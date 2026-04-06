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
import { checkSideJob, type SideJobType } from "@/lib/tax/side-job-checker";
import { AffiliateSuggestion } from "@/components/common/affiliate-suggestion";
import { saveTaxData, loadTaxData } from "@/lib/storage";

function fmt(n: number) {
  return n.toLocaleString("ja-JP");
}

const SIDE_JOB_TYPES: { value: SideJobType; label: string }[] = [
  { value: "freelance", label: "フリーランス・業務委託（雑所得 / 事業所得）" },
  { value: "part_time", label: "アルバイト・パート（給与所得）" },
  { value: "stock", label: "株式・投資信託の売却益（特定口座 源泉徴収あり）" },
  { value: "crypto", label: "仮想通貨の売却益（雑所得）" },
  { value: "real_estate", label: "不動産収入（不動産所得）" },
  { value: "retired", label: "年の途中で退職（年末調整を受けていない）" },
  { value: "other", label: "その他（雑所得）" },
];

export function SideJobNavigator() {
  const [salary, setSalary] = useState(0);
  const [sideJobType, setSideJobType] = useState<SideJobType>("freelance");
  const [sideJobRevenue, setSideJobRevenue] = useState(0);
  const [sideJobExpenses, setSideJobExpenses] = useState(0);
  const [sideJobWithholding, setSideJobWithholding] = useState(0);
  const [restored, setRestored] = useState(false);
  // 退職ケース用
  const [hasRetirementPay, setHasRetirementPay] = useState<"yes" | "no">("no");
  const [submittedRetirementForm, setSubmittedRetirementForm] = useState<"yes" | "no" | "unknown">("unknown");

  useEffect(() => {
    const data = loadTaxData();
    if (data.salary && data.salary > 0) {
      setSalary(data.salary);
      setRestored(true);
    }
  }, []);

  const result = useMemo(() => {
    if (salary === 0) return null;
    if (sideJobRevenue === 0 && sideJobType !== 'retired') return null;
    return checkSideJob({
      salary,
      sideJobType,
      sideJobRevenue,
      sideJobExpenses,
      sideJobWithholding,
    });
  }, [salary, sideJobType, sideJobRevenue, sideJobExpenses, sideJobWithholding]);

  useEffect(() => {
    if (result) {
      saveTaxData({
        sideJobIncome: result.sideJobIncome,
        needsFiling: result.needsFiling,
        sideJobRevenue,
        sideJobExpenses,
      });
    }
  }, [result, sideJobRevenue, sideJobExpenses]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* 入力フォーム */}
      <div className="lg:col-span-3 space-y-6">
        {/* 本業セクション */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">本業（会社員）</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput
              id="salary"
              label="給与収入（年収）"
              value={salary}
              onChange={setSalary}
              suffix="円"
              placeholder="例: 5,000,000"
              required
              description="本業の源泉徴収票の「支払金額」を入力"
            />
            {restored && (
              <p className="text-xs text-muted-foreground">前回の入力値を復元しました</p>
            )}
          </CardContent>
        </Card>

        {/* 副業セクション */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">副業</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="side-job-type">副業の種類</Label>
              <Select
                value={sideJobType}
                onValueChange={(v) => setSideJobType(v as SideJobType)}
              >
                <SelectTrigger id="side-job-type">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SIDE_JOB_TYPES.map((t) => (
                    <SelectItem key={t.value} value={t.value}>
                      {t.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <NumberInput
              id="side-job-revenue"
              label={sideJobType === "retired" ? "退職までの給与以外の収入" : "副業の年間収入（売上）"}
              value={sideJobRevenue}
              onChange={setSideJobRevenue}
              suffix="円"
              required
            />
            {sideJobType === "retired" && (
              <p className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 rounded p-2">
                年末調整を受けていない退職の場合、退職以外の収入が0円でも確定申告が必要です
              </p>
            )}

            {sideJobType !== "stock" && (
              <NumberInput
                id="side-job-expenses"
                label="副業の年間経費"
                value={sideJobExpenses}
                onChange={setSideJobExpenses}
                suffix="円"
                description="通信費、交通費、消耗品費、外注費など"
              />
            )}

            {sideJobType === "retired" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="retirement-pay">退職金の有無</Label>
                  <Select value={hasRetirementPay} onValueChange={(v) => setHasRetirementPay(v as "yes" | "no")}>
                    <SelectTrigger id="retirement-pay">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="no">なし</SelectItem>
                      <SelectItem value="yes">あり</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {hasRetirementPay === "yes" && (
                  <div className="space-y-2">
                    <Label htmlFor="retirement-form">退職所得の受給に関する申告書を提出しましたか</Label>
                    <Select value={submittedRetirementForm} onValueChange={(v) => setSubmittedRetirementForm(v as "yes" | "no" | "unknown")}>
                      <SelectTrigger id="retirement-form">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">はい</SelectItem>
                        <SelectItem value="no">いいえ</SelectItem>
                        <SelectItem value="unknown">わからない</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </>
            )}

            <NumberInput
              id="side-job-withholding"
              label="副業で源泉徴収されている金額"
              value={sideJobWithholding}
              onChange={setSideJobWithholding}
              suffix="円"
            />
          </CardContent>
        </Card>
      </div>

      {/* 判定結果 */}
      <div className="lg:col-span-2 space-y-6">
        {result ? (
          <>
            {/* メイン判定カード */}
            <Card
              className={
                result.needsFiling
                  ? "border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-950/30"
                  : "border-green-300 dark:border-green-700 bg-green-50 dark:bg-green-950/30"
              }
            >
              <CardContent className="pt-6">
                <p
                  className={`text-2xl font-bold ${
                    result.needsFiling
                      ? "text-red-600 dark:text-red-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {result.needsFiling
                    ? "確定申告が必要です"
                    : "確定申告は不要です（所得税）"}
                </p>
                <p className="text-sm mt-3 text-foreground">{result.reason}</p>
                <div className="mt-3 p-3 rounded-md bg-yellow-50 dark:bg-yellow-950/30 border border-yellow-200 dark:border-yellow-800">
                  <p className="text-xs text-yellow-800 dark:text-yellow-300">
                    ⚠ ただし、住民税の申告は金額に関わらず必要です
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* 内訳テーブル */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">計算内訳</CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {(sideJobType === "retired"
                  ? [
                      { label: "所得区分", value: result.incomeType },
                      { label: "申告理由", value: "年末調整を受けていない" },
                      ...(sideJobRevenue > 0
                        ? [{ label: "退職前の給与以外の収入", value: `${fmt(sideJobRevenue)}円`, bold: false }]
                        : []),
                    ]
                  : [
                      { label: "副業の収入", value: `${fmt(sideJobRevenue)}円` },
                      ...(sideJobType !== "stock"
                        ? [{ label: "副業の経費", value: `△${fmt(sideJobExpenses)}円` }]
                        : []),
                      {
                        label: "副業の所得",
                        value: `${fmt(result.sideJobIncome)}円`,
                        bold: true,
                      },
                      { label: "所得区分", value: result.incomeType },
                      {
                        label: "20万円ライン",
                        value:
                          result.sideJobIncome > 200_000
                            ? `超過（+${fmt(result.sideJobIncome - 200_000)}円）`
                            : `以内（残り${fmt(200_000 - result.sideJobIncome)}円）`,
                      },
                    ]
                ).map(({ label, value, bold }) => (
                  <div
                    key={label}
                    className={`flex justify-between py-2 border-b last:border-0 text-sm ${bold ? "font-semibold" : ""}`}
                  >
                    <span className="text-muted-foreground">{label}</span>
                    <span className="tabular-nums">{value}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* 追加税額 */}
            {result.sideJobIncome > 0 && result.needsFiling && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">追加で納める税金の目安</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 tabular-nums">
                    約{fmt(result.estimatedTax)}
                    <span className="text-base ml-1">円</span>
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    ※源泉徴収済み分を差し引いた概算です。実際の税額は所得控除等により異なります。
                  </p>
                </CardContent>
              </Card>
            )}

            {/* アドバイスセクション */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">アドバイス</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {result.tips.map((tip, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-md bg-muted text-sm leading-relaxed"
                  >
                    {tip}
                  </div>
                ))}
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
                  <Link href="/medical" className="text-primary hover:underline">
                    医療費控除の計算はこちら →
                  </Link>
                </p>
                <p>
                  <Link href="/etax-guide" className="text-primary hover:underline font-medium">
                    この結果を使ってe-Taxに入力する →
                  </Link>
                </p>
              </CardContent>
            </Card>
            <AffiliateSuggestion show={!!result && !!result.needsFiling} />
          </>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center text-muted-foreground text-sm py-12">
              副業の収入を入力すると、確定申告の要否を判定します
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
