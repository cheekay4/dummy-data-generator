// チャネル
export type Channel = 'email-subject' | 'email-body' | 'line' | 'blog-sns';

// コンバージョン目的
export type ConversionGoal = 'purchase' | 'click' | 'signup' | 'visit' | 'inquiry';

// 目的ごとの表示ラベル定義
export const CONVERSION_LABELS: Record<ConversionGoal, {
  name: string;
  icon: string;
  finalMetricLabel: string;
  finalMetricUnit: string;
}> = {
  purchase: { name: '購入・注文', icon: '🛒', finalMetricLabel: '推定購入数', finalMetricUnit: '件' },
  click:    { name: '記事クリック', icon: '📰', finalMetricLabel: '推定クリック数', finalMetricUnit: '件' },
  signup:   { name: '申込・登録', icon: '📝', finalMetricLabel: '推定申込数', finalMetricUnit: '件' },
  visit:    { name: '来店・予約', icon: '🏪', finalMetricLabel: '推定予約数', finalMetricUnit: '件' },
  inquiry:  { name: '問い合わせ', icon: '💬', finalMetricLabel: '推定問い合わせ数', finalMetricUnit: '件' },
};

// セグメント設定
export interface AudienceSegment {
  totalRecipients: number;
  conversionGoal: ConversionGoal;
  gender: { female: number; male: number; other: number };
  ageDistribution: {
    under20: number;
    twenties: number;
    thirties: number;
    forties: number;
    fifties: number;
    sixtiesPlus: number;
  };
  attributes: {
    deviceMobile: number;
    existingCustomer: number;
    avgOpenRate?: number;
    avgCtr?: number;
  };
  presetName?: string;
}

// スコアリングリクエスト
export interface ScoreRequest {
  channel: Channel;
  text: string;
  subject?: string;
  audience: AudienceSegment;
  source?: 'web' | 'chrome-extension' | 'api';
}

// API Route用のバリデーション
export interface ScoreRequestBody {
  channel: Channel;
  text: string;
  subject?: string;
  audience: AudienceSegment;
  source?: 'web' | 'chrome-extension' | 'api';
}

// エラーレスポンス
export interface ErrorResponse {
  error: string;
  code: 'VALIDATION_ERROR' | 'RATE_LIMIT' | 'API_ERROR' | 'PARSE_ERROR';
  remainingToday?: number;
}

// スコア軸
export interface ScoreAxis {
  name: string;
  score: number;
  feedback: string;
}

// A/Bバリアント
export interface ABVariant {
  label: string;
  text: string;
  predictedOpenRate: number;
  predictedCtr: number;
  predictedConversionRate: number;
  predictedConversionCount: number;
}

// 予測インパクト
export interface PredictedImpact {
  openRate: number;
  openCount: number;
  ctr: number;
  clickCount: number;
  conversionRate: number;
  conversionCount: number;
  conversionLabel: string;
}

// スコアリングレスポンス
export interface ScoreResponse {
  totalScore: number;
  axes: ScoreAxis[];
  improvements: string[];
  abVariants: ABVariant[];
  currentImpact: PredictedImpact;
  improvedImpact: PredictedImpact;
  ngWordsFound?: string[];
  // Team scoring additions
  minScoreThreshold?: number;
  minScoreAction?: 'warn' | 'badge';
}

// ──────────────────────────────────────
// Team 関連型
// ──────────────────────────────────────

export type TeamPlan = 'team_s' | 'team_m' | 'team_l' | 'team_pro';

export interface Team {
  id: string;
  name: string;
  created_by: string;
  plan: TeamPlan;
  max_seats: number;
  stripe_subscription_id?: string;
  created_at: string;
}

export interface TeamMember {
  id: string;
  team_id: string;
  user_id?: string;
  role: 'owner' | 'member';
  invited_email: string;
  invite_token?: string;
  status: 'pending' | 'active' | 'removed';
  joined_at?: string;
  created_at: string;
}

export interface TeamPreset {
  id: string;
  team_id: string;
  name: string;
  segment: AudienceSegment;
  created_by: string;
  created_at: string;
}

export interface BrandVoice {
  id?: string;
  team_id: string;
  tone?: string;
  ng_words: string[];
  required_checks: string[];
  subject_rules?: string;
  min_score_threshold?: number;
  min_score_action: 'warn' | 'badge';
  updated_by?: string;
  updated_at?: string;
}

export interface RevisionRequest {
  id: string;
  score_history_id: string;
  team_id: string;
  requested_by: string;
  assigned_to: string;
  comment: string;
  status: 'open' | 'resolved';
  resolved_at?: string;
  created_at: string;
  // joined fields
  requester_email?: string;
  assignee_email?: string;
  score_history?: {
    channel: Channel;
    input_text: string;
    result: { totalScore: number };
    created_at: string;
  };
}

export interface TeamStats {
  totalScores: number;
  avgScore: number;
  avgScorePrevMonth: number;
  belowThresholdRate: number;
  memberStats: MemberStat[];
}

export interface MemberStat {
  userId: string;
  email: string;
  displayName?: string;
  scoreCount: number;
  avgScore: number;
  avgScorePrevMonth: number;
  topChannel?: Channel;
  belowThresholdRate: number;
  axisAverages: { name: string; avg: number }[];
}

// ──────────────────────────────────────
// Phase 3-B: CSVインポート・API・Slack
// ──────────────────────────────────────

export interface CampaignRecord {
  date?: string;
  channel: 'email' | 'line';
  subject?: string;
  body?: string;
  recipients?: number;
  open_rate?: number;
  ctr?: number;
  cv_count?: number;
  cv_type?: string;
}

export interface CampaignResult extends CampaignRecord {
  id: string;
  team_id: string;
  imported_by?: string;
  import_batch_id: string;
  imported_at: string;
}

export interface CsvError {
  row: number;
  field?: string;
  message: string;
}

export interface CsvParseResult {
  records: CampaignRecord[];
  errors: CsvError[];
  summary: {
    totalRows: number;
    validRows: number;
    invalidRows: number;
    channels: { email: number; line: number };
    dateRange: { from: string; to: string } | null;
    avgOpenRate: { email: number | null; line: number | null };
    avgCtr: { email: number | null; line: number | null };
  };
}

export interface ImportBatch {
  import_batch_id: string;
  count: number;
  imported_at: string;
  filename?: string;
  has_analysis: boolean;
}

export interface OrganizationKnowledge {
  id: string;
  team_id: string;
  content: string;
  source: string;
  import_batch_id?: string;
  created_at: string;
}

export interface ApiKey {
  id: string;
  team_id: string;
  key_prefix: string;
  name: string;
  created_by: string;
  last_used_at?: string;
  created_at: string;
  revoked_at?: string;
}

export type SlackNotificationType =
  | 'min_score'
  | 'approval_request'
  | 'approval_complete'
  | 'approval_revision'
  | 'all_scoring'
  | 'feedback';

export interface SlackNotifications {
  min_score: boolean;
  approval_request: boolean;
  approval_complete: boolean;
  all_scoring: boolean;
  feedback: boolean;
}

// ──────────────────────────────────────
// Phase 3-A: フィードバック
// ──────────────────────────────────────

export interface Feedback {
  id: string;
  score_history_id: string;
  user_id: string;
  team_id?: string;
  rating: 1 | -1;  // 1=👍 役立った, -1=👎 改善が必要
  comment?: string;
  created_at: string;
}

export interface FeedbackWithContext extends Feedback {
  member_email?: string;
  total_score?: number;
  channel?: Channel;
}

export interface TeamFeedbackStats {
  total: number;
  positive: number;
  positiveRate: number;                                         // 0-100
  recent: FeedbackWithContext[];                                // 直近20件
  weeklyTrend: { week: string; positiveRate: number; count: number }[];
}
