'use client';
import { useState } from 'react';
import Link from 'next/link';

const API_BASE = 'https://msg-scorer.vercel.app/api/v1';

const CURL_EXAMPLE = `curl -X POST ${API_BASE}/score \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer msk_xxxxx" \\
  -d '{
    "channel": "email_subject",
    "text": "【限定】春コスメ50%OFF",
    "conversionGoal": "purchase"
  }'`;

const JS_EXAMPLE = `const response = await fetch('${API_BASE}/score', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer msk_xxxxx',
  },
  body: JSON.stringify({
    channel: 'email_subject',
    text: '【限定】春コスメ50%OFF',
    conversionGoal: 'purchase',
  }),
});
const data = await response.json();
console.log(data.data.totalScore); // 72`;

const PYTHON_EXAMPLE = `import requests

response = requests.post(
    '${API_BASE}/score',
    headers={
        'Content-Type': 'application/json',
        'Authorization': 'Bearer msk_xxxxx',
    },
    json={
        'channel': 'email_subject',
        'text': '【限定】春コスメ50%OFF',
        'conversionGoal': 'purchase',
    },
)
data = response.json()
print(data['data']['totalScore'])  # 72`;

const RESPONSE_EXAMPLE = `{
  "success": true,
  "data": {
    "totalScore": 72,
    "axes": [
      { "name": "開封誘引力", "score": 82, "feedback": "..." },
      { "name": "読了性",     "score": 75, "feedback": "..." },
      { "name": "CTA強度",   "score": 68, "feedback": "..." },
      { "name": "ターゲット適合度", "score": 70, "feedback": "..." },
      { "name": "配信適正",   "score": 65, "feedback": "..." }
    ],
    "improvements": ["改善案1", "改善案2", "改善案3"],
    "abVariants": [...],
    "currentImpact": {
      "openRate": 23.4, "openCount": 2340,
      "ctr": 4.7, "clickCount": 468,
      "conversionRate": 1.5, "conversionCount": 7,
      "conversionLabel": "購入数"
    },
    "improvedImpact": { ... }
  }
}`;

const ERROR_CODES = [
  { code: 'INVALID_API_KEY', status: 401, desc: 'APIキーが無効、または無効化済み' },
  { code: 'TEAM_NOT_PRO',    status: 403, desc: 'Team Proプランではない' },
  { code: 'RATE_LIMITED',    status: 429, desc: 'レート制限（1,000回/日）超過' },
  { code: 'INVALID_INPUT',   status: 400, desc: 'リクエストボディが不正' },
  { code: 'SCORING_FAILED',  status: 500, desc: 'AI処理エラー' },
];

type Tab = 'curl' | 'js' | 'python';

export default function ApiDocsPage() {
  const [tab, setTab] = useState<Tab>('curl');

  const codeMap: Record<Tab, string> = {
    curl: CURL_EXAMPLE,
    js: JS_EXAMPLE,
    python: PYTHON_EXAMPLE,
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center gap-2">
        <Link href="/team/settings/api" className="text-stone-400 hover:text-stone-600 text-sm">← APIキー管理</Link>
        <span className="text-stone-300">/</span>
        <h1 className="text-xl font-bold text-stone-900">📄 APIドキュメント</h1>
      </div>

      <p className="text-sm text-stone-500">
        MsgScore外部スコアリングAPIのリファレンスです。Team ProプランのAPIキーで認証を行います。
      </p>

      {/* 認証 */}
      <section className="space-y-3">
        <h2 className="font-semibold text-stone-800">認証</h2>
        <div className="bg-stone-50 border border-stone-200 rounded-xl p-4 text-sm space-y-2">
          <p className="text-stone-700">すべてのリクエストに <code className="bg-stone-200 px-1 rounded text-xs">Authorization</code> ヘッダーが必要です。</p>
          <code className="block text-xs font-mono text-stone-700 bg-white border border-stone-100 rounded px-3 py-2">
            Authorization: Bearer msk_xxxxx
          </code>
          <p className="text-xs text-stone-400">APIキーは <Link href="/team/settings/api" className="text-indigo-600 hover:underline">APIキー管理</Link> ページで生成できます。</p>
        </div>
      </section>

      {/* エンドポイント */}
      <section className="space-y-3">
        <h2 className="font-semibold text-stone-800">エンドポイント</h2>
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3 border-b border-stone-100">
            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-2 py-0.5 rounded">POST</span>
            <code className="text-sm font-mono text-stone-700">/api/v1/score</code>
          </div>
          <div className="p-4 text-sm text-stone-600">
            テキストのスコアリングを実行します。チームのブランドボイス・組織ナレッジが自動適用されます。
          </div>
        </div>
      </section>

      {/* リクエスト */}
      <section className="space-y-3">
        <h2 className="font-semibold text-stone-800">リクエストボディ</h2>
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden text-sm">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium text-stone-500">パラメータ</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-stone-500">型</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-stone-500">必須</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-stone-500">説明</th>
              </tr>
            </thead>
            <tbody>
              {[
                { param: 'channel', type: 'string', req: '✓', desc: 'email_subject / email_body / line' },
                { param: 'text', type: 'string', req: '✓', desc: '評価するテキスト（5,000文字以内）' },
                { param: 'audience', type: 'object', req: '—', desc: 'オーディエンス情報（省略時はデフォルト）' },
                { param: 'conversionGoal', type: 'string', req: '—', desc: 'purchase / click / signup / visit / inquiry' },
              ].map((row, i) => (
                <tr key={i} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-2.5"><code className="text-xs font-mono text-stone-800">{row.param}</code></td>
                  <td className="px-4 py-2.5 text-xs text-stone-500">{row.type}</td>
                  <td className="px-4 py-2.5 text-xs text-emerald-600">{row.req}</td>
                  <td className="px-4 py-2.5 text-xs text-stone-600">{row.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <details className="bg-stone-50 border border-stone-200 rounded-xl overflow-hidden">
          <summary className="px-4 py-3 text-xs text-stone-600 cursor-pointer hover:text-stone-800 font-medium">
            audience オブジェクトの詳細
          </summary>
          <div className="px-4 pb-4 text-xs text-stone-600 space-y-1 font-mono">
            <p>totalRecipients: number     — 配信母数</p>
            <p>gender: {`{ female, male, other }`}    — 性別構成（各%）</p>
            <p>age: {`{ under20, twenties, thirties, forties, fifties, sixtiesPlus }`}</p>
            <p>attributes: {`{ deviceMobile, existingCustomer, avgOpenRate, avgCtr }`}</p>
          </div>
        </details>
      </section>

      {/* レスポンス例 */}
      <section className="space-y-3">
        <h2 className="font-semibold text-stone-800">レスポンス例</h2>
        <pre className="bg-stone-900 text-green-400 rounded-xl p-4 text-xs overflow-x-auto leading-relaxed">
          {RESPONSE_EXAMPLE}
        </pre>
      </section>

      {/* サンプルコード */}
      <section className="space-y-3">
        <h2 className="font-semibold text-stone-800">サンプルコード</h2>
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden">
          <div className="flex border-b border-stone-200">
            {(['curl', 'js', 'python'] as Tab[]).map(t => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-4 py-2.5 text-xs font-medium transition-colors ${
                  tab === t
                    ? 'bg-stone-900 text-white'
                    : 'text-stone-500 hover:text-stone-700 hover:bg-stone-50'
                }`}
              >
                {t === 'curl' ? 'curl' : t === 'js' ? 'JavaScript' : 'Python'}
              </button>
            ))}
          </div>
          <pre className="bg-stone-900 text-green-400 p-4 text-xs overflow-x-auto leading-relaxed">
            {codeMap[tab]}
          </pre>
        </div>
      </section>

      {/* エラーコード */}
      <section className="space-y-3">
        <h2 className="font-semibold text-stone-800">エラーコード</h2>
        <div className="bg-white border border-stone-200 rounded-xl overflow-hidden text-sm">
          <table className="w-full">
            <thead className="bg-stone-50 border-b border-stone-200">
              <tr>
                <th className="text-left px-4 py-2 text-xs font-medium text-stone-500">コード</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-stone-500">HTTP</th>
                <th className="text-left px-4 py-2 text-xs font-medium text-stone-500">説明</th>
              </tr>
            </thead>
            <tbody>
              {ERROR_CODES.map((e, i) => (
                <tr key={i} className="border-b border-stone-100 last:border-0">
                  <td className="px-4 py-2.5"><code className="text-xs font-mono text-red-700">{e.code}</code></td>
                  <td className="px-4 py-2.5 text-xs text-stone-500">{e.status}</td>
                  <td className="px-4 py-2.5 text-xs text-stone-600">{e.desc}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* レート制限 */}
      <section className="space-y-3">
        <h2 className="font-semibold text-stone-800">レート制限</h2>
        <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
          Team Proプランは <strong>1,000回/日</strong> の利用上限があります。
          上限超過時は HTTP 429 と <code className="bg-amber-100 px-1 rounded text-xs">RATE_LIMITED</code> エラーコードを返します。
          制限は日本時間の0:00にリセットされます。
        </div>
      </section>

      <div className="pb-4">
        <Link href="/team/settings/api" className="text-sm text-indigo-600 hover:underline">
          ← APIキー管理に戻る
        </Link>
      </div>
    </div>
  );
}
