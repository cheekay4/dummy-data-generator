import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'リリースノート',
  description: 'MyReplyTone の更新履歴・新機能・改善情報をお知らせします。',
}

const RELEASES = [
  {
    version: 'v1.0',
    date: '2026年3月1日',
    title: '正式リリース',
    items: [
      '8業種・8プラットフォーム対応の口コミ返信AIを公開',
      '性格診断（10問・2分）であなたのトーンをAIが学習する「返信プロファイル」機能',
      '過去のメールや返信文から文体を学習する「テキスト学習」機能',
      '口コミから客層を推定する「客層分析」機能',
      'Proプラン: 補助スタイル5種・多言語返信（日英中韓）・履歴90日保存・プロファイル5件',
      'よくある質問13問を掲載',
      'お問い合わせページ・プライバシーポリシー・利用規約を整備',
    ],
  },
]

export default function ReleasesPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <h1 className="text-2xl font-bold text-stone-800 mb-2">リリースノート</h1>
      <p className="text-stone-400 text-sm mb-10">MyReplyTone の更新履歴です。</p>

      <div className="relative pl-6 border-l-2 border-amber-200 space-y-10">
        {RELEASES.map((release) => (
          <div key={release.version} className="relative">
            <div className="absolute -left-[calc(1.5rem+5px)] top-1 w-2.5 h-2.5 rounded-full bg-amber-400 ring-4 ring-white" />
            <div className="flex items-center gap-3 mb-2">
              <span className="bg-amber-100 text-amber-700 text-xs font-mono font-medium px-2 py-0.5 rounded">
                {release.version}
              </span>
              <span className="text-stone-400 text-sm">{release.date}</span>
            </div>
            <h2 className="text-lg font-bold text-stone-800 mb-3">{release.title}</h2>
            <ul className="space-y-1.5">
              {release.items.map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-stone-600 leading-relaxed">
                  <span className="text-amber-400 mt-1.5 flex-shrink-0">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
