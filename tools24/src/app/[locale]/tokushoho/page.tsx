import { getTranslations } from "next-intl/server";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Link } from "@/i18n/navigation";

const baseUrl = "https://tools24.jp";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "meta" });
  const url = locale === "ja" ? `${baseUrl}/tokushoho` : `${baseUrl}/en/tokushoho`;

  return {
    title: t("tokushoho.title"),
    description: t("tokushoho.description"),
    robots: { index: false, follow: false },
    alternates: { canonical: url },
  };
}

const jaItems = [
  { label: "販売事業者", value: "[ここに名前を入れる]" },
  { label: "所在地", value: "[ここに住所を入れる]" },
  { label: "連絡先", value: "[ここにメールアドレスを入れる]" },
  { label: "販売価格", value: "各サービスページに記載" },
  { label: "支払い方法", value: "クレジットカード（Stripe経由）" },
  { label: "支払い時期", value: "月額サービスは申込時、都度払いは購入時" },
  {
    label: "返品・キャンセルについて",
    value:
      "月額サービスはいつでも解約可能です。解約月末日までサービスをご利用いただけます。デジタルコンテンツの性質上、購入後の返金には対応しておりません。",
  },
  { label: "サービスの提供時期", value: "申込・決済完了後、即時提供" },
  { label: "動作環境", value: "最新のモダンブラウザ（Chrome、Firefox、Safari、Edge）を推奨" },
];

const enItems = [
  { label: "Seller", value: "[Operator name]" },
  { label: "Address", value: "[Address]" },
  { label: "Contact", value: "[Email address]" },
  { label: "Pricing", value: "See each service page" },
  { label: "Payment method", value: "Credit card (via Stripe)" },
  { label: "Payment timing", value: "Monthly subscriptions: at signup. One-time purchases: at time of purchase." },
  {
    label: "Refunds / cancellations",
    value:
      "Monthly subscriptions can be cancelled at any time. Service continues until the end of the billing period. Due to the nature of digital content, refunds are not available after purchase.",
  },
  { label: "Service delivery", value: "Immediate upon payment confirmation" },
  { label: "System requirements", value: "Latest modern browsers (Chrome, Firefox, Safari, Edge)" },
];

export default async function TokushohoPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const tMeta = await getTranslations({ locale, namespace: "meta" });
  const isEn = locale === "en";
  const items = isEn ? enItems : jaItems;

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumb items={[{ label: tMeta("tokushoho.title") }]} />
      <h1 className="text-2xl font-bold mb-2">{tMeta("tokushoho.title")}</h1>

      {isEn && (
        <div className="mb-6 p-4 border border-amber-200 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/30 rounded-lg text-sm">
          <p className="text-amber-800 dark:text-amber-200">
            This is an English summary for reference only. The legally binding version is the{" "}
            <Link href="/tokushoho" locale="ja" className="underline">
              Japanese original
            </Link>{" "}
            as required under Japan&apos;s Act on Specified Commercial Transactions.
          </p>
        </div>
      )}

      {!isEn && (
        <p className="text-sm text-muted-foreground mb-6">
          ※ プレースホルダーテキストです。実際の情報に差し替えてください。
        </p>
      )}

      <div className="border rounded-lg overflow-hidden">
        {items.map(({ label, value }, i) => (
          <div
            key={i}
            className={`flex flex-col sm:flex-row ${i % 2 === 0 ? "bg-muted/30" : ""} ${
              i !== 0 ? "border-t" : ""
            }`}
          >
            <dt className="font-medium text-sm px-4 py-3 sm:w-48 shrink-0 text-muted-foreground">
              {label}
            </dt>
            <dd className="text-sm px-4 py-3 sm:border-l">{value}</dd>
          </div>
        ))}
      </div>
    </div>
  );
}
