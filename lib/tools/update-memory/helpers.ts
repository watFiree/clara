import type { UpdateMemoryToolPart } from "./consts";

export function isUpdateMemoryToolPart(part: {
  type: string;
}): part is UpdateMemoryToolPart {
  return part.type === "tool-updateMemory";
}
