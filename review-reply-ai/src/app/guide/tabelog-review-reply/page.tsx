import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '食べログの口コミ返信ガイド【例文付き】 | MyReplyTone',
  description: '食べログの口コミ返信の書き方を徹底解説。Google口コミとの違い、食べログ特有の注意点、すぐ使える返信例文を紹介。',
  keywords: '食べログ 口コミ 返信, 食べログ レビュー 返信 書き方, 食べログ 返信 例文',
  alternates: { canonical: 'https://myreplytone.com/guide/tabelog-review-reply' },
}

export default function TabelogReviewReplyPage() {
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: '食べログの口コミ返信ガイド【例文付き】',
    description: '食べログの口コミ返信の書き方を徹底解説。Google口コミとの違い、食べログ特有の注意点、すぐ使える返信例文を紹介。',
    author: { '@type': 'Organization', name: 'tools24.jp', url: 'https://tools24.jp' },
    publisher: { '@type': 'Organization', name: 'MyReplyTone', url: 'https://myreplytone.com' },
    datePublished: '2026-03-29',
    dateModified: '2026-03-29',
    mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://myreplytone.com/guide/tabelog-review-reply' },
  }

  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/guide" className="text-sm text-stone-400 hover:text-stone-600">
            ← ガイド一覧に戻る
          </Link>
        </div>

        <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">食べログ</span>
        <h1 className="text-3xl font-bold text-stone-800 mt-3 mb-2">食べログの口コミ返信ガイド</h1>
        <p className="text-stone-500 mb-10">Google口コミとの違い・食べログ特有の注意点・すぐ使える例文</p>

        <div className="space-y-10 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              食べログとGoogle口コミの返信の違い
            </h2>
            <p>
              食べログとGoogleマップの口コミは、どちらも飲食店の評判に大きく影響しますが、利用者層・文化・表示のされ方に明確な違いがあります。この違いを理解せずに同じ返信テンプレートを使い回すと、食べログユーザーには「場違い」に映ってしまうことがあります。
            </p>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="border-b border-stone-200">
                    <th className="text-left py-2 pr-4 font-medium text-stone-700">比較項目</th>
                    <th className="text-left py-2 px-3 font-medium text-stone-700">食べログ</th>
                    <th className="text-left py-2 px-3 font-medium text-stone-700">Google口コミ</th>
                  </tr>
                </thead>
                <tbody className="text-stone-600">
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-medium">利用者層</td>
                    <td className="py-2 px-3">グルメ志向が強い。食に詳しいレビュアーが多い</td>
                    <td className="py-2 px-3">一般消費者が幅広く利用</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-medium">レビューの詳しさ</td>
                    <td className="py-2 px-3">長文・写真付きが主流。料理の描写が具体的</td>
                    <td className="py-2 px-3">短文〜中程度。星評価のみも多い</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-medium">返信の表示位置</td>
                    <td className="py-2 px-3">レビュー直下に表示。閲覧率が高い</td>
                    <td className="py-2 px-3">「オーナーからの返信」として折りたたみ表示</td>
                  </tr>
                  <tr className="border-b border-stone-100">
                    <td className="py-2 pr-4 font-medium">読者の期待</td>
                    <td className="py-2 px-3">丁寧で知的な文章。料理への言及を求める</td>
                    <td className="py-2 px-3">簡潔で誠実な対応</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4">
              食べログのレビュアーは「食のプロ意識」を持つ方が多く、料理の味・盛り付け・食材の質について詳細に言及する傾向があります。そのため返信文でも、料理に対するこだわりや食材へのコメントを自然に盛り込むことで、レビュアーとの信頼関係が築きやすくなります。一方、Googleの口コミではカジュアルで親しみやすい文体が好まれることが多く、同じトーンで食べログに返信すると軽薄に見えてしまう場合があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              食べログ特有の注意点
            </h2>
            <div className="space-y-4">
              <div className="flex gap-3">
                <span className="text-amber-500 text-lg flex-shrink-0">▸</span>
                <div>
                  <p className="font-medium text-stone-700 mb-0.5">点数システムへの言及は避ける</p>
                  <p className="text-stone-500">食べログの点数は独自のアルゴリズムで算出されており、レビュアーの付ける星評価とは一致しないことがあります。返信文で「3.5点をいただきありがとうございます」のように点数に言及すると、アルゴリズムへの理解不足と受け取られることがあります。点数ではなく、レビュー内容そのものに対して感謝を伝えましょう。</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-500 text-lg flex-shrink-0">▸</span>
                <div>
                  <p className="font-medium text-stone-700 mb-0.5">常連レビュアーへの対応</p>
                  <p className="text-stone-500">食べログにはレビュー投稿数が数百件を超える「常連レビュアー」が存在します。彼らの口コミは閲覧数が非常に多く、他の見込み客への影響力が大きいのが特徴です。常連レビュアーからの口コミには特に丁寧に返信し、料理へのこだわりや食材の仕入れ先のエピソードなど、一歩踏み込んだ情報を添えると好印象です。ただし、特別扱いしすぎると他のお客様からの印象が悪くなるため、あくまで「丁寧さの範囲内」で対応します。</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-500 text-lg flex-shrink-0">▸</span>
                <div>
                  <p className="font-medium text-stone-700 mb-0.5">写真付きレビューへのリアクション</p>
                  <p className="text-stone-500">食べログでは写真付きのレビューが主流です。レビュアーが撮影した料理写真に対して「お写真もとても美しく撮っていただきありがとうございます」と一言添えるだけで、レビュアーの満足度が大きく向上します。写真を撮る手間をかけてくれたことへの感謝は、リピート投稿にもつながります。</p>
                </div>
              </div>
              <div className="flex gap-3">
                <span className="text-amber-500 text-lg flex-shrink-0">▸</span>
                <div>
                  <p className="font-medium text-stone-700 mb-0.5">文体は丁寧語を基本に</p>
                  <p className="text-stone-500">食べログのレビューは丁寧な文体で書かれることが多いため、返信もそれに合わせて「です・ます調」を基本とします。Googleの口コミで使うようなカジュアルな絵文字や砕けた表現は、食べログでは避けた方が無難です。格式を保ちつつも温かみのある文章が理想的です。</p>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              返信の構成テンプレート
            </h2>
            <p className="mb-4">食べログの口コミ返信は「感謝 → 具体的な言及 → 改善・情報提供 → 再来店への期待」の4ステップで構成するのが効果的です。</p>
            <div className="space-y-3">
              {[
                {
                  step: '① 感謝',
                  desc: 'ご来店とレビュー投稿の両方に感謝を伝えます。',
                  example: '「このたびはご来店いただき、またお時間を割いて丁寧なレビューをお寄せいただきありがとうございます。」',
                },
                {
                  step: '② 具体的な言及',
                  desc: 'レビューで触れられた料理名・サービス・雰囲気について具体的にコメントします。',
                  example: '「〇〇（料理名）をお楽しみいただけたようで大変嬉しく思います。こちらは当店のシェフが〇〇にこだわって仕上げた一品です。」',
                },
                {
                  step: '③ 改善・追加情報',
                  desc: '指摘があれば改善策を、好評であれば関連する情報（季節メニュー等）を伝えます。',
                  example: '「来月からは旬の〇〇を使った新メニューもご用意いたします。」',
                },
                {
                  step: '④ 再来店への期待',
                  desc: '控えめかつ温かい表現で再来店を促します。',
                  example: '「またのお越しを心よりお待ちしております。季節ごとに変わるメニューもぜひお試しください。」',
                },
              ].map((item) => (
                <div key={item.step} className="bg-stone-50 rounded-xl p-4">
                  <p className="font-medium text-stone-700 mb-1">{item.step}</p>
                  <p className="text-stone-500 mb-2">{item.desc}</p>
                  <p className="text-stone-600 italic bg-white rounded-lg px-3 py-2">{item.example}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              良い口コミへの返信例文
            </h2>

            <div className="space-y-5">
              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="text-xs text-stone-500 mb-3">パターン1：料理を褒めてくれたレビューへの返信</p>
                <p className="text-stone-700 leading-relaxed">
                  「このたびはご来店いただき、またとても丁寧なレビューをお寄せいただきありがとうございます。<br /><br />
                  自家製パスタをお気に召していただけたとのこと、シェフをはじめスタッフ一同大変嬉しく拝読いたしました。パスタの生地は毎朝店内で手打ちしており、季節の食材に合わせてソースも変えております。<br /><br />
                  お写真もとても素敵に撮っていただきありがとうございます。4月からは春野菜を使った新しいパスタメニューもご用意いたしますので、またのお越しを心よりお待ちしております。」
                </p>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <p className="text-xs text-stone-500 mb-3">パターン2：雰囲気・接客を褒めてくれたレビューへの返信</p>
                <p className="text-stone-700 leading-relaxed">
                  「ご来店いただきありがとうございます。また、お店の雰囲気やスタッフの対応についてお褒めの言葉をいただき、心より感謝いたします。<br /><br />
                  当店では「ゆっくりお食事を楽しんでいただける空間づくり」を大切にしており、そのコンセプトがお客様に伝わっていることをとても嬉しく思います。スタッフにも共有させていただきました。<br /><br />
                  ランチタイムは比較的ゆったりとお過ごしいただけますので、またお気軽にお立ち寄りください。季節限定のデザートもご用意しております。」
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              悪い口コミへの返信例文
            </h2>

            <div className="space-y-5">
              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                <p className="text-xs text-stone-500 mb-3">パターン1：料理の提供時間・味への不満</p>
                <p className="text-stone-700 leading-relaxed">
                  「このたびはご来店いただき、また率直なご意見をお寄せいただきありがとうございます。<br /><br />
                  お料理の提供にお時間をいただいてしまったとのこと、大変申し訳ございませんでした。当日の調理体制を確認し、ピーク時のオペレーション改善に取り組んでおります。<br /><br />
                  また、お味についてもご期待に沿えなかった点、真摯に受け止めております。いただいたご意見をシェフと共有し、味付けのバランスを再度見直す機会といたしました。改善に努めてまいりますので、またの機会がございましたら、ぜひ変化をご確認いただけますと幸いです。」
                </p>
              </div>

              <div className="bg-stone-50 border border-stone-200 rounded-2xl p-5">
                <p className="text-xs text-stone-500 mb-3">パターン2：コストパフォーマンスへの不満</p>
                <p className="text-stone-700 leading-relaxed">
                  「ご来店いただきありがとうございます。また、貴重なご意見をお聞かせいただき感謝いたします。<br /><br />
                  価格に対してご満足いただけなかったとのこと、申し訳ございません。当店では産地直送の旬の食材を使用し、一品ずつ手作りでご提供しておりますが、その価値が十分にお伝えできていなかったと反省しております。<br /><br />
                  メニュー表への食材の産地や調理法の記載を充実させるなど、お客様に価値を実感していただける工夫を進めてまいります。いただいたご意見を今後のサービス向上に活かしてまいります。」
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              食べログで返信率を上げるコツ
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: '通知設定を有効にする',
                  desc: '食べログの店舗管理画面で口コミ通知をONにしておくと、新しいレビューが投稿された際にメールで通知が届きます。レビューの見落としを防ぎ、48時間以内の返信を習慣化しましょう。',
                },
                {
                  title: '返信テンプレートを用意しておく',
                  desc: '完全なテンプレートではなく「書き出し」「締めの言葉」のバリエーションを3〜4パターン用意しておくと、ゼロから書く負担が大幅に減ります。中間部分はレビュー内容に合わせてカスタマイズします。',
                },
                {
                  title: '週2回の「返信タイム」を設定する',
                  desc: '毎日返信する時間が取れない場合は、週2回（例えば火曜と金曜の閉店後）に返信時間を固定するのが効果的です。溜めすぎずに対応でき、負担も分散されます。',
                },
                {
                  title: 'AI返信ツールを活用する',
                  desc: '口コミの文章をコピーしてAI返信ツールに貼り付けるだけで、食べログのトーンに合った返信文の下書きが数秒で生成されます。それを自分の言葉で微調整すれば、返信にかかる時間を大幅に短縮できます。',
                },
                {
                  title: '長文レビューほど丁寧に返す',
                  desc: '食べログでは長文の詳細レビューほど閲覧数が多い傾向にあります。手間をかけてレビューを書いてくれたお客様には、それに見合う丁寧な返信を心がけることで、他の閲覧者にも「しっかり対応するお店」という印象を与えられます。',
                },
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
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">関連ガイド</h2>
            <div className="space-y-3">
              <Link href="/guide/google-review-reply" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">基本</span>
                <p className="font-medium text-stone-700 mt-2">Google口コミ返信の書き方完全ガイド</p>
              </Link>
              <Link href="/guide/industry-tips" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">業種別</span>
                <p className="font-medium text-stone-700 mt-2">業種別・口コミ返信のコツ</p>
              </Link>
            </div>
          </section>

          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
            <p className="font-medium text-stone-800 mb-2">MyReplyToneで返信を自動生成</p>
            <p className="text-sm text-stone-500 mb-4">食べログの口コミを貼り付けるだけで、このガイドに沿った返信文をAIが自動生成します。食べログのトーンに合わせた丁寧な返信を数秒で作成。</p>
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
