export const CHANNEL_LABELS = {
  'email-subject': { name: 'メール件名', icon: '📧' },
  'email-body':    { name: 'メール本文', icon: '📝' },
  'line':          { name: 'LINE配信',   icon: '💬' },
  'blog-sns':      { name: 'ブログ・SNS', icon: '✍️' },
} as const;

export const AGE_GROUP_LABELS = {
  under20:    '~19歳',
  twenties:   '20代',
  thirties:   '30代',
  forties:    '40代',
  fifties:    '50代',
  sixtiesPlus: '60歳以上',
} as const;

export const AGE_GROUP_COLORS = [
  '#818cf8', // indigo-400
  '#6366f1', // indigo-500
  '#4f46e5', // indigo-600
  '#4338ca', // indigo-700
  '#3730a3', // indigo-800
  '#312e81', // indigo-900
] as const;

export const FREE_DAILY_LIMIT = 5;

export const LOADING_TIPS = [
  'メール件名は15〜25文字が最も開封率が高い傾向があります',
  'LINE配信は火曜・木曜の12:00〜13:00が高反応の時間帯です',
  'CTAボタンの文言は動詞から始めると行動喚起に効果的です',
  '既存顧客への配信は新規の3倍のCTRが出る傾向があります',
  '絵文字を1つ使った件名は開封率が約5%向上することがあります',
  '配信目的を明確にするだけでCTA強度スコアが平均+12pt向上します',
] as const;
