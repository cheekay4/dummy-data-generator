-- review-reply-ai Supabase Schema
-- Phase 2: Auth + Stripe + Big Five 4軸プロファイル + 履歴

-- ─────────────────────────────────────────
-- 1. profiles テーブル（Supabase Auth と 1:1）
-- ─────────────────────────────────────────
create table if not exists public.profiles (
  id             uuid primary key references auth.users(id) on delete cascade,
  email          text,
  display_name   text,
  stripe_customer_id text unique,
  plan           text not null default 'free' check (plan in ('free', 'pro')),
  created_at     timestamptz not null default now()
);

-- Auth ユーザー登録時に自動で profiles レコードを作成
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ─────────────────────────────────────────
-- 2. reply_profiles テーブル（Big Five 4軸）
-- ─────────────────────────────────────────
create table if not exists public.reply_profiles (
  id                uuid primary key default gen_random_uuid(),
  user_id           uuid not null references public.profiles(id) on delete cascade,
  profile_name      text not null,
  agreeableness     numeric(2,1) not null default 2.5 check (agreeableness >= 0 and agreeableness <= 5),
  extraversion      numeric(2,1) not null default 2.5 check (extraversion >= 0 and extraversion <= 5),
  conscientiousness numeric(2,1) not null default 2.5 check (conscientiousness >= 0 and conscientiousness <= 5),
  openness          numeric(2,1) not null default 2.5 check (openness >= 0 and openness <= 5),
  disc_type         text check (disc_type in ('D', 'I', 'S', 'C')),
  analysis_text     text,
  speaking_style    text,
  creation_method   text not null default 'diagnosis' check (creation_method in ('text_learning', 'diagnosis')),
  shop_name         text,
  shop_description  text,
  business_type     text not null default '飲食店（カフェ・レストラン・居酒屋）',
  is_default        boolean not null default false,
  created_at        timestamptz not null default now(),
  updated_at        timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- 3. text_samples テーブル（テキスト学習サンプル）
-- ─────────────────────────────────────────
create table if not exists public.text_samples (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.reply_profiles(id) on delete cascade,
  sample_text text not null,
  sort_order  integer not null default 0,
  created_at  timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- 4. daily_usage テーブル（利用回数管理）
-- ─────────────────────────────────────────
create table if not exists public.daily_usage (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  usage_date  date not null,
  count       integer not null default 0,
  unique (user_id, usage_date)
);

-- ─────────────────────────────────────────
-- 5. reply_history テーブル（返信履歴 Pro限定）
-- ─────────────────────────────────────────
create table if not exists public.reply_history (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references public.profiles(id) on delete cascade,
  profile_id          uuid references public.reply_profiles(id) on delete set null,
  review_text         text not null,
  rating              integer not null check (rating between 1 and 5),
  platform            text,
  selected_reply      text,
  sentiment           text,
  customer_analysis   jsonb,
  created_at          timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- 6. subscriptions テーブル（Stripe サブスク管理）
-- ─────────────────────────────────────────
create table if not exists public.subscriptions (
  id                      uuid primary key default gen_random_uuid(),
  user_id                 uuid not null unique references public.profiles(id) on delete cascade,
  stripe_subscription_id  text unique,
  status                  text not null default 'active',
  created_at              timestamptz not null default now(),
  updated_at              timestamptz not null default now()
);

-- ─────────────────────────────────────────
-- 7. RLS（Row Level Security）
-- ─────────────────────────────────────────
alter table public.profiles       enable row level security;
alter table public.reply_profiles enable row level security;
alter table public.text_samples   enable row level security;
alter table public.daily_usage    enable row level security;
alter table public.reply_history  enable row level security;
alter table public.subscriptions  enable row level security;

create policy "profiles: self read"   on public.profiles for select using (auth.uid() = id);
create policy "profiles: self update" on public.profiles for update using (auth.uid() = id);

create policy "reply_profiles: self all" on public.reply_profiles for all using (auth.uid() = user_id);

create policy "text_samples: self all" on public.text_samples for all using (
  exists (select 1 from public.reply_profiles where reply_profiles.id = text_samples.profile_id and reply_profiles.user_id = auth.uid())
);

create policy "daily_usage: self read"   on public.daily_usage for select using (auth.uid() = user_id);
create policy "daily_usage: self insert" on public.daily_usage for insert with check (auth.uid() = user_id);
create policy "daily_usage: self update" on public.daily_usage for update using (auth.uid() = user_id);

create policy "reply_history: self all" on public.reply_history for all using (auth.uid() = user_id);

create policy "subscriptions: self read" on public.subscriptions for select using (auth.uid() = user_id);
