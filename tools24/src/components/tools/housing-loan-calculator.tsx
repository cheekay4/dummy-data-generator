"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { NumberInput } from "@/components/common/number-input";
import {
  calcHousingLoanDeduction,
  LIMIT_TABLE,
  type HousingType,
} from "@/lib/tax/housing-loan-deduction";
import { saveTaxData } from "@/lib/storage";
import { AffiliateSuggestion } from "@/components/common/affiliate-suggestion";

function fmt(n: number) {
  return n.toLocaleString("ja-JP");
}

const HOUSING_TYPE_OPTIONS: { value: HousingType; label: string }[] = [
  { value: "certified", label: "認定住宅（認定長期優良住宅・認定低炭素住宅）" },
  { value: "zeh", label: "ZEH水準省エネ住宅" },
  { value: "energy_efficient", label: "省エネ基準適合住宅" },
  { value: "general_new", label: "その他の新築（経過措置・2023年末までに建築確認済み）" },
  { value: "certified_used", label: "中古住宅（認定住宅等）" },
  { value: "general_used", label: "中古住宅（その他）" },
];

const MOVE_IN_YEARS = [2022, 2023, 2024, 2025, 2026];

export function HousingLoanCalculator() {
  const [moveInYear, setMoveInYear] = useState<number>(2024);
  const [housingType, setHousingType] = useState<HousingType>("certified");
  const [yearEndBalance, setYearEndBalance] = useState(0);
  const [controlYear, setControlYear] = useState(1);

  const result = useMemo(() => {
    if (yearEndBalance === 0) return null;
    return calcHousingLoanDeduction({ moveInYear, housingType, yearEndBalance, controlYear });
  }, [moveInYear, housingType, yearEndBalance, controlYear]);

  useEffect(() => {
    if (result) {
      saveTaxData({ housingLoanDeduction: result.deduction });
    }
  }, [result]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* 入力フォーム */}
      <div className="lg:col-span-3 space-y-6">
        {/* 住宅情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">住宅情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>入居年</Label>
              <Select
                value={String(moveInYear)}
                onValueChange={(v) => setMoveInYear(Number(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {MOVE_IN_YEARS.map((y) => (
                    <SelectItem key={y} value={String(y)}>
                      {y}年
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="housing-type">住宅の種類</Label>
              <Select
                value={housingType}
                onValueChange={(v) => setHousingType(v as HousingType)}
              >
                <SelectTrigger id="housing-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {HOUSING_TYPE_OPTIONS.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <NumberInput
              id="year-end-balance"
              label="住宅ローンの年末残高"
              value={yearEndBalance}
              onChange={setYearEndBalance}
              suffix="円"
              placeholder="例: 30,000,000"
              required
              description="金融機関から届く「年末残高等証明書」の金額を入力"
            />
          </CardContent>
        </Card>

        {/* 控除情報 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">控除情報</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput
              id="control-year"
              label="控除を受けるのは何年目か"
              value={controlYear}
              onChange={(v) => setControlYear(Math.max(1, Math.min(13, Math.round(v))))}
              suffix="年目"
              description="初めて受ける場合は1。1年目のみ確定申告が必要です（2年目以降は年末調整で可能）"
            />
          </CardContent>
        </Card>

        {/* 借入限度額一覧テーブル */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">借入限度額・控除期間 一覧</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b text-muted-foreground">
                    <th className="text-left py-2 pr-2">住宅の種類</th>
                    <th className="text-right py-2">2022〜2023年</th>
                    <th className="text-right py-2">2024〜2025年</th>
                  </tr>
                </thead>
                <tbody>
                  {LIMIT_TABLE.map((row) => (
                    <tr
                      key={row.housingType}
                      className={`border-b last:border-0 ${
                        row.housingType === housingType
                          ? "bg-blue-50 dark:bg-blue-950/30 font-semibold text-blue-600 dark:text-blue-400"
                          : ""
                      }`}
                    >
                      <td className="py-1.5 pr-2">{row.label}</td>
                      <td className="py-1.5 text-right tabular-nums">
                        {fmt(row.limit2022_2023 / 10000)}万円<br />
                        <span className="text-muted-foreground font-normal">（{row.period2022_2023}年）</span>
                      </td>
                      <td className="py-1.5 text-right tabular-nums">
                        {fmt(row.limit2024_2025 / 10000)}万円<br />
                        <span className="text-muted-foreground font-normal">（{row.period2024_2025}年）</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <p className="text-xs text-muted-foreground mt-2">控除率は一律0.7%</p>
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
                <CardTitle className="text-base text-muted-foreground">住宅ローン控除額</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {fmt(result.deduction)}
                  <span className="text-xl ml-1">円</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  控除期間: {result.controlPeriod}年中{controlYear}年目（残り{result.remainingYears}年）
                </p>
              </CardContent>
            </Card>

            {/* 内訳テーブル */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">計算内訳</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {[
                  { label: "年末残高", value: `${fmt(yearEndBalance)}円` },
                  { label: "借入限度額", value: `${fmt(result.borrowingLimit)}円` },
                  { label: "対象となる残高", value: `${fmt(result.applicableBalance)}円`, bold: true },
                  { label: "控除率", value: "0.7%" },
                  { label: "控除額", value: `${fmt(result.deduction)}円`, highlight: true },
                  { label: "控除期間", value: `${result.controlPeriod}年` },
                  { label: "残り控除年数", value: `${result.remainingYears}年` },
                ].map(({ label, value, bold, highlight }) => (
                  <div
                    key={label}
                    className={`flex justify-between py-2 border-b last:border-0 text-sm ${
                      highlight ? "text-blue-600 dark:text-blue-400 font-bold" : bold ? "font-semibold" : ""
                    }`}
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="tabular-nums">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {moveInYear >= 2024 && (
              <p className="text-xs text-muted-foreground">
                ※ 2024〜2026年入居は同じ借入限度額を適用しています。正確な値は国税庁にご確認ください。
              </p>
            )}

            {/* 初年度の注意 */}
            {result.isFirstYear && (
              <Card className="border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30">
                <CardContent className="pt-6 space-y-2">
                  <p className="text-sm font-bold text-red-600 dark:text-red-400">
                    ⚠ 1年目は確定申告が必要です
                  </p>
                  <p className="text-xs text-muted-foreground">
                    2年目以降は年末調整で控除を受けられます。
                  </p>
                  <p className="text-xs">
                    <Link href="/checklist" className="text-primary hover:underline">
                      必要書類を確認する →
                    </Link>
                  </p>
                </CardContent>
              </Card>
            )}

            {/* ふるさと納税への影響 */}
            <Card>
              <CardContent className="pt-6 space-y-2 text-sm">
                <p className="text-muted-foreground text-xs">
                  ⚠ 住宅ローン控除がある場合、ふるさと納税の控除上限額が下がる可能性があります。
                </p>
                <p>
                  <Link href="/furusato" className="text-primary hover:underline">
                    ふるさと納税の上限額を計算する →
                  </Link>
                </p>
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
              年末残高を入力すると、控除額が表示されます
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
