"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { AffiliateSuggestion } from "@/components/common/affiliate-suggestion";
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
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { NumberInput } from "@/components/common/number-input";
import { ResultCard } from "@/components/common/result-card";
import { calculateIncomeTax, type IncomeTaxInput } from "@/lib/tax/income-tax";
import { saveTaxData, loadTaxData } from "@/lib/storage";

const defaultInput: IncomeTaxInput = {
  salary: 0,
  sideIncome: 0,
  sideExpenses: 0,
  socialInsurance: 0,
  lifeInsurance: 0,
  earthquakeInsurance: 0,
  medicalDeduction: 0,
  furusatoDeduction: 0,
  spouseDeduction: "none",
  dependents: {
    general: 0,
    specific: 0,
    elderly: 0,
  },
  pensionIncome: 0,
  isOver65: false,
};

export function IncomeTaxCalculator() {
  const [input, setInput] = useState<IncomeTaxInput>(defaultInput);
  const [restoredSalary, setRestoredSalary] = useState(false);
  const [restoredSideJob, setRestoredSideJob] = useState(false);

  useEffect(() => {
    const data = loadTaxData();
    if (data.salary && data.salary > 0) {
      setInput((prev) => ({ ...prev, salary: data.salary! }));
      setRestoredSalary(true);
    }
    if (data.sideJobRevenue && data.sideJobRevenue > 0) {
      setInput((prev) => ({
        ...prev,
        sideIncome: data.sideJobRevenue!,
        sideExpenses: data.sideJobExpenses ?? 0,
      }));
      setRestoredSideJob(true);
    }
  }, []);

  const hasAnyIncome = input.salary > 0 || (input.pensionIncome ?? 0) > 0;
  const result = useMemo(
    () => (hasAnyIncome ? calculateIncomeTax(input) : null),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [input]
  );

  useEffect(() => {
    if (result && hasAnyIncome) {
      saveTaxData({
        salary: input.salary,
        employmentIncome: result.employmentIncome,
        totalIncome: result.totalIncome,
        incomeTax: result.totalTax,
        incomeTaxRate: result.taxRate,
        taxableIncome: result.taxableIncome,
      });
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [result]);

  const updateField = <K extends keyof IncomeTaxInput>(
    key: K,
    value: IncomeTaxInput[K]
  ) => {
    setInput((prev) => ({ ...prev, [key]: value }));
  };

  const updateDependents = (
    type: keyof IncomeTaxInput["dependents"],
    value: number
  ) => {
    setInput((prev) => ({
      ...prev,
      dependents: { ...prev.dependents, [type]: value },
    }));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* Input Form */}
      <div className="lg:col-span-3 space-y-6">
        {/* Revenue Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">収入</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput
              id="salary"
              label="給与収入（年収）"
              value={input.salary}
              onChange={(v) => updateField("salary", v)}
              suffix="円"
              placeholder="例: 5,000,000"
              min={0}
            />
            {restoredSalary && !restoredSideJob && (
              <p className="text-xs text-muted-foreground">給与収入を復元しました</p>
            )}
            {restoredSalary && restoredSideJob && (
              <p className="text-xs text-muted-foreground">給与収入・副業収入を復元しました</p>
            )}
            {!restoredSalary && restoredSideJob && (
              <p className="text-xs text-muted-foreground">副業収入を復元しました</p>
            )}
            <NumberInput
              id="sideIncome"
              label="副業・その他の収入"
              value={input.sideIncome}
              onChange={(v) => updateField("sideIncome", v)}
              suffix="円"
              min={0}
            />
            <NumberInput
              id="sideExpenses"
              label="副業の経費"
              value={input.sideExpenses}
              onChange={(v) => updateField("sideExpenses", v)}
              suffix="円"
              min={0}
            />

            {/* 年金収入 */}
            <Accordion type="single" collapsible>
              <AccordionItem value="pension">
                <AccordionTrigger className="text-sm font-medium text-primary">
                  年金収入・公的年金のある方はこちらを展開 ▼
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <NumberInput
                    id="pensionIncome"
                    label="公的年金等の収入"
                    value={input.pensionIncome ?? 0}
                    onChange={(v) => updateField("pensionIncome", v)}
                    suffix="円"
                    min={0}
                  />
                  <div className="space-y-1.5">
                    <Label htmlFor="isOver65" className="text-sm font-medium">
                      年齢区分
                    </Label>
                    <Select
                      value={input.isOver65 ? "over65" : "under65"}
                      onValueChange={(v) => updateField("isOver65", v === "over65")}
                    >
                      <SelectTrigger id="isOver65">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="under65">65歳未満</SelectItem>
                        <SelectItem value="over65">65歳以上</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>

        {/* Deductions Section */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">控除</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput
              id="socialInsurance"
              label="社会保険料控除"
              value={input.socialInsurance}
              onChange={(v) => updateField("socialInsurance", v)}
              suffix="円"
              placeholder="源泉徴収票の『社会保険料等の金額』"
              min={0}
            />

            <Accordion type="single" collapsible>
              <AccordionItem value="more-deductions">
                <AccordionTrigger className="text-sm">
                  その他の控除を入力
                </AccordionTrigger>
                <AccordionContent className="space-y-4 pt-4">
                  <NumberInput
                    id="lifeInsurance"
                    label="生命保険料控除"
                    value={input.lifeInsurance}
                    onChange={(v) => updateField("lifeInsurance", v)}
                    suffix="円"
                    max={120_000}
                    min={0}
                  />
                  <NumberInput
                    id="earthquakeInsurance"
                    label="地震保険料控除"
                    value={input.earthquakeInsurance}
                    onChange={(v) => updateField("earthquakeInsurance", v)}
                    suffix="円"
                    max={50_000}
                    min={0}
                  />
                  <div>
                    <NumberInput
                      id="medicalDeduction"
                      label="医療費控除"
                      value={input.medicalDeduction}
                      onChange={(v) => updateField("medicalDeduction", v)}
                      suffix="円"
                      min={0}
                    />
                    <Link
                      href="/medical"
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      医療費控除計算ツールで計算 →
                    </Link>
                  </div>
                  <div>
                    <NumberInput
                      id="furusatoDeduction"
                      label="ふるさと納税（寄附金額）"
                      value={input.furusatoDeduction}
                      onChange={(v) => updateField("furusatoDeduction", v)}
                      suffix="円"
                      min={0}
                    />
                    <Link
                      href="/furusato"
                      className="text-xs text-primary hover:underline mt-1 inline-block"
                    >
                      控除上限額を計算 →
                    </Link>
                  </div>

                  {/* Spouse Deduction */}
                  <div className="space-y-1.5">
                    <Label htmlFor="spouseDeduction" className="text-sm font-medium">
                      配偶者控除
                    </Label>
                    <Select
                      value={input.spouseDeduction}
                      onValueChange={(v) =>
                        updateField(
                          "spouseDeduction",
                          v as IncomeTaxInput["spouseDeduction"]
                        )
                      }
                    >
                      <SelectTrigger id="spouseDeduction">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">なし</SelectItem>
                        <SelectItem value="spouse">
                          配偶者控除（38万円）
                        </SelectItem>
                        <SelectItem value="special">
                          配偶者特別控除
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Dependents */}
                  <div className="space-y-3">
                    <Label className="text-sm font-medium">扶養控除</Label>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <NumberInput
                        id="dependentsGeneral"
                        label="一般（38万円）"
                        value={input.dependents.general}
                        onChange={(v) => updateDependents("general", v)}
                        suffix="人"
                        min={0}
                        max={10}
                      />
                      <NumberInput
                        id="dependentsSpecific"
                        label="特定（63万円）"
                        value={input.dependents.specific}
                        onChange={(v) => updateDependents("specific", v)}
                        suffix="人"
                        min={0}
                        max={10}
                      />
                      <NumberInput
                        id="dependentsElderly"
                        label="老人（48万円）"
                        value={input.dependents.elderly}
                        onChange={(v) => updateDependents("elderly", v)}
                        suffix="人"
                        min={0}
                        max={10}
                      />
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </div>

      {/* Results */}
      <div className="lg:col-span-2 space-y-6">
        {!hasAnyIncome && (
          <p className="text-sm text-muted-foreground border rounded-md p-3">
            給与収入または年金収入のいずれかを入力してください
          </p>
        )}
        {result && (
        <ResultCard
          title="所得税額（復興特別所得税含む）"
          value={result.totalTax}
          description={`適用税率: ${(result.taxRate * 100).toFixed(0)}%`}
          variant="neutral"
        />
        )}

        {result && (<Card>
          <CardHeader>
            <CardTitle className="text-lg">計算内訳</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <BreakdownRow
              label="給与収入"
              value={result.salaryRevenue}
            />
            <BreakdownRow
              label="給与所得控除"
              value={-result.employmentDeduction}
            />
            <Separator />
            <BreakdownRow
              label="給与所得"
              value={result.employmentIncome}
              bold
            />
            {result.sideIncome > 0 && (
              <BreakdownRow
                label="副業所得（収入 - 経費）"
                value={result.sideIncome}
              />
            )}
            {result.pensionIncome > 0 && (
              <>
                <BreakdownRow
                  label="年金収入"
                  value={result.pensionIncome}
                />
                <BreakdownRow
                  label="公的年金等控除"
                  value={-result.pensionDeduction}
                />
                <BreakdownRow
                  label="年金所得"
                  value={result.pensionIncomeNet}
                />
              </>
            )}
            <BreakdownRow
              label="合計所得"
              value={result.totalIncome}
              bold
            />
            <Separator />

            {/* Deduction Breakdown */}
            <Accordion type="single" collapsible>
              <AccordionItem value="deduction-detail" className="border-none">
                <AccordionTrigger className="py-1 text-sm hover:no-underline">
                  <BreakdownRow
                    label="所得控除合計"
                    value={-result.totalDeductions}
                    bold
                    inline
                  />
                </AccordionTrigger>
                <AccordionContent className="pb-2">
                  <div className="pl-4 space-y-1">
                    {result.deductionBreakdown.map((d, i) => (
                      <BreakdownRow
                        key={i}
                        label={d.label}
                        value={d.amount}
                        small
                      />
                    ))}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            <Separator />
            <BreakdownRow
              label="課税所得"
              value={result.taxableIncome}
              bold
            />
            <Separator />
            <BreakdownRow label="所得税額" value={result.incomeTax} />
            <BreakdownRow
              label="復興特別所得税"
              value={result.reconstructionTax}
            />
            <Separator />
            <BreakdownRow
              label="合計税額"
              value={result.totalTax}
              bold
              highlight
            />
          </CardContent>
        </Card>)}

        {result && (
        <Button asChild className="w-full" variant="outline">
          <a
            href="https://www.keisan.nta.go.jp/kyoutu/ky/sm/top"
            target="_blank"
            rel="noopener noreferrer"
          >
            この結果を使って確定申告を進める
            <ExternalLink className="h-4 w-4 ml-2" />
          </a>
        </Button>
        )}
        {result && (
        <Button asChild className="w-full" variant="secondary">
          <Link href="/etax-guide">
            この結果を使ってe-Taxに入力する →
          </Link>
        </Button>
        )}
        <AffiliateSuggestion show={!!result} />
      </div>
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  bold,
  highlight,
  small,
  inline,
}: {
  label: string;
  value: number;
  bold?: boolean;
  highlight?: boolean;
  small?: boolean;
  inline?: boolean;
}) {
  const textSize = small ? "text-xs" : "text-sm";
  const fontWeight = bold ? "font-semibold" : "font-normal";
  const color = highlight
    ? "text-blue-700 dark:text-blue-400"
    : "text-foreground";

  return (
    <div className={`flex justify-between items-center ${inline ? "w-full" : `py-1 ${textSize}`}`}>
      <span className={`${fontWeight} ${textSize} text-muted-foreground`}>
        {label}
      </span>
      <span className={`${fontWeight} ${textSize} ${color} tabular-nums`}>
        {value < 0 ? `△ ${Math.abs(value).toLocaleString()}` : value.toLocaleString()}円
      </span>
    </div>
  );
}
