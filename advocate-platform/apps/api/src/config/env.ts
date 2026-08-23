import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.coerce.number().default(4000),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),

  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  JWT_ACCESS_EXPIRES_IN: z.string().default('15m'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('7d'),

  FRONTEND_URL: z.string().url().default('http://localhost:3000'),
  ALLOWED_ORIGINS: z.string().default('http://localhost:3000'),

  STORAGE_PROVIDER: z.enum(['local', 's3', 'r2']).default('local'),
  AWS_ACCESS_KEY_ID: z.string().optional(),
  AWS_SECRET_ACCESS_KEY: z.string().optional(),
  AWS_REGION: z.string().default('ap-south-1'),
  AWS_S3_BUCKET: z.string().optional(),

  ADMIN_EMAIL: z.string().email().default('admin@example.com'),
  ADMIN_PASSWORD: z.string().min(8).default('Admin@123456'),

  SITE_NAME: z.string().default('[FIRM_NAME]'),
  SITE_URL: z.string().default('http://localhost:3000'),
  SITE_TAGLINE: z.string().default('Expert Legal Counsel You Can Trust'),
  CONTACT_EMAIL: z.string().default('contact@example.com'),
  CONTACT_PHONE: z.string().default('+91 XXXXX XXXXX'),
  OFFICE_ADDRESS: z.string().default('[Office Address]'),
  PRIMARY_COLOR: z.string().default('#1a365d'),
  DEFAULT_SEO_TITLE: z.string().default('[FIRM_NAME] — Expert Legal Services'),
  DEFAULT_META_DESC: z.string().default('[FIRM_NAME] provides expert legal services.'),

  RATE_LIMIT_WINDOW_MS: z.coerce.number().default(60000),
  RATE_LIMIT_MAX: z.coerce.number().default(100),
  AUTH_RATE_LIMIT_MAX: z.coerce.number().default(5),

  ENABLED_COURT_PROVIDERS: z.string().default('MANUAL'),

  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.coerce.number().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM_NAME: z.string().default('[FIRM_NAME]'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
export type Env = typeof env;
