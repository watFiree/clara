import { prisma } from "@/lib/prisma";
import { getStartOfDayUTC } from "@/lib/utils/date";

type UsageInput = {
  userId: string;
  model: string;
  inputTokens?: number;
  outputTokens?: number;
};

export async function trackUsage({
  userId,
  model,
  inputTokens,
  outputTokens,
}: UsageInput) {
  try {
    const today = getStartOfDayUTC();
    const input = inputTokens ?? 0;
    const output = outputTokens ?? 0;
    await prisma.usage.upsert({
      where: {
        userId_model_date: {
          userId,
          model,
          date: today,
        },
      },
      create: {
        userId,
        model,
        date: today,
        inputTokens: input,
        outputTokens: output,
        totalTokens: input + output,
      },
      update: {
        inputTokens: { increment: input },
        outputTokens: { increment: output },
        totalTokens: { increment: input + output },
      },
    });
  } catch (err) {
    console.error("Failed to save usage:", err);
  }
}
