import { PromptSectionKey } from "@/app/generated/prisma/client";
import { prisma } from "@/lib/prisma";

import { ROLE } from "./base";
import { PERSONALITY } from "./personality";
import { GUIDELINES } from "./guidelines";
import { TERMINOLOGY } from "./terminology";
import { CLOSING } from "./closing";
import { ASK_QUESTIONS_INSTRUCTIONS } from "./tools/ask-questions";
import { SAVE_MEMORY_INSTRUCTIONS } from "./tools/save-memory";
import { GET_MEMORIES_INSTRUCTIONS } from "./tools/get-memories";
import { UPDATE_MEMORY_INSTRUCTIONS } from "./tools/update-memory";
import { READ_JOURNAL_INSTRUCTIONS } from "./tools/read-journal";
import { UPDATE_JOURNAL_INSTRUCTIONS } from "./tools/update-journal";
import { JOURNAL_GENERATE_PROMPT } from "./journal-generate";

const DEFAULTS: Record<PromptSectionKey, string> = {
  [PromptSectionKey.ROLE]: ROLE,
  [PromptSectionKey.PERSONALITY]: PERSONALITY,
  [PromptSectionKey.GUIDELINES]: GUIDELINES,
  [PromptSectionKey.TERMINOLOGY]: TERMINOLOGY,
  [PromptSectionKey.CLOSING]: CLOSING,
  [PromptSectionKey.TOOLS_ASK_QUESTIONS]: ASK_QUESTIONS_INSTRUCTIONS,
  [PromptSectionKey.TOOLS_SAVE_MEMORY]: SAVE_MEMORY_INSTRUCTIONS,
  [PromptSectionKey.TOOLS_GET_MEMORIES]: GET_MEMORIES_INSTRUCTIONS,
  [PromptSectionKey.TOOLS_UPDATE_MEMORY]: UPDATE_MEMORY_INSTRUCTIONS,
  [PromptSectionKey.TOOLS_READ_JOURNAL]: READ_JOURNAL_INSTRUCTIONS,
  [PromptSectionKey.TOOLS_UPDATE_JOURNAL]: UPDATE_JOURNAL_INSTRUCTIONS,
  [PromptSectionKey.JOURNAL_GENERATE]: JOURNAL_GENERATE_PROMPT,
};

let cache: Record<PromptSectionKey, string> | null = null;

export async function getPromptSections(): Promise<
  Record<PromptSectionKey, string>
> {
  if (cache) return cache;

  try {
    const rows = await prisma.promptSection.findMany();
    const sections = rows.reduce<Record<PromptSectionKey, string>>(
      (acc, cur) => {
        acc[cur.key] = cur.content;
        return acc;
      },
      DEFAULTS,
    );

    cache = sections;
    return sections;
  } catch {
    return DEFAULTS;
  }
}

export function invalidatePromptCache(): void {
  cache = null;
}
