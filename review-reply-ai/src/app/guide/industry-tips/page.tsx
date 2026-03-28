import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '業種別・口コミ返信のコツ（飲食・美容・クリニック・ホテル） | MyReplyTone',
  description: '飲食店・美容院・クリニック・ホテル・整体サロン・不動産など業種ごとの口コミ特徴と、読まれる返信文を書くための具体的なテクニックを解説。',
  keywords: '口コミ返信 業種別, 飲食店 口コミ 返信, 美容院 口コミ 返信, クリニック 口コミ 対応, ホテル 口コミ 返信',
  alternates: {
    canonical: 'https://myreplytone.com/guide/industry-tips',
  },
}

const industries = [
  {
    icon: '🍽️',
    name: '飲食店・カフェ',
    positive: {
      title: 'ポジティブ口コミの返信ポイント',
      points: [
        '口コミで言及されたメニュー名を必ず返信に入れる（「パスタをお楽しみいただけたようで」）',
        '季節メニューや新メニューの予告を自然に添える（再来店を促す）',
        'スタッフの名前は必須ではないが、厨房やホールへの言及があると温かみが出る',
      ],
    },
    negative: {
      title: 'ネガティブ口コミの注意点',
      points: [
        '料理の提供時間・量・味への批判は、事実確認後に改善策を具体的に示す',
        '「その日は混雑していた」などの言い訳は逆効果。改善姿勢のみを伝える',
        '食中毒・異物混入の示唆がある場合は、公式対応として個別連絡を促す（「お手数ですが直接ご連絡ください」）',
      ],
    },
  },
  {
    icon: '✂️',
    name: '美容院・ネイルサロン',
    positive: {
      title: 'ポジティブ口コミの返信ポイント',
      points: [
        '担当スタイリスト名を入れると親近感が増す（「担当させていただいた〇〇より」）',
        '施術内容（カラー・パーマ・カットなど）を引用するとオリジナル感が出る',
        '「また△△の季節に」など次来店のイメージを植え付けるフレーズが効果的',
      ],
    },
    negative: {
      title: 'ネガティブ口コミの注意点',
      points: [
        'イメージと違った・仕上がりへの不満は、確認不足を認めつつ「次回ご来店時に必ず確認いたします」と改善を約束する',
        '価格への不満は値段の正当性を説明するより、価値を伝える表現で対応する',
        '予約・待ち時間の問題は具体的な改善策（予約システム導入・人員増強）を示す',
      ],
    },
  },
  {
    icon: '🏥',
    name: 'クリニック・歯科・整形外科',
    positive: {
      title: 'ポジティブ口コミの返信ポイント',
      points: [
        '医療広告ガイドラインに厳しく従う。「治った」「効果がある」などの表現はNG',
        '「丁寧な対応を心がけております」「説明を大切にしています」など姿勢を伝える表現にとどめる',
        'スタッフや院長の名前は個人情報保護の観点から慎重に扱う',
      ],
    },
    negative: {
      title: 'ネガティブ口コミの注意点',
      points: [
        '待ち時間への不満は特に多い。「予約システムの改善」「受付オペレーションの見直し」など具体策を示す',
        '診療内容や診断への不満は医師法・医療広告ガイドラインに従い慎重に対応。個別連絡を促す',
        '「診断が間違っている」などの内容は、返信での医療的説明は避け、再診のご案内にとどめる',
      ],
    },
  },
  {
    icon: '🏨',
    name: 'ホテル・旅館・民泊',
    positive: {
      title: 'ポジティブ口コミの返信ポイント',
      points: [
        '宿泊した時期・季節に言及すると「その時期に来た人への返信」感が出る（「桜の季節にご利用いただき〜」）',
        '口コミで触れられた部屋・施設・料理を具体的に引用する',
        '季節ごとの特別企画や次回来訪のシーズンを自然に促す',
      ],
    },
    negative: {
      title: 'ネガティブ口コミの注意点',
      points: [
        '設備の古さ・清潔感への不満は改修計画や清掃強化を具体的に示す',
        'スタッフ対応への批判は内部で確認の上、再発防止を約束する',
        '騒音・近隣客への不満はコントロール困難だが、今後の部屋割りや防音対策への言及で対応する',
      ],
    },
  },
  {
    icon: '💆',
    name: '整体・マッサージ・エステ',
    positive: {
      title: 'ポジティブ口コミの返信ポイント',
      points: [
        '身体の悩みに寄り添う表現が刺さる（「〇〇のお悩みが少し和らいでいれば嬉しいです」）',
        '施術名や担当スタッフへの言及があればそれを引用する',
        '定期的なケアの重要性に触れると次回来店を自然に促せる',
      ],
    },
    negative: {
      title: 'ネガティブ口コミの注意点',
      points: [
        '施術後の痛み・不快感への訴えは深刻に受け止め、直接連絡を促す',
        '効果がなかったという口コミは効果を保証する返信はNGで、「個人差がある」旨を穏やかに伝える',
        '価格・回数券のトラブルは個別対応が必要な場合が多い',
      ],
    },
  },
  {
    icon: '🏠',
    name: '不動産・リフォーム',
    positive: {
      title: 'ポジティブ口コミの返信ポイント',
      points: [
        '長期関係性を重視した表現が効果的（「今後もお気軽にご相談ください」）',
        '購入・売却・賃貸など取引の種類に応じた具体的な言及をする',
        '担当スタッフへの信頼に言及があればそれを引用して温かみを出す',
      ],
    },
    negative: {
      title: 'ネガティブ口コミの注意点',
      points: [
        '対応の遅さ・情報提供不足への批判は改善策とともに謝罪する',
        '契約内容・費用への不満はデリケートなため、必ず個別連絡を促す',
        '法的トラブルに発展しそうな内容は返信では対応せず、責任者からの連絡を約束する',
      ],
    },
  },
]

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '業種別・口コミ返信のコツ（飲食・美容・クリニック・ホテル）',
  description: '飲食店・美容院・クリニック・ホテル・整体サロン・不動産など業種ごとの口コミ特徴と、読まれる返信文を書くための具体的なテクニックを解説。',
  author: { '@type': 'Organization', name: 'tools24.jp', url: 'https://tools24.jp' },
  publisher: { '@type': 'Organization', name: 'MyReplyTone', url: 'https://myreplytone.com' },
  datePublished: '2025-06-01',
  dateModified: '2026-03-29',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://myreplytone.com/guide/industry-tips' },
}

export default function IndustryTipsPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/guide" className="text-sm text-stone-400 hover:text-stone-600">
            ← ガイド一覧に戻る
          </Link>
        </div>

        <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">業種別</span>
        <h1 className="text-3xl font-bold text-stone-800 mt-3 mb-2">業種別・口コミ返信のコツ</h1>
        <p className="text-stone-500 mb-10">飲食・美容・クリニック・ホテル・整体・不動産の6業種を徹底解説</p>

        <div className="space-y-10 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              業種で口コミの特徴が大きく変わる理由
            </h2>
            <p>
              同じ「口コミ返信」でも、飲食店に最適な表現がクリニックでは規制違反になることがあります。また、ホテルと整体では来店動機が異なり、返信で触れるべきポイントも変わります。
            </p>
            <p className="mt-3">
              業種の特性を理解した返信は、見ている見込み客に「このお店はわかっている」という信頼感を与えます。以下、業種別のポイントをまとめました。
            </p>
          </section>

          {industries.map((industry) => (
            <section key={industry.name}>
              <h2 className="text-xl font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">
                {industry.icon} {industry.name}
              </h2>
              <div className="space-y-4">
                <div className="border border-emerald-100 rounded-xl p-4">
                  <p className="font-medium text-emerald-700 mb-3">✅ {industry.positive.title}</p>
                  <ul className="space-y-2">
                    {industry.positive.points.map((p, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-emerald-400 flex-shrink-0">•</span>
                        <span className="text-stone-600">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="border border-red-100 rounded-xl p-4">
                  <p className="font-medium text-red-700 mb-3">⚠️ {industry.negative.title}</p>
                  <ul className="space-y-2">
                    {industry.negative.points.map((p, i) => (
                      <li key={i} className="flex gap-2 items-start">
                        <span className="text-red-400 flex-shrink-0">•</span>
                        <span className="text-stone-600">{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </section>
          ))}

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">関連ガイド</h2>
            <div className="space-y-3">
              <Link href="/guide/tabelog-review-reply" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">食べログ</span>
                <p className="font-medium text-stone-700 mt-2">食べログの口コミ返信ガイド</p>
              </Link>
              <Link href="/guide/hotpepper-review-reply" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">ホットペッパー</span>
                <p className="font-medium text-stone-700 mt-2">ホットペッパービューティーの口コミ返信ガイド</p>
              </Link>
              <Link href="/guide/review-reply-examples" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">例文集</span>
                <p className="font-medium text-stone-700 mt-2">【2026年版】口コミ返信テンプレート30選</p>
              </Link>
            </div>
          </section>

          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
            <p className="font-medium text-stone-800 mb-2">業種を選ぶだけで最適な返信文を自動生成</p>
            <p className="text-sm text-stone-500 mb-4">MyReplyToneは8業種に対応。業種ごとの特性を学習したAIが、このガイドを踏まえた返信文を即座に生成します。</p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
            >
              ✨ 業種を選んで返信を生成する →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
