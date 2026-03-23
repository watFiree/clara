import type { UserSettings } from "@/app/generated/prisma/client";
import { PromptSectionKey } from "@/app/generated/prisma/client";
import { buildUserContext } from "./user-context";
import { buildToolInstructions } from "./tools";
import { getPromptSections } from "./cache";

/**
 * Assembles the full system prompt from modular sections,
 * optionally personalized with user settings.
 * Sections are loaded from the database (with hardcoded fallbacks).
 */
export async function buildSystemPrompt(
  settings?: UserSettings | null,
  overrides?: { memoryEnabled?: boolean },
): Promise<string> {
  const sections = await getPromptSections();

  const parts = [
    sections[PromptSectionKey.ROLE],
    sections[PromptSectionKey.PERSONALITY],
    sections[PromptSectionKey.GUIDELINES],
    sections[PromptSectionKey.TERMINOLOGY],
    sections[PromptSectionKey.CLOSING],
  ];

  if (settings) {
    parts.push(buildUserContext(settings));
    const memoryEnabled = overrides?.memoryEnabled ?? settings.memoryEnabled;
    parts.push(buildToolInstructions(memoryEnabled, sections));
  } else {
    parts.push(buildToolInstructions(false, sections));
  }

  return parts.join("\n\n");
}
