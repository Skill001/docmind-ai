import fs from "fs/promises";
import path from "path";

const PUBLIC_DIR = path.join(process.cwd(), "public");

function normalizeKey(key: string) {
  const normalized = key.replace(/^\/+/, "");
  if (normalized.includes("..")) {
    throw new Error("Invalid storage key.");
  }
  return normalized;
}

export async function uploadObject(key: string, body: Buffer | Uint8Array | ArrayBuffer | string, contentType: string) {
  const normalizedKey = normalizeKey(key);
  const fullPath = path.join(PUBLIC_DIR, normalizedKey);
  await fs.mkdir(path.dirname(fullPath), { recursive: true });

  const payload =
    body instanceof ArrayBuffer
      ? Buffer.from(body)
      : Buffer.isBuffer(body)
      ? body
      : body instanceof Uint8Array
      ? Buffer.from(body)
      : Buffer.from(String(body));

  await fs.writeFile(fullPath, payload);
}

export async function deleteObject(key: string) {
  const normalizedKey = normalizeKey(key);
  const fullPath = path.join(PUBLIC_DIR, normalizedKey);
  await fs.rm(fullPath, { force: true });
}

export async function getPresignedDownloadUrl(key: string, expiresInSeconds = 60) {
  const normalizedKey = normalizeKey(key);
  return `/${normalizedKey.replace(/\\/g, "/")}`;
}
