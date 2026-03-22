import { tool } from "ai";
import { askQuestionsParameters } from "./schema";

export const askQuestionsTool = tool({
  description:
    "Ask the user a series of questions with predefined options and optional custom text input. Use for check-ins, assessments, or gathering structured information.",
  inputSchema: askQuestionsParameters,
});
