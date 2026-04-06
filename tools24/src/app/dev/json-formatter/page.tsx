import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/common/breadcrumb';
import { FeatureTabs } from '@/components/json-formatter/feature-tabs';
import { Faq } from '@/components/json-formatter/faq';
import { AdPlaceholder } from '@/components/common/ad-placeholder';
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { affiliateDevTools } from "@/lib/affiliate-data";

export const metadata: Metadata = {
  title: 'JSON整形ツール - オンラインでJSON変換・バリデーション',
  description:
    '無料のオンラインJSON整形ツール。JSONの整形、圧縮、CSV/YAML/XML変換、バリデーション、TypeScript型生成、差分比較がブラウザだけで完結。データはサーバーに送信されません。',
  keywords: [
    'json 整形',
    'json フォーマッター',
    'json 変換',
    'json バリデーション',
    'json csv 変換',
    'json 圧縮',
  ],
  openGraph: {
    title: 'JSON整形ツール - オンラインでJSON変換・バリデーション | tools24.jp',
    description:
      '無料のオンラインJSON整形ツール。JSONの整形、圧縮、CSV/YAML/XML変換、バリデーション、TypeScript型生成、差分比較がブラウザだけで完結。データはサーバーに送信されません。',
    url: 'https://tools24.jp/dev/json-formatter',
    type: 'website',
  },
  alternates: {
    canonical: 'https://tools24.jp/dev/json-formatter',
  },
  other: {
    'application/ld+json': JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'JSON整形ツール',
      url: 'https://tools24.jp/dev/json-formatter',
      description:
        '無料のオンラインJSON整形ツール。JSONの整形、圧縮、CSV/YAML/XML変換、バリデーション、TypeScript型生成、差分比較がブラウザだけで完結。',
      applicationCategory: 'DeveloperApplication',
      operatingSystem: 'Any',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'JPY',
      },
      inLanguage: 'ja',
    }),
  },
};

export default function JsonFormatterPage(): React.JSX.Element {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 広告: ヘッダー直下 */}
      <AdPlaceholder position="header" />

      {/* パンくずリスト */}
      <Breadcrumb
        items={[
          { label: 'ホーム', href: '/' },
          { label: '開発者ツール', href: '/dev' },
          { label: 'JSON整形ツール' },
        ]}
      />

      {/* ページタイトル */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">JSON整形ツール</h1>
        <p className="text-sm text-muted-foreground">
          整形・圧縮・バリデーション・各種変換をブラウザで完結。データの送信なし。
        </p>
      </div>

      {/* メイン機能エリア */}
      <FeatureTabs />

      {/* 広告 */}
      <AdPlaceholder position="content" />

      {/* SEOコンテンツ */}
      <section className="mt-12 space-y-6 text-sm text-muted-foreground">
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">JSON整形ツールとは</h2>
          <p>
            JSON整形ツール（JSONフォーマッター）は、読みにくいJSON文字列を見やすく整形（インデント整理）したり、
            逆に空白を取り除いて1行に圧縮したりするためのオンラインツールです。
            APIレスポンスの確認、設定ファイルの編集、データ変換など、Webエンジニアの日常業務を効率化します。
          </p>
        </div>
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">使い方</h2>
          <ol className="list-decimal list-inside space-y-1">
            <li>左のテキストエリアにJSONを貼り付けるか、.jsonファイルをドラッグ&ドロップします</li>
            <li>上部のタブから実行する操作を選択します（整形・圧縮・変換など）</li>
            <li>右のエリアに結果が表示されます。「コピー」または「ダウンロード」で取り出せます</li>
          </ol>
        </div>
      </section>

      {/* 教育コンテンツ */}
      <section className="mt-16 prose dark:prose-invert max-w-none">
        <h2 className="text-xl font-bold text-foreground mb-4">JSONとは</h2>
        <p className="text-muted-foreground leading-relaxed">
          JSON（JavaScript Object Notation）は、2001年にDouglas Crockford氏によって仕様が整理された軽量なデータ交換フォーマットです。
          もともとJavaScriptのオブジェクトリテラル記法をベースにしていますが、言語に依存しない汎用フォーマットとして設計されており、
          Python、Java、Go、Ruby、PHPなどほぼ全てのプログラミング言語で標準的にサポートされています。
        </p>
        <p className="text-muted-foreground leading-relaxed mt-3">
          2013年にECMA-404として国際標準化され、2017年にはRFC 8259としてIETFでも標準化されました。
          現在ではREST APIのリクエスト・レスポンス形式として事実上の標準となっており、
          package.json（Node.js）、tsconfig.json（TypeScript）、settings.json（VS Code）など、設定ファイルとしても広く使われています。
          XMLと比較して記述量が少なく、人間にも機械にも読みやすいことが普及の大きな理由です。
        </p>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">JSON整形が必要な場面</h2>
        <p className="text-muted-foreground leading-relaxed">
          実務でJSON整形ツールが活躍する場面は非常に多岐にわたります。以下は代表的なユースケースです。
        </p>
        <ul className="text-muted-foreground leading-relaxed mt-3 space-y-2 list-disc list-inside">
          <li>
            <strong className="text-foreground">APIデバッグ</strong> — REST APIやGraphQLのレスポンスは通常、圧縮された1行のJSONで返されます。
            数百行に及ぶレスポンスを目視で確認するには、インデント付きの整形が不可欠です。
            本ツールではツリー構造を視覚的に確認しながら、特定のキーや値を素早く見つけられます。
          </li>
          <li>
            <strong className="text-foreground">設定ファイルの編集</strong> — package.json、docker-compose用のJSON設定、CI/CDパイプラインの定義ファイルなど、
            手動で編集する場面では構文エラーの検出が重要です。リアルタイムバリデーション機能で、編集中にエラー箇所を即座に特定できます。
          </li>
          <li>
            <strong className="text-foreground">データ変換・移行</strong> — CSVからJSONへの変換、JSONからYAMLへの変換など、
            異なるフォーマット間の変換作業を頻繁に行うエンジニアにとって、ワンクリックで変換できるツールは時間の節約になります。
          </li>
          <li>
            <strong className="text-foreground">TypeScript開発</strong> — APIレスポンスのJSONから TypeScript の型定義（interface / type）を自動生成する機能は、
            フロントエンド開発で型安全なコードを書く際に特に有用です。
          </li>
          <li>
            <strong className="text-foreground">差分比較</strong> — 2つのJSONを比較して差分を可視化する機能は、
            デプロイ前後の設定ファイルの変更確認や、APIレスポンスの回帰テストで重宝します。
          </li>
        </ul>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">よくあるJSONエラーと対処法</h2>
        <p className="text-muted-foreground leading-relaxed">
          JSONは厳格な構文規則を持っており、些細なミスでもパースエラーになります。以下は開発現場でよく遭遇するエラーと、その対処法です。
        </p>
        <div className="mt-4 space-y-4">
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">末尾カンマ（Trailing Comma）</h3>
            <p className="text-muted-foreground text-sm mt-1">
              JavaScriptでは配列やオブジェクトの最後の要素にカンマを付けても問題ありませんが、
              JSON仕様では末尾カンマは許可されていません。<code className="bg-muted px-1 rounded">{"[1, 2, 3,]"}</code>のような記述はエラーになります。
              本ツールのバリデーション機能で該当箇所を検出し、行番号付きで表示します。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">キーのクォート漏れ</h3>
            <p className="text-muted-foreground text-sm mt-1">
              JSONではオブジェクトのキーは必ずダブルクォーテーションで囲む必要があります。
              <code className="bg-muted px-1 rounded">{"{name: \"太郎\"}"}</code>ではなく、
              <code className="bg-muted px-1 rounded">{"{\"name\": \"太郎\"}"}</code>と記述します。
              JavaScriptのオブジェクトリテラルとの混同が原因です。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">シングルクォーテーションの使用</h3>
            <p className="text-muted-foreground text-sm mt-1">
              JSON仕様では文字列の囲みはダブルクォーテーションのみ有効です。
              Pythonの辞書をそのままJSONとして使おうとすると、シングルクォーテーションが原因でパースに失敗します。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">文字エンコーディングの問題</h3>
            <p className="text-muted-foreground text-sm mt-1">
              JSONはUTF-8でエンコードすることが推奨されています（RFC 8259）。
              Shift_JISやEUC-JPのファイルをそのまま読み込むと文字化けやパースエラーが発生します。
              テキストエディタでUTF-8に変換してからツールに貼り付けてください。
            </p>
          </div>
          <div className="bg-muted/50 rounded-lg p-4">
            <h3 className="font-semibold text-foreground text-sm">コメントの混入</h3>
            <p className="text-muted-foreground text-sm mt-1">
              JSON仕様ではコメントは一切サポートされていません。
              <code className="bg-muted px-1 rounded">{"// コメント"}</code>や<code className="bg-muted px-1 rounded">{"/* コメント */"}</code>を含めるとエラーになります。
              コメントが必要な設定ファイルにはJSON5やJSONCフォーマットの使用を検討してください。
            </p>
          </div>
        </div>

        <h2 className="text-xl font-bold text-foreground mb-4 mt-10">JSONとYAML・XML・CSVの比較</h2>
        <p className="text-muted-foreground leading-relaxed">
          データ交換や設定ファイルに使われるフォーマットにはそれぞれ特徴があります。用途に応じた使い分けが重要です。
        </p>
        <div className="overflow-x-auto mt-4">
          <table className="w-full text-sm text-muted-foreground border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-2 text-foreground">フォーマット</th>
                <th className="text-left p-2 text-foreground">特徴</th>
                <th className="text-left p-2 text-foreground">適した用途</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              <tr>
                <td className="p-2 font-medium text-foreground">JSON</td>
                <td className="p-2">軽量・パースが高速・ほぼ全言語で対応</td>
                <td className="p-2">API通信、設定ファイル、NoSQLデータベース</td>
              </tr>
              <tr>
                <td className="p-2 font-medium text-foreground">YAML</td>
                <td className="p-2">インデントベース・コメント可・可読性が高い</td>
                <td className="p-2">Docker Compose、Kubernetes、CI/CD設定</td>
              </tr>
              <tr>
                <td className="p-2 font-medium text-foreground">XML</td>
                <td className="p-2">スキーマ定義・名前空間・属性をサポート</td>
                <td className="p-2">SOAP API、SVG、Office文書、レガシーシステム連携</td>
              </tr>
              <tr>
                <td className="p-2 font-medium text-foreground">CSV</td>
                <td className="p-2">表形式データに最適・Excel互換・軽量</td>
                <td className="p-2">データ分析、帳票出力、DBインポート/エクスポート</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="text-muted-foreground leading-relaxed mt-4">
          ネストの深いデータ構造にはJSONやYAMLが適しており、フラットな表形式データにはCSVが最も効率的です。
          XMLは厳密なスキーマバリデーションが必要な場面や、既存システムとの互換性が求められる場合に選択されます。
          本ツールではJSON⇔YAML、JSON⇔XML、JSON⇔CSVの相互変換をワンクリックで実行できるため、
          プロジェクトの要件に応じたフォーマット変換を手軽に行えます。
        </p>
      </section>

      {/* FAQ */}
      <Faq />

      {/* 広告: フッター上 */}
      <AdPlaceholder position="sidebar" className="mt-12" />
      <AffiliateTextLink {...affiliateDevTools['/dev/json-formatter']} />
    </div>
  );
}
