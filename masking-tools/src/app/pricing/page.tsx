import type { Metadata } from "next";
import { Breadcrumb } from "@/components/layout/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { PricingActions } from "@/components/pricing/pricing-actions";

export const metadata: Metadata = {
  title: "料金プラン",
  description: "tools24.jp マスキングツールの料金プラン。Free（0円）とPro（月額190円）の比較。",
};

const PLAN_ROWS = [
  { feature: "マスキング回数", free: "10回/日", pro: "無制限" },
  { feature: "正規表現ベース検出", free: "✅", pro: "✅" },
  { feature: "AI高精度検出", free: "—", pro: "✅" },
  { feature: "伏字マスク（●●●）", free: "✅", pro: "✅" },
  { feature: "ハッシュ化", free: "✅", pro: "✅" },
  { feature: "固定値置換", free: "✅", pro: "✅" },
  { feature: "ダミーデータ置換", free: "—", pro: "✅" },
  { feature: "カスタムルール", free: "—", pro: "✅" },
  { feature: "一括処理", free: "—", pro: "✅" },
  { feature: "復元機能", free: "—", pro: "✅" },
  { feature: "履歴保存（30日）", free: "—", pro: "✅" },
  { feature: "全ページ広告なし", free: "—", pro: "✅" },
];

export default function PricingPage() {
  return (
    <>
      <Breadcrumb items={[{ label: "ホーム", href: "/" }, { label: "料金プラン" }]} />
      <div className="max-w-2xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">料金プラン</h1>
        <p className="text-muted-foreground mb-8">シンプルな料金体系。いつでも解約可能。</p>

        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/40">
                <th className="text-left py-3 px-4 font-medium">機能</th>
                <th className="text-center py-3 px-4 font-medium">
                  Free<br /><span className="text-muted-foreground font-normal text-xs">0円</span>
                </th>
                <th className="text-center py-3 px-4 font-medium">
                  <span className="flex items-center justify-center gap-1">Pro <Badge variant="secondary" className="text-xs">✨</Badge></span>
                  <span className="text-muted-foreground font-normal text-xs">月額190円</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {PLAN_ROWS.map((row) => (
                <tr key={row.feature} className="border-b last:border-0">
                  <td className="py-2.5 px-4 text-muted-foreground">{row.feature}</td>
                  <td className="py-2.5 px-4 text-center">{row.free}</td>
                  <td className="py-2.5 px-4 text-center text-green-600 dark:text-green-400 font-medium">{row.pro}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* クライアント側でPro状態を見てボタンを切り替え */}
        <PricingActions />

        <p className="text-xs text-muted-foreground mt-4 text-center">
          クレジットカード決済（Stripe）。いつでも解約可能。
          <a href="/tokushoho" className="underline ml-1">特定商取引法に基づく表記</a>
        </p>
      </div>
    </>
  );
}
