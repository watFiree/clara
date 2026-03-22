import z from "zod";

export const modelConfigSchema = z.object({
  modelId: z.string(),
  provider: z.union([z.literal("openai")]),
});

export type ModelConfig = z.infer<typeof modelConfigSchema>;
export type ProvidersList = ModelConfig["provider"];

export const DEFAULT_MODEL: ModelConfig = {
  provider: "openai",
  modelId: "gpt-5.4-nano",
};
