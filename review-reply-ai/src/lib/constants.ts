import type { AxisKey, DISCType } from './types'

export const PLANS = {
  free: {
    name: 'Free',
    dailyLimit: 5,
    maxProfiles: 1,
    historyDays: 0,
    multilingual: false,
    modifiers: false,
    adsHidden: false,
  },
  pro: {
    name: 'Pro',
    dailyLimit: Infinity,
    maxProfiles: 5,
    historyDays: 90,
    multilingual: true,
    modifiers: true,
    adsHidden: true,
  },
} as const

export const TRIAL_DAILY_LIMIT = 1 // ログインなし

export const AXIS_CONFIG: Array<{
  key: AxisKey
  label: string
  left: string
  right: string
  color: string
}> = [
  { key: 'agreeableness', label: '温かみ', left: '淡々・結果重視', right: 'ぬくもり・寄り添い', color: '#f59e0b' },
  { key: 'extraversion', label: '社交性', left: '控えめ・落ち着き', right: 'フレンドリー・距離近い', color: '#8b5cf6' },
  { key: 'conscientiousness', label: '丁寧さ', left: 'ラフ・即興', right: 'きっちり・計画的', color: '#3b82f6' },
  { key: 'openness', label: '独自性', left: '定型・安定', right: '個性的・意外性', color: '#10b981' },
]

export interface PersonaModifier {
  id: string
  name: string
  icon: string
  description: string
  when: string
  modifiers: Partial<Record<AxisKey, number>>
}

export const PERSONA_MODIFIERS: PersonaModifier[] = [
  {
    id: 'crisis',
    name: 'クレーム対応モード',
    icon: '🛡️',
    description: '冷静かつ誠実に。感情的にならず、プロとして対応',
    when: '星1-2の厳しい口コミに',
    modifiers: { conscientiousness: +1.0, agreeableness: +0.5, extraversion: -1.5 },
  },
  {
    id: 'celebration',
    name: 'お祝いモード',
    icon: '🎉',
    description: '特別な日に来てくれた感謝を、いつも以上に',
    when: '「記念日に利用しました」系の口コミに',
    modifiers: { agreeableness: +1.0, extraversion: +0.5, conscientiousness: +0.5 },
  },
  {
    id: 'business',
    name: 'ビジネスモード',
    icon: '📋',
    description: 'フォーマルで信頼感のある対応',
    when: '企業・法人の口コミ対応に',
    modifiers: { conscientiousness: +1.5, agreeableness: -0.5, extraversion: -1.5 },
  },
  {
    id: 'regular',
    name: '常連モード',
    icon: '💬',
    description: 'いつも来てくれる人への親しみを込めて',
    when: 'リピーター感がある口コミに',
    modifiers: { extraversion: +1.5, agreeableness: +0.5, conscientiousness: -1.0 },
  },
  {
    id: 'inbound',
    name: 'インバウンドモード',
    icon: '🌏',
    description: '外国からのお客様への丁寧な対応',
    when: '外国語口コミへの返信に',
    modifiers: { conscientiousness: +1.0, openness: +0.5 },
  },
]

export const DISC_LABELS: Record<DISCType, { name: string; description: string }> = {
  D: { name: '主導型（ドライバー）', description: '結論ファーストで簡潔。信頼感のある返信。' },
  I: { name: '感化型（インフルエンサー）', description: '熱量高めでフレンドリー。読んで楽しい返信。' },
  S: { name: '安定型（サポーター）', description: '穏やかで温かい。寄り添う丁寧な返信。' },
  C: { name: '慎重型（アナリスト）', description: '正確で論理的。具体的な事実に基づく返信。' },
}

export function mapToDISC(scores: Record<AxisKey, number>): DISCType {
  const assertive = scores.extraversion >= 2.5
  const people = scores.agreeableness >= 2.5
  if (assertive && !people) return 'D'
  if (assertive && people) return 'I'
  if (!assertive && people) return 'S'
  return 'C'
}

export function clampAxis(v: number): number {
  return Math.min(5, Math.max(0, Math.round(v * 2) / 2))
}

export function applyModifier(
  profile: Record<AxisKey, number>,
  modifier?: PersonaModifier['modifiers']
): Record<AxisKey, number> {
  if (!modifier) return profile
  return {
    agreeableness: clampAxis(profile.agreeableness + (modifier.agreeableness ?? 0)),
    extraversion: clampAxis(profile.extraversion + (modifier.extraversion ?? 0)),
    conscientiousness: clampAxis(profile.conscientiousness + (modifier.conscientiousness ?? 0)),
    openness: clampAxis(profile.openness + (modifier.openness ?? 0)),
  }
}

export const MAX_DIAGNOSIS_SCORES: Record<AxisKey, number> = {
  agreeableness: 24,
  extraversion: 19,
  conscientiousness: 22,
  openness: 9,
}
