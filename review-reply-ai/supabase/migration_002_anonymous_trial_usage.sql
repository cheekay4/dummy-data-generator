-- 未ログインユーザーのトライアル利用回数管理テーブル
-- サーバーレス環境のin-memoryリセット問題を解消するためSupabaseで永続化する

create table if not exists public.anonymous_trial_usage (
  id          uuid primary key default gen_random_uuid(),
  ip_hash     text not null,         -- SHA-256(IP) をhex文字列で保存
  usage_date  date not null,
  count       integer not null default 0,
  unique (ip_hash, usage_date)
);

-- RLS無効（service roleのみでアクセス）
alter table public.anonymous_trial_usage disable row level security;
