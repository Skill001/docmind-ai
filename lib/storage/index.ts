import * as local from "./local";
import * as minio from "./minio";

const isProduction = process.env.NODE_ENV === "production";

export async function uploadFile(key: string, body: Buffer | Uint8Array | ArrayBuffer | string, contentType: string) {
  if (isProduction) {
    return minio.uploadObject(key, body, contentType);
  }

  return local.uploadObject(key, body, contentType);
}

export async function deleteFile(key: string) {
  if (isProduction) {
    return minio.deleteObject(key);
  }

  return local.deleteObject(key);
}

export async function getDownloadUrl(key: string, expiresInSeconds = 60) {
  if (isProduction) {
    return minio.getPresignedDownloadUrl(key, expiresInSeconds);
  }

  return local.getPresignedDownloadUrl(key, expiresInSeconds);
}
