"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { NumberInput } from "@/components/common/number-input";
import { calcLifeInsuranceDeduction } from "@/lib/tax/life-insurance-deduction";
import { saveTaxData } from "@/lib/storage";
import { AffiliateSuggestion } from "@/components/common/affiliate-suggestion";

function fmt(n: number) {
  return n.toLocaleString("ja-JP");
}

function SectionHeader({ title, note }: { title: string; note?: string }) {
  return (
    <div className="mb-3">
      <p className="text-sm font-semibold">{title}</p>
      {note && <p className="text-xs text-muted-foreground mt-0.5">{note}</p>}
    </div>
  );
}

export function LifeInsuranceCalculator() {
  const [generalNew, setGeneralNew] = useState(0);
  const [generalOld, setGeneralOld] = useState(0);
  const [medicalNew, setMedicalNew] = useState(0);
  const [pensionNew, setPensionNew] = useState(0);
  const [pensionOld, setPensionOld] = useState(0);

  const result = useMemo(() => {
    const total = generalNew + generalOld + medicalNew + pensionNew + pensionOld;
    if (total === 0) return null;
    return calcLifeInsuranceDeduction({
      generalNew,
      generalOld,
      medicalNew,
      pensionNew,
      pensionOld,
    });
  }, [generalNew, generalOld, medicalNew, pensionNew, pensionOld]);

  const totalPremium = generalNew + generalOld + medicalNew + pensionNew + pensionOld;

  useEffect(() => {
    if (result) {
      saveTaxData({ lifeInsuranceDeduction: result.total });
    }
  }, [result]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
      {/* 入力フォーム */}
      <div className="lg:col-span-3 space-y-6">
        <p className="text-sm text-muted-foreground">
          生命保険料控除は3つの区分に分かれています。保険会社から届く「控除証明書」の金額を入力してください。
        </p>

        {/* 一般生命保険料 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">一般生命保険料</CardTitle>
            <p className="text-xs text-muted-foreground">死亡保険、学資保険、養老保険など</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput
              id="general-new"
              label="新制度（2012年1月1日以降の契約）"
              value={generalNew}
              onChange={setGeneralNew}
              suffix="円"
              description="控除証明書に「新制度」と記載されているもの"
            />
            <NumberInput
              id="general-old"
              label="旧制度（2011年12月31日以前の契約）"
              value={generalOld}
              onChange={setGeneralOld}
              suffix="円"
              description="控除証明書に「旧制度」と記載されているもの"
            />
          </CardContent>
        </Card>

        {/* 介護医療保険料 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">介護医療保険料</CardTitle>
            <p className="text-xs text-muted-foreground">医療保険、がん保険、介護保険など（2012年以降の契約・新制度のみ）</p>
          </CardHeader>
          <CardContent>
            <NumberInput
              id="medical-new"
              label="年間保険料"
              value={medicalNew}
              onChange={setMedicalNew}
              suffix="円"
            />
          </CardContent>
        </Card>

        {/* 個人年金保険料 */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">個人年金保険料</CardTitle>
            <p className="text-xs text-muted-foreground">個人年金保険（税制適格特約付き）</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <NumberInput
              id="pension-new"
              label="新制度（2012年1月1日以降の契約）"
              value={pensionNew}
              onChange={setPensionNew}
              suffix="円"
            />
            <NumberInput
              id="pension-old"
              label="旧制度（2011年12月31日以前の契約）"
              value={pensionOld}
              onChange={setPensionOld}
              suffix="円"
            />
          </CardContent>
        </Card>

        {/* 新旧制度の解説テーブル */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">新制度・旧制度の違い</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-2"></th>
                    <th className="text-left py-2">新制度（2012年〜）</th>
                    <th className="text-left py-2">旧制度（〜2011年）</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b">
                    <td className="py-2 text-muted-foreground">区分</td>
                    <td className="py-2">一般・介護医療・個人年金の3区分</td>
                    <td className="py-2">一般・個人年金の2区分</td>
                  </tr>
                  <tr className="border-b">
                    <td className="py-2 text-muted-foreground">1区分の上限</td>
                    <td className="py-2">4万円</td>
                    <td className="py-2">5万円</td>
                  </tr>
                  <tr>
                    <td className="py-2 text-muted-foreground">合計上限</td>
                    <td className="py-2">12万円</td>
                    <td className="py-2">10万円</td>
                  </tr>
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
                <CardTitle className="text-base text-muted-foreground">
                  生命保険料控除額（合計）
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
                  {fmt(result.total)}
                  <span className="text-xl ml-1">円</span>
                </p>
                <p className="text-xs text-muted-foreground mt-2">
                  ※ 3区分合計の上限は12万円
                </p>
              </CardContent>
            </Card>

            {/* 内訳テーブル */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">区分別内訳</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b text-muted-foreground">
                        <th className="text-left py-2">区分</th>
                        <th className="text-right py-2">保険料</th>
                        <th className="text-right py-2">控除額</th>
                        <th className="text-right py-2">計算方法</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-b">
                        <td className="py-2">一般生命保険料</td>
                        <td className="py-2 text-right tabular-nums">{fmt(generalNew + generalOld)}円</td>
                        <td className="py-2 text-right tabular-nums font-mono">{fmt(result.general)}円</td>
                        <td className="py-2 text-right text-xs text-muted-foreground">{result.generalMethod}</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">介護医療保険料</td>
                        <td className="py-2 text-right tabular-nums">{fmt(medicalNew)}円</td>
                        <td className="py-2 text-right tabular-nums font-mono">{fmt(result.medical)}円</td>
                        <td className="py-2 text-right text-xs text-muted-foreground">新制度</td>
                      </tr>
                      <tr className="border-b">
                        <td className="py-2">個人年金保険料</td>
                        <td className="py-2 text-right tabular-nums">{fmt(pensionNew + pensionOld)}円</td>
                        <td className="py-2 text-right tabular-nums font-mono">{fmt(result.pension)}円</td>
                        <td className="py-2 text-right text-xs text-muted-foreground">{result.pensionMethod}</td>
                      </tr>
                      <tr className="font-semibold">
                        <td className="py-2">合計</td>
                        <td className="py-2 text-right tabular-nums">{fmt(totalPremium)}円</td>
                        <td className="py-2 text-right tabular-nums font-mono text-blue-600 dark:text-blue-400">
                          {fmt(result.total)}円
                        </td>
                        <td className="py-2 text-right text-xs text-muted-foreground">上限12万円</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            {/* 節税効果 */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base">節税効果の目安</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2 text-sm">
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">所得税率10%の場合</span>
                  <span className="font-semibold tabular-nums">
                    約{fmt(Math.floor(result.total * 0.1))}円の節税
                  </span>
                </div>
                <div className="flex justify-between py-1">
                  <span className="text-muted-foreground">所得税率20%の場合</span>
                  <span className="font-semibold tabular-nums">
                    約{fmt(Math.floor(result.total * 0.2))}円の節税
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">
                  ※ 住民税（税率10%）の軽減効果も別途あります
                </p>
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
                  <Link href="/furusato" className="text-primary hover:underline">
                    ふるさと納税の上限計算はこちら →
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
              保険料を入力すると、控除額が表示されます
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
