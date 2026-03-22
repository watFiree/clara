import type { GetMemoriesToolPart } from "./consts";

export function isGetMemoriesToolPart(part: {
  type: string;
}): part is GetMemoriesToolPart {
  return part.type === "tool-getMemories";
}
