'use client'

import { useState } from 'react'
import { mapToDISC, DISC_LABELS } from '@/lib/constants'
import type { AxisKey } from '@/lib/types'

const SAMPLE_REVIEWS = [
  { rating: 5, text: 'パスタが絶品でした！スタッフの方もとても親切で、また来たいと思います。' },
  { rating: 2, text: '料理の提供が遅く、30分以上待ちました。もう少し改善してほしいです。' },
  { rating: 4, text: '雰囲気はとても良かったです。値段も手頃でコスパ抜群でした。' },
]

const SAMPLE_REPLIES: Record<string, Record<number, string>> = {
  安定型: {
    5: 'この度は素晴らしいお言葉をいただき、誠にありがとうございます。パスタをお楽しみいただけたこと、またスタッフの対応もご評価いただけたこと、大変光栄に存じます。またのご来店を心よりお待ち申し上げております。',
    2: 'この度はご不便をおかけし、誠に申し訳ございませんでした。お料理の提供にお時間をいただいてしまいましたこと、深くお詫び申し上げます。改善に取り組んでまいりますので、またの機会にぜひお越しいただけますと幸いです。',
    4: 'ありがとうございます！雰囲気やコスパをお褒めいただき、嬉しく思います。また季節のメニューも楽しんでいただけるよう、スタッフ一同努めてまいります。またのご来店をお待ちしております。',
  },
  影響型: {
    5: 'わああ、ありがとうございます！パスタ、気に入っていただけてめちゃくちゃ嬉しいです！スタッフも喜んでいます。ぜひまた来てくださいね！新メニューも準備中ですよ〜🎉',
    2: 'ご指摘ありがとうございます！30分待ちは本当に申し訳なかったです💦オペレーション改善中ですので、次回はきっとスムーズにご案内できるはず！ぜひまたチャンスをいただけると嬉しいです！',
    4: 'ありがとうございます！コスパ抜群ってめちゃくちゃ嬉しいです！雰囲気も気に入っていただけてよかった😊またぜひ来てくださいね！',
  },
  分析型: {
    5: 'ご来店いただきありがとうございます。パスタ及びサービスを高くご評価いただき、光栄に思います。引き続き品質維持に努めてまいります。またのご来店をお待ちしております。',
    2: 'ご指摘をいただきありがとうございます。30分の待ち時間は許容範囲を超えており、改善が必要と認識しております。提供時間の短縮に向けて具体的な施策を講じてまいります。',
    4: 'ご利用いただきありがとうございます。雰囲気とコストパフォーマンスをご評価いただき、ありがとうございます。引き続き高品質なサービスを提供してまいります。',
  },
  主導型: {
    5: 'ご来店ありがとうございます。お喜びいただけて何よりです。引き続きご期待に応えます。またどうぞ。',
    2: 'ご意見ありがとうございます。提供時間を改善します。次回はより良い体験をご提供します。',
    4: 'ありがとうございます。ご評価いただけて嬉しいです。引き続き努力してまいります。',
  },
}

export default function ProfileDemo() {
  const [agreeableness, setAgreeableness] = useState(4)
  const [extraversion, setExtraversion] = useState(3)
  const [conscientiousness, setConscientiousness] = useState(4)
  const [openness, setOpenness] = useState(2.5)
  const [reviewIdx, setReviewIdx] = useState(0)

  const axes: Record<AxisKey, number> = { agreeableness, extraversion, conscientiousness, openness }
  const disc = mapToDISC(axes)
  const discLabel = DISC_LABELS[disc]
  const shortName = discLabel.name.split('（')[0]

  const review = SAMPLE_REVIEWS[reviewIdx]
  const replySet = SAMPLE_REPLIES[shortName] ?? SAMPLE_REPLIES['安定型']
  const reply = replySet[review.rating] ?? ''

  const sliders = [
    { label: '温かみ', left: '淡々', right: 'ぬくもり', value: agreeableness, onChange: setAgreeableness },
    { label: '社交性', left: '控えめ', right: 'にぎやか', value: extraversion, onChange: setExtraversion },
    { label: '丁寧さ', left: 'カジュアル', right: 'きっちり', value: conscientiousness, onChange: setConscientiousness },
    { label: '独自性', left: '王道', right: '個性的', value: openness, onChange: setOpenness },
  ]

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-10">
          <h2 className="text-2xl md:text-3xl font-bold text-stone-800 mb-3">
            プロファイルで返信がこんなに変わる
          </h2>
          <p className="text-stone-500 text-sm">スライダーを動かすと返信が変わります（デモ）</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* スライダー */}
          <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5 space-y-5">
            <p className="text-sm font-medium text-stone-700">返信スタイルを設定</p>

            {sliders.map((ax) => (
              <div key={ax.label}>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs text-stone-400">{ax.left}</span>
                  <span className="text-sm font-medium text-stone-700">{ax.label}</span>
                  <span className="text-xs text-stone-400">{ax.right}</span>
                </div>
                <input
                  type="range"
                  min={0}
                  max={5}
                  step={0.5}
                  value={ax.value}
                  onChange={(e) => ax.onChange(Number(e.target.value))}
                  className="w-full accent-amber-500"
                />
              </div>
            ))}

            <div className="bg-amber-50 rounded-xl px-3 py-2 text-center">
              <p className="text-xs text-stone-500">あなたのタイプ</p>
              <p className="text-sm font-bold text-amber-700">{shortName}</p>
              <p className="text-xs text-stone-400 mt-0.5">{discLabel.description}</p>
            </div>

            {/* 口コミ選択 */}
            <div>
              <p className="text-xs text-stone-500 mb-2">サンプル口コミを選択:</p>
              <div className="space-y-1">
                {SAMPLE_REVIEWS.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => setReviewIdx(i)}
                    className={`w-full text-left text-xs px-3 py-2 rounded-lg border transition-colors ${
                      reviewIdx === i ? 'border-amber-400 bg-amber-50 text-amber-700' : 'border-stone-200 text-stone-500 hover:border-stone-300'
                    }`}
                  >
                    {'★'.repeat(r.rating)} {r.text.slice(0, 30)}...
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* 返信プレビュー */}
          <div className="bg-white border-2 border-amber-200 rounded-2xl p-5">
            <p className="text-xs text-stone-400 mb-2">生成される返信（イメージ）</p>
            <div className="text-amber-400 text-sm mb-3">
              {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
            </div>
            <div className="bg-stone-50 rounded-xl p-4 mb-4">
              <p className="text-xs text-stone-400 mb-1">口コミ</p>
              <p className="text-sm text-stone-600">{review.text}</p>
            </div>
            <div className="bg-amber-50 rounded-xl p-4">
              <p className="text-xs text-amber-600 font-medium mb-2">✨ AI返信（{shortName}スタイル）</p>
              <p className="text-sm text-stone-700 leading-relaxed">{reply}</p>
            </div>
          </div>
        </div>

        <div className="text-center mt-8">
          <a
            href="/generator"
            className="inline-flex items-center gap-2 bg-amber-500 hover:bg-amber-600 text-white font-bold px-7 py-3.5 rounded-xl transition-colors shadow-sm"
          >
            自分のプロファイルで試してみる →
          </a>
          <p className="text-xs text-stone-400 mt-2">無料 · ログイン後にプロファイル設定できます</p>
        </div>
      </div>
    </section>
  )
}
