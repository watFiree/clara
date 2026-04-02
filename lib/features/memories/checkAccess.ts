import { checkFeatureAccess } from "../checkAccess";
import { MemoryAccessCheck } from "./consts";

export async function checkMemoryAccess(
  userId: string,
): Promise<MemoryAccessCheck> {
  const result = await checkFeatureAccess(userId, "MEMORY");

  if (!result.allowed) {
    return {
      allowed: false,
      reason: result.reason,
    };
  }

  return { allowed: true, memoryLimit: result.config?.memoryLimit };
}
