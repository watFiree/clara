import { prisma } from "@/lib/prisma";
import { Prisma } from "@/app/generated/prisma/client";
import { encryptData, decryptData } from "@/lib/crypto";
import { getOrCreateUserKey } from "@/lib/user-keys";
import { getStartOfDayUTC } from "@/lib/utils/date";

export interface DecryptedJournalEntry {
  id: string;
  date: Date;
  content: string;
  createdAt: Date;
  updatedAt: Date;
}

export async function getJournalEntry(
  userId: string,
  date: Date,
): Promise<DecryptedJournalEntry | null> {
  const normalizedDate = getStartOfDayUTC(date);

  const entry = await prisma.journalEntry.findUnique({
    where: { userId_date: { userId, date: normalizedDate } },
  });

  if (!entry) return null;

  const userKey = await getOrCreateUserKey(userId);
  const content = decryptData(entry.encryptedContent, userKey) as string;

  return {
    id: entry.id,
    date: entry.date,
    content,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

export async function upsertJournalEntry(
  userId: string,
  date: Date,
  content: string,
): Promise<DecryptedJournalEntry> {
  const normalizedDate = getStartOfDayUTC(date);
  const userKey = await getOrCreateUserKey(userId);
  const encryptedContent = encryptData(content, userKey);

  const entry = await prisma.journalEntry.upsert({
    where: { userId_date: { userId, date: normalizedDate } },
    create: {
      userId,
      date: normalizedDate,
      encryptedContent,
    },
    update: {
      encryptedContent,
    },
  });

  return {
    id: entry.id,
    date: entry.date,
    content,
    createdAt: entry.createdAt,
    updatedAt: entry.updatedAt,
  };
}

export async function getJournalEntryDates(
  userId: string,
  year: number,
  month: number,
): Promise<Date[]> {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  const entries = await prisma.journalEntry.findMany({
    where: {
      userId,
      date: { gte: startDate, lt: endDate },
    },
    select: { date: true },
    orderBy: { date: "asc" },
  });

  return entries.map((e) => e.date);
}

export async function getMonthlyGenerationCount(
  userId: string,
  year: number,
  month: number,
): Promise<number> {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  return prisma.journalGeneration.count({
    where: {
      userId,
      createdAt: { gte: startDate, lt: endDate },
    },
  });
}

export async function recordGeneration(userId: string): Promise<void> {
  await prisma.journalGeneration.create({
    data: { userId },
  });
}

class QuotaExceededError extends Error {
  constructor(public readonly used: number) {
    super("QUOTA_EXCEEDED");
  }
}

export async function reserveJournalGeneration(
  userId: string,
  year: number,
  month: number,
  limit: number,
): Promise<{ reserved: boolean; used: number }> {
  const startDate = new Date(Date.UTC(year, month - 1, 1));
  const endDate = new Date(Date.UTC(year, month, 1));

  try {
    await prisma.$transaction(
      async (tx) => {
        const used = await tx.journalGeneration.count({
          where: { userId, createdAt: { gte: startDate, lt: endDate } },
        });
        if (used >= limit) throw new QuotaExceededError(used);
        await tx.journalGeneration.create({ data: { userId } });
      },
      { isolationLevel: Prisma.TransactionIsolationLevel.Serializable },
    );
    return { reserved: true, used: 0 };
  } catch (err) {
    if (err instanceof QuotaExceededError) {
      return { reserved: false, used: err.used };
    }
    throw err;
  }
}

export async function deleteJournalEntry(
  userId: string,
  date: Date,
): Promise<void> {
  const normalizedDate = getStartOfDayUTC(date);

  await prisma.journalEntry.delete({
    where: { userId_date: { userId, date: normalizedDate } },
  });
}
