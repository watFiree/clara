import { prisma } from "@/lib/prisma";
import { encryptData, decryptData } from "@/lib/crypto";
import { getOrCreateUserKey } from "@/lib/user-keys";
import type { MessageRole } from "@/app/generated/prisma/client";

interface CreateMessageData {
  id?: string;
  role: MessageRole;
  parts: unknown;
  conversationId: string;
}

interface UpsertMessageData {
  id: string;
  role: MessageRole;
  parts: unknown;
  conversationId: string;
}

export async function createMessage(userId: string, data: CreateMessageData) {

  const userKey = await getOrCreateUserKey(userId);
  const encryptedParts = encryptData(data.parts, userKey);

  return prisma.message.create({
    data: {
      ...(data.id && { id: data.id }),
      role: data.role,
      parts: encryptedParts,
      conversationId: data.conversationId,
    },
  });
}

export async function upsertMessage(userId: string, data: UpsertMessageData) {

  const userKey = await getOrCreateUserKey(userId);
  const encryptedParts = encryptData(data.parts, userKey);

  return prisma.message.upsert({
    where: { id: data.id },
    create: {
      id: data.id,
      role: data.role,
      parts: encryptedParts,
      conversationId: data.conversationId,
    },
    update: {
      parts: encryptedParts,
    },
  });
}

export async function getMessages(userId: string, conversationId: string) {

  const userKey = await getOrCreateUserKey(userId);

  const messages = await prisma.message.findMany({
    where: { conversationId },
    orderBy: { createdAt: "asc" },
  });

  return messages.map((m) => ({
    ...m,
    parts: decryptData(m.parts, userKey),
  }));
}
