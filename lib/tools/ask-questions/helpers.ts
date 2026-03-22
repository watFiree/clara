import type { AskQuestionsToolPart } from "./consts";

export function isAskQuestionsToolPart(part: {
  type: string;
}): part is AskQuestionsToolPart {
  return part.type === "tool-askQuestions";
}
