-- MsgScore Phase 2 — Supabase スキーマ
-- Supabase SQL Editor で実行してください

-- ========================================
-- 1. profiles テーブル
-- ========================================
create table if not exists public.profiles (
  id                     uuid references auth.users on delete cascade primary key,
  email                  text,
  plan                   text not null default 'free' check (plan in ('free', 'pro')),
  stripe_customer_id     text unique,
  stripe_subscription_id text,
  custom_ng_words        text[] default '{}',
  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now()
);

-- ========================================
-- 2. score_history テーブル
-- ========================================
create table if not exists public.score_history (
  id                       uuid primary key default gen_random_uuid(),
  user_id                  uuid references public.profiles(id) on delete cascade not null,
  channel                  text not null,
  input_text               text not null,
  subject                  text,
  audience                 jsonb not null,
  result                   jsonb not null,
  share_token              text unique default encode(gen_random_bytes(16), 'hex'),
  actual_open_rate         numeric,
  actual_ctr               numeric,
  actual_conversion_rate   numeric,
  actual_conversion_count  integer,
  actual_note              text,
  created_at               timestamptz not null default now()
);

-- ========================================
-- 3. custom_segments テーブル
-- ========================================
create table if not exists public.custom_segments (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid references public.profiles(id) on delete cascade not null,
  name       text not null,
  segment    jsonb not null,
  created_at timestamptz not null default now()
);

-- ========================================
-- 4. daily_usage テーブル（部分ユニークインデックス）
-- ========================================
create table if not exists public.daily_usage (
  id      uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  ip      text,
  date    date not null default current_date,
  count   integer not null default 0
);

-- ログイン済み: user_id + date でユニーク
create unique index if not exists daily_usage_user_date
  on public.daily_usage (user_id, date) where user_id is not null;

-- 未ログイン: ip + date でユニーク
create unique index if not exists daily_usage_ip_date
  on public.daily_usage (ip, date) where ip is not null and user_id is null;

-- ========================================
-- 5. RLS ポリシー
-- ========================================
alter table public.profiles        enable row level security;
alter table public.score_history   enable row level security;
alter table public.custom_segments enable row level security;
alter table public.daily_usage     enable row level security;

-- profiles
create policy "Users can view own profile"
  on public.profiles for select using (auth.uid() = id);
create policy "Users can update own profile"
  on public.profiles for update using (auth.uid() = id);

-- score_history: 自分の履歴 + share_token で公開読み取り
create policy "Users can view own history"
  on public.score_history for select using (auth.uid() = user_id);
create policy "Users can insert own history"
  on public.score_history for insert with check (auth.uid() = user_id);
create policy "Share token public read"
  on public.score_history for select using (share_token is not null);

-- custom_segments
create policy "Users can manage own segments"
  on public.custom_segments for all using (auth.uid() = user_id);

-- daily_usage: service_role のみ（APIルート経由）
create policy "Service role full access to daily_usage"
  on public.daily_usage for all to service_role using (true);

-- ========================================
-- 6. handle_new_user トリガー（Profile 自動作成）
-- ========================================
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ========================================
-- 7. updated_at 自動更新
-- ========================================
create or replace function public.update_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_updated_at on public.profiles;
create trigger profiles_updated_at
  before update on public.profiles
  for each row execute procedure public.update_updated_at();
