export type { SaveMemoryToolPart } from "./save-memory/consts";
export type { GetMemoriesToolPart } from "./get-memories/consts";
export type { UpdateMemoryToolPart } from "./update-memory/consts";
export type { ReadJournalToolPart } from "./read-journal/consts";
export type { UpdateJournalToolPart } from "./update-journal/consts";

export { isSaveMemoryToolPart } from "./save-memory/helpers";
export { isGetMemoriesToolPart } from "./get-memories/helpers";
export { isUpdateMemoryToolPart } from "./update-memory/helpers";
export { isReadJournalToolPart } from "./read-journal/helpers";
export { isUpdateJournalToolPart } from "./update-journal/helpers";

import type { SaveMemoryToolPart } from "./save-memory/consts";
import type { GetMemoriesToolPart } from "./get-memories/consts";
import type { UpdateMemoryToolPart } from "./update-memory/consts";
import { isSaveMemoryToolPart } from "./save-memory/helpers";
import { isGetMemoriesToolPart } from "./get-memories/helpers";
import { isUpdateMemoryToolPart } from "./update-memory/helpers";

export function isMemoryToolPart(part: {
  type: string;
}): part is SaveMemoryToolPart | GetMemoriesToolPart | UpdateMemoryToolPart {
  return (
    isSaveMemoryToolPart(part) ||
    isGetMemoriesToolPart(part) ||
    isUpdateMemoryToolPart(part)
  );
}
