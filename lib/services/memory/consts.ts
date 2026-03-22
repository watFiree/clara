import { MemoryCategory, MemoryStatus } from "@/app/generated/prisma/enums";
import { z } from "zod";

export const factContentSchema = z.object({
  type: z.literal("fact"),
  description: z.string(),
});

export const patternContentSchema = z.object({
  type: z.literal("pattern"),
  trigger: z.string(),
  effect: z.string(),
});

export const memoryContentSchema = z.discriminatedUnion("type", [
  factContentSchema,
  patternContentSchema,
]);

export type FactContent = z.infer<typeof factContentSchema>;
export type PatternContent = z.infer<typeof patternContentSchema>;
export type MemoryContent = z.infer<typeof memoryContentSchema>;

export const PATTERN_CATEGORIES: MemoryCategory[] = ["EMOTIONAL", "COPING"];

export interface DecryptedMemory {
  id: string;
  content: MemoryContent;
  category: MemoryCategory;
  status: MemoryStatus;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface MemorySearchRow {
  id: string;
  encryptedContent: string;
  category: MemoryCategory;
  status: MemoryStatus;
  confidence: number;
  createdAt: Date;
  updatedAt: Date;
  score: number;
}
