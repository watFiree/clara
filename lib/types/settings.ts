import { Language } from "@/app/generated/prisma/browser";

export type UserSettings = {
  id: string;
  userId: string;
  name: string | null;
  gender: string | null;
  tonePreference: string;
  memoryEnabled: boolean;
  language: Language;
  ageRange: string | null;
  focusAreas: string[];
  createdAt: string;
  updatedAt: string;
};

export type UserSettingsResponse = {
  settings: UserSettings;
};

const isLanguage = (value: unknown): value is Language =>
  typeof value === "string" &&
  Object.values(Language).includes(value as Language);

export function isUserSettingsResponse(
  data: unknown,
): data is UserSettingsResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "settings" in data &&
    typeof data.settings === "object"
  );
}

export type UpdateSettingsBody = {
  name?: string | null;
  gender?: string | null;
  tonePreference?: string;
  memoryEnabled?: boolean;
  language?: Language;
  ageRange?: string | null;
  focusAreas?: string[];
};

export function isUpdateSettingsBody(
  data: unknown,
): data is UpdateSettingsBody {
  if (typeof data !== "object" || data === null) return false;

  if ("name" in data && typeof data.name !== "string" && data.name !== null)
    return false;
  if (
    "gender" in data &&
    typeof data.gender !== "string" &&
    data.gender !== null
  )
    return false;
  if ("tonePreference" in data && typeof data.tonePreference !== "string")
    return false;
  if ("memoryEnabled" in data && typeof data.memoryEnabled !== "boolean")
    return false;
  if ("language" in data && !isLanguage(data.language)) return false;
  if (
    "ageRange" in data &&
    typeof data.ageRange !== "string" &&
    data.ageRange !== null
  )
    return false;
  if (
    "focusAreas" in data &&
    (!Array.isArray(data.focusAreas) ||
      !data.focusAreas.every((v: unknown) => typeof v === "string"))
  )
    return false;

  return true;
}

export const TONE_OPTIONS = [
  { value: "warm", label: "Warm & Gentle" },
  { value: "direct", label: "Direct & Practical" },
  { value: "playful", label: "Playful & Light" },
] as const;

export const GENDER_OPTIONS = [
  { value: "female", label: "Female" },
  { value: "male", label: "Male" },
  { value: "non-binary", label: "Non-binary" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

export const AGE_RANGE_OPTIONS = [
  { value: "under-18", label: "Under 18" },
  { value: "18-25", label: "18–25" },
  { value: "26-35", label: "26–35" },
  { value: "36-50", label: "36–50" },
  { value: "51-65", label: "51–65" },
  { value: "65+", label: "65+" },
] as const;

export const FOCUS_AREA_OPTIONS = [
  { value: "stress", label: "Stress & Anxiety" },
  { value: "sleep", label: "Sleep" },
  { value: "mindfulness", label: "Mindfulness" },
  { value: "gratitude", label: "Gratitude" },
  { value: "self-reflection", label: "Self-reflection" },
  { value: "energy", label: "Energy & Motivation" },
  { value: "relationships", label: "Relationships" },
  { value: "work-life-balance", label: "Work-life Balance" },
] as const;

export const LANGUAGE_OPTIONS: readonly { value: Language; label: string }[] = [
  { value: Language.en, label: "English" },
  { value: Language.es, label: "Spanish" },
  { value: Language.fr, label: "French" },
  { value: Language.de, label: "German" },
  { value: Language.pl, label: "Polish" },
  { value: Language.pt, label: "Portuguese" },
];

export const LANGUAGE_LOCALE: Record<Language, string> = {
  [Language.en]: "en-US",
  [Language.es]: "es-ES",
  [Language.fr]: "fr-FR",
  [Language.de]: "de-DE",
  [Language.pl]: "pl-PL",
  [Language.pt]: "pt-PT",
};
