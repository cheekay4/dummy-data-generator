-- 管理者操作ログ
CREATE TABLE IF NOT EXISTS public.admin_audit_log (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id    uuid NOT NULL REFERENCES auth.users(id),
  action      text NOT NULL,
  target_id   uuid,
  details     jsonb,
  ip_address  text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_audit_log DISABLE ROW LEVEL SECURITY;

-- パフォーマンス用インデックス（存在しなければ作成）
CREATE INDEX IF NOT EXISTS idx_profiles_plan ON public.profiles(plan);
CREATE INDEX IF NOT EXISTS idx_profiles_created ON public.profiles(created_at);
CREATE INDEX IF NOT EXISTS idx_daily_usage_date ON public.daily_usage(usage_date);
CREATE INDEX IF NOT EXISTS idx_anonymous_trial_date ON public.anonymous_trial_usage(usage_date);
CREATE INDEX IF NOT EXISTS idx_reply_history_created ON public.reply_history(created_at);
CREATE INDEX IF NOT EXISTS idx_admin_audit_log_created ON public.admin_audit_log(created_at);
