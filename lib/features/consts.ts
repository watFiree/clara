import type { ZodType } from "zod";
import { FeatureKey } from "@/app/generated/prisma/browser";
import { MemoryConfig, memoryConfigSchema } from "./memories/consts";
import { ModelConfig, modelConfigSchema } from "./model/consts";

export type FeatureConfigMap = {
  [FeatureKey.MEMORY]: MemoryConfig;
  [FeatureKey.MODEL]: ModelConfig;
};

type FeatureSchemaMap = {
  [K in FeatureKey]: ZodType<FeatureConfigMap[K]>;
};

interface FeatureAccessDenied {
  allowed: false;
  reason: string;
}

interface FeatureAccessGranted<K extends FeatureKey> {
  allowed: true;
  config?: FeatureConfigMap[K];
}

export type FeatureAccess<K extends FeatureKey> =
  | FeatureAccessDenied
  | FeatureAccessGranted<K>;

export const featureConfigSchemas: FeatureSchemaMap = {
  [FeatureKey.MEMORY]: memoryConfigSchema,
  [FeatureKey.MODEL]: modelConfigSchema,
};
