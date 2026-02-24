'use client'
import { useState } from 'react'

export default function UrlScrapeTab() {
  const [url, setUrl] = useState('')
  const [depth, setDepth] = useState(1)

  return (
    <div className="bg-white rounded-2xl border border-stone-200 p-6">
      <h2 className="text-lg font-semibold text-stone-900 mb-2">🔗 URL指定スクレイプ</h2>
      <p className="text-sm text-stone-500 mb-5">
        企業サイトのURLを入力して、CLIでメールアドレスを抽出します。
        Vercel 上では Playwright を実行できないため、以下のコマンドをローカルで実行してください。
      </p>

      <div className="flex gap-3 mb-4">
        <input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://example.com"
          className="flex-1 border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-indigo-400"
        />
        <div className="flex items-center gap-2">
          <label className="text-sm text-stone-600 shrink-0">深さ:</label>
          <select value={depth} onChange={(e) => setDepth(Number(e.target.value))}
            className="border border-stone-200 rounded-xl px-3 py-3 text-sm focus:outline-none focus:border-indigo-400 bg-white">
            {[1, 2, 3].map((d) => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
      </div>

      {url && (
        <div className="bg-stone-900 text-green-400 rounded-xl p-4 font-mono text-sm">
          <p className="text-stone-400 text-xs mb-2"># ローカルで実行するコマンド:</p>
          <p>node dist/index.js scrape {url} --depth {depth}</p>
        </div>
      )}

      <p className="text-xs text-stone-400 mt-4">
        CLIを実行すると、メールアドレスが自動で Supabase に保存され、このダッシュボードの「リード」に反映されます。
      </p>
    </div>
  )
}
