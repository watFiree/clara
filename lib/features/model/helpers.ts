import { checkFeatureAccess } from "../checkAccess";
import { DEFAULT_MODEL, ModelConfig } from "./consts";
import { providers } from "./providers";

export function getModel(config: ModelConfig) {
  const providerFn = providers[config.provider];
  if (!providerFn) {
    throw new Error(`Unknown AI provider: ${config.provider}`);
  }
  return providerFn(config.modelId);
}

export async function getModelForUser(userId: string): Promise<ModelConfig> {
  const result = await checkFeatureAccess(userId, "MODEL");

  if (!result.allowed || !result.config) {
    return DEFAULT_MODEL;
  }

  return result.config;
}
