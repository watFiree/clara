export interface JournalEntryResponse {
  id: string;
  date: string;
  content: string;
  createdAt: string;
  updatedAt: string;
}

export interface JournalDatesResponse {
  dates: string[];
}

export interface JournalAccessResponse {
  monthlyGenerationLimit: number;
  monthlyGenerationCount: number;
  canEdit: boolean;
}

export interface JournalGenerateResponse {
  content: string;
}

const isRecord = (v: unknown): v is Record<string, unknown> =>
  typeof v === "object" && v !== null;

export function isJournalEntryResponse(
  data: unknown,
): data is { entry: JournalEntryResponse | null } {
  if (!isRecord(data) || !("entry" in data)) return false;
  const entry = data.entry;
  if (entry === null) return true;
  if (!isRecord(entry)) return false;
  return (
    typeof entry.id === "string" &&
    typeof entry.date === "string" &&
    typeof entry.content === "string" &&
    typeof entry.createdAt === "string" &&
    typeof entry.updatedAt === "string"
  );
}

export function isJournalDatesResponse(
  data: unknown,
): data is JournalDatesResponse {
  return (
    isRecord(data) &&
    "dates" in data &&
    Array.isArray(data.dates) &&
    data.dates.every((d) => typeof d === "string")
  );
}

export function isJournalAccessResponse(
  data: unknown,
): data is JournalAccessResponse {
  return (
    isRecord(data) &&
    "monthlyGenerationLimit" in data &&
    "monthlyGenerationCount" in data &&
    "canEdit" in data &&
    typeof data.monthlyGenerationLimit === "number" &&
    typeof data.monthlyGenerationCount === "number" &&
    typeof data.canEdit === "boolean"
  );
}

export function isJournalGenerateResponse(
  data: unknown,
): data is JournalGenerateResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "content" in data &&
    typeof (data as JournalGenerateResponse).content === "string"
  );
}
