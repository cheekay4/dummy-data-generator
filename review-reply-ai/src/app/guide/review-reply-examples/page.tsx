import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '【2026年版】口コミ返信テンプレート30選 | MyReplyTone',
  description: '飲食店・美容院・クリニック・ホテルなど業種別の口コミ返信例文30選。高評価・低評価別にすぐコピペで使えるテンプレートを無料公開。',
  keywords: '口コミ 返信 例文, 口コミ 返信 テンプレート, Google口コミ 返信 例文, 口コミ返信 コピペ',
  alternates: { canonical: 'https://myreplytone.com/guide/review-reply-examples' },
}

export default function ReviewReplyExamplesPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '【2026年版】口コミ返信テンプレート30選——コピペで使える業種別例文集',
    description: '飲食店・美容院・クリニック・ホテルなど業種別の口コミ返信例文30選。高評価・低評価別にすぐコピペで使えるテンプレートを無料公開。',
    author: { '@type': 'Organization', name: 'tools24.jp', url: 'https://tools24.jp' },
    publisher: { '@type': 'Organization', name: 'MyReplyTone', url: 'https://myreplytone.com' },
    datePublished: '2026-03-29',
    dateModified: '2026-03-29',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://myreplytone.com/guide/review-reply-examples' },
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

        <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">例文集</span>
        <h1 className="text-3xl font-bold text-stone-800 mt-3 mb-2">【2026年版】口コミ返信テンプレート30選</h1>
        <p className="text-stone-500 mb-10">コピペで使える業種別例文集</p>

        <div className="space-y-10 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              この例文集の使い方
            </h2>
            <p>
              口コミ返信は「すべてオリジナルで書かなければならない」と思われがちですが、実際にはベースとなるテンプレートを業種・評価別に用意しておき、そこに固有名詞や具体的なエピソードを加えるのが最も効率的かつ効果的な方法です。
            </p>
            <p className="mt-3">
              本記事では飲食店・美容院・クリニック・ホテル・整体・不動産・カフェの7業種について、高評価と低評価それぞれの返信テンプレートを合計30本掲載しています。そのままコピペして使うこともできますが、お客様の口コミ内容に合わせて一部をカスタマイズすると、より誠実な印象を与えることができます。
            </p>
            <div className="mt-4 bg-stone-50 rounded-xl p-4 space-y-2">
              <p className="font-medium text-stone-700">テンプレート活用の3つのコツ</p>
              <ul className="list-disc pl-5 space-y-1">
                <li>口コミで触れられた<strong>具体的なメニュー名・サービス名</strong>を返信に入れる</li>
                <li>お客様の名前が分かる場合は「〇〇様」と記載する（フルネームは避ける）</li>
                <li>季節やキャンペーン情報を添えると再来店率が上がる</li>
              </ul>
            </div>
          </section>

          {/* 飲食店 */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              飲食店の口コミ返信例文（6本）
            </h2>
            <p className="mb-4">飲食店は口コミ数が最も多い業種の一つです。料理名やスタッフへの言及を返信に盛り込むことで、定型文ではない「あなたへの返信」という印象を与えられます。</p>
            <div className="space-y-4">
              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★5</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">このたびはご来店いただき、また素敵なご感想をお寄せいただきありがとうございます。当店自慢の和牛ハンバーグをお楽しみいただけたとのこと、料理長をはじめスタッフ一同大変嬉しく思っております。季節ごとにソースを変えてご用意しておりますので、ぜひまたお立ち寄りくださいませ。次回のご来店を心よりお待ちしております。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 具体的な料理名を引用し、季節メニューで再来店を自然に促しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★5</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">温かいお言葉をいただき、誠にありがとうございます。接客についてお褒めの言葉をいただけたこと、担当したスタッフにも共有させていただきました。お客様に心地よくお過ごしいただけるよう、これからもスタッフ全員で努めてまいります。またのお越しをお待ちしております。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 接客への感謝をスタッフ全体に広げることで、チーム全体の姿勢を伝えています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★4</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例③</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご来店ありがとうございます。ランチコースをお気に召していただけたようで何よりです。デザートのティラミスは毎朝手作りしておりますので、そちらもお楽しみいただけたなら幸いです。夜のコースもまた違った雰囲気でご用意しておりますので、機会がございましたらぜひお試しくださいませ。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: ランチ来店のお客様にディナーを提案するアップセル型の返信です。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">このたびはご来店いただきありがとうございます。料理の提供にお時間をいただいてしまい、大変申し訳ございませんでした。いただいたご指摘を真摯に受け止め、キッチンのオペレーション改善に取り組んでおります。お忙しい中ご意見をお寄せいただいたことに感謝申し上げます。改善した姿をお見せできる機会がございましたら幸いです。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 言い訳をせず、具体的な改善箇所（キッチンオペレーション）を明示しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">率直なご意見をお寄せいただきありがとうございます。お料理の味付けがお口に合わなかったとのこと、大変残念に思っております。お客様のご意見を調理スタッフと共有し、味のバランスについて改めて見直してまいります。貴重なフィードバックに感謝いたします。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 「お口に合わなかった」という表現で、相手の感覚を否定せずに受け止めています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★1</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例③</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">このたびはご不快な思いをおかけしてしまい、誠に申し訳ございませんでした。スタッフの対応につきまして、ご期待に沿えなかったことを深くお詫び申し上げます。該当スタッフへの指導を改めて行うとともに、全スタッフへの接客研修を強化いたします。お忙しい中、貴重なご意見をいただきありがとうございました。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 「該当スタッフへの指導」と「全体研修」の二段構えで、個別対応と組織的改善の両方を示しています。</p>
              </div>
            </div>
          </section>

          {/* 美容院 */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              美容院の口コミ返信例文（4本）
            </h2>
            <p className="mb-4">美容院では担当スタイリスト名を入れることで、パーソナルな印象を強調できます。施術内容（カット・カラー・パーマなど）への具体的な言及も効果的です。</p>
            <div className="space-y-4">
              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★5</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">嬉しいご感想をありがとうございます。カラーの仕上がりにご満足いただけたとのこと、担当させていただいた田中も大変喜んでおります。お客様の髪質に合わせたトーン選びにこだわりましたので、そのようにおっしゃっていただけて光栄です。色落ちが気になる頃にまたご相談くださいませ。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 担当者名を入れてパーソナル感を出し、次回来店のタイミングも自然に提示しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★5</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">このたびはご来店いただき、また温かい口コミをありがとうございます。ヘッドスパでリラックスしていただけたようで嬉しい限りです。当店では季節に合わせたアロマオイルを取り入れておりますので、次回もぜひお楽しみください。またのご来店をお待ちしております。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 施術の特徴（季節のアロマオイル）を紹介して再来店を促しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご来店いただきありがとうございます。仕上がりがイメージと異なったとのこと、大変申し訳ございませんでした。カウンセリングの段階でもう少し丁寧にご希望を確認すべきでした。今後はビジュアル資料を活用したカウンセリングを徹底し、認識のズレが起きないよう改善いたします。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 原因（カウンセリング不足）と改善策（ビジュアル資料活用）を具体的に提示しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">率直なご意見をいただきありがとうございます。待ち時間が長くなってしまったとのこと、お忙しいところご迷惑をおかけし申し訳ございませんでした。予約管理の見直しと、お待ちの際のご案内方法を改善してまいります。貴重なご指摘に感謝いたします。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 待ち時間の問題に対して、予約管理という運営面の改善を約束しています。</p>
              </div>
            </div>
          </section>

          {/* クリニック */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              クリニックの口コミ返信例文（4本）
            </h2>
            <p className="mb-4">医療機関の口コミ返信では、診療内容の詳細に踏み込みすぎないことが重要です。個人情報や診断内容には絶対に言及せず、安心感を与える返信を心がけましょう。</p>
            <div className="space-y-4">
              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★5</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">温かいお言葉をいただき、誠にありがとうございます。丁寧な説明とおっしゃっていただけたこと、スタッフ一同大変励みになっております。患者様にご安心いただけるよう、これからもわかりやすいご説明を心がけてまいります。何かご不安なことがございましたら、いつでもお気軽にご相談ください。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 診療内容に触れず、「説明の丁寧さ」という口コミのポイントに絞って返信しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★4</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご来院いただきありがとうございます。受付や看護師の対応についてお褒めの言葉をいただき、スタッフ一同大変嬉しく思っております。患者様が安心して通院できる環境づくりを引き続き大切にしてまいります。お身体のことでお気づきの点がありましたら、お気軽にご相談くださいませ。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 受付・看護師などスタッフ全体への感謝を伝え、クリニックの雰囲気をアピールしています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご来院いただきありがとうございます。待ち時間が長くなりご不便をおかけしましたこと、深くお詫び申し上げます。現在、予約枠の見直しと受付フローの改善に取り組んでおります。いただいたご意見を活かし、患者様の貴重なお時間を大切にする運営を目指してまいります。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: クリニックで最も多い「待ち時間」の不満に対し、具体的な改善施策を示しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★1</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">貴重なご意見をお寄せいただきありがとうございます。説明が不十分と感じられたとのこと、大変申し訳ございませんでした。患者様おひとりおひとりに寄り添った丁寧なご説明ができるよう、院内のコミュニケーション体制を見直してまいります。ご不明な点がございましたら、お電話でもご相談を承っております。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 個別の診療内容に触れず、コミュニケーション体制の改善を約束。電話での相談窓口も提示しています。</p>
              </div>
            </div>
          </section>

          {/* ホテル */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              ホテルの口コミ返信例文（4本）
            </h2>
            <p className="mb-4">ホテルの口コミは宿泊予約の意思決定に直結します。客室・朝食・接客・立地など、口コミで触れられた要素をしっかり拾って返信しましょう。</p>
            <div className="space-y-4">
              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★5</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">このたびはご宿泊いただき、また嬉しいお言葉をお寄せいただきありがとうございます。客室からの眺望をお楽しみいただけたとのこと、大変光栄に存じます。朝食のビュッフェも季節ごとにメニューを更新しておりますので、ぜひまた違う季節にもお越しくださいませ。またのご利用を心よりお待ちしております。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 眺望と朝食という具体的な要素に触れ、季節の違いで再訪を促しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★4</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご宿泊いただきありがとうございます。フロントスタッフの対応についてお褒めの言葉をいただき、本人にも伝えさせていただきました。お客様の旅のひとときが快適なものとなるよう、今後もサービスの向上に努めてまいります。またのお越しをお待ち申し上げております。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: スタッフ個人への感謝を伝えつつ、組織としてのサービス向上姿勢も示しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">このたびはご宿泊いただきありがとうございます。客室の清掃につきましてご不快をおかけし、誠に申し訳ございませんでした。清掃チームへの再教育を行うとともに、チェックイン前のダブルチェック体制を導入いたしました。いただいたご意見をサービス改善に活かしてまいります。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 「ダブルチェック体制の導入」という具体的な改善策を提示しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★1</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご宿泊いただきありがとうございます。空調設備の不具合により快適にお過ごしいただけなかったとのこと、心よりお詫び申し上げます。該当設備は早急に点検・修繕を完了いたしました。今後このようなことがないよう、設備管理の頻度を高めてまいります。貴重なご意見をいただき感謝申し上げます。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 設備の問題は「修繕完了」と「管理頻度の向上」で迅速な対応をアピールしています。</p>
              </div>
            </div>
          </section>

          {/* 整体 */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              整体・リラクゼーションの口コミ返信例文（4本）
            </h2>
            <p className="mb-4">整体やリラクゼーションでは、施術の効果や院内の雰囲気への言及が多くなります。お客様の体調に関わるため、医療的な断言は避けつつ共感を示すのがポイントです。</p>
            <div className="space-y-4">
              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★5</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">嬉しいご感想をいただきありがとうございます。肩こりが楽になったとのこと、施術者としても大変やりがいを感じております。お身体の状態は日々変化しますので、定期的なメンテナンスをおすすめしております。またお辛くなる前にお気軽にご来院くださいませ。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 「定期メンテナンス」という形で自然にリピートを促しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★4</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご来院いただきありがとうございます。院内の雰囲気についてもお褒めいただき、リラックスしてお過ごしいただけたようで安心いたしました。お客様おひとりおひとりに合った施術を心がけておりますので、お身体のお悩みがありましたら何でもご相談くださいませ。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 院内環境と個別対応の両面をアピールし、相談しやすい雰囲気を作っています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご来院いただきありがとうございます。施術の力加減がお身体に合わなかったとのこと、大変申し訳ございませんでした。施術前のヒアリングをより丁寧に行い、お客様のご要望をしっかり反映できるよう改善してまいります。貴重なご意見に感謝いたします。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 力加減の問題をヒアリングの改善に結びつけ、仕組みとしての改善を示しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">率直なご意見をいただきありがとうございます。施術後の効果を実感いただけなかったとのこと、大変残念に思っております。次回ご来院いただける際には、症状の原因をより深く分析し、最適な施術プランをご提案させていただきます。お身体の状態についてお気軽にご相談くださいませ。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 効果への不満に対して「原因分析」と「最適プラン」で専門性をアピールしています。</p>
              </div>
            </div>
          </section>

          {/* 不動産 */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              不動産の口コミ返信例文（4本）
            </h2>
            <p className="mb-4">不動産業界では、契約後の口コミが多くなります。担当者の対応力・物件提案の的確さ・契約手続きのスムーズさが評価ポイントです。高額取引だけに、信頼感を重視した返信が求められます。</p>
            <div className="space-y-4">
              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★5</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">このたびはお取引いただき、また嬉しいお言葉をお寄せいただきありがとうございます。ご希望に合った物件をご紹介できたとのこと、担当者としても大変嬉しく思っております。新生活が素晴らしいものとなりますよう心よりお祈り申し上げます。ご入居後もお困りのことがございましたら、お気軽にご連絡くださいませ。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 契約後のサポート姿勢を示すことで、長期的な信頼関係を構築しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★4</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご来店いただきありがとうございます。物件のご提案や契約手続きについてご満足いただけたとのこと、スタッフ一同大変嬉しく存じます。不動産に関するご相談はいつでも承っておりますので、今後ともどうぞよろしくお願いいたします。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 今後の相談にも応じる姿勢を示し、紹介やリピートにつなげています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">このたびは貴重なご意見をお寄せいただきありがとうございます。ご連絡の対応が遅れましたこと、深くお詫び申し上げます。お客様とのコミュニケーションは最も大切にすべき部分であり、社内の連絡体制を早急に見直してまいります。ご不快な思いをおかけし、誠に申し訳ございませんでした。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 連絡遅延の問題に対して、社内体制の見直しという組織的な改善を約束しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">率直なご意見をいただきありがとうございます。物件のご提案がご期待に沿えなかったとのこと、大変残念に思っております。お客様のご希望をより深く理解するためのヒアリングシートの導入と、提案プロセスの改善に取り組んでまいります。貴重なフィードバックに感謝申し上げます。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 「ヒアリングシートの導入」という具体的な仕組みで改善の本気度を伝えています。</p>
              </div>
            </div>
          </section>

          {/* カフェ */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              カフェの口コミ返信例文（4本）
            </h2>
            <p className="mb-4">カフェは「雰囲気」や「居心地の良さ」が評価される業種です。ドリンクやフードの味だけでなく、空間全体の印象に言及した返信が効果的です。</p>
            <div className="space-y-4">
              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★5</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご来店いただき、また素敵なご感想をありがとうございます。自家焙煎のエチオピアブレンドをお気に召していただけたようで、バリスタも大変喜んでおります。豆は季節ごとに厳選しておりますので、次回はまた違った味わいをお楽しみいただけるかと思います。ゆっくりとした時間をお過ごしにまたお越しくださいませ。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 豆の具体名と季節ごとの変更を伝え、コーヒー好きの再来店を促しています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★4</span>
                  <p className="font-bold text-stone-800 text-xs">高評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">温かいお言葉をありがとうございます。店内の雰囲気をお楽しみいただけたとのこと、大変嬉しく思います。当店ではお仕事や読書にもゆっくりお使いいただけるよう、座席の配置や照明にもこだわっております。お気軽にいつでもお立ち寄りくださいませ。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 空間づくりへのこだわりを伝え、作業利用や長居OKの姿勢をアピールしています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★2</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例①</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">ご来店いただきありがとうございます。ドリンクの提供に時間がかかってしまい、大変申し訳ございませんでした。混雑時のオペレーションを見直し、お待たせしない提供体制を整えてまいります。貴重なご意見をお寄せいただきありがとうございました。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 「混雑時のオペレーション」と限定することで、普段は問題ないことを暗に伝えています。</p>
              </div>

              <div className="border border-stone-100 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold bg-amber-500 text-white rounded-full px-2 py-0.5">★1</span>
                  <p className="font-bold text-stone-800 text-xs">低評価への返信例②</p>
                </div>
                <p className="text-stone-600 italic bg-stone-50 rounded-lg px-3 py-2 mb-2">率直なご意見をいただきありがとうございます。店内の清潔さにつきましてご不快をおかけし、誠に申し訳ございませんでした。清掃の頻度とチェック体制を見直し、どの時間帯にお越しいただいても快適にお過ごしいただける環境を整えてまいります。ご指摘に感謝いたします。</p>
                <p className="text-stone-500 text-xs">💡 ポイント: 清掃の「頻度」と「チェック体制」の両面で改善を約束しています。</p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              テンプレートをさらに効果的にする3つのテクニック
            </h2>
            <div className="space-y-4">
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="font-medium text-stone-700 mb-2">1. 口コミの言葉を「引用」する</p>
                <p>お客様が使った表現をそのまま返信に取り入れると、「ちゃんと読んでいる」という誠実さが伝わります。「美味しかったです」という口コミには「美味しいとおっしゃっていただき」と返すのがコツです。</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="font-medium text-stone-700 mb-2">2. 季節・イベント情報を添える</p>
                <p>「春の限定メニューもご用意しております」「年末年始も営業しております」など、時期に合わせた一言を添えることで、返信がより自然になり、再来店のきっかけを作れます。</p>
              </div>
              <div className="bg-stone-50 rounded-xl p-4">
                <p className="font-medium text-stone-700 mb-2">3. 返信文の長さは200〜300文字が最適</p>
                <p>短すぎると誠意が伝わらず、長すぎると読まれません。テンプレートをベースに、口コミに合わせた一文を追加する程度が理想的な長さです。</p>
              </div>
            </div>
          </section>

          {/* 関連ガイド */}
          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">関連ガイド</h2>
            <div className="space-y-3">
              <Link href="/guide/google-review-reply" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">基本</span>
                <p className="font-medium text-stone-700 mt-2">Google口コミ返信の書き方完全ガイド</p>
              </Link>
              <Link href="/guide/star-rating-meaning" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">戦略</span>
                <p className="font-medium text-stone-700 mt-2">星評価の意味と口コミ返信戦略</p>
              </Link>
              <Link href="/guide/review-reply-template" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">テクニック</span>
                <p className="font-medium text-stone-700 mt-2">口コミ返信の「型」——どんな口コミにも使える5つの返信フレームワーク</p>
              </Link>
            </div>
          </section>

          {/* CTA */}
          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
            <p className="font-medium text-stone-800 mb-2">テンプレートをAIでカスタマイズ</p>
            <p className="text-sm text-stone-500 mb-4">口コミを貼り付けるだけで、業種や口コミ内容に合わせた返信文をAIが自動生成します。テンプレート以上の仕上がりを体験してください。</p>
            <Link href="/generator" className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm">✨ AIで返信を生成する →</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
