import { checkFeatureAccess } from "../checkAccess";
import { JournalAccessCheck } from "./consts";

export async function checkJournalAccess(
  userId: string,
): Promise<JournalAccessCheck> {
  const result = await checkFeatureAccess(userId, "JOURNAL");

  if (!result.allowed) {
    return {
      allowed: false,
      reason: result.reason,
    };
  }

  // In local mode there is no config — default to fully unlocked
  return {
    allowed: true,
    monthlyGenerationLimit: result.config?.monthlyGenerationLimit ?? -1,
    canEdit: result.config?.canEdit ?? true,
    readToolEnabled: result.config?.readToolEnabled ?? true,
    updateToolEnabled: result.config?.updateToolEnabled ?? true,
  };
}
