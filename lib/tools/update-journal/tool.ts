import { tool } from "ai";
import { updateJournalParameters } from "./schema";

export function createUpdateJournalTool() {
  return tool({
    description:
      "Write or update the user's journal entry for a specific date. The content should be reflective, personal markdown. Always requires user approval before saving.",
    inputSchema: updateJournalParameters,
  });
}
