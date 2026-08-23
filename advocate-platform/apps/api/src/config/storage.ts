import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { env } from './env';
import path from 'path';
import fs from 'fs';

// ─── Local Storage Provider (Development) ────────────────────────────────────

const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'uploads');

function ensureLocalDir() {
  if (!fs.existsSync(LOCAL_UPLOAD_DIR)) {
    fs.mkdirSync(LOCAL_UPLOAD_DIR, { recursive: true });
  }
}

// ─── S3 Client ───────────────────────────────────────────────────────────────

let s3Client: S3Client | null = null;

if (env.STORAGE_PROVIDER === 's3' || env.STORAGE_PROVIDER === 'r2') {
  s3Client = new S3Client({
    region: env.AWS_REGION,
    credentials:
      env.AWS_ACCESS_KEY_ID && env.AWS_SECRET_ACCESS_KEY
        ? {
            accessKeyId: env.AWS_ACCESS_KEY_ID,
            secretAccessKey: env.AWS_SECRET_ACCESS_KEY,
          }
        : undefined,
  });
}

// ─── Storage Interface ───────────────────────────────────────────────────────

export const storage = {
  /**
   * Generate a presigned URL for client-side direct upload (S3)
   * or return a local upload endpoint path (dev)
   */
  async getUploadPresignedUrl(
    key: string,
    contentType: string,
    expiresIn = 300
  ): Promise<string> {
    if (env.STORAGE_PROVIDER === 'local') {
      // In local mode, return an internal API upload path
      return `/api/v1/documents/local-upload?key=${encodeURIComponent(key)}`;
    }

    if (!s3Client || !env.AWS_S3_BUCKET) {
      throw new Error('S3 not configured');
    }

    const command = new PutObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
      ContentType: contentType,
    });

    return getSignedUrl(s3Client, command, { expiresIn });
  },

  /**
   * Generate a presigned download URL for authorized document access.
   * Expires in 10 minutes by default.
   */
  async getDownloadPresignedUrl(key: string, expiresIn = 600): Promise<string> {
    if (env.STORAGE_PROVIDER === 'local') {
      return `/api/v1/documents/local-download?key=${encodeURIComponent(key)}`;
    }

    if (!s3Client || !env.AWS_S3_BUCKET) {
      throw new Error('S3 not configured');
    }

    const command = new GetObjectCommand({
      Bucket: env.AWS_S3_BUCKET,
      Key: key,
    });

    return getSignedUrl(s3Client, command, { expiresIn });
  },

  /**
   * Delete an object from storage
   */
  async deleteObject(key: string): Promise<void> {
    if (env.STORAGE_PROVIDER === 'local') {
      const filePath = path.join(LOCAL_UPLOAD_DIR, key);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
      return;
    }

    if (!s3Client || !env.AWS_S3_BUCKET) {
      throw new Error('S3 not configured');
    }

    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: env.AWS_S3_BUCKET,
        Key: key,
      })
    );
  },

  /**
   * Save file buffer to local storage (dev only)
   */
  saveLocal(key: string, buffer: Buffer): void {
    ensureLocalDir();
    const filePath = path.join(LOCAL_UPLOAD_DIR, key);
    const dir = path.dirname(filePath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(filePath, buffer);
  },

  /**
   * Read file from local storage (dev only)
   */
  readLocal(key: string): Buffer {
    ensureLocalDir();
    const filePath = path.join(LOCAL_UPLOAD_DIR, key);
    return fs.readFileSync(filePath);
  },
};
