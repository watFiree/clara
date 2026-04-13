import { openai } from "@ai-sdk/openai";
import { embed } from "ai";
import { trackUsage } from "@/lib/usage/track";

const EMBEDDING_MODEL = "text-embedding-3-small";

export async function generateEmbedding(userId: string, text: string) {
  try {
    const { embedding, usage } = await embed({
      model: openai.embedding(EMBEDDING_MODEL),
      value: text,
    });
    await trackUsage({
      userId,
      model: EMBEDDING_MODEL,
      inputTokens: usage.tokens,
    });
    return embedding;
  } catch (error) {
    console.log(error);
    throw new Error("Text embedding failed", { cause: error });
  }
}
