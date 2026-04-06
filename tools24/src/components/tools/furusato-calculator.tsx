"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { NumberInput } from "@/components/common/number-input";
import { calcFurusatoLimit, calcDependentDeduction } from "@/lib/tax/furusato-limit";
import { calcEmploymentIncome } from "@/lib/tax/income-tax";
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
}: {
  label: string;
  value: number | string;
  bold?: boolean;
  highlight?: boolean;
}) {
  const displayValue = typeof value === "number" ? `${fmt(value)}円` : value;
  return (
    <div
      className={`flex justify-between py-2 border-b border-border last:border-0 text-sm ${
        highlight ? "text-blue-600 dark:text-blue-400 font-bold text-base" : ""
      } ${bold ? "font-semibold" : ""}`}
    >
      <span>{label}</span>
      <span className="tabular-nums font-mono">{displayValue}</span>
    </div>
  );
}

// 年収別目安テーブルのデータを事前計算
function calcReferenceTable() {
  const rows = [];
  for (let salary = 3_000_000; salary <= 20_000_000; salary += 1_000_000) {
    const social = Math.floor(salary * 0.15);
    const { limit } = calcFurusatoLimit({
      salary,
      otherIncome: 0,
      socialInsurance: social,
      lifeInsurance: 0,
      earthquakeInsurance: 0,
      medicalDeduction: 0,
      housingLoanCredit: 0,
      spouseDeduction: 0,
      dependentDeduction: 0,
    });
    rows.push({ salary, limit });
  }
  return rows;
}

const REFERENCE_TABLE = calcReferenceTable();

export function FurusatoCalculator() {
  const [salary, setSalary] = useState(0);
  const [otherIncome, setOtherIncome] = useState(0);
  const [spouseDeductionType, setSpouseDeductionType] = useState<"none" | "spouse" | "special">("none");
  const [restoredSalary, setRestoredSalary] = useState(false);
  const [restoredMedical, setRestoredMedical] = useState(false);
  const [restoredLifeInsurance, setRestoredLifeInsurance] = useState(false);
  const [restoredHousingLoan, setRestoredHousingLoan] = useState(false);

  const [under16, setUnder16] = useState(0);
  const [age16to18, setAge16to18] = useState(0);
  const [age19to22, setAge19to22] = useState(0);
  const [age23to69, setAge23to69] = useState(0);
  const [age70plus, setAge70plus] = useState(0);

  const [socialInsurance, setSocialInsurance] = useState(0);
  const [socialInsuranceEdited, setSocialInsuranceEdited] = useState(false);
  const [lifeInsurance, setLifeInsurance] = useState(0);

  const [earthquakeInsurance, setEarthquakeInsurance] = useState(0);
  const [medicalDeduction, setMedicalDeduction] = useState(0);
  const [housingLoanCredit, setHousingLoanCredit] = useState(0);

  useEffect(() => {
    const data = loadTaxData();
    if (data.salary && data.salary > 0) {
      setSalary(data.salary);
      setRestoredSalary(true);
    }
    if (data.medicalDeduction && data.medicalDeduction > 0) {
      setMedicalDeduction(data.medicalDeduction);
      setRestoredMedical(true);
    }
    if (data.lifeInsuranceDeduction && data.lifeInsuranceDeduction > 0) {
      setLifeInsurance(data.lifeInsuranceDeduction);
      setRestoredLifeInsurance(true);
    }
    if (data.housingLoanDeduction && data.housingLoanDeduction > 0) {
      setHousingLoanCredit(data.housingLoanDeduction);
      setRestoredHousingLoan(true);
    }
  }, []);

  // 社会保険料が未編集なら年収×15%を自動推定
  const effectiveSocialInsurance = socialInsuranceEdited
    ? socialInsurance
    : Math.floor(salary * 0.15);

  const spouseDeductionAmount =
    spouseDeductionType === "none" ? 0 : 380_000;

  const dependentDeduction = calcDependentDeduction({
    under16,
    age16to18,
    age19to22,
    age23to69,
    age70plus,
  });

  const result = useMemo(() => {
    if (salary === 0) return null;
    return calcFurusatoLimit({
      salary,
      otherIncome,
      socialInsurance: effectiveSocialInsurance,
      lifeInsurance,
      earthquakeInsurance,
      medicalDeduction,
      housingLoanCredit,
      spouseDeduction: spouseDeductionAmount,
      dependentDeduction,
    });
  }, [
    salary, otherIncome, effectiveSocialInsurance, lifeInsurance,
    earthquakeInsurance, medicalDeduction, housingLoanCredit,
    spouseDeductionAmount, dependentDeduction,
  ]);

  useEffect(() => {
    if (result) {
      saveTaxData({ furusatoLimit: result.limit });
    }
  }, [result]);

  // 年収別テーブルのハイライト行
  const closestSalaryRow = salary > 0
    ? REFERENCE_TABLE.reduce((prev, curr) =>
        Math.abs(curr.salary - salary) < Math.abs(prev.salary - salary) ? curr : prev
      ).salary
    : null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* 入力フォーム */}
      <div className="lg:col-span-3 space-y-6">
        {/* 収入セクション */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">収入</CardTitle>
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
            />
            {restoredSalary && (
              <p className="text-xs text-muted-foreground">所得税シミュレーターの入力値を反映しました</p>
            )}
            <NumberInput
              id="other-income"
              label="副業・その他の所得"
              value={otherIncome}
              onChange={setOtherIncome}
              suffix="円"
            />
          </CardContent>
        </Card>

        {/* 家族構成セクション */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">家族構成</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="spouse">配偶者控除</Label>
              <Select
                value={spouseDeductionType}
                onValueChange={(v) =>
                  setSpouseDeductionType(v as "none" | "spouse" | "special")
                }
              >
                <SelectTrigger id="spouse">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">なし</SelectItem>
                  <SelectItem value="spouse">配偶者控除あり（38万円）</SelectItem>
                  <SelectItem value="special">配偶者特別控除あり（38万円）</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-1 gap-3">
              <p className="text-sm font-medium text-muted-foreground">扶養親族</p>
              {[
                { label: "16歳未満の子供", value: under16, onChange: setUnder16, note: "（控除額なし）" },
                { label: "16〜18歳（一般扶養）", value: age16to18, onChange: setAge16to18, note: "38万円/人" },
                { label: "19〜22歳（特定扶養）", value: age19to22, onChange: setAge19to22, note: "63万円/人" },
                { label: "23〜69歳（一般扶養）", value: age23to69, onChange: setAge23to69, note: "38万円/人" },
                { label: "70歳以上（老人扶養）", value: age70plus, onChange: setAge70plus, note: "48万円/人" },
              ].map(({ label, value, onChange, note }) => (
                <div key={label} className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm">{label} <span className="text-xs text-muted-foreground">{note}</span></p>
                  </div>
                  <Input
                    type="number"
                    min={0}
                    max={10}
                    value={value}
                    onChange={(e) => onChange(Math.max(0, Math.min(10, Number(e.target.value))))}
                    className="w-20 text-right"
                  />
                  <span className="text-sm text-muted-foreground w-4">人</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 追加控除（アコーディオン） */}
        <Card>
          <CardContent className="pt-6">
            <Accordion
              type="single"
              collapsible
              defaultValue={restoredMedical || restoredLifeInsurance || restoredHousingLoan ? "deductions" : undefined}
            >
              <AccordionItem value="deductions">
                <AccordionTrigger className="text-sm font-medium">
                  <span className="flex items-center gap-2">
                    詳細な控除を入力する（任意）
                    {(restoredMedical || restoredLifeInsurance || restoredHousingLoan) && (
                      <span className="text-xs text-muted-foreground font-normal leading-none">他のツールの結果を反映済み</span>
                    )}
                  </span>
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <NumberInput
                    id="social-insurance"
                    label="社会保険料控除"
                    value={socialInsuranceEdited ? socialInsurance : effectiveSocialInsurance}
                    onChange={(v) => {
                      setSocialInsurance(v);
                      setSocialInsuranceEdited(true);
                    }}
                    suffix="円"
                    description="不明な場合は年収の約15%が目安です"
                  />
                  <div>
                    <NumberInput
                      id="life-insurance"
                      label="生命保険料控除"
                      value={lifeInsurance}
                      onChange={setLifeInsurance}
                      suffix="円"
                    />
                    {restoredLifeInsurance && (
                      <p className="text-xs text-muted-foreground mt-1">生命保険料控除の計算結果を反映しました</p>
                    )}
                  </div>
                  <NumberInput
                    id="earthquake-insurance"
                    label="地震保険料控除"
                    value={earthquakeInsurance}
                    onChange={setEarthquakeInsurance}
                    suffix="円"
                  />
                  <div>
                    <NumberInput
                      id="medical-deduction"
                      label="医療費控除"
                      value={medicalDeduction}
                      onChange={setMedicalDeduction}
                      suffix="円"
                    />
                    {restoredMedical && (
                      <p className="text-xs text-muted-foreground mt-1">医療費控除の計算結果を反映しました</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      <Link href="/medical" className="text-primary hover:underline">
                        医療費控除を計算 →
                      </Link>
                    </p>
                  </div>
                  <div>
                    <NumberInput
                      id="housing-loan"
                      label="住宅ローン控除"
                      value={housingLoanCredit}
                      onChange={setHousingLoanCredit}
                      suffix="円"
                    />
                    {restoredHousingLoan && (
                      <p className="text-xs text-muted-foreground mt-1">住宅ローン控除シミュレーターの結果を反映しました</p>
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
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
                <CardTitle className="text-base text-muted-foreground">控除上限額（目安）</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {fmt(result.limit)}
                  <span className="text-xl ml-1">円</span>
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  この金額までの寄附なら自己負担が2,000円になります
                </p>
              </CardContent>
            </Card>

            {/* 内訳 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">計算内訳</CardTitle>
              </CardHeader>
              <CardContent>
                <BreakdownRow label="給与収入" value={salary} />
                <BreakdownRow
                  label="給与所得"
                  value={calcEmploymentIncome(salary)}
                  bold
                />
                <BreakdownRow
                  label="課税所得"
                  value={result.taxableIncome}
                />
                <BreakdownRow
                  label="適用所得税率"
                  value={`${Math.round(result.incomeTaxRate * 100)}%`}
                />
                <BreakdownRow
                  label="住民税所得割額（目安）"
                  value={result.residentTaxDeduction}
                />
                <BreakdownRow
                  label="控除上限額"
                  value={result.limit}
                  highlight
                />
              </CardContent>
            </Card>

            {/* 関連ツール */}
            <Card>
              <CardContent className="pt-6 space-y-2 text-sm">
                <p>
                  <Link href="/furusato-tracker" className="text-primary hover:underline">
                    寄附した金額を管理したい方はこちら →
                  </Link>
                </p>
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
            <AffiliateSuggestion show={!!result} />
          </>
        ) : (
          <Card className="border-dashed">
            <CardContent className="pt-6 text-center text-muted-foreground text-sm py-12">
              給与収入（年収）を入力すると、控除上限額が表示されます
            </CardContent>
          </Card>
        )}

        {/* 年収別目安テーブル */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">年収別の控除上限目安</CardTitle>
            <p className="text-xs text-muted-foreground">独身 / 社会保険料は年収の15%として試算</p>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2">年収</th>
                    <th className="text-right py-2">上限目安</th>
                  </tr>
                </thead>
                <tbody>
                  {REFERENCE_TABLE.map(({ salary: s, limit }) => (
                    <tr
                      key={s}
                      className={`border-b last:border-0 ${
                        s === closestSalaryRow
                          ? "bg-blue-50 dark:bg-blue-950/30 font-semibold text-blue-600 dark:text-blue-400"
                          : ""
                      }`}
                    >
                      <td className="py-1.5 tabular-nums">{fmt(s)}円</td>
                      <td className="py-1.5 tabular-nums text-right">{fmt(limit)}円</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
