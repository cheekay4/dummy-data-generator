-- ─────────────────────────────────────────────────────────────
-- MsgScore フィードバック機能 DBスキーマ
-- Phase 3-A: フィードバック収集UI + 傾向可視化
-- Supabase SQL Editor で実行してください
-- ─────────────────────────────────────────────────────────────

-- フィードバックテーブル
CREATE TABLE IF NOT EXISTS feedback (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  score_history_id  UUID REFERENCES score_history(id) ON DELETE CASCADE NOT NULL,
  user_id           UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  team_id           UUID REFERENCES teams(id) ON DELETE SET NULL,
  rating            SMALLINT NOT NULL CHECK (rating IN (1, -1)), -- 1=👍 役立った, -1=👎 改善が必要
  comment           TEXT CHECK (char_length(comment) <= 200),
  created_at        TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(score_history_id, user_id)         -- 1スコア履歴に1フィードバックのみ
);

-- RLS 有効化
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- ユーザーは自分のフィードバックを投稿できる
CREATE POLICY "Users can insert own feedback" ON feedback
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のフィードバックを閲覧できる
CREATE POLICY "Users can view own feedback" ON feedback
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

-- チームオーナーはチームのフィードバックを閲覧できる（Team Pro 向け）
CREATE POLICY "Team owners can view team feedback" ON feedback
  FOR SELECT TO authenticated
  USING (
    team_id IS NOT NULL AND
    EXISTS (
      SELECT 1 FROM team_members tm
      WHERE tm.team_id = feedback.team_id
        AND tm.user_id = auth.uid()
        AND tm.role = 'owner'
        AND tm.status = 'active'
    )
  );

-- インデックス
CREATE INDEX IF NOT EXISTS feedback_team_id_created_at_idx ON feedback (team_id, created_at DESC);
CREATE INDEX IF NOT EXISTS feedback_user_id_idx ON feedback (user_id);
