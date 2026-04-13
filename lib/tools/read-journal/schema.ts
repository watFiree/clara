import { z } from "zod";

export const readJournalParameters = z.object({
  date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Use YYYY-MM-DD format")
    .refine((value) => {
      const parsed = new Date(`${value}T00:00:00.000Z`);
      return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value;
    }, "Invalid calendar date")
    .describe(
      "ISO date string (YYYY-MM-DD) of the journal entry to read",
    ),
});
