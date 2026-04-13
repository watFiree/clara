import { NextResponse } from "next/server";
import { generateText } from "ai";
import { getUser } from "@/lib/auth";
import { ErrorFactory } from "@/lib/errors/errorFactory";
import { checkJournalAccess } from "@/lib/features/journal/checkAccess";
import { reserveJournalGeneration } from "@/lib/services/journal/service";
import { getMessages } from "@/lib/services/message-service";
import { getModelForUser, getModel } from "@/lib/features/model/helpers";
import { getPromptSections } from "@/lib/prompts/cache";
import { PromptSectionKey } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";
import { trackUsage } from "@/lib/usage/track";

export const maxDuration = 30;

export async function POST(req: Request) {
  try {
    const user = await getUser();
    if (!user) return ErrorFactory("USER_NOT_FOUND");

    const access = await checkJournalAccess(user.id);
    if (!access.allowed) {
      return NextResponse.json(
        { error: access.reason, upgrade: true },
        { status: 403 },
      );
    }

    const now = new Date();
    const limit = access.monthlyGenerationLimit ?? -1;

    if (limit !== -1) {
      const reservation = await reserveJournalGeneration(
        user.id,
        now.getUTCFullYear(),
        now.getUTCMonth() + 1,
        limit,
      );
      if (!reservation.reserved) {
        return NextResponse.json(
          {
            error: "generation_limit_reached",
            used: reservation.used,
            limit,
            upgrade: true,
          },
          { status: 403 },
        );
      }
    }

    const body = await req.json();
    const { conversationId } = body;

    if (typeof conversationId !== "string") {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 },
      );
    }

    // Verify conversation belongs to user
    const conversation = await prisma.conversation.findFirst({
      where: { id: conversationId, userId: user.id },
    });

    if (!conversation) {
      return NextResponse.json(
        { error: "Conversation not found" },
        { status: 404 },
      );
    }

    const messages = await getMessages(user.id, conversationId);

    const conversationText = messages
      .map((m) => {
        const parts = m.parts as Array<{ type: string; text?: string }>;
        const textParts = parts
          .filter((p) => p.type === "text" && p.text)
          .map((p) => p.text)
          .join("\n");
        return `${m.role === "USER" ? "User" : "Assistant"}: ${textParts}`;
      })
      .join("\n\n");

    const { provider, modelId } = await getModelForUser(user.id);
    const model = getModel({ provider, modelId });

    const sections = await getPromptSections();
    const systemPrompt = sections[PromptSectionKey.JOURNAL_GENERATE];

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: `Here is the conversation to base the journal entry on:\n\n${conversationText}`,
      async onFinish({ usage }) {
        await trackUsage({
          userId: user.id,
          model: modelId,
          inputTokens: usage.inputTokens,
          outputTokens: usage.outputTokens,
        });
      },
    });

    return NextResponse.json({ content: result.text });
  } catch (error) {
    console.error("Failed to generate journal entry:", error);
    return NextResponse.json(
      { error: "Failed to generate journal entry" },
      { status: 500 },
    );
  }
}
