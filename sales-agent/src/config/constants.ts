export const SAFETY = {
  DAILY_SEND_LIMIT: 20,
  MIN_SEND_INTERVAL_SEC: 60,
  MAX_BATCH_SIZE: 5,
  ICP_SCORE_THRESHOLD: 40,
  PERSONALIZATION_SCORE_MIN: 5,
  BOUNCE_RATE_ALERT: 0.02,
  SPAM_COMPLAINT_ALERT: 0.001,
  REQUIRE_HUMAN_APPROVAL: true,
  COOLDOWN_AFTER_BOUNCE: 24 * 60 * 60,
} as const;

export const CLAUDE_MODEL = 'claude-sonnet-4-6';

export const SCRAPER = {
  TIMEOUT_MS: 30_000,
  WAIT_AFTER_LOAD_MS: 3_000,
  RETRY_COUNT: 2,
  USER_AGENT:
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36',
} as const;

// フィルタリング対象の汎用メールアドレスプレフィックス
export const GENERIC_EMAIL_PREFIXES = [
  'noreply',
  'no-reply',
  'donotreply',
  'do-not-reply',
  'bounce',
  'mailer-daemon',
  'postmaster',
  'webmaster',
  'abuse',
  'spam',
  'newsletter',
];
