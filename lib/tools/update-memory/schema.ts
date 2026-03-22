import { z } from "zod";

export const updateMemoryParameters = z.object({
  memoryId: z.string().describe("The ID of the memory to update"),
  status: z
    .enum(["OPEN", "RESOLVED", "SNOOZED", "EXPIRED"])
    .optional()
    .describe(
      "New status: RESOLVED for achieved goals, EXPIRED for outdated info, SNOOZED for temporarily irrelevant",
    ),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .optional()
    .describe("Updated confidence score"),
});
