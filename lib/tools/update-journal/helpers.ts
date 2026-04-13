import type { UpdateJournalToolPart } from "./consts";

export function isUpdateJournalToolPart(
  part: { type: string } & Record<string, unknown>,
): part is UpdateJournalToolPart {
  return (
    part.type === "tool-updateJournal" &&
    typeof part.toolCallId === "string" &&
    typeof part.state === "string"
  );
}
