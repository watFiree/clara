import type { SaveMemoryToolPart } from "./consts";

export function isSaveMemoryToolPart(part: {
  type: string;
}): part is SaveMemoryToolPart {
  return part.type === "tool-saveMemory";
}
