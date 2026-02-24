-- Phase 3-C: Chrome拡張トークン用マイグレーション
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS extension_token_hash TEXT;
