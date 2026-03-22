import crypto, { type CipherGCMTypes } from "crypto";

const ALGORITHM: CipherGCMTypes = "aes-256-gcm";
const IV_LENGTH = 12;
const AUTH_TAG_LENGTH = 16;

let masterKeyCache: Buffer | null = null;

export function getMasterKey(): Buffer {
  if (masterKeyCache) return masterKeyCache;

  const hex = process.env.ENCRYPTION_MASTER_KEY;
  if (!hex || hex.length !== 64) {
    throw new Error(
      "ENCRYPTION_MASTER_KEY must be a 64-character hex string (32 bytes). Generate with: openssl rand -hex 32",
    );
  }

  masterKeyCache = Buffer.from(hex, "hex");
  return masterKeyCache;
}

export function generateUserKey(): Buffer {
  return crypto.randomBytes(32);
}

export function encryptUserKey(
  userKey: Buffer,
  masterKey: Buffer,
): { encrypted: string; iv: string } {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, masterKey, iv);

  const encrypted = Buffer.concat([cipher.update(userKey), cipher.final()]);
  const authTag = cipher.getAuthTag();

  return {
    encrypted: Buffer.concat([authTag, encrypted]).toString("base64"),
    iv: iv.toString("base64"),
  };
}

export function decryptUserKey(
  encrypted: string,
  iv: string,
  masterKey: Buffer,
): Buffer {
  const data = Buffer.from(encrypted, "base64");
  const authTag = data.subarray(0, AUTH_TAG_LENGTH);
  const ciphertext = data.subarray(AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(
    ALGORITHM,
    masterKey,
    Buffer.from(iv, "base64"),
  );
  decipher.setAuthTag(authTag);

  return Buffer.concat([decipher.update(ciphertext), decipher.final()]);
}

export function encryptData(data: unknown, key: Buffer): string {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);

  const plaintext = JSON.stringify(data);
  const encrypted = Buffer.concat([
    cipher.update(plaintext, "utf8"),
    cipher.final(),
  ]);
  const authTag = cipher.getAuthTag();

  return Buffer.concat([iv, authTag, encrypted]).toString("base64");
}

const EMBEDDING_DIM = 1536; // text-embedding-3-small

export function generateSignVector(): number[] {
  const bytes = crypto.randomBytes(EMBEDDING_DIM);
  return Array.from(bytes, (b) => (b < 128 ? -1 : 1));
}

export function applySignFlip(embedding: number[], signs: number[]): number[] {
  return embedding.map((v, i) => v * signs[i]);
}

export function decryptData(encryptedString: string, key: Buffer): unknown {
  const data = Buffer.from(encryptedString, "base64");

  const iv = data.subarray(0, IV_LENGTH);
  const authTag = data.subarray(IV_LENGTH, IV_LENGTH + AUTH_TAG_LENGTH);
  const ciphertext = data.subarray(IV_LENGTH + AUTH_TAG_LENGTH);

  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
  decipher.setAuthTag(authTag);

  const decrypted = Buffer.concat([
    decipher.update(ciphertext),
    decipher.final(),
  ]);

  return JSON.parse(decrypted.toString("utf8"));
}
