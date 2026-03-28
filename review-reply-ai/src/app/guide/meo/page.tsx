import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'MEO対策と口コミ管理の基本——飲食店・店舗オーナー向け | MyReplyTone',
  description: 'Googleマップの上位表示に直結するMEO対策を解説。口コミ返信がMEOに与える影響、具体的な対策チェックリスト、Googleビジネスプロフィールの最適化方法。',
  keywords: 'MEO対策, Googleマップ 上位表示, Googleビジネスプロフィール 最適化, 口コミ MEO, ローカルSEO',
  alternates: {
    canonical: 'https://myreplytone.com/guide/meo',
  },
}

const articleSchema = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: 'MEO対策と口コミ管理の基本——飲食店・店舗オーナー向け',
  description: 'Googleマップの上位表示に直結するMEO対策を解説。口コミ返信がMEOに与える影響、具体的な対策チェックリスト、Googleビジネスプロフィールの最適化方法。',
  author: { '@type': 'Organization', name: 'tools24.jp', url: 'https://tools24.jp' },
  publisher: { '@type': 'Organization', name: 'MyReplyTone', url: 'https://myreplytone.com' },
  datePublished: '2025-06-01',
  dateModified: '2026-03-29',
  mainEntityOfPage: { '@type': 'WebPage', '@id': 'https://myreplytone.com/guide/meo' },
}

export default function MeoPage() {
  return (
    <div className="min-h-screen bg-white py-12 px-4">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/guide" className="text-sm text-stone-400 hover:text-stone-600">
            ← ガイド一覧に戻る
          </Link>
        </div>

        <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">MEO</span>
        <h1 className="text-3xl font-bold text-stone-800 mt-3 mb-2">MEO対策と口コミ管理の基本</h1>
        <p className="text-stone-500 mb-10">飲食店・店舗オーナーのためのGoogleマップ集客ガイド</p>

        <div className="space-y-10 text-stone-600 text-sm leading-relaxed">

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              MEOとは何か
            </h2>
            <p>
              MEO（Map Engine Optimization）とは、Googleマップ上での検索順位を上げるための施策です。「渋谷 ランチ」「新宿 美容院」のように地名＋業種で検索したとき、Googleマップに表示される「ローカルパック」（地図と3店舗が出るエリア）の上位に表示されるための最適化です。
            </p>
            <p className="mt-3">
              スマートフォンでの検索の大半が「今すぐ、近くで」という意図を持っているため、MEOで上位表示できると<strong>広告費をかけずに来店客を増やせる</strong>効果があります。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              Googleが評価するMEOの3大要素
            </h2>
            <div className="space-y-4">
              {[
                {
                  title: '① 関連性（Relevance）',
                  desc: '検索キーワードとビジネスの内容が一致しているか。Googleビジネスプロフィールのカテゴリ・説明文・投稿内容が影響します。',
                },
                {
                  title: '② 距離（Distance）',
                  desc: '検索ユーザーの現在地から店舗までの距離。物理的な場所は変えられないため、他の要素を磨くことが重要です。',
                },
                {
                  title: '③ 知名度（Prominence）',
                  desc: 'そのビジネスがどれだけ有名・信頼されているか。口コミの数・評価・返信率が直接影響します。',
                },
              ].map((item) => (
                <div key={item.title} className="border border-stone-100 rounded-xl p-4">
                  <p className="font-bold text-stone-800 mb-1">{item.title}</p>
                  <p className="text-stone-500">{item.desc}</p>
                </div>
              ))}
            </div>
            <p className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4 text-stone-700">
              <strong>口コミ返信が直接影響するのは「③ 知名度」です。</strong>口コミへの返信率・返信速度・返信の質がGoogleのアルゴリズムに評価されます。
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              口コミ返信がMEOに与える具体的な影響
            </h2>
            <p className="mb-4">Googleは公式に「オーナーからの返信は、Google検索とマップにおけるビジネスの可視性に影響を与える可能性があります」と述べています。具体的には以下の点が評価されます。</p>
            <div className="space-y-3">
              {[
                { item: '返信率', desc: '口コミ全体に対して返信している割合。100%に近いほど評価が上がる傾向があります。' },
                { item: '返信速度', desc: '口コミ投稿から返信までの時間。24〜48時間以内が理想的とされています。' },
                { item: '返信の文字数・質', desc: '短すぎる定型文より、口コミ内容に即した具体的な返信の方が高評価されます。' },
                { item: '口コミ数の増加', desc: '返信があることで「次の人も口コミを書きやすい」環境が生まれ、口コミ数が自然に増加します。' },
              ].map((item) => (
                <div key={item.item} className="flex gap-3 items-start">
                  <span className="text-amber-500 font-bold flex-shrink-0">→</span>
                  <div>
                    <span className="font-medium text-stone-700">{item.item}：</span>
                    <span className="text-stone-500">{item.desc}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-4 pb-2 border-b border-stone-100">
              Googleビジネスプロフィール最適化チェックリスト
            </h2>
            <div className="space-y-2">
              {[
                'ビジネス名・住所・電話番号・営業時間が最新の情報になっている',
                'カテゴリが適切に設定されている（メインカテゴリ＋サブカテゴリ）',
                '説明文に主要キーワードが自然に含まれている（500文字以内）',
                '写真が10枚以上アップロードされている（外観・内装・料理・スタッフ）',
                '週1回以上「投稿」機能でお知らせや写真を更新している',
                '全ての口コミに返信している（返信率100%を目標に）',
                'Q&Aセクションに頻出質問と回答を自分で追加している',
                'ウェブサイトURLが正しく設定されている',
              ].map((item, i) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 border-2 border-stone-300 rounded flex-shrink-0 mt-0.5" />
                  <p className="text-stone-600">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-stone-800 mb-3 pb-2 border-b border-stone-100">
              口コミを増やすための3つの方法
            </h2>
            <p className="mb-4">良い口コミを増やすことはMEO向上の最短経路です。ただしGoogleのポリシー上、口コミへの報酬提供（割引・プレゼント）は禁止されています。</p>
            <div className="space-y-4">
              {[
                {
                  title: 'QRコードを店内に設置する',
                  desc: 'レジ横・テーブル・レシートにGoogleマップのレビューページへのQRコードを設置。「口コミを書いていただけると励みになります」の一言と合わせて置くと効果的です。',
                },
                {
                  title: '会計時に口頭でお願いする',
                  desc: '「よろしければGoogleマップにご感想をいただけると嬉しいです」と自然に伝える。強制感がなく、満足したお客様は快く書いてくれます。',
                },
                {
                  title: '返信でエンゲージメントを高める',
                  desc: '口コミに返信することで、他のお客様が「自分の口コミも読んでもらえる」と感じ、口コミを書く心理的ハードルが下がります。',
                },
              ].map((item) => (
                <div key={item.title} className="border border-stone-100 rounded-xl p-4">
                  <p className="font-bold text-stone-800 mb-1">{item.title}</p>
                  <p className="text-stone-500">{item.desc}</p>
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
              <Link href="/guide/review-psychology" className="block bg-stone-50 rounded-xl p-4 hover:bg-amber-50 transition-colors">
                <span className="text-xs font-medium bg-amber-100 text-amber-700 rounded-full px-2.5 py-0.5">マーケティング</span>
                <p className="font-medium text-stone-700 mt-2">口コミ心理学——返信が行動を変える理由</p>
              </Link>
            </div>
          </section>

          <div className="border border-amber-200 bg-amber-50 rounded-2xl p-6 text-center">
            <p className="font-medium text-stone-800 mb-2">口コミ返信を効率化してMEO対策を加速させよう</p>
            <p className="text-sm text-stone-500 mb-4">全ての口コミに返信するのは大変な作業。AIに任せれば数秒で高品質な返信文が完成します。</p>
            <Link
              href="/generator"
              className="inline-flex items-center gap-1.5 bg-amber-500 hover:bg-amber-600 text-white font-medium px-6 py-3 rounded-xl transition-colors shadow-sm"
            >
              ✨ 無料で返信を生成する →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
