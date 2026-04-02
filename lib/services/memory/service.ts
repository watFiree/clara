import { prisma } from "@/lib/prisma";
import { encryptData, decryptData, applySignFlip } from "@/lib/crypto";
import { getOrCreateUserKey, getOrCreateSignVector } from "@/lib/user-keys";
import type {
  MemoryCategory,
  MemoryStatus,
} from "@/app/generated/prisma/client";
import {
  DecryptedMemory,
  MemoryContent,
  memoryContentSchema,
  MemorySearchRow,
} from "./consts";
import { contentToEmbeddingText } from "./helpers";
import { generateEmbedding } from "@/lib/embed";
import { Prisma } from "@/app/generated/prisma/client";

const DUPLICATE_SIMILARITY_THRESHOLD = 0.75;

export async function createMemory(
  userId: string,
  data: {
    content: MemoryContent;
    category: MemoryCategory;
    status?: MemoryStatus;
    confidence?: number;
    sourceConversationId?: string;
  },
): Promise<DecryptedMemory> {
  try {

    const userKey = await getOrCreateUserKey(userId);
    const signVector = await getOrCreateSignVector(userId, userKey);
    const embeddingText = contentToEmbeddingText(data.content);
    const embedding = await generateEmbedding(embeddingText);
    const rotated = applySignFlip(embedding, signVector);
    const vectorStr = `[${rotated.join(",")}]`;

    // Check for duplicate memories and remove them before saving
    const duplicates = await prisma.$queryRaw<{ id: string }[]>(Prisma.sql`
      SELECT "id"
      FROM "Memory"
      WHERE "userId" = ${userId}
        AND "status" = 'OPEN'::"MemoryStatus"
        AND (1 - ("rotatedEmbedding" <=> ${vectorStr}::vector)) >= ${DUPLICATE_SIMILARITY_THRESHOLD}
    `);

    if (duplicates.length > 0) {
      await prisma.memory.deleteMany({
        where: {
          id: { in: duplicates.map((d) => d.id) },
          userId,
        },
      });
    }

    const encryptedContent = encryptData(data.content, userKey);
    const category = data.category;
    const status = data.status ?? "OPEN";
    const confidence = data.confidence ?? 1.0;

    const [memory] = await prisma.$queryRaw<
      {
        id: string;
        category: MemoryCategory;
        status: MemoryStatus;
        confidence: number;
        createdAt: Date;
        updatedAt: Date;
      }[]
    >(Prisma.sql`
    INSERT INTO "Memory" ("id", "userId", "encryptedContent", "rotatedEmbedding", "category", "status", "confidence", "sourceConversationId", "createdAt", "updatedAt")
    VALUES (gen_random_uuid(), ${userId}, ${encryptedContent}, ${vectorStr}::vector, ${category}::"MemoryCategory", ${status}::"MemoryStatus", ${confidence}, ${data.sourceConversationId ?? null}, NOW(), NOW())
    RETURNING "id", "category", "status", "confidence", "createdAt", "updatedAt"
  `);

    return {
      id: memory.id,
      content: data.content,
      category: memory.category,
      status: memory.status,
      confidence: memory.confidence,
      createdAt: memory.createdAt,
      updatedAt: memory.updatedAt,
    };
  } catch (error) {
    throw new Error("Memory creation failed", { cause: JSON.stringify(error) });
  }
}

export async function searchMemories(
  userId: string,
  query: string,
  options: {
    topK?: number;
    threshold?: number;
    category?: MemoryCategory;
    status?: MemoryStatus;
    includeAllStatuses?: boolean;
  } = {},
): Promise<Array<DecryptedMemory & { score: number }>> {

  const {
    topK = 5,
    threshold = 0.3,
    category,
    status = "OPEN",
    includeAllStatuses = false,
  } = options;

  const userKey = await getOrCreateUserKey(userId);
  const signVector = await getOrCreateSignVector(userId, userKey);
  const queryEmbedding = await generateEmbedding(query);
  const rotatedQuery = applySignFlip(queryEmbedding, signVector);
  const vectorStr = `[${rotatedQuery.join(",")}]`;

  // Build WHERE conditions
  const conditions = [Prisma.sql`"userId" = ${userId}`];
  if (!includeAllStatuses)
    conditions.push(Prisma.sql`"status" = ${status}::"MemoryStatus"`);
  if (category)
    conditions.push(Prisma.sql`"category" = ${category}::"MemoryCategory"`);

  const whereClause = Prisma.join(conditions, " AND ");

  // cosine distance (<=>): 0 = identical, 2 = opposite
  // convert to similarity: 1 - distance
  const rows = await prisma.$queryRaw<MemorySearchRow[]>(Prisma.sql`
    SELECT
      "id",
      "encryptedContent",
      "category",
      "status",
      "confidence",
      "createdAt",
      "updatedAt",
      (1 - ("rotatedEmbedding" <=> ${vectorStr}::vector)) * "confidence" AS "score"
    FROM "Memory"
    WHERE ${whereClause}
      AND (1 - ("rotatedEmbedding" <=> ${vectorStr}::vector)) * "confidence" >= ${threshold}
    ORDER BY "rotatedEmbedding" <=> ${vectorStr}::vector
    LIMIT ${topK}
  `);

  return rows.map((r) => ({
    id: r.id,
    content: memoryContentSchema.parse(
      decryptData(r.encryptedContent, userKey),
    ),
    category: r.category,
    status: r.status,
    confidence: r.confidence,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    score: Number(r.score),
  }));
}

export async function getMemoriesByUser(
  userId: string,
  options: { status?: MemoryStatus } = {},
): Promise<DecryptedMemory[]> {

  const userKey = await getOrCreateUserKey(userId);

  const where: Record<string, unknown> = { userId };
  if (options.status) where.status = options.status;

  const memories = await prisma.memory.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });

  return memories.map((m) => ({
    id: m.id,
    content: memoryContentSchema.parse(
      decryptData(m.encryptedContent, userKey),
    ),
    category: m.category,
    status: m.status,
    confidence: m.confidence,
    createdAt: m.createdAt,
    updatedAt: m.updatedAt,
  }));
}

export async function updateMemory(
  userId: string,
  memoryId: string,
  data: { status?: MemoryStatus; confidence?: number },
): Promise<void> {

  await prisma.memory.updateMany({
    where: { id: memoryId, userId },
    data,
  });
}

export async function deleteMemory(
  userId: string,
  memoryId: string,
): Promise<void> {

  await prisma.memory.deleteMany({
    where: { id: memoryId, userId },
  });
}

export async function getMemoryCount(userId: string): Promise<number> {
  return prisma.memory.count({ where: { userId } });
}
