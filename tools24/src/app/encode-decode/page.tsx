import type { Metadata } from 'next';
import { Breadcrumb } from '@/components/layout/breadcrumb';
import { EncodeDecodeToolkit } from '@/components/encode-decode/encode-decode-toolkit';
import { RelatedTools } from '@/components/common/related-tools';
import { AdPlaceholder } from '@/components/common/ad-placeholder';

export const metadata: Metadata = {
  title: 'エンコード・デコード ツールキット | Base64・URL・JWT・ハッシュ・Unicode変換',
  description:
    'Base64エンコード、URLエンコード、JWTデコード、MD5/SHAハッシュ生成、Unicode変換がブラウザだけで完結。日本語の文字コード処理にも完全対応。データはサーバーに送信されません。',
  keywords: [
    'base64 変換',
    'url エンコード',
    'jwt デコード',
    'ハッシュ 生成',
    'unicode 変換',
    'sha256',
    'md5',
    'base64 デコード',
    'urlエンコード 日本語',
  ],
  openGraph: {
    title:
      'エンコード・デコード ツールキット | Base64・URL・JWT・ハッシュ・Unicode変換 | tools24.jp',
    description:
      'Base64エンコード、URLエンコード、JWTデコード、MD5/SHAハッシュ生成、Unicode変換がブラウザで完結。',
    url: 'https://tools24.jp/encode-decode',
    type: 'website',
  },
  alternates: {
    canonical: 'https://tools24.jp/encode-decode',
  },
  other: {
    'application/ld+json': JSON.stringify([
      {
        '@context': 'https://schema.org',
        '@type': 'WebApplication',
        name: 'エンコード・デコード ツールキット',
        url: 'https://tools24.jp/encode-decode',
        description:
          'Base64・URLエンコード・JWTデコード・MD5/SHAハッシュ・Unicode変換をブラウザだけで実行。データはサーバーに送信されません。',
        applicationCategory: 'DeveloperApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: 'JPY' },
        inLanguage: 'ja',
      },
      {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: [
          {
            '@type': 'Question',
            name: 'Base64はデータの暗号化ですか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'いいえ。Base64はエンコード（変換）であり暗号化ではありません。誰でもデコードできます。機密データの保護には暗号化を使用してください。',
            },
          },
          {
            '@type': 'Question',
            name: 'MD5は安全ですか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'MD5は衝突耐性が破られているため、パスワードのハッシュや署名には推奨されません。ファイルのチェックサム用途なら問題ありません。セキュリティ用途にはSHA-256以上を使用してください。',
            },
          },
          {
            '@type': 'Question',
            name: 'JWTの署名を検証できますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'このツールではデコード（中身の確認）のみ可能です。署名の検証にはサーバーサイドで秘密鍵が必要です。',
            },
          },
          {
            '@type': 'Question',
            name: 'データはサーバーに送信されますか？',
            acceptedAnswer: {
              '@type': 'Answer',
              text: 'いいえ、全てブラウザ内で処理されます。入力したデータは外部に一切送信されません。',
            },
          },
        ],
      },
    ]),
  },
};

export default function EncodeDecodePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      {/* 広告: ヘッダー直下 */}
      <div className="flex justify-center mb-6">
        <AdPlaceholder slot="top-banner" width={728} height={90} />
      </div>

      {/* パンくずリスト */}
      <Breadcrumb items={[{ label: 'エンコード・デコード ツールキット' }]} />

      {/* ページタイトル */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold mb-1">エンコード・デコード ツールキット</h1>
        <p className="text-sm text-muted-foreground">
          Base64・URL・JWT・ハッシュ・Unicode変換をブラウザだけで
        </p>
      </div>

      {/* メイン機能 */}
      <EncodeDecodeToolkit />

      {/* 広告 */}
      <div className="flex justify-center my-8">
        <AdPlaceholder slot="mid-rect" width={300} height={250} />
      </div>

      {/* 関連ツール */}
      <RelatedTools currentPath="/encode-decode" />

      {/* SEOコンテンツ */}
      <section className="mt-12 space-y-8 text-sm text-muted-foreground">
        {/* エンコードとは */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-2">エンコードとは</h2>
          <p>
            エンコードとは、データを特定の規則に従って別の形式に変換することです。
            Web開発では、Base64（バイナリデータを安全にテキスト転送）、
            URLエンコード（日本語などをURLで安全に使う）、
            Unicodeエスケープ（文字コードを明示的に指定）が頻繁に使われます。
            <strong className="text-foreground">エンコードは暗号化ではありません</strong>—誰でも元のデータに戻せます。
          </p>
        </div>

        {/* 各ツールの使い方 */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-3">各ツールの使い方</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-muted/50">
                  <th className="px-3 py-2 border font-medium text-foreground w-32">ツール</th>
                  <th className="px-3 py-2 border font-medium text-foreground">主な用途</th>
                </tr>
              </thead>
              <tbody>
                {[
                  ['Base64', '画像のHTML/CSSへのインライン埋め込み、APIのBasic認証ヘッダー（Authorization: Basic ...）の作成、メール添付ファイルのエンコード'],
                  ['URLエンコード', '日本語を含むURLパラメータの安全な送信（クエリ文字列の値）、フォームデータの送信'],
                  ['JWTデコード', 'APIの認証トークンの中身確認・デバッグ、有効期限（exp）の確認、ペイロードに含まれる情報の確認'],
                  ['ハッシュ生成', 'ファイルの整合性チェック（ダウンロードファイルの検証）、パスワードのハッシュ値確認（既存システムの検証用）'],
                  ['Unicode変換', '文字コード問題のデバッグ、特殊文字・絵文字のコードポイント調査、HTMLエンティティの生成'],
                ].map(([tool, usage]) => (
                  <tr key={tool} className="border-b">
                    <td className="px-3 py-2 border font-medium text-foreground">{tool}</td>
                    <td className="px-3 py-2 border">{usage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            よくある質問（FAQ）
          </h2>
          <div className="space-y-3">
            {[
              {
                q: 'Base64はデータの暗号化ですか？',
                a: 'いいえ。Base64はエンコード（変換）であり暗号化ではありません。誰でもデコードできます。APIのBasic認証ヘッダーに使われますが、それはHTTPS通信の保護に依存しています。機密データの保護には適切な暗号化アルゴリズムを使用してください。',
              },
              {
                q: 'MD5は安全ですか？',
                a: 'MD5は衝突耐性が破られているため、パスワードのハッシュや電子署名には推奨されません。ただし、ファイルの偶発的な破損を検出するチェックサム用途（ダウンロードファイルの検証等）では依然として使用されています。セキュリティ用途にはSHA-256以上を使用してください。',
              },
              {
                q: 'JWTの署名を検証できますか？',
                a: 'このツールではデコード（中身の確認）のみ可能です。JWTの署名を検証するには秘密鍵が必要で、サーバーサイドで行う必要があります。このツールはJWTの内容（ヘッダー・ペイロード）の確認・デバッグ目的で使用してください。',
              },
              {
                q: 'encodeURIComponentとencodeURIの違いは？',
                a: 'encodeURIComponentはURLの「部品」をエンコードします（: / ? # & = などの特殊文字もエンコード）。クエリパラメータの値に使います。encodeURIはURL全体をエンコードしますが、URLの構造文字（/ ? & =など）はそのまま残します。URLの構造を保ちつつ日本語パスをエンコードしたい場合に使います。',
              },
              {
                q: 'データはサーバーに送信されますか？',
                a: 'いいえ、全てブラウザ内で処理されます。入力したテキスト・ファイルは外部に一切送信されません。JWTトークンなどの機密情報も安心して貼り付けてご利用いただけます。',
              },
            ].map(({ q, a }, i) => (
              <details key={i} className="border rounded-lg group" open={i === 0}>
                <summary className="px-4 py-3 font-medium cursor-pointer list-none flex items-center justify-between gap-2 select-none text-foreground">
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
                <div className="px-4 pb-3 border-t pt-3">A. {a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* 広告: フッター上 */}
      <div className="flex justify-center mt-12">
        <AdPlaceholder slot="footer-rect" width={336} height={280} />
      </div>
    </div>
  );
}
