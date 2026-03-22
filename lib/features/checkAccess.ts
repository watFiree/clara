import { prisma } from "@/lib/prisma";
import { isCloudMode } from "@/config";
import { FeatureKey, type PlanId } from "@/app/generated/prisma/client";
import {
  FeatureAccess,
  FeatureConfigMap,
  featureConfigSchemas,
} from "./consts";

export async function checkFeatureAccess<K extends FeatureKey>(
  userId: string,
  featureKey: K,
): Promise<FeatureAccess<K>> {
  if (!isCloudMode) return { allowed: true };

  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });
  const planId: PlanId =
    (subscription?.status === "active" ? subscription.plan : null) ?? "free";

  const feature = await prisma.feature.findUnique({
    where: { key_planId: { key: featureKey, planId } },
  });

  if (!feature || !feature.enabled) {
    return {
      allowed: false,
      reason: "This feature requires an upgraded plan.",
    };
  }

  const schema = featureConfigSchemas[featureKey];
  const parsed = feature.config ? schema.safeParse(feature.config) : undefined;

  return {
    allowed: true,
    config: parsed?.success
      ? (parsed.data satisfies FeatureConfigMap[K])
      : undefined,
  };
}
