import type { Metadata } from "next";
import Link from "next/link";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "tools24.jp のプライバシーポリシーです。",
  robots: { index: false, follow: false },
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "プライバシーポリシー" }]} />
      <h1 className="text-2xl font-bold mb-6">プライバシーポリシー</h1>
      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-sm">
        <p className="text-muted-foreground">最終更新日: 2026年2月</p>

        <section>
          <h2 className="text-lg font-semibold mb-2">1. サイト概要</h2>
          <p>
            tools24.jp（以下「当サイト」）は、無料のオンラインWebツールを提供するサービスです。
            当サイトのご利用に際して収集する情報の取り扱いについて説明します。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">2. 収集する情報</h2>
          <p>
            当サイトのツールは、入力されたデータを一切サーバーに送信しません。
            全ての処理はお使いのブラウザ内で完結します。
          </p>
          <p className="mt-2">
            ただし、以下の目的でアクセス情報を収集することがあります：
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>サイトの利用状況の分析（Google Analytics）</li>
            <li>広告の表示（Google AdSense、将来的に導入予定）</li>
          </ul>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">3. Cookieの使用</h2>
          <p>
            当サイトでは、以下の目的でCookieを使用する場合があります：
          </p>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>テーマ設定（ダークモード/ライトモード）の保存</li>
            <li>Google Analyticsによるアクセス解析</li>
            <li>Google AdSenseによる広告配信（将来的に導入予定）</li>
          </ul>
          <p className="mt-2">
            ブラウザの設定でCookieを無効にすることができますが、一部機能が正常に動作しない場合があります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">4. Google Analytics</h2>
          <p>
            当サイトはGoogle Analyticsを使用してアクセス状況を分析しています。
            Google Analyticsはトラフィックデータの収集のためにCookieを使用しています。
            このデータは匿名で収集されており、個人を特定するものではありません。
            Googleのプライバシーポリシーは
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              こちら
            </a>
            をご確認ください。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">5. 広告について</h2>
          <p>
            当サイトではGoogle AdSenseによる広告配信を予定しています。
            広告配信にあたり、Googleおよびそのパートナーは当サイトへのアクセス情報（Cookieなど）を使用することがあります。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">6. プライバシーポリシーの変更</h2>
          <p>
            当サイトは、必要に応じてプライバシーポリシーを変更することがあります。
            変更後のポリシーは本ページに掲載した時点で効力を生じるものとします。
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold mb-2">7. お問い合わせ</h2>
          <p>
            プライバシーポリシーに関するご質問は
            <Link href="/contact" className="text-primary hover:underline">
              お問い合わせページ
            </Link>
            からご連絡ください。
          </p>
        </section>
      </div>
    </div>
  );
}
