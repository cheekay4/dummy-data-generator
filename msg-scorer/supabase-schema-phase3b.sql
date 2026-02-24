-- ============================================================
-- MsgScore Phase 3-B Schema (FIXED)
-- Supabase SQL Editor で実行してください
-- ============================================================

-- ── 1. campaign_results（配信実績CSVインポート）────────────────

create table if not exists campaign_results (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams not null,
  date date,
  channel text,                     -- 'email' / 'line'
  subject text,
  body text,
  recipients int,
  open_rate decimal,
  ctr decimal,
  cv_count int,
  cv_type text,                     -- 'purchase' / 'click' / 'signup' / 'visit' / 'inquiry'
  imported_by uuid references auth.users,
  import_batch_id text,             -- 同一インポートのグルーピング用
  imported_at timestamp default now()
);

create index if not exists idx_campaign_results_team on campaign_results(team_id, date desc);
create index if not exists idx_campaign_results_batch on campaign_results(import_batch_id);

alter table campaign_results enable row level security;

drop policy if exists "Team members can view campaign results" on campaign_results;
create policy "Team members can view campaign results"
  on campaign_results for select
  using (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active'
  ));

drop policy if exists "Team owners can insert campaign results" on campaign_results;
create policy "Team owners can insert campaign results"
  on campaign_results for insert
  with check (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active' and role = 'owner'
  ));

drop policy if exists "Team owners can delete campaign results" on campaign_results;
create policy "Team owners can delete campaign results"
  on campaign_results for delete
  using (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active' and role = 'owner'
  ));

-- ── 2. organization_knowledge（組織ナレッジ）────────────────────

create table if not exists organization_knowledge (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams not null,
  content text not null,
  source text not null default 'csv_import', -- 'csv_import' / 'manual' / 'feedback'
  import_batch_id text,
  created_by uuid references auth.users,
  created_at timestamp default now()
);

create index if not exists idx_org_knowledge_team on organization_knowledge(team_id, created_at desc);

alter table organization_knowledge enable row level security;

drop policy if exists "Team members can view org knowledge" on organization_knowledge;
create policy "Team members can view org knowledge"
  on organization_knowledge for select
  using (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active'
  ));

drop policy if exists "Team owners can manage org knowledge" on organization_knowledge;
create policy "Team owners can manage org knowledge"
  on organization_knowledge for all
  using (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active' and role = 'owner'
  ));

-- ── 3. api_keys（外部APIキー）───────────────────────────────────

create table if not exists api_keys (
  id uuid primary key default gen_random_uuid(),
  team_id uuid references teams not null,
  key_hash text not null,           -- SHA-256ハッシュ（平文は表示時のみ）
  key_prefix text not null,         -- 先頭12文字（表示用）
  name text not null default 'Default',
  created_by uuid references auth.users not null,
  last_used_at timestamp,
  created_at timestamp default now(),
  revoked_at timestamp              -- NULLでない場合は無効化済み
);

create index if not exists idx_api_keys_team on api_keys(team_id);
create index if not exists idx_api_keys_hash on api_keys(key_hash);

alter table api_keys enable row level security;

drop policy if exists "Team owners can manage api keys" on api_keys;
create policy "Team owners can manage api keys"
  on api_keys for all
  using (team_id in (
    select team_id from team_members
    where user_id = auth.uid() and status = 'active' and role = 'owner'
  ));

-- ── 4. teamsテーブルへのSlack設定カラム追加 ──────────────────────

alter table teams add column if not exists slack_webhook_url text;
alter table teams add column if not exists slack_notifications jsonb
  default '{"min_score": true, "approval_request": true, "approval_complete": true, "all_scoring": false, "feedback": false}';
