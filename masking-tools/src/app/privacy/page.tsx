import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "プライバシーポリシー",
  description: "tools24.jp のプライバシーポリシー。Google Analytics、AdSense、Cookie使用に関する方針。",
};

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "プライバシーポリシー" }]} />
      <div className="max-w-2xl prose dark:prose-invert">
        <h1>プライバシーポリシー</h1>
        <p className="text-muted-foreground text-sm">改定日: 2026年2月</p>

        <h2>個人情報の取り扱い</h2>
        <p>当サイトでは、お問い合わせの際にメールアドレス等の個人情報をご提供いただく場合があります。取得した個人情報は、お問い合わせへの回答にのみ使用し、第三者への提供は行いません。</p>

        <h2>データの処理について</h2>
        <p>当サイトの計算ツールで入力されたデータは、すべてお使いのブラウザ内で処理されます。サーバーへの送信は一切行いません。一部のデータはブラウザのlocalStorageに保存されますが、外部に送信されることはありません。</p>

        <h2>広告について（Google AdSense）</h2>
        <p>当サイトでは、第三者配信の広告サービス「Google AdSense」を利用する予定です。Google AdSenseでは、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。Cookieの使用を望まない場合は、<a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">Google広告設定</a>から無効化できます。</p>

        <h2>アクセス解析（Google Analytics）</h2>
        <p>当サイトでは、Google Analyticsを利用する場合があります。データは匿名で収集されており、個人を特定するものではありません。詳細は<a href="https://policies.google.com/privacy?hl=ja" target="_blank" rel="noopener noreferrer">Googleのプライバシーポリシー</a>をご覧ください。</p>

        <h2>免責事項</h2>
        <p>当サイトの利用により生じたいかなる損害についても、当サイトは責任を負いかねます。</p>
      </div>
    </>
  );
}
