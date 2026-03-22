import { tool } from "ai";
import { getMemoriesParameters } from "./schema";

export function createGetMemoriesTool(userId: string) {
  return tool({
    description:
      "Retrieve relevant memories about the user based on a semantic query. Use at the START of a conversation to recall context, or when the user references something you should already know. Returns the most relevant stored facts and patterns.",
    inputSchema: getMemoriesParameters,
    execute: async ({ query, category, status, includeAllStatuses }) => {
      const { searchMemories } = await import("@/lib/services/memory/service");
      const results = await searchMemories(userId, query, {
        topK: 5,
        threshold: 0.3,
        category: category satisfies
          | import("@/app/generated/prisma/client").MemoryCategory
          | undefined,
        status: status as import("@/app/generated/prisma/client").MemoryStatus,
        includeAllStatuses,
      });

      return {
        memories: results.map((m) => ({
          id: m.id,
          category: m.category,
          content: m.content,
          status: m.status,
          confidence: m.confidence,
        })),
      };
    },
  });
}
