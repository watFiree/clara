import { convertToModelMessages, streamText, stepCountIs } from "ai";
import type { UIMessage } from "ai";

import { prisma } from "@/lib/prisma";
import { buildSystemPrompt } from "@/lib/prompts";
import { getOrCreateUser } from "@/lib/auth";
import { isCloudMode } from "@/config";
import { checkUsageLimit } from "@/lib/stripe/usage";
import { getStartOfDayUTC } from "@/lib/utils/date";
import { createMessage, upsertMessage } from "@/lib/services/message-service";
import { createToolsSet } from "@/lib/tools/tools-set";
import { getModelForUser, getModel } from "@/lib/features/model/helpers";
import { isChatRequestBody } from "@/lib/types/api";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const user = await getOrCreateUser();

    const body = await req.json();

    if (!isChatRequestBody(body)) {
      return new Response(JSON.stringify({ error: "Invalid request body" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { messages, id } = body;

    // Check usage limits (cloud mode only)
    if (isCloudMode) {
      const usage = await checkUsageLimit(user.id);
      if (!usage.allowed) {
        return new Response(
          JSON.stringify({
            error: "limit_exceeded",
            upgrade: true,
            plan: usage.plan,
            used: usage.used,
            limit: usage.limit,
          }),
          { status: 403, headers: { "Content-Type": "application/json" } },
        );
      }
    }

    await prisma.conversation.update({
      where: { id },
      data: { updatedAt: new Date() },
    });

    const lastMessage = messages.at(-1);

    if (!lastMessage) {
      throw new Error("No new messages found");
    }

    if (lastMessage?.role === "user") {
      await createMessage(user.id, {
        id: lastMessage.id,
        role: "USER",
        parts: lastMessage.parts,
        conversationId: id,
        metadata: lastMessage.metadata
          ? JSON.parse(JSON.stringify(lastMessage.metadata))
          : undefined,
      });
    } else if (lastMessage.role === "assistant") {
      await upsertMessage(user.id, {
        id: lastMessage.id,
        role: "ASSISTANT",
        parts: lastMessage.parts,
        conversationId: id,
      });
    } else {
      throw new Error("Incorrect message role for new message");
    }

    const [userSettings, conversationSettings] = await Promise.all([
      prisma.userSettings.findUnique({ where: { userId: user.id } }),
      prisma.conversationSettings.findUnique({ where: { conversationId: id } }),
    ]);

    const memoryEnabled =
      !!userSettings?.memoryEnabled && !conversationSettings?.memoryDisabled;

    const tools = await createToolsSet({
      userId: user.id,
      conversationId: id,
      memoryEnabled,
    });

    const { provider, modelId } = await getModelForUser(user.id);
    const model = getModel({ provider, modelId });

    const result = streamText({
      model,
      messages: await convertToModelMessages(messages),
      system: await buildSystemPrompt(userSettings, { memoryEnabled }),
      stopWhen: stepCountIs(Object.keys(tools).length * 2), //TODO: there is an edge case error when llm uses only tools the number of times it stops. In this case useChat sends messages again where last message is assistant parts with these toolcall -> it causes the same assisant message to be saved in database what then throws error when sending to llm (same 2 assistant messages next to eaach other)
      tools,
      async onFinish({ usage }) {
        try {
          const today = getStartOfDayUTC();
          await prisma.usage.upsert({
            where: {
              userId_model_date: {
                userId: user.id,
                model: modelId,
                date: today,
              },
            },
            create: {
              userId: user.id,
              model: modelId,
              date: today,
              inputTokens: usage.inputTokens ?? 0,
              outputTokens: usage.outputTokens ?? 0,
              totalTokens: (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0),
            },
            update: {
              inputTokens: { increment: usage.inputTokens ?? 0 },
              outputTokens: { increment: usage.outputTokens ?? 0 },
              totalTokens: {
                increment: (usage.inputTokens ?? 0) + (usage.outputTokens ?? 0),
              },
            },
          });
        } catch (err) {
          console.error("Failed to save usage:", err);
        }
      },
    });
    return result.toUIMessageStreamResponse({
      sendReasoning: false,
      async onFinish({ responseMessage }) {
        await createMessage(user.id, {
          role: "ASSISTANT",
          parts: responseMessage.parts,
          conversationId: id,
        });
      },
    });
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: "Failed to process chat",
        cause: JSON.stringify(error),
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
}
