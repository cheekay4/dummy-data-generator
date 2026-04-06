import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/navigation";
import { Breadcrumb } from "@/components/layout/breadcrumb";

const baseUrl = "https://tools24.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const url = locale === "ja" ? `${baseUrl}/privacy` : `${baseUrl}/en/privacy`;

  return {
    title: t("privacy.title"),
    description: t("privacy.description"),
    robots: { index: false, follow: false },
    alternates: { canonical: url },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const isEn = locale === "en";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumb items={[{ label: tMeta("privacy.title") }]} />
      <h1 className="text-2xl font-bold mb-6">{tMeta("privacy.title")}</h1>

      {isEn && (
        <div className="mb-6 p-4 border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 rounded-lg text-sm">
          <p className="text-amber-800 dark:text-amber-200">
            This is an English reference translation. The legally binding version is the{" "}
            <Link href="/privacy" locale="ja" className="underline">
              Japanese original
            </Link>
            .
          </p>
        </div>
      )}

      <div className="prose prose-sm dark:prose-invert max-w-none space-y-6 text-sm">
        <p className="text-muted-foreground">
          {isEn ? "Last updated: February 2026" : "最終更新日: 2026年2月"}
        </p>

        {isEn ? (
          <>
            <section>
              <h2 className="text-lg font-semibold mb-2">1. About this site</h2>
              <p>
                tools24.jp provides free online web tools. This page explains how we handle
                information collected when you use our services.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">2. Data collected</h2>
              <p>
                Our tools do <strong>not</strong> send any input data to our servers.
                All processing happens entirely in your browser.
              </p>
              <p className="mt-2">We may collect access information for the following purposes:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Site usage analytics (Google Analytics 4)</li>
                <li>Advertising (Google AdSense, planned)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">3. External data transmission</h2>
              <p>The following third-party services receive data when you use this site:</p>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border px-3 py-2 text-left">Service</th>
                      <th className="border px-3 py-2 text-left">Data transmitted</th>
                      <th className="border px-3 py-2 text-left">Purpose</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-3 py-2">Google LLC (Analytics)</td>
                      <td className="border px-3 py-2">Cookie ID, browsing history, IP address</td>
                      <td className="border px-3 py-2">Access analytics</td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">Google LLC (AdSense)</td>
                      <td className="border px-3 py-2">Cookie ID, browsing history</td>
                      <td className="border px-3 py-2">Ad delivery</td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">Vercel Inc. (hosting)</td>
                      <td className="border px-3 py-2">Access logs, IP address</td>
                      <td className="border px-3 py-2">Site delivery</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              <p className="mt-2 text-muted-foreground">
                Data transferred to Vercel (US) and Google (US) is subject to their respective
                privacy policies and applicable international data transfer regulations.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Cookies</h2>
              <p>We may use cookies for:</p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>Saving your theme preference (dark/light mode)</li>
                <li>Google Analytics access tracking</li>
                <li>Google AdSense ad delivery (planned)</li>
              </ul>
              <p className="mt-2">You can disable cookies in your browser settings.</p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">5. Changes to this policy</h2>
              <p>
                We may update this policy at any time. Changes take effect when posted on this page.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">6. Contact</h2>
              <p>
                For privacy-related inquiries, please use the{" "}
                <Link href="/contact" className="text-primary hover:underline">
                  contact page
                </Link>
                .
              </p>
            </section>
          </>
        ) : (
          <>
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
              <h2 className="text-lg font-semibold mb-2">3. 外部送信について</h2>
              <p>当サイトご利用時に以下の外部サービスにデータが送信されます：</p>
              <div className="overflow-x-auto mt-3">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-muted/50">
                      <th className="border px-3 py-2 text-left">送信先</th>
                      <th className="border px-3 py-2 text-left">送信情報</th>
                      <th className="border px-3 py-2 text-left">利用目的</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border px-3 py-2">Google LLC (Analytics)</td>
                      <td className="border px-3 py-2">Cookie ID・閲覧履歴・IP</td>
                      <td className="border px-3 py-2">アクセス解析</td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">Google LLC (AdSense)</td>
                      <td className="border px-3 py-2">Cookie ID・閲覧履歴</td>
                      <td className="border px-3 py-2">広告配信</td>
                    </tr>
                    <tr>
                      <td className="border px-3 py-2">Vercel Inc.（ホスティング）</td>
                      <td className="border px-3 py-2">アクセスログ・IP</td>
                      <td className="border px-3 py-2">サイト配信</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">4. Cookieの使用</h2>
              <p>当サイトでは、以下の目的でCookieを使用する場合があります：</p>
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
              <h2 className="text-lg font-semibold mb-2">5. Google Analytics</h2>
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
              <h2 className="text-lg font-semibold mb-2">6. 広告について</h2>
              <p>
                当サイトではGoogle AdSenseによる広告配信を予定しています。
                広告配信にあたり、Googleおよびそのパートナーは当サイトへのアクセス情報（Cookieなど）を使用することがあります。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">7. プライバシーポリシーの変更</h2>
              <p>
                当サイトは、必要に応じてプライバシーポリシーを変更することがあります。
                変更後のポリシーは本ページに掲載した時点で効力を生じるものとします。
              </p>
            </section>

            <section>
              <h2 className="text-lg font-semibold mb-2">8. お問い合わせ</h2>
              <p>
                プライバシーポリシーに関するご質問は
                <Link href="/contact" className="text-primary hover:underline">
                  お問い合わせページ
                </Link>
                からご連絡ください。
              </p>
            </section>
          </>
        )}
      </div>
    </div>
  );
}
