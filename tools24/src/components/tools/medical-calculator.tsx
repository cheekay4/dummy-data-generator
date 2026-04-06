"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberInput } from "@/components/common/number-input";
import { calcMedicalDeduction } from "@/lib/tax/medical-deduction";
import { getIncomeTaxRate } from "@/lib/tax/income-tax";
import { saveTaxData, loadTaxData } from "@/lib/storage";
import { AffiliateSuggestion } from "@/components/common/affiliate-suggestion";

function fmt(n: number) {
  return n.toLocaleString("ja-JP");
}

function BreakdownRow({
  label,
  value,
  bold = false,
  highlight = false,
  indent = false,
}: {
  label: string;
  value: number | string;
  bold?: boolean;
  highlight?: boolean;
  indent?: boolean;
}) {
  const displayValue = typeof value === "number" ? `${fmt(value)}円` : value;
  return (
    <div
      className={`flex justify-between py-2 border-b border-border last:border-0 text-sm ${
        highlight ? "text-blue-600 dark:text-blue-400 font-bold text-base" : ""
      } ${bold ? "font-semibold" : ""} ${indent ? "pl-4 text-muted-foreground" : ""}`}
    >
      <span>{label}</span>
      <span className="tabular-nums font-mono">{displayValue}</span>
    </div>
  );
}

const COVERED_ITEMS = [
  { covered: true, item: "診察費・治療費" },
  { covered: true, item: "入院費（食事代含む）" },
  { covered: true, item: "処方薬代（薬局）" },
  { covered: true, item: "通院交通費（公共交通機関）" },
  { covered: true, item: "歯科治療（保険適用外含む）" },
  { covered: false, item: "美容整形" },
  { covered: false, item: "健康診断（異常なしの場合）" },
  { covered: false, item: "サプリメント・ビタミン剤" },
  { covered: false, item: "自家用車のガソリン代" },
];

export function MedicalCalculator() {
  const [totalMedical, setTotalMedical] = useState(0);
  const [insurance, setInsurance] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [restoredIncome, setRestoredIncome] = useState(false);

  useEffect(() => {
    const data = loadTaxData();
    const income = data.totalIncome ?? data.employmentIncome;
    if (income && income > 0) {
      setTotalIncome(income);
      setRestoredIncome(true);
    }
  }, []);

  const result = useMemo(() => {
    if (totalMedical === 0 || totalIncome === 0) return null;
    const { deduction, threshold, netExpense } = calcMedicalDeduction(
      totalMedical,
      insurance,
      totalIncome
    );
    const taxRate = getIncomeTaxRate(totalIncome);
    const refund = Math.floor(deduction * taxRate);
    return { deduction, threshold, netExpense, taxRate, refund };
  }, [totalMedical, insurance, totalIncome]);

  useEffect(() => {
    if (result && result.deduction >= 0) {
      saveTaxData({ medicalDeduction: result.deduction });
    }
  }, [result]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* 入力フォーム */}
      <div className="lg:col-span-3 space-y-6">
        {/* 医療費セクション */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">医療費</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput
              id="total-medical"
              label="年間の医療費合計"
              value={totalMedical}
              onChange={setTotalMedical}
              suffix="円"
              placeholder="例: 150,000"
              required
            />
            <NumberInput
              id="insurance"
              label="保険金等で補填された金額"
              value={insurance}
              onChange={setInsurance}
              suffix="円"
              description="生命保険の入院給付金、健康保険の高額療養費など"
            />
          </CardContent>
        </Card>

        {/* 所得セクション */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">所得</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput
              id="total-income"
              label="総所得金額"
              value={totalIncome}
              onChange={setTotalIncome}
              suffix="円"
              placeholder="例: 4,000,000"
              required
              description="給与所得・年金所得などの合計額（所得税シミュレーターの「合計所得」をご利用ください）"
            />
            {restoredIncome && (
              <p className="text-xs text-muted-foreground">所得税シミュレーターの結果を反映しました</p>
            )}
            <p className="text-sm">
              <Link
                href="/income-tax"
                className="text-primary hover:underline"
              >
                所得税シミュレーターで計算する →
              </Link>
            </p>
          </CardContent>
        </Card>

        {/* 対象・対象外テーブル */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">医療費控除の対象になるもの・ならないもの</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2 w-16">対象</th>
                    <th className="text-left py-2">項目</th>
                  </tr>
                </thead>
                <tbody>
                  {COVERED_ITEMS.map((row) => (
                    <tr key={row.item} className="border-b last:border-0">
                      <td className="py-2">
                        {row.covered ? (
                          <span className="text-green-600 dark:text-green-400 font-bold">○</span>
                        ) : (
                          <span className="text-red-500 dark:text-red-400 font-bold">×</span>
                        )}
                      </td>
                      <td className="py-2 text-muted-foreground">{row.item}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 計算結果 */}
      <div className="lg:col-span-2 space-y-6">
        {result ? (
          <>
            {/* メイン結果カード */}
            <Card className="border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-950/30">
              <CardHeader>
                <CardTitle className="text-base text-muted-foreground">医療費控除額</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {fmt(result.deduction)}
                  <span className="text-xl ml-1">円</span>
                </p>
                {result.deduction > 0 ? (
                  <p className="text-sm text-muted-foreground mt-2">
                    還付目安: 約{fmt(result.refund)}円
                    （税率{Math.round(result.taxRate * 100)}%で計算）
                  </p>
                ) : (
                  <p className="text-sm text-muted-foreground mt-2">
                    医療費が足切り額を超えていないため、控除額は0円です
                  </p>
                )}
              </CardContent>
            </Card>

            {/* 内訳 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">計算内訳</CardTitle>
              </CardHeader>
              <CardContent>
                <BreakdownRow label="年間医療費合計" value={totalMedical} />
                <BreakdownRow
                  label="保険金等で補填された金額"
                  value={insurance}
                  indent
                />
                <BreakdownRow label="実質負担額" value={result.netExpense} bold />
                <BreakdownRow
                  label={`足切り額（${totalIncome < 2_000_000 ? "総所得の5%" : "10万円"}）`}
                  value={result.threshold}
                />
                <BreakdownRow
                  label="医療費控除額"
                  value={result.deduction}
                  highlight
                />
              </CardContent>
            </Card>

            {/* 関連ツール */}
            <Card>
              <CardContent className="pt-6 space-y-2 text-sm">
                <p>
                  <Link href="/income-tax" className="text-primary hover:underline">
                    所得税の計算はこちら →
                  </Link>
                </p>
                <p>
                  <Link href="/etax-guide" className="text-primary hover:underline font-medium">
                    この結果を使ってe-Taxに入力する →
                  </Link>
                </p>
              </CardContent>
            </Card>
            <AffiliateSuggestion show={!!result} />
          </>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center text-muted-foreground text-sm py-12">
              医療費合計と総所得金額を入力すると、控除額が表示されます
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
