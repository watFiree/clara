import { tool } from "ai";
import { saveMemoryParameters } from "./schema";

export function createSaveMemoryTool(userId: string, conversationId: string, memoryLimit?: number) {
  return tool({
    description:
      "Save an important fact or pattern about the user for future reference. For PERSONAL, HEALTH, GOALS, CONTEXT categories: provide a description. For EMOTIONAL, COPING categories: provide trigger and effect. Be selective — only save genuinely useful context.",
    inputSchema: saveMemoryParameters,
    execute: async (input) => {
      const { createMemory, getMemoryCount } = await import("@/lib/services/memory/service");

      if (memoryLimit !== undefined) {
        const count = await getMemoryCount(userId);
        if (count >= memoryLimit) {
          return { success: false, error: "Memory limit reached. The user has reached their plan's memory storage limit. They need to delete existing memories or upgrade their plan to save new ones." };
        }
      }
      const { status, confidence, category } = input;

      const isPattern = category === "EMOTIONAL" || category === "COPING";
      const content = isPattern
        ? {
            type: "pattern" as const,
            trigger: input.trigger ?? "",
            effect: input.effect ?? "",
          }
        : {
            type: "fact" as const,
            description: input.description ?? "",
          };

      await createMemory(userId, {
        content,
        category,
        status,
        confidence,
        sourceConversationId: conversationId,
      });

      return { success: true };
    },
  });
}
