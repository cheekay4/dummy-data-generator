const faqs = [
  {
    q: "このツールは無料ですか？",
    a: "はい、完全無料です。会員登録も不要です。全ての機能を無料でご利用いただけます。",
  },
  {
    q: "データはサーバーに送信されますか？",
    a: "いいえ、全てブラウザ内で処理されます。入力したデータは外部に一切送信されません。機密性の高いJSONも安心してご利用いただけます。",
  },
  {
    q: "大きなJSONファイルも扱えますか？",
    a: "はい、ブラウザのメモリが許す限り対応します。ただし非常に大きなファイル（数十MB以上）では処理に時間がかかる場合があります。",
  },
  {
    q: "どのファイル形式でダウンロードできますか？",
    a: "整形・圧縮した結果は .json、CSV変換は .csv、YAML変換は .yaml、XML変換は .xml、TypeScript型生成は .ts 形式でダウンロードできます。",
  },
  {
    q: "JSONPathとは何ですか？",
    a: "JSONPathはJSON内の特定の要素を抽出するためのクエリ言語です。XPathのJSON版で、$ でルートを表し、$.name でプロパティ、$.items[0] で配列要素にアクセスできます。",
  },
];

export function Faq() {
  return (
    <section className="mt-12">
      <h2 className="text-xl font-semibold mb-6">よくある質問（FAQ）</h2>
      <div className="space-y-4">
        {faqs.map(({ q, a }, i) => (
          <details key={i} className="border rounded-lg group" open={i === 0}>
            <summary className="px-4 py-3 font-medium cursor-pointer list-none flex items-center justify-between gap-2 select-none">
              <span>Q. {q}</span>
              <svg
                className="w-4 h-4 shrink-0 transition-transform group-open:rotate-180"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </summary>
            <div className="px-4 pb-3 text-sm text-muted-foreground border-t pt-3">
              A. {a}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}
