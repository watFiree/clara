import { z } from "zod";

export const askQuestionsParameters = z.object({
  title: z
    .string()
    .describe("Short title for the questionnaire, e.g. 'Quick Check-in'"),
  questions: z
    .array(
      z.object({
        id: z.string().describe("Unique identifier for this question"),
        text: z.string().describe("The question text to display to the user"),
        options: z
          .array(z.string())
          .min(1)
          .describe("Predefined answer options"),
        allowCustomAnswer: z
          .boolean()
          .default(true)
          .describe("Whether the user can type a custom answer"),
      }),
    )
    .min(1)
    .describe("The list of questions to ask, presented one at a time"),
});
