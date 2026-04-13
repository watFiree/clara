import { z } from "zod";

export const updateJournalParameters = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "date must be in YYYY-MM-DD format")
    .refine((value) => {
      const [y, m, d] = value.split("-").map(Number);
      const normalized = new Date(Date.UTC(y, m - 1, d));
      return (
        normalized.getUTCFullYear() === y &&
        normalized.getUTCMonth() === m - 1 &&
        normalized.getUTCDate() === d
      );
    }, "date must be a valid calendar date")
    .describe("ISO date string (YYYY-MM-DD) for the journal entry"),
  content: z
    .string()
    .describe("The full markdown content for the journal entry"),
});
