import type { MemoryStatus } from "@/app/generated/prisma/client";

export interface MemoryResponse {
  id: string;
  content:
    | { type: "fact"; description: string }
    | { type: "pattern"; trigger: string; effect: string };
  category: string;
  status: string;
  confidence: number;
  createdAt: string;
  updatedAt: string;
}

const VALID_MEMORY_STATUSES: readonly string[] = [
  "OPEN",
  "RESOLVED",
  "SNOOZED",
  "EXPIRED",
];

export type UpdateMemoryBody = {
  status?: MemoryStatus;
  confidence?: number;
};

export function isUpdateMemoryBody(
  data: unknown,
): data is UpdateMemoryBody {
  if (typeof data !== "object" || data === null) return false;

  if (
    "status" in data &&
    (typeof data.status !== "string" ||
      !VALID_MEMORY_STATUSES.includes(data.status))
  )
    return false;
  if ("confidence" in data && typeof data.confidence !== "number") return false;

  return true;
}

export interface MemoriesListResponse {
  memories: MemoryResponse[];
}

export function isMemoriesListResponse(
  data: unknown,
): data is MemoriesListResponse {
  return (
    typeof data === "object" &&
    data !== null &&
    "memories" in data &&
    Array.isArray(data.memories)
  );
}
