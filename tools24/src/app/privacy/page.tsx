import type { Metadata } from "next";
import { Breadcrumb } from "@/components/common/breadcrumb";

export const metadata: Metadata = {
  title: "プライバシーポリシー | 確定申告かんたんツール集",
  description:
    "確定申告かんたんツール集のプライバシーポリシー。データの取り扱い、Cookie、広告に関する方針を記載しています。",
  alternates: { canonical: '/privacy' },
};

export default function PrivacyPage() {
  return (
    <>
      <Breadcrumb
        items={[
          { label: "ホーム", href: "/" },
          { label: "プライバシーポリシー" },
        ]}
      />

      <h1 className="text-2xl md:text-3xl font-bold mb-8">
        プライバシーポリシー
      </h1>

      <div className="prose dark:prose-invert max-w-none space-y-8">
        <p className="text-muted-foreground leading-relaxed">
          tools24.jp（以下「当サイト」）は、ユーザーの個人情報とプライバシーの保護に努めます。
        </p>

        <section>
          <h2 className="text-xl font-semibold">■ 個人情報の取り扱い</h2>
          <p className="text-muted-foreground leading-relaxed">
            当サイトでは、お問い合わせの際にメールアドレス等の個人情報をご提供いただく場合があります。
            取得した個人情報は、お問い合わせへの回答にのみ使用し、第三者への提供は行いません。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">■ データの処理について</h2>
          <p className="text-muted-foreground leading-relaxed">
            当サイトの計算ツール（所得税シミュレーター、医療費控除計算等）で入力されたデータは、
            すべてお使いのブラウザ内で処理されます。サーバーへの送信は一切行いません。
          </p>
          <p className="text-muted-foreground leading-relaxed mt-2">
            一部のデータはブラウザのlocalStorageに保存されますが、これはツール間のデータ連携と
            利便性向上のためであり、外部に送信されることはありません。
            localStorageのデータはブラウザの設定からいつでも削除できます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">■ 広告について</h2>
          <p className="text-muted-foreground leading-relaxed">
            当サイトでは、第三者配信の広告サービス「Google AdSense」を利用する予定です。
            Google AdSenseでは、ユーザーの興味に応じた広告を表示するためにCookieを使用することがあります。
            Cookieの使用を望まない場合は、ブラウザの設定または
            <a
              href="https://adssettings.google.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Google広告設定
            </a>
            から無効化できます。詳細は
            <a
              href="https://policies.google.com/technologies/ads?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Googleのポリシー
            </a>
            をご覧ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">■ アクセス解析について</h2>
          <p className="text-muted-foreground leading-relaxed">
            当サイトでは、サイトの利用状況を把握するためにGoogle Analyticsを利用する場合があります。
            Google Analyticsはデータ収集のためにCookieを使用します。
            データは匿名で収集されており、個人を特定するものではありません。
            詳細は
            <a
              href="https://policies.google.com/privacy?hl=ja"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Googleのプライバシーポリシー
            </a>
            をご覧ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">■ 免責事項</h2>
          <p className="text-muted-foreground leading-relaxed">
            当サイトの計算ツールは、税額や控除額の概算を提供するものであり、正確性を保証するものではありません。
            実際の税額は個別の状況により異なります。確定申告の際は、
            <a
              href="https://www.keisan.nta.go.jp/kyoutu/ky/sm/top"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              国税庁の確定申告書等作成コーナー
            </a>
            をご利用いただくか、税務署または税理士にご相談ください。
            当サイトの利用により生じたいかなる損害についても、当サイトは責任を負いかねます。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">■ 著作権</h2>
          <p className="text-muted-foreground leading-relaxed">
            当サイトのコンテンツ（テキスト、画像、プログラム等）の著作権は当サイト運営者に帰属します。
            無断での複製・転載はご遠慮ください。
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold">■ プライバシーポリシーの変更</h2>
          <p className="text-muted-foreground leading-relaxed">
            本ポリシーは予告なく変更される場合があります。変更後のポリシーは当ページに掲載した時点で効力を生じます。
          </p>
        </section>

        <div className="text-sm text-muted-foreground mt-8 space-y-1">
          <p>最終更新日: 2026年2月</p>
          <p>運営者: tools24.jp 運営者</p>
          <p>
            お問い合わせ:{" "}
            <a
              href="mailto:satoshi.yamada0808@gmail.com"
              className="text-primary hover:underline"
            >
              satoshi.yamada0808@gmail.com
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
