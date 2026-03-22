import type { UserSettings } from "@/app/generated/prisma/client";

const TONE_MAP: Record<string, string> = {
  warm: "Be warm, gentle, and nurturing in your responses.",
  direct:
    "Be direct, practical, and action-oriented. Skip excessive pleasantries.",
  playful:
    "Be playful, light-hearted, and use humor where appropriate.",
};

export function buildUserContext(settings: UserSettings): string {
  const lines: string[] = ["## User preferences"];

  if (settings.name) {
    lines.push(
      `- The user's name is ${settings.name}. Address them by name naturally.`,
    );
  }

  if (settings.gender && settings.gender !== "prefer-not-to-say") {
    lines.push(`- The user identifies as ${settings.gender}.`);
  }

  if (settings.ageRange) {
    lines.push(`- The user is in the ${settings.ageRange} age range.`);
  }

  lines.push(`- Tone: ${TONE_MAP[settings.tonePreference] ?? TONE_MAP.warm}`);

  if (settings.focusAreas.length > 0) {
    lines.push(
      `- The user is particularly interested in: ${settings.focusAreas.join(", ")}. Lean into these topics when relevant.`,
    );
  }

  if (settings.language !== "en") {
    lines.push(
      `- Respond in the user's preferred language: ${settings.language}.`,
    );
  }

  if (!settings.memoryEnabled) {
    lines.push(
      "- The user prefers not to have context remembered across sessions. Treat each session as fresh.",
    );
  }

  return lines.join("\n");
}
