import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
  description: "tools24.jp の特定商取引法に基づく表記です。",
  robots: { index: false, follow: false },
};

const items = [
  { label: "販売事業者", value: "[ここに名前を入れる]" },
  { label: "所在地", value: "[ここに住所を入れる]" },
  { label: "連絡先", value: "[ここにメールアドレスを入れる]" },
  { label: "販売価格", value: "各サービスページに記載" },
  {
    label: "支払い方法",
    value: "クレジットカード（Stripe経由）",
  },
  {
    label: "支払い時期",
    value: "月額サービスは申込時、都度払いは購入時",
  },
  {
    label: "返品・キャンセルについて",
    value:
      "月額サービスはいつでも解約可能です。解約月末日までサービスをご利用いただけます。デジタルコンテンツの性質上、購入後の返金には対応しておりません。",
  },
  {
    label: "サービスの提供時期",
    value: "申込・決済完了後、即時提供",
  },
  {
    label: "動作環境",
    value: "最新のモダンブラウザ（Chrome、Firefox、Safari、Edge）を推奨",
  },
];

export default function TokushohoPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Breadcrumb items={[{ label: "特定商取引法に基づく表記" }]} />
      <h1 className="text-2xl font-bold mb-2">特定商取引法に基づく表記</h1>
      <p className="text-sm text-muted-foreground mb-6">
        ※ プレースホルダーテキストです。実際の情報に差し替えてください。
      </p>

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
