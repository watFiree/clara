import "dotenv/config";
import { PrismaClient } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});

const prisma = new PrismaClient({ adapter });

const plans = [
  {
    id: "free" as const,
    name: "Free",
    description: "A short conversation once a day",
    price: 0,
    tokenLimit: 2_147_483_647,
    stripePriceId: null,
    features: [],
    highlighted: false,
  },
];

const planFeatures = [
  {
    key: "MEMORY" as const,
    planId: "free" as const,
    enabled: true,
    config: {
      memoryLimit: 2_147_483_647,
    },
  },
  {
    key: "MODEL" as const,
    planId: "free" as const,
    enabled: true,
    config: {
      provider: "openai",
      modelId: "gpt-5.4-nano",
    },
  },
];

async function main() {
  for (const plan of plans) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      create: plan,
      update: plan,
    });
    console.log(`Upserted plan: ${plan.name}`);
  }

  for (const feature of planFeatures) {
    await prisma.feature.upsert({
      where: {
        key_planId: {
          key: feature.key,
          planId: feature.planId,
        },
      },
      create: feature,
      update: feature,
    });
    console.log(`Upserted feature: ${feature.key} for ${feature.planId}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
