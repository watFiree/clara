import { PromptSectionKey } from "@/app/generated/prisma/client";

import { ASK_QUESTIONS_INSTRUCTIONS } from "./ask-questions";
import { SAVE_MEMORY_INSTRUCTIONS } from "./save-memory";
import { GET_MEMORIES_INSTRUCTIONS } from "./get-memories";
import { UPDATE_MEMORY_INSTRUCTIONS } from "./update-memory";
import { READ_JOURNAL_INSTRUCTIONS } from "./read-journal";
import { UPDATE_JOURNAL_INSTRUCTIONS } from "./update-journal";

/**
 * Build tool usage instructions section.
 * Always includes askQuestions; memory/journal tools conditionally.
 * Uses externally configured sections when provided, falls back to hardcoded defaults.
 */
export function buildToolInstructions(
  memoryEnabled: boolean,
  sections?: Partial<Record<PromptSectionKey, string>>,
  options?: { journalReadEnabled?: boolean; journalUpdateEnabled?: boolean },
): string {
  const parts = [
    "# Tool usage instructions\n",
    sections?.[PromptSectionKey.TOOLS_ASK_QUESTIONS] ??
      ASK_QUESTIONS_INSTRUCTIONS,
  ];

  if (memoryEnabled) {
    parts.push(
      sections?.[PromptSectionKey.TOOLS_GET_MEMORIES] ??
        GET_MEMORIES_INSTRUCTIONS,
      sections?.[PromptSectionKey.TOOLS_SAVE_MEMORY] ??
        SAVE_MEMORY_INSTRUCTIONS,
      sections?.[PromptSectionKey.TOOLS_UPDATE_MEMORY] ??
        UPDATE_MEMORY_INSTRUCTIONS,
    );
  }

  if (options?.journalReadEnabled) {
    parts.push(
      sections?.[PromptSectionKey.TOOLS_READ_JOURNAL] ??
        READ_JOURNAL_INSTRUCTIONS,
    );
  }

  if (options?.journalUpdateEnabled) {
    parts.push(
      sections?.[PromptSectionKey.TOOLS_UPDATE_JOURNAL] ??
        UPDATE_JOURNAL_INSTRUCTIONS,
    );
  }

  return parts.join("\n\n");
}
