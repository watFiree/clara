import { z } from "zod";
import { PlanId } from "@/app/generated/prisma/enums";

// Re-export as const for client-side usage (Prisma enum can't be imported in client components)
export const PLAN_ID = {
  free: "free",
  premium_lite: "premium_lite",
  premium: "premium",
} as const satisfies Record<PlanId, PlanId>;

export type { PlanId };

export interface Plan {
  id: PlanId;
  name: string;
  description: string;
  price: number;
  tokenLimit: number;
  stripePriceId: string | null;
  features: string[];
  highlighted: boolean;
}

const planIds = Object.values(PlanId);

export const PlanSchema: z.ZodType<Plan> = z.object({
  id: z.enum(planIds),
  name: z.string(),
  description: z.string(),
  price: z.number(),
  tokenLimit: z.number(),
  stripePriceId: z.string().nullable(),
  features: z.array(z.string()),
  highlighted: z.boolean(),
});
