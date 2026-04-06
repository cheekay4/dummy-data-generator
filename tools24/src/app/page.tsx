import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { FAQSection } from "@/components/common/faq-section";
import { AdPlaceholder } from "@/components/common/ad-placeholder";
import { AffiliateTextLink } from "@/components/common/affiliate-text-link";
import { ToolSearchHub } from "@/components/home/tool-search-hub";

export const metadata: Metadata = {
  title: "tools24.jp — 登録不要・無料のオンラインツール集",
  description:
    "ブラウザだけで使える無料ツール集。確定申告・JSON整形・正規表現・画像圧縮・文字数カウント・ふりがな変換など30本以上のツールを提供。登録不要・データ送信なし。",
  keywords:
    "無料ツール, 確定申告, JSON整形, 正規表現, ダミーデータ, 画像圧縮, 文字数カウント, ふりがな変換",
  alternates: { canonical: "/" },
};

const faqs = [
  {
    question: "無料ツールは全て無料で使えますか？",
    answer:
      "はい、確定申告ツール・Webツール・開発者ツールは全て完全無料です。回数制限もありません。",
  },
  {
    question: "データはサーバーに送信されますか？",
    answer:
      "無料ツールは全てブラウザ内で処理が完結します。AIプロツール（敬語メール・契約書チェッカー）はAI処理のためサーバーと通信しますが、データは保存されません。",
  },
  {
    question: "スマートフォンでも使えますか？",
    answer:
      "はい、全ツールがスマートフォン・タブレット・PCに対応しています。",
  },
  {
    question: "確定申告ツールは年間を通して使えますか？",
    answer:
      "はい、確定申告期間（2〜3月）以外でも年間を通してご利用いただけます。ふるさと納税の上限確認や医療費の事前計算など、時期を問わず活用できます。",
  },
];

export default function HomePage(): React.JSX.Element {
  return (
    <>
      {/* Hero */}
      <section className="text-center pt-12 pb-8 px-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
          tools24.jp
        </h1>
        <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-[400px] mx-auto">
          基本登録不要・無料のオンラインツール集
        </p>
      </section>

      {/* Search + Tags + Grid (client component) */}
      <ToolSearchHub />

      {/* SEO Content — compact */}
      <section className="mt-16 prose dark:prose-invert max-w-none mb-12">
        <h2 className="text-lg font-bold text-foreground mb-3">tools24.jpとは</h2>
        <p className="text-sm text-muted-foreground leading-relaxed">
          tools24.jp は、ブラウザだけで使える日本語対応のオンラインツール集です。
          入力データがサーバーに送信されることはありません（AIプロツールを除く）。
          社内のセキュリティポリシーが厳しい環境でも安心して利用できます。
          JSON整形・画像圧縮・文字数カウントなどのWeb/開発ツールから、
          所得税シミュレーター・医療費控除など確定申告ツールまで幅広くカバーしています。
        </p>

        <h2 className="text-lg font-bold text-foreground mb-3 mt-8">お役立ちガイド</h2>
        <ul className="text-sm text-muted-foreground leading-relaxed space-y-1.5 list-disc list-inside">
          <li>
            <Link href="/guide/kakutei-beginners" className="text-primary hover:underline">
              【2026年版】確定申告の始め方 完全ガイド
            </Link>
          </li>
          <li>
            <Link href="/guide/csv-mojibake" className="text-primary hover:underline">
              ExcelのCSV文字化けを3秒で直す方法
            </Link>
          </li>
          <li>
            <Link href="/guide/webp-seo" className="text-primary hover:underline">
              WebP画像でサイト速度とSEOを改善する方法
            </Link>
          </li>
          <li>
            <Link href="/guide/json-api-debug" className="text-primary hover:underline">
              JSON整形でAPIデバッグを効率化する方法
            </Link>
          </li>
        </ul>
        <Link href="/guide" className="inline-flex items-center text-sm text-primary hover:underline mt-2">
          すべてのガイド記事を見る <ChevronRight className="h-4 w-4 ml-0.5" />
        </Link>
      </section>

      {/* FAQ Section */}
      <FAQSection faqs={faqs} />

      {/* Affiliate Promotion */}
      <AffiliateTextLink
        label="おすすめサービス"
        items={[
          { text: '確定申告を簡単に → freee会計（無料で始める）', clickUrl: 'https://px.a8.net/svt/ejp?a8mat=4AXEWG+32QO2I+3SPO+9FL80Y', impressionUrl: 'https://www17.a8.net/0.gif?a8mat=4AXEWG+32QO2I+3SPO+9FL80Y', badge: '人気' },
          { text: '高速レンタルサーバー → シンレンタルサーバー', clickUrl: 'https://af.moshimo.com/af/c/click?a_id=5440080&p_id=4942&pc_id=13183&pl_id=65061', impressionUrl: 'https://i.moshimo.com/af/i/impression?a_id=5440080&p_id=4942&pc_id=13183&pl_id=65061' },
          { text: '経理を丸投げ → ゼロ経理 月3,980円から', clickUrl: 'https://af.moshimo.com/af/c/click?a_id=5440078&p_id=6729&pc_id=19230&pl_id=85867', impressionUrl: 'https://i.moshimo.com/af/i/impression?a_id=5440078&p_id=6729&pc_id=19230&pl_id=85867' },
        ]}
      />

      {/* Ad Placeholder */}
      <AdPlaceholder position="content" className="mt-12" />
    </>
  );
}
