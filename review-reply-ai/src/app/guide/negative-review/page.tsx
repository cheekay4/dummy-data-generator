import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '悪い口コミへの対応方法——炎上させずに誠実に返す技術 | MyReplyTone',
  description: '低評価・クレーム口コミに正しく対応するための4ステップ。NGパターン・心構え・業種別の注意点をわかりやすく解説。返信例文付き。',
  keywords: '悪い口コミ 対応, 低評価 口コミ 返信, クレーム 口コミ 対処法, Googleマップ 悪評 対応',
  alternates: {
    canonical: 'https://myreplytone.com/guide/negative-review',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: '悪い口コミへの対応方法——炎上させずに誠実に返す技術',
  description: '低評価・クレーム口コミに正しく対応するための4ステップ。NGパターン・心構え・業種別の注意点をわかりやすく解説。',
  author: { '@type': 'Organization', name: 'tools24.jp', url: 'https://tools24.jp' },
  publisher: { '@type': 'Organization', name: 'MyReplyTone', url: 'https://myreplytone.com' },
  datePublished: '2025-06-01',
  dateModified: '2026-03-29',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://myreplytone.com/guide/negative-review' },
}

export default function NegativeReviewPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/guide" className="text-sm text-stone-400 hover:text-stone-600">
            ← ガイド一覧に戻る
          </Link>
        </div>

        <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">対応</span>
        <h1 className="text-3xl font-bold text-stone-800 mt-3 mb-2">悪い口コミへの対応方法</h1>
        <p className="text-stone-500 mb-10">炎上させずに誠実に返す技術</p>

        <div className="space-y-10 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              悪い口コミはチャンスである
            </h2>
            <p>
              低評価の口コミをもらったとき、多くのオーナーは「どうにか消せないか」「反論したい」と思います。しかし、悪い口コミへの対応こそが、<strong>他の見込み客があなたのお店を評価する重要な場面</strong>です。
            </p>
            <p className="mt-3">
              あるマーケティング調査では、悪い口コミに誠実に返信した店舗は、全て高評価の店舗よりも信頼されるという結果が出ています。完璧に見えるお店より、問題が起きたときの対応が良いお店の方が「人間らしさ」を感じさせるためです。
            </p>
            <div className="mt-4 bg-stone-50 rounded-xl p-4">
              <p className="font-medium text-stone-700 mb-2">返信を読んでいる人は誰か？</p>
              <p>悪い口コミへの返信を最も注目して読んでいるのは、口コミを投稿したお客様ではなく、<strong>来店を検討している見込み客</strong>です。その見込み客に「このお店はちゃんと対応してくれる」と思わせることが最大の目的です。</p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">
              悪い口コミ返信の4ステップ
            </h2>
            <div className="space-y-4">
              {[
                {
                  step: 'STEP 1',
                  title: '感謝と受け止め',
                  desc: 'まず「率直なご意見をありがとうございます」という姿勢を示します。反論や言い訳は一切せず、まずご意見を受け止めたことを伝えます。',
                  point: '「貴重なご意見をお寄せいただき、ありがとうございます。」',
                },
                {
                  step: 'STEP 2',
                  title: '謝意の表明（問題を認める）',
                  desc: '不快な思いをさせたことへの謝罪を明確にします。ただし「過度な謝罪」は逆効果。一言で済ませ、言い訳は加えません。',
                  point: '「ご不便をおかけしてしまい、大変申し訳ございませんでした。」',
                },
                {
                  step: 'STEP 3',
                  title: '具体的な改善策の提示',
                  desc: '「検討します」「努めます」だけでは不十分です。「スタッフへの接客研修を強化します」のように、具体性を持たせると信頼度が上がります。',
                  point: '「ご指摘を受け、〇〇の改善に取り組んでまいります。」',
                },
                {
                  step: 'STEP 4',
                  title: '前向きな締め（任意）',
                  desc: '「またお越しください」という押しつけはNGです。「改善した姿をご覧いただける機会があれば」という控えめな表現が自然です。',
                  point: '「またの機会がございましたら、改善した姿をご確認いただけますと幸いです。」',
                },
              ].map((item) => (
                <div key={item.step} className="border border-stone-100 rounded-xl p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">{item.step}</span>
                    <p className="font-bold text-stone-800">{item.title}</p>
                  </div>
                  <p className="text-stone-500 mb-2">{item.desc}</p>
                  <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2">{item.point}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">
              絶対にやってはいけないNGパターン
            </h2>
            <div className="space-y-3">
              {[
                { ng: '事実無根と断言する', reason: '「そのような事実はございません」は見ている人に高圧的な印象を与えます。事実確認は「状況を確認いたします」と柔らかく表現します。' },
                { ng: '他のお客様の評価を持ち出す', reason: '「他のお客様には好評です」は逆効果。批判した人をさらに傷つける表現です。' },
                { ng: '過剰な謝罪を繰り返す', reason: '同じ謝罪フレーズを何度も並べると、誠意ではなくテンプレ感が出てしまいます。' },
                { ng: '個人情報を返信に含める', reason: '来店日時・予約名・注文内容など、特定につながる情報の記載はプライバシー違反になる可能性があります。' },
                { ng: 'Googleへの削除申請を優先する', reason: '削除申請が通るのは明確な規約違反のみ。対応が遅れるほど悪印象が固定されます。まず返信を優先します。' },
              ].map((item) => (
                <div key={item.ng} className="flex gap-3 items-start">
                  <span className="text-red-400 text-lg flex-shrink-0">✗</span>
                  <div>
                    <p className="font-medium text-stone-700 mb-0.5">{item.ng}</p>
                    <p className="text-stone-500">{item.reason}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              口コミの種類別・対応の温度感
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 pr-4 font-medium text-stone-700">口コミの種類</th>
                    <th className="text-left py-2 px-3 font-medium text-stone-700">対応方針</th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-medium">事実ベースのクレーム</td>
                    <td className="py-2 px-3">謝罪＋具体的改善策を明示。最優先で対応。</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-medium">誤解・事実誤認</td>
                    <td className="py-2 px-3">謝罪後、穏やかに事実を1〜2文で補足。反論にならない言い方で。</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-medium">感情的な悪評</td>
                    <td className="py-2 px-3">感情には乗らず、事実と改善姿勢のみを淡々と記載。</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-medium">嫌がらせ・根拠のない誹謗中傷</td>
                    <td className="py-2 px-3">短く丁寧に受け止め返信。同時にGoogle削除申請を検討。</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">関連ガイド</h2>
            <div className="space-y-3">
              <Link href="/guide/star-rating-meaning" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">戦略</span>
                <p className="font-medium text-stone-700 mt-2">星評価の本当の意味——★1〜★5それぞれに最適な返信戦略</p>
              </Link>
              <Link href="/guide/review-reply-template" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">テクニック</span>
                <p className="font-medium text-stone-700 mt-2">口コミ返信の「型」——どんな口コミにも使える5つの返信フレームワーク</p>
              </Link>
              <Link href="/guide/review-psychology" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">マーケティング</span>
                <p className="font-medium text-stone-700 mt-2">口コミ心理学——返信が行動を変える理由</p>
              </Link>
            </div>
          </section>

          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
            <p className="font-medium text-stone-800 mb-2">悪い口コミへの返信もAIにお任せ</p>
            <p className="text-sm text-stone-500 mb-4">クレーム口コミを貼り付けるだけで、このガイドに沿った誠実な返信文をAIが自動生成します。</p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
            >
              ✨ 返信を生成してみる →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
