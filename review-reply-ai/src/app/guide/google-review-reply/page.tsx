import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Google口コミ返信の書き方完全ガイド【例文付き】 | MyReplyTone',
  description: 'Google口コミへの返信方法を良い口コミ・悪い口コミ別に解説。返信が必要な理由、守るべきルール、すぐ使える例文テンプレートを無料公開。',
  keywords: 'Google口コミ 返信, 口コミ 返信 書き方, 口コミ 返信 例文, Googleビジネスプロフィール 返信',
  alternates: {
    canonical: 'https://myreplytone.com/guide/google-review-reply',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'Google口コミ返信の書き方完全ガイド',
  description: 'Google口コミへの返信方法を良い口コミ・悪い口コミ別に解説。返信が必要な理由、守るべきルール、すぐ使える例文テンプレートを無料公開。',
  author: { '@type': 'Organization', name: 'tools24.jp', url: 'https://tools24.jp' },
  publisher: { '@type': 'Organization', name: 'MyReplyTone', url: 'https://myreplytone.com' },
  datePublished: '2025-06-01',
  dateModified: '2026-03-29',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://myreplytone.com/guide/google-review-reply' },
}

export default function GoogleReviewReplyPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/guide" className="text-sm text-stone-400 hover:text-stone-600">
            ← ガイド一覧に戻る
          </Link>
        </div>

        <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">基本</span>
        <h1 className="text-3xl font-bold text-stone-800 mt-3 mb-2">Google口コミ返信の書き方完全ガイド</h1>
        <p className="text-stone-500 mb-10">良い口コミ・悪い口コミ別の返信構成と例文</p>

        <div className="space-y-10 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              なぜGoogle口コミへの返信が重要なのか
            </h2>
            <p>
              Googleマップに表示される口コミへの返信は、単なる「お礼」ではありません。返信文はお客様本人だけでなく、<strong>その口コミを見た不特定多数の見込み客</strong>に向けた発信でもあります。
            </p>
            <p className="mt-3">
              Googleの調査によると、オーナーが返信している店舗は、そうでない店舗に比べて来店率が高くなる傾向があります。また、悪い口コミに誠実に返信することで、むしろ信頼感が上がるケースも多く報告されています。
            </p>
            <div className="mt-4 bg-stone-50 rounded-xl p-4 space-y-2">
              <p className="font-medium text-stone-700">返信することで得られる効果</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>Googleマップのローカル検索順位（MEO）に好影響</li>
                <li>見込み客への「オーナーが真剣に運営している」という印象づけ</li>
                <li>リピーターとの関係強化</li>
                <li>悪い口コミの印象を中和・軽減</li>
              </ul>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              返信の基本ルール
            </h2>
            <div className="space-y-4">
              {[
                { title: '7日以内に返信する', desc: '口コミへの返信は速さも評価されます。特に悪い口コミは放置期間が長いほど印象が悪化します。理想は24〜48時間以内。' },
                { title: '口コミの内容を具体的に引用する', desc: '「パスタをお楽しみいただけたようで」のように、口コミの言葉を拾うことで「ちゃんと読んだ」という誠実さが伝わります。' },
                { title: '200〜300文字を目安にする', desc: '短すぎると誠意が感じられず、長すぎると読まれません。200〜300文字が最も読まれやすいとされています。' },
                { title: '個人情報を含めない', desc: '口コミ投稿者のフルネームや住所など、特定につながる情報を返信に書くのはNGです。「〇〇様」「お客様」と表記します。' },
              ].map((item) => (
                <div key={item.title} className="flex gap-3">
                  <span className="text-amber-500 text-lg flex-shrink-0">✓</span>
                  <div>
                    <p className="font-medium text-stone-700 mb-0.5">{item.title}</p>
                    <p className="text-stone-500">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              良い口コミへの返信：3つの構成要素
            </h2>
            <p className="mb-4">高評価・ポジティブな口コミへの返信は「感謝→共感→再来店の期待」の3ステップで構成するのが基本です。</p>

            <div className="space-y-3">
              {[
                { step: '① 感謝', example: '「このたびはご来店いただき、また温かいお言葉をいただきありがとうございます。」' },
                { step: '② 共感・具体的な言及', example: '「〇〇（口コミで触れられた料理や対応）をお喜びいただけたこと、スタッフ一同とても嬉しく思います。」' },
                { step: '③ 再来店の期待', example: '「またのご来店を心よりお待ちしております。次回は季節のメニューもぜひお試しください。」' },
              ].map((item) => (
                <div key={item.step} className="bg-stone-50 rounded-xl p-4">
                  <p className="font-medium text-stone-700 mb-2">{item.step}</p>
                  <p className="text-stone-500 italic">{item.example}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              悪い口コミへの返信：絶対に避けるべきこと
            </h2>
            <p className="mb-4">低評価口コミへの返信は、対応を誤ると炎上・二次被害につながります。以下は絶対にやってはいけないパターンです。</p>
            <div className="space-y-3">
              {[
                { ng: '感情的な反論をする', reason: '「事実とは異なります」などの反論は見ている人に悪印象を与えます。事実確認は冷静に、かつ一言で済ませます。' },
                { ng: '言い訳を並べる', reason: '「その日は混雑していて」「スタッフが新人で」といった言い訳は誠実さを損ないます。' },
                { ng: '返信しない・削除依頼する', reason: '返信なしは放置と受け取られます。Googleへの削除申請は明らかな規約違反以外では認められません。' },
                { ng: '過度に謝罪を繰り返す', reason: '謝罪を重ねすぎると問題を認めすぎている印象を与えます。1回の謝意＋改善姿勢が適切です。' },
              ].map((item) => (
                <div key={item.ng} className="flex gap-3">
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
              悪い口コミ返信の例文
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-xs text-stone-500 mb-3">状況：「料理の提供が遅すぎた。スタッフの対応も冷たかった」という3つ星の口コミへの返信</p>
              <p className="text-stone-700 leading-relaxed">
                「このたびはご来店いただきありがとうございます。また、率直なご意見をお寄せいただきありがとうございます。<br /><br />
                提供時間とスタッフの対応につきまして、ご不快をおかけしてしまい、大変申し訳ございませんでした。<br /><br />
                当日の状況を確認し、お待たせしない提供体制とスタッフへの接客指導を改めて徹底いたします。いただいたご意見を真摯に受け止め、より良いお店づくりに努めてまいります。<br /><br />
                またの機会がございましたら、改善した姿をご覧いただけますと幸いです。」
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">関連ガイド</h2>
            <div className="space-y-3">
              <Link href="/guide/negative-review" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">対応</span>
                <p className="font-medium text-stone-700 mt-2">悪い口コミへの対応方法——炎上させずに誠実に返す技術</p>
              </Link>
              <Link href="/guide/review-reply-examples" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">例文集</span>
                <p className="font-medium text-stone-700 mt-2">【2026年版】口コミ返信テンプレート30選</p>
              </Link>
              <Link href="/guide/meo" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">MEO</span>
                <p className="font-medium text-stone-700 mt-2">MEO対策と口コミ管理の基本</p>
              </Link>
            </div>
          </section>

          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
            <p className="font-medium text-stone-800 mb-2">返信文をAIに任せてみよう</p>
            <p className="text-sm text-stone-500 mb-4">口コミを貼り付けるだけで、このガイドに沿った返信文をAIが自動生成します。ログインで1日5回無料。</p>
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
