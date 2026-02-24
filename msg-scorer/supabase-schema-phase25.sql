-- ============================================================
-- MsgScore Phase 2.5 — Team 基盤スキーマ
-- Supabase SQL Editor で実行してください
-- ============================================================

-- score_history に team_id カラムを追加（存在しない場合）
alter table score_history add column if not exists team_id uuid;

-- ──────────────────────────────────────────
-- チーム
-- ──────────────────────────────────────────
create table if not exists teams (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  created_by uuid references auth.users not null,
  plan text not null,           -- 'team_s' / 'team_m' / 'team_l'
  max_seats int not null,       -- 5 / 10 / 30
  stripe_subscription_id text,
  created_at timestamp with time zone default now()
);

-- ──────────────────────────────────────────
-- チームメンバー
-- ──────────────────────────────────────────
create table if not exists team_members (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams not null,
  user_id uuid references auth.users,   -- 招待承諾後にセット
  role text not null default 'member',  -- 'owner' / 'member'
  invited_email text not null,
  invite_token uuid default gen_random_uuid() unique,
  status text not null default 'pending',  -- 'pending' / 'active' / 'removed'
  joined_at timestamp with time zone,
  created_at timestamp with time zone default now(),
  unique(team_id, user_id)
);

-- ──────────────────────────────────────────
-- 共有セグメントプリセット
-- ──────────────────────────────────────────
create table if not exists team_presets (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams not null,
  name text not null,
  segment jsonb not null,
  created_by uuid references auth.users not null,
  created_at timestamp with time zone default now()
);

-- ──────────────────────────────────────────
-- ブランドボイス設定
-- ──────────────────────────────────────────
create table if not exists brand_voice (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams not null unique,
  tone text,
  ng_words text[] default '{}',
  required_checks text[] default '{}',
  subject_rules text,
  min_score_threshold int,
  min_score_action text default 'warn',  -- 'warn' / 'badge'
  updated_by uuid references auth.users,
  updated_at timestamp with time zone default now()
);

-- ──────────────────────────────────────────
-- 修正依頼
-- ──────────────────────────────────────────
create table if not exists revision_requests (
  id uuid primary key default gen_random_uuid(),
  score_history_id uuid references score_history not null,
  team_id uuid references teams not null,
  requested_by uuid references auth.users not null,
  assigned_to uuid references auth.users not null,
  comment text not null,
  status text not null default 'open',   -- 'open' / 'resolved'
  resolved_at timestamp with time zone,
  created_at timestamp with time zone default now()
);

-- ──────────────────────────────────────────
-- インデックス
-- ──────────────────────────────────────────
create index if not exists idx_team_members_team   on team_members(team_id);
create index if not exists idx_team_members_user   on team_members(user_id);
create index if not exists idx_team_presets_team   on team_presets(team_id);
create index if not exists idx_brand_voice_team    on brand_voice(team_id);
create index if not exists idx_revision_req_team   on revision_requests(team_id);
create index if not exists idx_score_history_team  on score_history(team_id, created_at desc);

-- ──────────────────────────────────────────
-- RLS ポリシー
-- ──────────────────────────────────────────

-- teams
alter table teams enable row level security;
drop policy if exists "Team members can view team" on teams;
create policy "Team members can view team"
  on teams for select
  using (id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active'
  ));

-- team_members
alter table team_members enable row level security;
drop policy if exists "Team members can view members" on team_members;
create policy "Team members can view members"
  on team_members for select
  using (team_id in (
    select team_id from team_members tm2
    where tm2.user_id = auth.uid() and tm2.status = 'active'
  ));

-- 招待トークンで自分の招待レコードを閲覧可能
drop policy if exists "Allow invite token lookup" on team_members;
create policy "Allow invite token lookup"
  on team_members for select
  using (invite_token is not null);

-- team_presets
alter table team_presets enable row level security;
drop policy if exists "Team members can view presets" on team_presets;
create policy "Team members can view presets"
  on team_presets for select
  using (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active'
  ));
drop policy if exists "Team members can insert presets" on team_presets;
create policy "Team members can insert presets"
  on team_presets for insert
  with check (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active'
  ));

-- brand_voice
alter table brand_voice enable row level security;
drop policy if exists "Team members can view brand voice" on brand_voice;
create policy "Team members can view brand voice"
  on brand_voice for select
  using (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active'
  ));

-- revision_requests
alter table revision_requests enable row level security;
drop policy if exists "Team members can view revisions" on revision_requests;
create policy "Team members can view revisions"
  on revision_requests for select
  using (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active'
  ));

-- score_history: チームメンバーが同チームのスコアを閲覧可能
drop policy if exists "Team members can view team scores" on score_history;
create policy "Team members can view team scores"
  on score_history for select
  using (
    user_id = auth.uid()
    or team_id in (
      select team_id from team_members
      where user_id = auth.uid() and status = 'active'
    )
  );
