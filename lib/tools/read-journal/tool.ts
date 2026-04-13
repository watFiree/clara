import { tool } from "ai";
import { readJournalParameters } from "./schema";

export function createReadJournalTool(userId: string) {
  return tool({
    description:
      "Read the user's journal entry for a specific date. Use when the user asks about what they wrote or reflected on a particular day.",
    inputSchema: readJournalParameters,
    execute: async ({ date }) => {
      const { getJournalEntry } = await import(
        "@/lib/services/journal/service"
      );
      const entry = await getJournalEntry(userId, new Date(date));

      if (!entry) {
        return { found: false, message: "No journal entry for this date." };
      }

      return { found: true, date, content: entry.content };
    },
  });
}
