import { z } from "zod";

export const getMemoriesParameters = z.object({
  query: z
    .string()
    .describe(
      "A natural-language query describing what context you need about the user, e.g. 'sleep habits' or 'work situation'",
    ),
  category: z
    .enum(["PERSONAL", "EMOTIONAL", "HEALTH", "GOALS", "COPING", "CONTEXT"])
    .optional()
    .describe("Optionally filter to a specific category"),
  status: z
    .enum(["OPEN", "RESOLVED", "SNOOZED", "EXPIRED"])
    .default("OPEN")
    .describe("Filter by status, defaults to OPEN"),
  includeAllStatuses: z
    .boolean()
    .default(false)
    .describe("Override status filter and search across all statuses"),
});
