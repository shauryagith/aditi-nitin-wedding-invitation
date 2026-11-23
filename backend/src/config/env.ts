import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

// Look for .env in current directory and parent directory (monorepo root)
const rootEnvPath = path.resolve(process.cwd(), '.env');
const parentEnvPath = path.resolve(process.cwd(), '..', '.env');

const initialNodeEnv = process.env.NODE_ENV;
const isVitest = process.env.VITEST === 'true';

if (fs.existsSync(rootEnvPath)) {
  dotenv.config({ path: rootEnvPath });
} else if (fs.existsSync(parentEnvPath)) {
  dotenv.config({ path: parentEnvPath });
} else {
  dotenv.config();
}

// Preserve test environment
if (initialNodeEnv === 'test' || isVitest) {
  process.env.NODE_ENV = 'test';
}

export const ENV = {
  PORT: process.env.PORT ? parseInt(process.env.PORT, 10) : 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/aditi-nitin-wedding',
  JWT_SECRET: process.env.JWT_SECRET || 'aditi_nitin_royal_wedding_jwt_secret_key_2026_super_secure',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  COOKIE_SECRET: process.env.COOKIE_SECRET || 'aditi_nitin_cookie_secret_2026',

  // Storage Provider Configuration
  STORAGE_PROVIDER: (process.env.STORAGE_PROVIDER?.toLowerCase() || 'local') as 'cloudinary' | 'local',
  CLOUDINARY_CLOUD_NAME: process.env.CLOUDINARY_CLOUD_NAME || '',
  CLOUDINARY_API_KEY: process.env.CLOUDINARY_API_KEY || '',
  CLOUDINARY_API_SECRET: process.env.CLOUDINARY_API_SECRET || '',

  // Admin Seed Account
  ADMIN_DEFAULT_NAME: process.env.ADMIN_DEFAULT_NAME || 'Wedding Admin',
  ADMIN_DEFAULT_EMAIL: process.env.ADMIN_DEFAULT_EMAIL || 'admin@aditinitinwedding.com',
  ADMIN_DEFAULT_PASSWORD: process.env.ADMIN_DEFAULT_PASSWORD || 'ChangeMe@Wedding2026!',

  // WhatsApp Cloud API
  WHATSAPP_PHONE_NUMBER_ID: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
  WHATSAPP_ACCESS_TOKEN: process.env.WHATSAPP_ACCESS_TOKEN || '',
  WHATSAPP_BUSINESS_ACCOUNT_ID: process.env.WHATSAPP_BUSINESS_ACCOUNT_ID || '',
  WHATSAPP_WEBHOOK_VERIFY_TOKEN: process.env.WHATSAPP_WEBHOOK_VERIFY_TOKEN || 'royal_wedding_webhook_secret_token_2026',
  WHATSAPP_API_VERSION: process.env.WHATSAPP_API_VERSION || 'v21.0',
};

/**
 * Validates storage provider configuration during application startup.
 * Never prints secret values.
 */
export function validateStorageConfig(): { valid: boolean; provider: string; warning?: string } {
  if (ENV.STORAGE_PROVIDER === 'cloudinary') {
    const missing: string[] = [];
    if (!ENV.CLOUDINARY_CLOUD_NAME) missing.push('CLOUDINARY_CLOUD_NAME');
    if (!ENV.CLOUDINARY_API_KEY) missing.push('CLOUDINARY_API_KEY');
    if (!ENV.CLOUDINARY_API_SECRET) missing.push('CLOUDINARY_API_SECRET');

    if (missing.length > 0) {
      const msg = `[Storage Config Error] STORAGE_PROVIDER is set to 'cloudinary' but missing required credentials: ${missing.join(', ')}.`;
      if (ENV.NODE_ENV === 'production') {
        throw new Error(msg);
      } else {
        console.warn(`⚠️ ${msg} Running with local fallback for development.`);
        return { valid: false, provider: 'cloudinary', warning: msg };
      }
    }
    return { valid: true, provider: 'cloudinary' };
  }

  return { valid: true, provider: 'local' };
}

