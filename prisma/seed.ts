import "dotenv/config";
import { PrismaClient, PromptSectionKey } from "../app/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { ROLE } from "../lib/prompts/base";
import { PERSONALITY } from "../lib/prompts/personality";
import { GUIDELINES } from "../lib/prompts/guidelines";
import { TERMINOLOGY } from "../lib/prompts/terminology";
import { CLOSING } from "../lib/prompts/closing";
import { ASK_QUESTIONS_INSTRUCTIONS } from "../lib/prompts/tools/ask-questions";
import { SAVE_MEMORY_INSTRUCTIONS } from "../lib/prompts/tools/save-memory";
import { GET_MEMORIES_INSTRUCTIONS } from "../lib/prompts/tools/get-memories";
import { UPDATE_MEMORY_INSTRUCTIONS } from "../lib/prompts/tools/update-memory";
import { READ_JOURNAL_INSTRUCTIONS } from "../lib/prompts/tools/read-journal";
import { UPDATE_JOURNAL_INSTRUCTIONS } from "../lib/prompts/tools/update-journal";
import { JOURNAL_GENERATE_PROMPT } from "../lib/prompts/journal-generate";

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
  {
    key: "JOURNAL" as const,
    planId: "free" as const,
    enabled: true,
    config: {
      monthlyGenerationLimit: 4,
      canEdit: false,
      readToolEnabled: false,
      updateToolEnabled: false,
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

  const promptSections: { key: PromptSectionKey; content: string }[] = [
    { key: PromptSectionKey.ROLE, content: ROLE },
    { key: PromptSectionKey.PERSONALITY, content: PERSONALITY },
    { key: PromptSectionKey.GUIDELINES, content: GUIDELINES },
    { key: PromptSectionKey.TERMINOLOGY, content: TERMINOLOGY },
    { key: PromptSectionKey.CLOSING, content: CLOSING },
    {
      key: PromptSectionKey.TOOLS_ASK_QUESTIONS,
      content: ASK_QUESTIONS_INSTRUCTIONS,
    },
    {
      key: PromptSectionKey.TOOLS_SAVE_MEMORY,
      content: SAVE_MEMORY_INSTRUCTIONS,
    },
    {
      key: PromptSectionKey.TOOLS_GET_MEMORIES,
      content: GET_MEMORIES_INSTRUCTIONS,
    },
    {
      key: PromptSectionKey.TOOLS_UPDATE_MEMORY,
      content: UPDATE_MEMORY_INSTRUCTIONS,
    },
    {
      key: PromptSectionKey.TOOLS_READ_JOURNAL,
      content: READ_JOURNAL_INSTRUCTIONS,
    },
    {
      key: PromptSectionKey.TOOLS_UPDATE_JOURNAL,
      content: UPDATE_JOURNAL_INSTRUCTIONS,
    },
    {
      key: PromptSectionKey.JOURNAL_GENERATE,
      content: JOURNAL_GENERATE_PROMPT,
    },
  ];

  for (const section of promptSections) {
    await prisma.promptSection.upsert({
      where: { key: section.key },
      create: section,
      update: { content: section.content },
    });
    console.log(`Upserted prompt section: ${section.key}`);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
