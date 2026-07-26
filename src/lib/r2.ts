import {
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";

// ─── R2 Client ────────────────────────────────────────────────────────────────
// Uses Cloudflare R2's S3-compatible endpoint.
// Credentials are injected via environment variables (never exposed to client).

function getR2Client(): S3Client {
  const accountId = process.env.R2_ACCOUNT_ID;
  const accessKeyId = process.env.R2_ACCESS_KEY_ID;
  const secretAccessKey = process.env.R2_SECRET_ACCESS_KEY;

  if (!accountId || !accessKeyId || !secretAccessKey) {
    throw new Error(
      "Missing Cloudflare R2 environment variables. " +
        "Please set R2_ACCOUNT_ID, R2_ACCESS_KEY_ID, R2_SECRET_ACCESS_KEY, and R2_BUCKET_NAME in your .env file.",
    );
  }

  return new S3Client({
    region: "auto",
    endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId, secretAccessKey },
  });
}

// ─── Generate a short-lived signed download URL ────────────────────────────────
// The URL is valid for 1 hour and can only be used once-ish (no sharing).
export async function getSignedDownloadUrl(
  r2Key: string,
  expiresInSeconds = 3600,
): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME!;
  const command = new GetObjectCommand({ Bucket: bucket, Key: r2Key });
  return getSignedUrl(getR2Client(), command, { expiresIn: expiresInSeconds });
}

// ─── Generate a signed upload URL (for admin uploads) ─────────────────────────
export async function getSignedUploadUrl(
  r2Key: string,
  contentType: string,
  expiresInSeconds = 900, // 15 minutes
): Promise<string> {
  const bucket = process.env.R2_BUCKET_NAME!;
  const command = new PutObjectCommand({
    Bucket: bucket,
    Key: r2Key,
    ContentType: contentType,
  });
  return getSignedUrl(getR2Client(), command, { expiresIn: expiresInSeconds });
}

/** Public object URL for covers/images (requires R2_PUBLIC_URL, e.g. https://pub-xxx.r2.dev). */
export function getPublicObjectUrl(r2Key: string): string {
  const base = process.env.R2_PUBLIC_URL?.replace(/\/$/, "");
  if (!base) {
    throw new Error(
      "Missing R2_PUBLIC_URL. Set it to your R2 public bucket URL or custom domain.",
    );
  }
  return `${base}/${r2Key}`;
}

export function buildObjectKey(folder: string, filename: string): string {
  const safeName = filename.replace(/[^a-zA-Z0-9._-]/g, "_");
  return `${folder}/${Date.now()}-${safeName}`;
}
