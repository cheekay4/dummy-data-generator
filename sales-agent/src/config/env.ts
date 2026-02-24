import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

const envSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, 'ANTHROPIC_API_KEY is required'),
  GMAIL_CLIENT_ID: z.string().min(1, 'GMAIL_CLIENT_ID is required'),
  GMAIL_CLIENT_SECRET: z.string().min(1, 'GMAIL_CLIENT_SECRET is required'),
  GMAIL_REDIRECT_URI: z.string().url().default('http://localhost:3000/oauth2callback'),
  GMAIL_REFRESH_TOKEN: z.string().optional(),
  SUPABASE_URL: z.string().url('SUPABASE_URL must be a valid URL'),
  SUPABASE_SERVICE_KEY: z.string().min(1, 'SUPABASE_SERVICE_KEY is required'),
  SENDER_NAME: z.string().default('Riku'),
  SENDER_EMAIL: z.string().email('SENDER_EMAIL must be a valid email'),
  DAILY_SEND_LIMIT: z.coerce.number().int().min(1).max(500).default(20),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ 環境変数の設定エラー:');
  for (const err of parsed.error.errors) {
    console.error(`  - ${err.path.join('.')}: ${err.message}`);
  }
  process.exit(1);
}

export const env = parsed.data;
