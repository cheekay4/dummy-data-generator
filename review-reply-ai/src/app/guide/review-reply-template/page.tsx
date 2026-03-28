import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '口コミ返信の5つのフレームワーク | MyReplyTone',
  description: '口コミ返信に使える5つの型（基本型・クレーム対応型・アップセル型・質問型・短文型）を例文付きで解説。どんな口コミにも対応できるフレームワーク集。',
  keywords: '口コミ 返信 テンプレート, 口コミ 返信 フレームワーク, 口コミ 返信 型, 口コミ 返信 構成',
  alternates: { canonical: 'https://myreplytone.com/guide/review-reply-template' },
}

export default function ReviewReplyTemplatePage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '口コミ返信の「型」——どんな口コミにも使える5つの返信フレームワーク',
    description: '口コミ返信に使える5つの型（基本型・クレーム対応型・アップセル型・質問型・短文型）を例文付きで解説。どんな口コミにも対応できるフレームワーク集。',
    author: { '@type': 'Organization', name: 'tools24.jp', url: 'https://tools24.jp' },
    publisher: { '@type': 'Organization', name: 'MyReplyTone', url: 'https://myreplytone.com' },
    datePublished: '2026-03-29',
    dateModified: '2026-03-29',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://myreplytone.com/guide/review-reply-template' },
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/guide" className="text-sm text-stone-400 hover:text-stone-600">
            ← ガイド一覧に戻る
          </Link>
        </div>

        <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">テクニック</span>
        <h1 className="text-3xl font-bold text-stone-800 mt-3 mb-2">口コミ返信の「型」</h1>
        <p className="text-stone-500 mb-10">どんな口コミにも使える5つの返信フレームワーク</p>

        <div className="space-y-10 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              なぜ「型」が必要なのか
            </h2>
            <p>
              口コミ返信を毎回ゼロから考えるのは、時間的にもメンタル的にも大きな負担です。特に低評価口コミへの返信は、感情的になりやすく、つい反論や言い訳を書いてしまいがちです。
            </p>
            <p className="mt-3">
              そこで役立つのが「返信の型（フレームワーク）」です。型を持っておくことで、どんな口コミが来ても冷静に対応でき、見込み客に好印象を与える返信を安定して書けるようになります。本記事では、あらゆる口コミに対応できる5つの型をBefore/After形式で解説します。
            </p>
            <div className="mt-4 bg-stone-50 rounded-xl p-4 space-y-2">
              <p className="font-medium text-stone-700">フレームワークを使うメリット</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>返信時間を大幅に短縮できる（1件あたり5分→1〜2分に）</li>
                <li>感情的な返信を防ぎ、プロフェッショナルな印象を保てる</li>
                <li>スタッフ間で返信品質を統一できる</li>
                <li>どんな種類の口コミにも漏れなく対応できる</li>
              </ul>
            </div>
          </section>

          {/* フレームワーク① */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              フレームワーク①: 基本型
            </h2>
            <div className="border border-stone-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">型①</span>
                <p className="font-bold text-stone-800">基本型：感謝→共感→再来店</p>
              </div>
              <p className="text-stone-500 mb-2">最も汎用性が高い返信の型です。高評価口コミの約80%はこの型で対応できます。まず来店への感謝を伝え、次に口コミで言及された具体的な内容に共感し、最後に再来店を促すメッセージで締めくくります。</p>
              <div className="space-y-2">
                <div className="bg-red-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-red-600 font-medium mb-1">❌ Before</p>
                  <p className="text-stone-600 italic text-xs">ありがとうございます。またのご来店をお待ちしております。</p>
                </div>
                <div className="bg-emerald-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-emerald-600 font-medium mb-1">✅ After</p>
                  <p className="text-stone-600 italic text-xs">このたびはご来店いただき、温かいお言葉をありがとうございます。当店のカルボナーラをお気に召していただけたようで、シェフも大変喜んでおります。来月からは春の限定パスタもご用意いたしますので、ぜひまたお立ち寄りくださいませ。</p>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-stone-50 rounded-xl p-4">
              <p className="font-medium text-stone-700 mb-2">基本型の3つのステップ</p>
              <div className="space-y-2">
                <p><strong>ステップ1：感謝</strong>——来店と口コミ投稿の両方に感謝を伝えます。「このたびはご来店いただき」「温かいお言葉をいただき」などの表現を使います。</p>
                <p><strong>ステップ2：共感</strong>——口コミで触れられた料理名・サービス名・スタッフ名を引用し、「お楽しみいただけたようで嬉しく思います」と共感を示します。ここが定型文との差別化ポイントです。</p>
                <p><strong>ステップ3：再来店</strong>——季節メニュー・新サービス・キャンペーンなどの情報を自然に添えて、次の来店を促します。「またのお越しをお待ちしております」だけでは弱いので、具体的な理由を加えましょう。</p>
              </div>
            </div>
          </section>

          {/* フレームワーク② */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              フレームワーク②: クレーム対応型
            </h2>
            <div className="border border-stone-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">型②</span>
                <p className="font-bold text-stone-800">クレーム対応型：受け止め→謝罪→改善→前向き</p>
              </div>
              <p className="text-stone-500 mb-2">低評価やクレーム口コミに対応するための型です。最も重要なのは「反論しない」こと。まず意見を受け止め、謝罪し、具体的な改善策を示し、最後に前向きな一言で締めます。この型は見込み客に「問題が起きても誠実に対応するお店」という印象を与えます。</p>
              <div className="space-y-2">
                <div className="bg-red-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-red-600 font-medium mb-1">❌ Before</p>
                  <p className="text-stone-600 italic text-xs">申し訳ございませんでした。その日は非常に混雑しておりまして、通常ではこのようなことはございません。ご理解いただけますと幸いです。</p>
                </div>
                <div className="bg-emerald-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-emerald-600 font-medium mb-1">✅ After</p>
                  <p className="text-stone-600 italic text-xs">貴重なご意見をお寄せいただきありがとうございます。料理の提供にお時間をいただいてしまい、大変申し訳ございませんでした。キッチンのオペレーションを見直し、お待たせしない体制づくりに取り組んでおります。改善した姿をご覧いただける機会がございましたら幸いです。</p>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-stone-50 rounded-xl p-4">
              <p className="font-medium text-stone-700 mb-2">クレーム対応型の4つのステップ</p>
              <div className="space-y-2">
                <p><strong>ステップ1：受け止め</strong>——「貴重なご意見をお寄せいただきありがとうございます」と、まず意見をもらったこと自体に感謝します。感情的な口コミでも、否定から入ってはいけません。</p>
                <p><strong>ステップ2：謝罪</strong>——「大変申し訳ございませんでした」と一度だけ明確に謝罪します。過度な謝罪の繰り返しは逆効果。問題を認めつつも、言い訳は一切加えません。</p>
                <p><strong>ステップ3：改善</strong>——「〇〇を見直し」「△△に取り組んでおります」と具体的な改善策を示します。「今後気をつけます」では不十分。何をどう変えるかを明示することで信頼が生まれます。</p>
                <p><strong>ステップ4：前向き</strong>——「改善した姿をご覧いただけましたら」と控えめに締めます。「またお越しください」は押しつけがましいため避けましょう。</p>
              </div>
            </div>
          </section>

          {/* フレームワーク③ */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              フレームワーク③: アップセル型
            </h2>
            <div className="border border-stone-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">型③</span>
                <p className="font-bold text-stone-800">アップセル型：感謝→引用→提案→期待</p>
              </div>
              <p className="text-stone-500 mb-2">高評価口コミを活用して、追加のサービスやメニューを自然に紹介する型です。お客様の満足度が高い状態を活かし、次回のアップグレードを提案します。ただし宣伝色が強くなりすぎないよう、あくまで「おすすめ」程度に留めるのがコツです。</p>
              <div className="space-y-2">
                <div className="bg-red-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-red-600 font-medium mb-1">❌ Before</p>
                  <p className="text-stone-600 italic text-xs">ありがとうございます。当店ではランチのほかにディナーコースもございます。ぜひご利用ください。またデザートの盛り合わせもおすすめです。</p>
                </div>
                <div className="bg-emerald-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-emerald-600 font-medium mb-1">✅ After</p>
                  <p className="text-stone-600 italic text-xs">ご来店いただきありがとうございます。ランチコースのパスタをお楽しみいただけたとのこと、嬉しい限りです。実は夜のコースでは同じシェフが手がけるトリュフのリゾットもご用意しております。ランチとはまた違った雰囲気ですので、機会がございましたらぜひお試しくださいませ。</p>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-stone-50 rounded-xl p-4">
              <p className="font-medium text-stone-700 mb-2">アップセル型の4つのステップ</p>
              <div className="space-y-2">
                <p><strong>ステップ1：感謝</strong>——基本型と同様に、来店と口コミへの感謝を述べます。</p>
                <p><strong>ステップ2：引用</strong>——口コミで言及されたサービスや商品を引用し、満足してもらえたことへの喜びを伝えます。</p>
                <p><strong>ステップ3：提案</strong>——「実は」「ご存知でしょうか」といった導入で、関連する別のサービスやメニューを紹介します。口コミで触れられたものとの関連性を明確にするのがポイントです。</p>
                <p><strong>ステップ4：期待</strong>——「機会がございましたら」「ぜひお試しください」と、押しつけにならない表現で締めます。</p>
              </div>
            </div>
          </section>

          {/* フレームワーク④ */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              フレームワーク④: 質問口コミ型
            </h2>
            <div className="border border-stone-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">型④</span>
                <p className="font-bold text-stone-800">質問口コミ型：共感→情報提供→次のアクション</p>
              </div>
              <p className="text-stone-500 mb-2">口コミの中には質問や問い合わせが含まれるケースがあります。「駐車場はありますか？」「予約は必要ですか？」「子連れOKですか？」など。これらに的確に回答することで、同じ疑問を持つ見込み客にも情報を届けられます。</p>
              <div className="space-y-2">
                <div className="bg-red-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-red-600 font-medium mb-1">❌ Before</p>
                  <p className="text-stone-600 italic text-xs">ありがとうございます。詳細はホームページをご覧ください。</p>
                </div>
                <div className="bg-emerald-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-emerald-600 font-medium mb-1">✅ After</p>
                  <p className="text-stone-600 italic text-xs">ご来店いただきありがとうございます。駐車場についてのご質問、ありがとうございます。当店には専用駐車場を5台分ご用意しておりますが、土日は満車になることがございます。その場合は、近隣のコインパーキング（徒歩2分）もご利用いただけます。事前にお電話いただけましたら、空き状況をお伝えいたします。</p>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-stone-50 rounded-xl p-4">
              <p className="font-medium text-stone-700 mb-2">質問口コミ型の3つのステップ</p>
              <div className="space-y-2">
                <p><strong>ステップ1：共感</strong>——質問をしてくれたことへの感謝を示します。「〇〇についてのご質問、ありがとうございます」と、質問内容を明示することで、他の読者にも内容が伝わります。</p>
                <p><strong>ステップ2：情報提供</strong>——質問に対して具体的かつ正確に回答します。数字（台数・所要時間・料金）を含めると信頼度が上がります。曖昧な回答は逆効果です。</p>
                <p><strong>ステップ3：次のアクション</strong>——「お電話いただけましたら」「ホームページでもご確認いただけます」など、お客様が次に取れる行動を提示します。これにより、問い合わせや来店につながりやすくなります。</p>
              </div>
            </div>
          </section>

          {/* フレームワーク⑤ */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              フレームワーク⑤: 短文型
            </h2>
            <div className="border border-stone-100 rounded-xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">型⑤</span>
                <p className="font-bold text-stone-800">短文型：短文感謝→1行メッセージ（星だけ・コメントなし型）</p>
              </div>
              <p className="text-stone-500 mb-2">星評価のみでコメントがない口コミへの返信に使う型です。コメントがないため引用もできませんが、返信しないのは機会損失です。短文でもきちんと返信することで、「すべての口コミに丁寧に対応するお店」という印象を与えられます。</p>
              <div className="space-y-2">
                <div className="bg-red-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-red-600 font-medium mb-1">❌ Before</p>
                  <p className="text-stone-600 italic text-xs">ありがとうございます。</p>
                </div>
                <div className="bg-emerald-50 rounded-lg px-3 py-2">
                  <p className="text-xs text-emerald-600 font-medium mb-1">✅ After</p>
                  <p className="text-stone-600 italic text-xs">高い評価をいただきありがとうございます。お客様のまたのお越しを、スタッフ一同心よりお待ちしております。次回はぜひ季節の限定メニューもお試しくださいませ。</p>
                </div>
              </div>
            </div>
            <div className="mt-4 bg-stone-50 rounded-xl p-4">
              <p className="font-medium text-stone-700 mb-2">短文型の2つのステップ</p>
              <div className="space-y-2">
                <p><strong>ステップ1：短文感謝</strong>——「高い評価をいただきありがとうございます」「ご来店ありがとうございます」など、シンプルな感謝を述べます。コメントがないため、過度に長い返信は不自然になります。</p>
                <p><strong>ステップ2：1行メッセージ</strong>——再来店の期待、季節の情報、新メニューの紹介など、1〜2文の付加情報を添えます。これにより、定型的なお礼だけの返信から脱却できます。低評価の星だけ口コミには「ご意見をいただきありがとうございます。お気づきの点がございましたらお気軽にお申し付けください」と短く返すのが効果的です。</p>
              </div>
            </div>
          </section>

          {/* 使い分け判断基準 */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              使い分けの判断基準
            </h2>
            <p className="mb-4">
              5つの型を紹介しましたが、実際に口コミを受け取ったとき、どの型を使うべきか迷うことがあるかもしれません。以下のフローチャートを参考に、口コミの内容から最適な型を選んでください。
            </p>
            <div className="space-y-3">
              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-stone-700 text-white rounded-full px-2 py-0.5">判断1</span>
                  <p className="font-bold text-stone-800 text-sm">コメントはあるか？</p>
                </div>
                <p className="text-stone-500">コメントなし（星だけ）→ <strong>型⑤ 短文型</strong>を使用。コメントあり→ 判断2へ。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-stone-700 text-white rounded-full px-2 py-0.5">判断2</span>
                  <p className="font-bold text-stone-800 text-sm">口コミは質問を含むか？</p>
                </div>
                <p className="text-stone-500">質問あり→ <strong>型④ 質問口コミ型</strong>を使用。質問なし→ 判断3へ。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-stone-700 text-white rounded-full px-2 py-0.5">判断3</span>
                  <p className="font-bold text-stone-800 text-sm">評価はポジティブかネガティブか？</p>
                </div>
                <p className="text-stone-500">ネガティブ（★1〜3）→ <strong>型② クレーム対応型</strong>を使用。ポジティブ（★4〜5）→ 判断4へ。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-stone-700 text-white rounded-full px-2 py-0.5">判断4</span>
                  <p className="font-bold text-stone-800 text-sm">関連サービスを提案できるか？</p>
                </div>
                <p className="text-stone-500">提案可能→ <strong>型③ アップセル型</strong>を使用。提案なし→ <strong>型① 基本型</strong>を使用。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              フレームワーク活用の注意点
            </h2>
            <div className="space-y-4">
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="font-medium text-stone-700 mb-2">同じ型を連続で使わない</p>
                <p>口コミ一覧で返信文が並んで表示されるため、同じ構成の返信が続くとテンプレ感が出ます。型①と型③を交互に使うなど、バリエーションを持たせましょう。</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="font-medium text-stone-700 mb-2">固有名詞を必ず入れる</p>
                <p>どの型を使う場合でも、口コミで触れられた料理名・サービス名・スタッフ名などの固有名詞を必ず1つは引用してください。これだけでテンプレート感は大きく軽減されます。</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="font-medium text-stone-700 mb-2">返信は48時間以内を目標に</p>
                <p>型を活用すれば、1件あたりの返信時間を1〜2分に短縮できます。口コミが投稿されたら、理想は24時間以内、遅くとも48時間以内に返信しましょう。速い返信は誠実さの証です。</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="font-medium text-stone-700 mb-2">型を組み合わせてもOK</p>
                <p>実際の口コミは複雑で、1つの型にきれいに当てはまらないこともあります。例えば、高評価だが改善要望も含む口コミには、型①（感謝・共感）と型②（改善提示）を組み合わせて対応するのが効果的です。</p>
              </div>
            </div>
          </section>

          {/* 関連ガイド */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">関連ガイド</h2>
            <div className="space-y-3">
              <Link href="/guide/review-reply-examples" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">例文集</span>
                <p className="font-medium text-stone-700 mt-2">【2026年版】口コミ返信テンプレート30選</p>
              </Link>
              <Link href="/guide/negative-review" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">対応</span>
                <p className="font-medium text-stone-700 mt-2">悪い口コミへの対応方法——炎上させずに誠実に返す技術</p>
              </Link>
              <Link href="/guide/star-rating-meaning" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">戦略</span>
                <p className="font-medium text-stone-700 mt-2">星評価の意味と口コミ返信戦略</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
            <p className="font-medium text-stone-800 mb-2">フレームワークをAIが自動適用</p>
            <p className="text-sm text-stone-500 mb-4">口コミを貼り付けるだけで、最適なフレームワークを自動選択し、プロ品質の返信文をAIが生成します。型選びに迷う必要はもうありません。</p>
            <Link href="/generator" className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm">✨ AIで返信を生成する →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
