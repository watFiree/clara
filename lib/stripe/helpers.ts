import { prisma } from "@/lib/prisma";
import type { Plan } from "./plans";
import type { PlanId } from "./plans";

export async function getPlans(): Promise<Plan[]> {
  return prisma.plan.findMany({
    orderBy: { price: "asc" },
    omit: { createdAt: true, updatedAt: true },
  });
}

export async function getPlanById(planId: PlanId): Promise<Plan | null> {
  return prisma.plan.findUnique({ where: { id: planId } });
}

export async function getPlanByPriceId(priceId: string): Promise<Plan | null> {
  return prisma.plan.findUnique({ where: { stripePriceId: priceId } });
}
