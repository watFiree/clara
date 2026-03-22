import { z } from "zod";
import type { Tool, UIToolInvocation } from "ai";
import { askQuestionsParameters } from "./schema";

export type AskQuestionsInput = z.infer<typeof askQuestionsParameters>;

export type AskQuestionsOutput = {
  answers: Array<{
    questionId: string;
    questionText: string;
    answer: string;
    wasCustomAnswer: boolean;
  }>;
};

export type AskQuestionsToolPart = {
  type: "tool-askQuestions";
  toolCallId: string;
  state: UIToolInvocation<Tool>["state"];
  input: AskQuestionsInput;
  output?: AskQuestionsOutput;
};
