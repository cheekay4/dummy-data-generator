'use client'

import { useState } from 'react'

const FAQS = [
  {
    q: '本当に無料ですか？',
    a: 'はい。ログインすれば1日5回まで完全無料です。性格診断もプロファイル設定も無料。ログイン不要でも1回だけお試しいただけます。',
  },
  {
    q: '性格診断って何を聞かれるの？',
    a: '「友達に久しぶりに会ったら？」「旅行の話をどう伝える？」など日常のちょっとした場面を10問聞くだけ。接客やお店の質問は一切ありません。それなのに出てくる返信が「まるで自分が書いたみたい」と驚く方が多いです。※ 過去のメールや返信文をお持ちなら「テキスト学習」がおすすめ。2〜3件コピペするだけです。',
  },
  {
    q: '毎回同じ返信が出てきませんか？',
    a: 'いいえ。生成のたびに返信の構成パターン（文頭・構成・締め・焦点）をランダムに組み合わせるので、同じ口コミを入れても毎回違う返信になります。Proなら過去の返信履歴も参照して、さらに重複を防ぎます。',
  },
  {
    q: '返信プロファイルって何ですか？',
    a: 'あなたの文章分析や性格診断をもとに自動生成される「返信の人格」です。温かみ、社交性、丁寧さ、独自性の4つの軸であなたらしさを再現します。あとからスライダーで微調整もできます。1人分は無料。',
  },
  {
    q: '補助スタイルって何ですか？',
    a: 'クレーム対応、お祝い、常連さん向けなど、シーンに応じてあなたのプロファイルに上乗せする調整モードです（Pro限定）。あなたの性格はそのままに、状況に合わせた最適な返信になります。',
  },
  {
    q: '客層分析って何がわかりますか？',
    a: '口コミの文面から、推定年齢層・利用シーン・重視ポイント・リピート可能性などをAIが分析します。どんなお客様が多いかの傾向把握に役立ちます。',
  },
  {
    q: 'ネガティブな口コミにも対応できますか？',
    a: 'はい。星1の厳しい口コミにも、感情的にならない丁寧な返信を生成します。Proなら「クレーム対応モード」の補助スタイルでさらに安心です。',
  },
  {
    q: '英語・中国語の口コミにも対応？',
    a: '多言語口コミの読み取りは全プランで対応。多言語での返信生成はPro限定です（日本語/英語/中国語/韓国語）。',
  },
]

export default function FAQSection() {
  const [open, setOpen] = useState<number | null>(null)

  return (
    <section id="faq" className="py-16 px-4 bg-white">
      <div className="max-w-2xl mx-auto">
        <h2 className="text-2xl md:text-3xl font-bold text-stone-800 text-center mb-10">
          よくある質問
        </h2>
        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div
              key={i}
              className="border border-stone-200 rounded-2xl overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between px-5 py-4 text-left font-medium text-stone-800 hover:bg-stone-50 transition-colors"
              >
                <span className="text-sm">{faq.q}</span>
                <span className={`text-stone-400 text-lg flex-shrink-0 ml-3 transition-transform ${open === i ? 'rotate-45' : ''}`}>
                  +
                </span>
              </button>
              {open === i && (
                <div className="px-5 pb-4">
                  <p className="text-sm text-stone-600 leading-relaxed">{faq.a}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
