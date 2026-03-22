import type { UserSettings } from "@/app/generated/prisma/client";

import { ROLE } from "./base";
import { PERSONALITY } from "./personality";
import { GUIDELINES } from "./guidelines";
import { TERMINOLOGY } from "./terminology";
import { CLOSING } from "./closing";
import { buildUserContext } from "./user-context";
import { buildToolInstructions } from "./tools";

/**
 * Assembles the full system prompt from modular sections,
 * optionally personalized with user settings.
 */
export function buildSystemPrompt(
  settings?: UserSettings | null,
  overrides?: { memoryEnabled?: boolean },
): string {
  const sections = [ROLE, PERSONALITY, GUIDELINES, TERMINOLOGY, CLOSING];

  if (settings) {
    sections.push(buildUserContext(settings));
    const memoryEnabled = overrides?.memoryEnabled ?? settings.memoryEnabled;
    sections.push(buildToolInstructions(memoryEnabled));
  } else {
    sections.push(buildToolInstructions(false));
  }

  return sections.join("\n\n");
}

/**
 * Pre-built full system prompt for direct use (no personalization)
 */
export const SYSTEM_PROMPT = buildSystemPrompt();

// Export individual sections for custom compositions
export { ROLE, PERSONALITY, GUIDELINES, TERMINOLOGY, CLOSING };
