import { z } from "zod";

export const updateJournalParameters = z.object({
  date: z
    .string()
    .describe("ISO date string (YYYY-MM-DD) for the journal entry"),
  content: z
    .string()
    .describe("The full markdown content for the journal entry"),
});
