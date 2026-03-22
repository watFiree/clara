import { PLAN_ID, type PlanId } from "@/lib/stripe/plans";

export interface SubscriptionResponse {
  plan: PlanId;
  percentage: number;
  allowed: boolean;
}

const PLAN_IDS: Set<string> = new Set(Object.values(PLAN_ID));

function isPlanId(value: unknown): value is PlanId {
  return typeof value === "string" && PLAN_IDS.has(value);
}

export function isSubscriptionResponse(
  data: unknown,
): data is SubscriptionResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "plan" in data &&
    isPlanId(data.plan) &&
    "percentage" in data &&
    typeof data.percentage === "number" &&
    "allowed" in data &&
    typeof data.allowed === "boolean"
  );
}
