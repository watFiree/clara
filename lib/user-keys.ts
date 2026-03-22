import { prisma } from "@/lib/prisma";
import {
  generateUserKey,
  encryptUserKey,
  decryptUserKey,
  getMasterKey,
  generateSignVector,
  encryptData,
  decryptData,
} from "@/lib/crypto";

export async function getOrCreateUserKey(userId: string): Promise<Buffer> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { encryptedKey: true, keyIv: true },
  });

  const masterKey = getMasterKey();

  if (user.encryptedKey && user.keyIv) {
    return decryptUserKey(user.encryptedKey, user.keyIv, masterKey);
  }

  const userKey = generateUserKey();
  const { encrypted, iv } = encryptUserKey(userKey, masterKey);

  await prisma.user.update({
    where: { id: userId },
    data: { encryptedKey: encrypted, keyIv: iv },
  });

  return userKey;
}

export async function getOrCreateSignVector(
  userId: string,
  userKey: Buffer,
): Promise<number[]> {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId },
    select: { encryptedSignVector: true },
  });

  if (user.encryptedSignVector) {
    return decryptData(user.encryptedSignVector, userKey) as number[];
  }

  const signVector = generateSignVector();
  const encrypted = encryptData(signVector, userKey);

  await prisma.user.update({
    where: { id: userId },
    data: { encryptedSignVector: encrypted },
  });

  return signVector;
}
