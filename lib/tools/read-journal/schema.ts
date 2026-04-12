import { z } from "zod";

export const readJournalParameters = z.object({
  date: z
    .string()
    .describe(
      "ISO date string (YYYY-MM-DD) of the journal entry to read",
    ),
});
