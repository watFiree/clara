import { z } from "zod";

export const saveMemoryParameters = z.object({
  category: z
    .enum(["PERSONAL", "HEALTH", "GOALS", "CONTEXT", "EMOTIONAL", "COPING"])
    .describe(
      "Memory category. PERSONAL/HEALTH/GOALS/CONTEXT are fact memories (provide description). EMOTIONAL/COPING are pattern memories (provide trigger and effect).",
    ),
  description: z
    .string()
    .optional()
    .describe(
      "A concise factual statement about the user. Required for PERSONAL, HEALTH, GOALS, CONTEXT categories.",
    ),
  trigger: z
    .string()
    .optional()
    .describe(
      "What triggers this pattern. Required for EMOTIONAL, COPING categories.",
    ),
  effect: z
    .string()
    .optional()
    .describe(
      "The effect or response. Required for EMOTIONAL, COPING categories.",
    ),
  confidence: z
    .number()
    .min(0)
    .max(1)
    .default(1.0)
    .describe(
      "How certain you are: 1.0 for explicit statements, 0.5-0.8 for inferences, 0.3-0.5 for uncertain",
    ),
  status: z
    .enum(["OPEN", "RESOLVED", "SNOOZED", "EXPIRED"])
    .default("OPEN")
    .describe("Memory lifecycle status"),
});
