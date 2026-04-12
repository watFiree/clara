import type { UpdateJournalToolPart } from "./consts";

export function isUpdateJournalToolPart(part: {
  type: string;
}): part is UpdateJournalToolPart {
  return part.type === "tool-updateJournal";
}
