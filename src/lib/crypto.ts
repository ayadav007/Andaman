import { createCipheriv, createDecipheriv, createHash, randomBytes } from "crypto";

function keyBytes() {
  const secret =
    process.env.ENCRYPTION_KEY ||
    process.env.SESSION_SECRET ||
    "andaman-ecstasy-dev-encryption-key";
  return createHash("sha256").update(secret).digest();
}

/** Encrypt plaintext → `ae1:iv:tag:ciphertext` (base64url parts). */
export function encryptSecret(plaintext: string): string {
  const iv = randomBytes(12);
  const cipher = createCipheriv("aes-256-gcm", keyBytes(), iv);
  const enc = Buffer.concat([cipher.update(plaintext, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return [
    "ae1",
    iv.toString("base64url"),
    tag.toString("base64url"),
    enc.toString("base64url"),
  ].join(":");
}

export function decryptSecret(payload: string | null | undefined): string | null {
  if (!payload) return null;
  try {
    const parts = payload.split(":");
    if (parts.length !== 4 || parts[0] !== "ae1") return null;
    const iv = Buffer.from(parts[1], "base64url");
    const tag = Buffer.from(parts[2], "base64url");
    const data = Buffer.from(parts[3], "base64url");
    const decipher = createDecipheriv("aes-256-gcm", keyBytes(), iv);
    decipher.setAuthTag(tag);
    const out = Buffer.concat([decipher.update(data), decipher.final()]);
    return out.toString("utf8");
  } catch {
    return null;
  }
}

export function isSecretConfigured(enc: string | null | undefined) {
  return Boolean(enc && enc.startsWith("ae1:"));
}
