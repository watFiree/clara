import type { ReadJournalToolPart } from "./consts";

export function isReadJournalToolPart(part: {
  type: string;
}): part is ReadJournalToolPart {
  return part.type === "tool-readJournal";
}
