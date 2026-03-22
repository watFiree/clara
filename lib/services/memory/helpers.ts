import { MemoryCategory } from "@/app/generated/prisma/enums";
import { MemoryContent, PATTERN_CATEGORIES } from "./consts";

export function getContentTypeForCategory(
  category: MemoryCategory,
): "fact" | "pattern" {
  if (PATTERN_CATEGORIES.includes(category)) return "pattern";
  return "fact";
}

export function contentToEmbeddingText(content: MemoryContent): string {
  if (content.type === "fact") return content.description;
  return `${content.trigger} → ${content.effect}`;
}
