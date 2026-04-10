import { prisma } from "@/lib/prisma";
import { PLAN_ID, type PlanId } from "./plans";
import { getPlanById } from "./helpers";

interface UsageCheck {
  allowed: boolean;
  used: number;
  limit: number;
  percentage: number;
  plan: PlanId;
}

export async function checkUsageLimit(userId: string): Promise<UsageCheck> {
  const subscription = await prisma.subscription.findUnique({
    where: { userId },
  });

  const now = new Date();
  const isActive = !!subscription && subscription.currentPeriodEnd > now;

  const plan: PlanId = isActive ? subscription.plan : PLAN_ID.free;
  const dbPlan = await getPlanById(plan);
  const freePlan = dbPlan ? null : await getPlanById(PLAN_ID.free);
  const limit = dbPlan?.tokenLimit ?? freePlan?.tokenLimit ?? 150_000;

  let periodStart: Date;
  let periodEnd: Date;

  if (isActive) {
    periodStart = subscription.currentPeriodStart;
    periodEnd = subscription.currentPeriodEnd;
  } else {
    // Free tier: rolling 30-day window
    periodEnd = now;
    const monthBack = new Date(now);
    monthBack.setMonth(monthBack.getMonth() - 1);
    periodStart = monthBack;
  }

  const usage = await prisma.usage.aggregate({
    where: {
      userId,
      date: { gte: periodStart, lte: periodEnd },
    },
    _sum: { totalTokens: true },
  });

  const used = usage._sum.totalTokens ?? 0;
  const percentage = limit > 0 ? (used / limit) * 100 : 0;
  return { allowed: used < limit, used, limit, percentage, plan };
}
