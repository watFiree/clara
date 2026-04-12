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

export function isJournalEntryResponse(
  data: unknown,
): data is { entry: JournalEntryResponse | null } {
  if (typeof data !== "object" || data === null) return false;
  if (!("entry" in data)) return false;
  return true;
}

export function isJournalDatesResponse(
  data: unknown,
): data is JournalDatesResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "dates" in data &&
    Array.isArray(data.dates)
  );
}

export function isJournalAccessResponse(
  data: unknown,
): data is JournalAccessResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "monthlyGenerationLimit" in data &&
    "monthlyGenerationCount" in data &&
    "canEdit" in data
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
