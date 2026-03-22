import { tool } from "ai";
import { updateMemoryParameters } from "./schema";
import type { UpdateMemoryInput } from "./consts";

export function createUpdateMemoryTool(userId: string) {
  return tool({
    description:
      "Update the status or confidence of an existing memory. Use when context changes: mark goals as RESOLVED when achieved, situations as EXPIRED when no longer relevant, or adjust confidence when new information confirms or contradicts a memory.",
    inputSchema: updateMemoryParameters,
    execute: async ({ memoryId, status, confidence }) => {
      const { updateMemory } = await import("@/lib/services/memory/service");

      const update: {
        status?: UpdateMemoryInput["status"];
        confidence?: number;
      } = {};
      if (status) update.status = status;
      if (confidence !== undefined) update.confidence = confidence;

      await updateMemory(userId, memoryId, update);

      return { success: true };
    },
  });
}
