import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

let cachedClient: S3Client | null = null;
let cachedBucket: string | null = null;

function ensureClient() {
  if (cachedClient && cachedBucket) {
    return { client: cachedClient, bucket: cachedBucket };
  }

  const endpoint = process.env.MINIO_ENDPOINT;
  const accessKeyId = process.env.MINIO_ROOT_USER;
  const secretAccessKey = process.env.MINIO_ROOT_PASSWORD;
  const bucketName = process.env.MINIO_BUCKET;
  const region = process.env.MINIO_REGION || "us-east-1";

  if (!endpoint || !accessKeyId || !secretAccessKey || !bucketName) {
    throw new Error(
      "Missing MinIO configuration. Please set MINIO_ENDPOINT, MINIO_ROOT_USER, MINIO_ROOT_PASSWORD, and MINIO_BUCKET."
    );
  }

  cachedClient = new S3Client({
    region,
    endpoint,
    credentials: {
      accessKeyId,
      secretAccessKey,
    },
    forcePathStyle: true,
  });

  cachedBucket = bucketName;
  return { client: cachedClient, bucket: cachedBucket };
}

export async function uploadObject(key: string, body: Buffer | Uint8Array | ArrayBuffer | string, contentType: string) {
  const { client, bucket } = ensureClient();
  let payload: Uint8Array | Buffer | string = body as any;
  if (body instanceof ArrayBuffer) {
    payload = new Uint8Array(body);
  }

  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: payload,
      ContentType: contentType,
    })
  );
}

export async function deleteObject(key: string) {
  const { client, bucket } = ensureClient();
  await client.send(
    new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    })
  );
}

export async function getPresignedDownloadUrl(key: string, expiresInSeconds = 60) {
  const { client, bucket } = ensureClient();
  return await getSignedUrl(
    client,
    new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    }),
    { expiresIn: expiresInSeconds }
  );
}
