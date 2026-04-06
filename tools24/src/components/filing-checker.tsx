"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  checkFilingNeed,
  type EmploymentStatus,
  type FilingResult,
} from "@/lib/tax/filing-checker";

const EMPLOYMENT_OPTIONS: { value: EmploymentStatus; label: string }[] = [
  { value: "employee", label: "会社員・公務員（年末調整あり）" },
  { value: "part_time_adjusted", label: "パート・アルバイト（年末調整あり）" },
  { value: "part_time_no_adjust", label: "パート・アルバイト（年末調整なし）" },
  { value: "self_employed", label: "自営業・フリーランス" },
  { value: "pensioner", label: "年金受給者" },
  { value: "unemployed", label: "無職・その他" },
];

type ConditionOption = { id: string; label: string; note?: string };

const EMPLOYEE_CONDITIONS: ConditionOption[] = [
  { id: "side_job", label: "副業の所得（収入-経費）が20万円を超える" },
  { id: "high_income", label: "給与の年収が2,000万円を超える" },
  { id: "multi_employer", label: "2か所以上から給与をもらっている" },
  { id: "medical", label: "医療費が年間10万円を超えた", note: "※ 確定申告をする場合、ふるさと納税のワンストップ特例は無効になります。申告書でふるさと納税の寄附金控除も合わせて申告してください" },
  { id: "furusato_many", label: "ふるさと納税を6自治体以上にした" },
  { id: "furusato_no_onestop", label: "ふるさと納税のワンストップ特例を申請していない寄附がある" },
  { id: "housing_loan", label: "住宅ローン控除を初めて受ける（1年目）" },
  { id: "retired_no_adjust", label: "年の途中で退職し、年末調整を受けていない" },
  { id: "investment", label: "株式や仮想通貨の利益がある（特定口座の源泉徴収ありを除く）" },
  { id: "none", label: "上記のいずれにも当てはまらない" },
];

const PENSIONER_CONDITIONS: ConditionOption[] = [
  { id: "pension_high", label: "公的年金等の収入が400万円を超える" },
  {
    id: "pension_other",
    label: "年金以外の所得が20万円を超える",
    note: "※「所得」は収入から必要経費や給与所得控除を引いた後の金額です",
  },
  { id: "medical", label: "医療費が年間10万円を超えた" },
  { id: "none", label: "上記のいずれにも当てはまらない" },
];

const TOOL_LABELS: Record<string, string> = {
  "/income-tax": "所得税シミュレーター",
  "/medical": "医療費控除かんたん計算",
  "/furusato": "ふるさと納税 控除上限",
  "/side-job": "副業の確定申告ナビ",
  "/life-insurance": "生命保険料控除",
  "/checklist": "必要書類チェックリスト",
  "/housing-loan": "住宅ローン控除シミュレーター",
  "/furusato-tracker": "ふるさと納税 寄附管理",
  "/etax-guide": "e-Tax入力ガイド",
};

function showConditionStep(employment: EmploymentStatus): boolean {
  return (
    employment === "employee" ||
    employment === "part_time_adjusted" ||
    employment === "pensioner"
  );
}

export function FilingChecker() {
  const [employment, setEmployment] = useState<EmploymentStatus | null>(null);
  const [conditions, setConditions] = useState<string[]>([]);
  const [result, setResult] = useState<FilingResult | null>(null);

  const conditionOptions =
    employment === "pensioner" ? PENSIONER_CONDITIONS : EMPLOYEE_CONDITIONS;

  const toggleCondition = (id: string) => {
    if (id === "none") {
      setConditions(["none"]);
      return;
    }
    setConditions((prev) => {
      const without = prev.filter((c) => c !== "none");
      return without.includes(id)
        ? without.filter((c) => c !== id)
        : [...without, id];
    });
  };

  const handleCheck = () => {
    if (!employment) return;
    const mappedConditions = conditions.map((c) =>
      c === "furusato_many" || c === "furusato_no_onestop" ? "furusato" : c
    );
    const res = checkFilingNeed(employment, mappedConditions);
    setResult(res);
  };

  const handleReset = () => {
    setEmployment(null);
    setConditions([]);
    setResult(null);
  };

  const needsConditionStep = employment !== null && showConditionStep(employment);
  const canSubmit =
    employment !== null &&
    (!needsConditionStep || conditions.length > 0);

  return (
    <section className="mb-16">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            まず確認 — あなたは確定申告が必要ですか？
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            3問で判定します
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* 質問1 */}
          <div>
            <p className="text-sm font-semibold mb-3">
              質問1: あなたの状況に最も近いものは？
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {EMPLOYMENT_OPTIONS.map((opt) => (
                <label
                  key={opt.value}
                  className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors ${
                    employment === opt.value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/50"
                  }`}
                >
                  <input
                    type="radio"
                    name="employment"
                    value={opt.value}
                    checked={employment === opt.value}
                    onChange={() => {
                      setEmployment(opt.value);
                      setConditions([]);
                      setResult(null);
                    }}
                    className="accent-primary"
                  />
                  <span className="text-sm">{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* 質問2 */}
          {needsConditionStep && (
            <div>
              <p className="text-sm font-semibold mb-3">
                質問2: 以下に当てはまるものをすべて選んでください
              </p>
              <div className="space-y-2">
                {conditionOptions.map((opt) => (
                  <label
                    key={opt.id}
                    className={`flex items-center gap-2 p-3 rounded-md border cursor-pointer transition-colors ${
                      conditions.includes(opt.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={conditions.includes(opt.id)}
                      onChange={() => toggleCondition(opt.id)}
                      className="accent-primary"
                    />
                    <div>
                      <span className="text-sm">{opt.label}</span>
                      {opt.note && (
                        <p className="text-xs text-muted-foreground mt-0.5">{opt.note}</p>
                      )}
                    </div>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* 判定ボタン */}
          {!result && (
            <Button
              onClick={handleCheck}
              disabled={!canSubmit}
              className="w-full sm:w-auto"
            >
              判定する
            </Button>
          )}

          {/* 結果表示 */}
          {result && (
            <div className="space-y-4">
              <div
                className={`p-4 rounded-lg border-2 ${
                  result.status === "required"
                    ? "border-red-300 bg-red-50 dark:border-red-700 dark:bg-red-950/30"
                    : result.status === "recommended"
                    ? "border-yellow-300 bg-yellow-50 dark:border-yellow-700 dark:bg-yellow-950/30"
                    : "border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950/30"
                }`}
              >
                <p
                  className={`text-lg font-bold mb-2 ${
                    result.status === "required"
                      ? "text-red-600 dark:text-red-400"
                      : result.status === "recommended"
                      ? "text-yellow-700 dark:text-yellow-400"
                      : "text-green-600 dark:text-green-400"
                  }`}
                >
                  {result.status === "required" && "確定申告が必要です"}
                  {result.status === "recommended" && "確定申告をすると得になる可能性があります（還付申告）"}
                  {result.status === "not_required" && "確定申告は不要です（所得税）"}
                </p>

                {result.reasons.length > 0 && (
                  <ul className="list-disc list-inside space-y-1 text-sm mb-3">
                    {result.reasons.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                )}

                {result.tips.length > 0 && (
                  <ul className="space-y-1">
                    {result.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-muted-foreground">
                        ・{tip}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* おすすめツール */}
              {result.recommendedTools.length > 0 && (
                <div>
                  <p className="text-sm font-semibold mb-2">おすすめツール</p>
                  <div className="flex flex-wrap gap-2">
                    {result.recommendedTools.map((href) => (
                      <Link
                        key={href}
                        href={href}
                        className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                      >
                        {TOOL_LABELS[href] ?? href} →
                      </Link>
                    ))}
                    <Link
                      href="/checklist"
                      className="inline-flex items-center px-3 py-1.5 rounded-md bg-primary/10 text-primary text-sm hover:bg-primary/20 transition-colors"
                    >
                      必要書類チェックリスト →
                    </Link>
                  </div>
                </div>
              )}

              <Button variant="outline" size="sm" onClick={handleReset}>
                やり直す
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </section>
  );
}
