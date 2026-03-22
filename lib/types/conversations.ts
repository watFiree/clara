import z from "zod";

export const createConversationResponseSchema = z.object({
  id: z.string(),
});
