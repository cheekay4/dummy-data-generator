'use client'

import PersonalityRadar from './PersonalityRadar'

interface PersonaTemplate {
  name: string
  description: string
  icon: string
  agreeableness: number
  extraversion: number
  conscientiousness: number
  openness: number
  speaking_style: string
}

const PERSONA_TEMPLATES: PersonaTemplate[] = [
  {
    name: 'おもてなし店長',
    description: '丁寧で温かく、お客様一人ひとりに心を込めて返信',
    icon: '🏪',
    agreeableness: 5,
    extraversion: 3,
    conscientiousness: 5,
    openness: 2,
    speaking_style: '感謝の気持ちを丁寧に伝える。具体的なエピソードに触れる。',
  },
  {
    name: '人情派オーナー',
    description: '親しみやすく人懐っこい。お客様との距離が近い',
    icon: '😊',
    agreeableness: 5,
    extraversion: 4.5,
    conscientiousness: 3,
    openness: 3,
    speaking_style: '「〜ですよね！」「嬉しいです！」など感情を素直に表現',
  },
  {
    name: 'キッチリ店長',
    description: 'プロフェッショナルで信頼感のある対応',
    icon: '👔',
    agreeableness: 2.5,
    extraversion: 2,
    conscientiousness: 5,
    openness: 1.5,
    speaking_style: '事実に基づく簡潔な対応。改善点は具体的に言及。',
  },
  {
    name: 'フレンドリーなスタッフ',
    description: '距離が近くてカジュアル。常連さんとの会話のような返信',
    icon: '🙋',
    agreeableness: 4,
    extraversion: 5,
    conscientiousness: 1.5,
    openness: 3.5,
    speaking_style: 'カジュアルな口調。「また来てくださいね〜！」的な親しみ',
  },
  {
    name: '職人気質',
    description: 'こだわりを持った真面目な返信。技術やサービスへの誇り',
    icon: '🔨',
    agreeableness: 2.5,
    extraversion: 1.5,
    conscientiousness: 4.5,
    openness: 4,
    speaking_style: '自店の技術やこだわりに触れる。謙虚だが自信がある。',
  },
  {
    name: 'ムードメーカー',
    description: '明るくユーモアたっぷり。読んで楽しい返信',
    icon: '🎉',
    agreeableness: 4,
    extraversion: 5,
    conscientiousness: 2,
    openness: 5,
    speaking_style: '軽い冗談、比喩表現、「！」多め。楽しい雰囲気。',
  },
]

interface TemplateSelection {
  profile_name: string
  agreeableness: number
  extraversion: number
  conscientiousness: number
  openness: number
  speaking_style: string
}

interface Props {
  isPro: boolean
  onSelect: (template: TemplateSelection) => void
}

export default function PersonaTemplates({ isPro, onSelect }: Props) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <h3 className="font-bold text-stone-800">ペルソナテンプレート</h3>
        {!isPro && (
          <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full">🔒 Pro限定</span>
        )}
      </div>
      <p className="text-sm text-stone-500 mb-5">
        {isPro
          ? 'テンプレートを選ぶとスライダーが自動で設定されます。その後、微調整できます。'
          : 'Proプランにアップグレードすると、プロが作ったペルソナテンプレートを使えます。'}
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {PERSONA_TEMPLATES.map((t) => (
          <div
            key={t.name}
            className={`border rounded-2xl p-4 transition-all ${isPro ? 'border-stone-200 hover:border-amber-300 cursor-pointer' : 'border-stone-100 opacity-60'}`}
            onClick={() =>
              isPro &&
              onSelect({
                profile_name: t.name,
                agreeableness: t.agreeableness,
                extraversion: t.extraversion,
                conscientiousness: t.conscientiousness,
                openness: t.openness,
                speaking_style: t.speaking_style,
              })
            }
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-2xl">{t.icon}</span>
              <div>
                <p className="font-medium text-stone-800 text-sm">{t.name}</p>
              </div>
            </div>
            <p className="text-xs text-stone-500 mb-3">{t.description}</p>
            <div className="flex justify-center">
              <PersonalityRadar
                agreeableness={t.agreeableness}
                extraversion={t.extraversion}
                conscientiousness={t.conscientiousness}
                openness={t.openness}
                size={120}
              />
            </div>
            {isPro && (
              <button className="w-full mt-3 border border-amber-300 hover:bg-amber-50 text-amber-600 py-1.5 rounded-lg text-xs font-medium transition-colors">
                このテンプレで作成
              </button>
            )}
          </div>
        ))}
      </div>

      {!isPro && (
        <div className="mt-5 text-center">
          <a
            href="/pricing"
            className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white text-sm font-medium px-5 py-2.5 rounded-lg transition-colors"
          >
            ✨ Proにアップグレード →
          </a>
        </div>
      )}
    </div>
  )
}
