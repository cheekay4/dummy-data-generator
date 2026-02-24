import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";

export const metadata: Metadata = {
  title: "特定商取引法に基づく表記",
};

export default function TokushohoPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "特商法表記" }]} />
      <div className="max-w-2xl prose dark:prose-invert">
        <h1>特定商取引法に基づく表記</h1>
        <table className="text-sm">
          <tbody>
            {[
              ["販売業者", "個人運営（tools24.jp）"],
              ["運営責任者", "非公開（お問い合わせよりご連絡ください）"],
              ["所在地", "非公開（お問い合わせよりご連絡ください）"],
              ["電話番号", "お問い合わせフォームよりご連絡ください"],
              ["メールアドレス", "satoshi.yamada0808@gmail.com"],
              ["販売価格", "Proプラン: 月額190円（税込）"],
              ["支払方法", "クレジットカード（Stripe経由）"],
              ["支払時期", "月次自動課金"],
              ["提供時期", "お申し込み後即時"],
              ["返品・キャンセル", "月の途中でキャンセルした場合、その月末まで利用可能です。日割り返金は行いません。"],
            ].map(([label, value]) => (
              <tr key={label} className="border-b last:border-0">
                <td className="py-2 pr-4 font-medium whitespace-nowrap">{label}</td>
                <td className="py-2 text-muted-foreground">{value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
