"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ExternalLink, Printer, Calculator, Heart, Gift, Briefcase, Shield, Home, ChevronDown, ChevronUp, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { loadTaxData, loadFurusatoDonations, type TaxData, type FurusatoDonation } from "@/lib/storage";

const fmt = (n: number) => n.toLocaleString();

function SummaryCard({
  icon: Icon,
  title,
  href,
  hasData,
  children,
}: {
  icon: React.ElementType;
  title: string;
  href: string;
  hasData: boolean;
  children?: React.ReactNode;
}) {
  return (
    <Card className={`h-full ${!hasData ? "opacity-60" : ""}`}>
      <CardHeader className="pb-2">
        <div className="flex items-center gap-2">
          <Icon className="h-5 w-5 text-primary shrink-0" />
          <CardTitle className="text-base">{title}</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {hasData ? (
          <>
            <div className="text-sm space-y-1">{children}</div>
            <Link href={href} className="text-xs text-primary hover:underline block">
              再計算 →
            </Link>
          </>
        ) : (
          <>
            <p className="text-xs text-muted-foreground">まだ計算していません。</p>
            <Link href={href} className="text-xs text-primary hover:underline block">
              計算する →
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function StepCard({
  step,
  title,
  children,
}: {
  step: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border rounded-lg p-4 space-y-3">
      <div className="flex items-center gap-3">
        <span className="bg-primary text-primary-foreground text-sm font-bold rounded-full w-8 h-8 flex items-center justify-center shrink-0">
          {step}
        </span>
        <h3 className="font-semibold text-base">{title}</h3>
      </div>
      <div className="pl-11 space-y-3">{children}</div>
    </div>
  );
}

function GuideTable({ rows }: { rows: { col1: string; col2: string; col3: string }[] }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm border-collapse">
        <thead>
          <tr className="bg-muted">
            <th className="border px-3 py-2 text-left font-medium">e-Taxの入力欄</th>
            <th className="border px-3 py-2 text-left font-medium">入力する値</th>
            <th className="border px-3 py-2 text-left font-medium">参照元</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="even:bg-muted/30">
              <td className="border px-3 py-2">{row.col1}</td>
              <td className="border px-3 py-2 font-mono">{row.col2}</td>
              <td className="border px-3 py-2 text-muted-foreground text-xs">{row.col3}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function PrintMemo({ data, donations }: { data: TaxData; donations: FurusatoDonation[] }) {
  const today = new Date().toLocaleDateString("ja-JP", { year: "numeric", month: "long", day: "numeric" });

  return (
    <div className="print-memo space-y-4 text-sm">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-bold">e-Tax転記メモ</h2>
        <span className="text-muted-foreground text-xs">{today}</span>
      </div>
      <p className="text-xs text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950 border border-amber-200 dark:border-amber-800 rounded p-2">
        ※ この数字はツールの概算値です。源泉徴収票や各種証明書の原本の値を優先してください。
      </p>
      <Separator />
      {data.salary != null && data.salary > 0 && (
        <div>
          <p className="font-semibold">給与収入（参考）</p>
          <p>・給与収入: {fmt(data.salary)}円</p>
          {data.employmentIncome != null && <p>・給与所得: {fmt(data.employmentIncome)}円</p>}
        </div>
      )}
      {data.pensionIncome != null && data.pensionIncome > 0 && (
        <div>
          <p className="font-semibold">年金収入（参考）</p>
          <p>・年金収入: {fmt(data.pensionIncome)}円</p>
        </div>
      )}
      {data.incomeTax != null && data.incomeTax > 0 && (
        <div>
          <p className="font-semibold">所得税額（概算）</p>
          <p>・所得税額: {fmt(data.incomeTax)}円（復興特別所得税含む）</p>
          {data.taxableIncome != null && <p>・課税所得: {fmt(data.taxableIncome)}円</p>}
        </div>
      )}
      {data.medicalDeduction != null && data.medicalDeduction > 0 && (
        <div>
          <p className="font-semibold">医療費控除（概算）</p>
          <p>・控除額: {fmt(data.medicalDeduction)}円</p>
        </div>
      )}
      {data.lifeInsuranceDeduction != null && data.lifeInsuranceDeduction > 0 && (
        <div>
          <p className="font-semibold">生命保険料控除</p>
          <p>・控除額: {fmt(data.lifeInsuranceDeduction)}円</p>
        </div>
      )}
      {data.housingLoanDeduction != null && data.housingLoanDeduction > 0 && (
        <div>
          <p className="font-semibold">住宅ローン控除</p>
          <p>・控除額: {fmt(data.housingLoanDeduction)}円</p>
        </div>
      )}
      {data.furusatoLimit != null && data.furusatoLimit > 0 && (
        <div>
          <p className="font-semibold">ふるさと納税</p>
          <p>・控除上限（目安）: {fmt(data.furusatoLimit)}円</p>
          {donations.length > 0 && (
            <>
              <p className="mt-1">・寄附一覧:</p>
              {donations.map((d) => (
                <p key={d.id} className="pl-2">
                  {d.date} {d.municipality} {fmt(d.amount)}円
                </p>
              ))}
            </>
          )}
        </div>
      )}
      {data.sideJobIncome != null && data.sideJobIncome > 0 && (
        <div>
          <p className="font-semibold">副業</p>
          <p>・副業所得: {fmt(data.sideJobIncome)}円</p>
          <p>・確定申告: {data.needsFiling ? "必要" : "不要"}</p>
        </div>
      )}
      <Separator />
      <p className="text-xs text-muted-foreground">tools24.jp | 確定申告かんたんツール集</p>
    </div>
  );
}

export function EtaxGuide() {
  const [data, setData] = useState<TaxData>({});
  const [donations, setDonations] = useState<FurusatoDonation[]>([]);
  const [mounted, setMounted] = useState(false);
  const [showPrintMemo, setShowPrintMemo] = useState(false);

  useEffect(() => {
    setData(loadTaxData());
    setDonations(loadFurusatoDonations());
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const hasAnyData =
    (data.salary != null && data.salary > 0) ||
    (data.pensionIncome != null && data.pensionIncome > 0) ||
    data.incomeTax != null ||
    data.medicalDeduction != null ||
    data.furusatoLimit != null ||
    data.needsFiling != null ||
    data.lifeInsuranceDeduction != null ||
    data.housingLoanDeduction != null;

  const hasFurusato = (data.furusatoLimit != null && data.furusatoLimit > 0) || donations.length > 0;
  const hasSideJob = data.needsFiling === true && (data.sideJobRevenue ?? 0) > 0;
  const hasMedical = data.medicalDeduction != null && data.medicalDeduction > 0;
  const hasLifeInsurance = data.lifeInsuranceDeduction != null && data.lifeInsuranceDeduction > 0;
  const hasHousingLoan = data.housingLoanDeduction != null && data.housingLoanDeduction > 0;
  const hasPension = data.pensionIncome != null && data.pensionIncome > 0;
  const hasIncomeTax = data.incomeTax != null;
  const hasSalary = data.salary != null && data.salary > 0;

  const lastUpdated = data.lastUpdated
    ? new Date(data.lastUpdated).toLocaleDateString("ja-JP", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : null;

  return (
    <div className="space-y-10">
      {/* Section 1: 計算結果サマリー */}
      <section>
        <h2 className="text-xl font-bold mb-1">計算結果サマリー</h2>
        {lastUpdated && (
          <p className="text-xs text-muted-foreground mb-4">最終更新: {lastUpdated}</p>
        )}

        {!hasAnyData ? (
          <div className="border rounded-lg p-8 text-center space-y-4">
            <p className="text-muted-foreground">
              まだ計算結果がありません。まず所得税シミュレーターから始めましょう。
            </p>
            <Button asChild>
              <Link href="/income-tax">所得税シミュレーターを使う →</Link>
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {/* 所得税 */}
            <SummaryCard icon={Calculator} title="所得税" href="/income-tax" hasData={hasIncomeTax}>
              {data.incomeTax != null && (
                <p className="text-lg font-bold">{fmt(data.incomeTax)}円</p>
              )}
              {data.incomeTaxRate != null && (
                <p className="text-muted-foreground">税率: {(data.incomeTaxRate * 100).toFixed(0)}%</p>
              )}
              {hasSalary && (
                <p className="text-muted-foreground text-xs">給与: {fmt(data.salary!)}円</p>
              )}
            </SummaryCard>

            {/* 医療費控除 */}
            <SummaryCard icon={Heart} title="医療費控除" href="/medical" hasData={hasMedical}>
              {data.medicalDeduction != null && (
                <p className="text-lg font-bold">{fmt(data.medicalDeduction)}円</p>
              )}
            </SummaryCard>

            {/* ふるさと納税 */}
            <SummaryCard icon={Gift} title="ふるさと納税" href="/furusato" hasData={hasFurusato}>
              {data.furusatoLimit != null && data.furusatoLimit > 0 && (
                <p className="text-lg font-bold">上限: {fmt(data.furusatoLimit)}円</p>
              )}
              {donations.length > 0 && (
                <p className="text-muted-foreground">寄附済: {donations.length}件</p>
              )}
            </SummaryCard>

            {/* 副業 */}
            <SummaryCard icon={Briefcase} title="副業" href="/side-job" hasData={hasSideJob}>
              {data.needsFiling != null && (
                <p className={`font-semibold ${data.needsFiling ? "text-orange-600 dark:text-orange-400" : "text-green-600 dark:text-green-400"}`}>
                  {data.needsFiling ? "要申告" : "申告不要"}
                </p>
              )}
              {data.sideJobIncome != null && data.sideJobIncome > 0 && (
                <p className="text-muted-foreground">所得: {fmt(data.sideJobIncome)}円</p>
              )}
            </SummaryCard>

            {/* 生命保険料控除 */}
            <SummaryCard icon={Shield} title="生命保険料控除" href="/life-insurance" hasData={hasLifeInsurance}>
              {data.lifeInsuranceDeduction != null && (
                <p className="text-lg font-bold">{fmt(data.lifeInsuranceDeduction)}円</p>
              )}
            </SummaryCard>

            {/* 住宅ローン控除 */}
            <SummaryCard icon={Home} title="住宅ローン控除" href="/housing-loan" hasData={hasHousingLoan}>
              {data.housingLoanDeduction != null && (
                <p className="text-lg font-bold">{fmt(data.housingLoanDeduction)}円</p>
              )}
            </SummaryCard>
          </div>
        )}
      </section>

      {/* Section 2: e-Tax入力ステップガイド */}
      <section>
        <h2 className="text-xl font-bold mb-4">e-Tax入力ステップガイド</h2>
        <div className="space-y-4">

          {/* ステップ0 */}
          <StepCard step="0" title="事前準備">
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">以下を手元に準備してください:</p>
              <ul className="space-y-1">
                {[
                  "マイナンバーカードを手元に準備",
                  "ICカードリーダー or スマートフォン（マイナポータル連携）",
                  "源泉徴収票を手元に準備",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <span className="w-4 h-4 border rounded-sm shrink-0 inline-block" />
                    {item}
                  </li>
                ))}
                <li className="flex items-center gap-2">
                  <span className="w-4 h-4 border rounded-sm shrink-0 inline-block" />
                  <span>
                    必要書類が揃っている（
                    <Link href="/checklist" className="text-primary hover:underline">
                      チェックリストで確認 →
                    </Link>
                    ）
                  </span>
                </li>
              </ul>
            </div>
            <Button asChild variant="outline" size="sm" className="mt-3">
              <a
                href="https://www.keisan.nta.go.jp/kyoutu/ky/sm/top"
                target="_blank"
                rel="noopener noreferrer"
              >
                確定申告書等作成コーナーを開く
                <ExternalLink className="h-3.5 w-3.5 ml-1.5" />
              </a>
            </Button>
          </StepCard>

          {/* ステップ1 */}
          <StepCard step="1" title="申告書の作成開始">
            <ol className="space-y-1 text-sm list-decimal list-inside">
              <li>「作成開始」をクリック</li>
              <li>「e-Taxで提出する」を選択（マイナンバーカード方式）</li>
              <li>申告書の種類は「所得税」を選択</li>
              <li>
                「給与以外の所得がありますか？」→{" "}
                {hasSideJob && data.needsFiling ? (
                  <span className="font-medium">副業所得があるため「はい」を選択</span>
                ) : (
                  "副業所得がある場合は「はい」"
                )}
              </li>
            </ol>
            <p className="text-xs text-muted-foreground">このステップで必要な情報: 特になし（選択のみ）</p>
          </StepCard>

          {/* ステップ2 */}
          <StepCard step="2" title="収入金額の入力">
            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium mb-2">給与所得（源泉徴収票から転記）</p>
                {hasSalary && (
                  <div className="text-xs bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded p-2 mb-2">
                    あなたが入力した給与収入: <strong>{fmt(data.salary!)}円</strong>
                    （源泉徴収票の金額と一致するか確認してください）
                  </div>
                )}
                <GuideTable
                  rows={[
                    { col1: "支払金額", col2: "源泉徴収票の値", col3: "源泉徴収票「支払金額」" },
                    { col1: "給与所得控除後の金額", col2: "源泉徴収票の値", col3: "源泉徴収票「給与所得控除後の金額」" },
                    { col1: "所得控除の額の合計額", col2: "源泉徴収票の値", col3: "源泉徴収票「所得控除の額の合計額」" },
                    { col1: "源泉徴収税額", col2: "源泉徴収票の値", col3: "源泉徴収票「源泉徴収税額」" },
                    { col1: "社会保険料等の金額", col2: "源泉徴収票の値", col3: "源泉徴収票「社会保険料等の金額」" },
                  ]}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  ※ これらは源泉徴収票の原本から転記します
                </p>
              </div>

              {hasSideJob && data.needsFiling && (
                <div>
                  <p className="text-sm font-medium mb-2">副業所得（雑所得）</p>
                  <GuideTable
                    rows={[
                      {
                        col1: "雑所得 → 収入金額",
                        col2: data.sideJobRevenue != null ? `${fmt(data.sideJobRevenue)}円` : "副業ナビで確認",
                        col3: "副業ナビの「副業の収入（売上）」",
                      },
                      {
                        col1: "雑所得 → 必要経費",
                        col2: data.sideJobExpenses != null ? `${fmt(data.sideJobExpenses)}円` : "副業ナビで確認",
                        col3: "副業ナビの「副業の経費」",
                      },
                    ]}
                  />
                </div>
              )}

              {hasPension && (
                <div>
                  <p className="text-sm font-medium mb-2">年金所得</p>
                  <GuideTable
                    rows={[
                      {
                        col1: "公的年金等 → 収入金額",
                        col2: `${fmt(data.pensionIncome!)}円`,
                        col3: "所得税シミュレーターの「年金収入」",
                      },
                    ]}
                  />
                </div>
              )}
            </div>
          </StepCard>

          {/* ステップ3 */}
          {(hasMedical || hasLifeInsurance) && (
            <StepCard step="3" title="所得控除の入力">
              <div className="space-y-4">
                {hasMedical && (
                  <div>
                    <p className="text-sm font-medium mb-2">医療費控除</p>
                    <GuideTable
                      rows={[
                        {
                          col1: "医療費控除 → 支払った医療費",
                          col2: "※自分で把握している合計額",
                          col3: "領収書の合計",
                        },
                        {
                          col1: "医療費控除 → 保険金等で補填される金額",
                          col2: "※自分で把握している金額",
                          col3: "保険会社からの支払い",
                        },
                      ]}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      e-Taxが自動で控除額を計算してくれます。このツールで計算した控除額（{fmt(data.medicalDeduction!)}円）と一致するか確認してください。
                    </p>
                  </div>
                )}

                {hasLifeInsurance && (
                  <div>
                    <p className="text-sm font-medium mb-2">生命保険料控除</p>
                    <GuideTable
                      rows={[
                        {
                          col1: "生命保険料控除 → 新制度/旧制度の各保険料",
                          col2: "各○○円",
                          col3: "控除証明書から転記",
                        },
                      ]}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      控除証明書の金額をそのまま入力すれば、e-Taxが控除額を自動計算します。このツールの結果（{fmt(data.lifeInsuranceDeduction!)}円）と一致するか確認用にお使いください。
                    </p>
                  </div>
                )}
              </div>
            </StepCard>
          )}

          {/* ステップ4 */}
          {hasHousingLoan && (
            <StepCard step="4" title="税額控除の入力（住宅ローン控除）">
              <p className="text-xs text-muted-foreground">
                初年度は入力項目が多いですが、2年目以降は年末調整で控除を受けられます。
              </p>
              <GuideTable
                rows={[
                  {
                    col1: "住宅借入金等特別控除 → 年末残高",
                    col2: "○○円",
                    col3: "残高証明書から転記",
                  },
                  {
                    col1: "住宅借入金等特別控除 → 取得対価の額",
                    col2: "○○円",
                    col3: "売買契約書から転記",
                  },
                  {
                    col1: "住宅借入金等特別控除 → 居住開始年月日",
                    col2: "○年○月○日",
                    col3: "入居日を入力",
                  },
                ]}
              />
              <p className="text-xs text-muted-foreground">
                このツールの計算結果: <strong>{fmt(data.housingLoanDeduction!)}円</strong>
              </p>
            </StepCard>
          )}

          {/* ステップ5 */}
          {hasFurusato && (
            <StepCard step="5" title="ふるさと納税（寄附金控除）の入力">
              <GuideTable
                rows={[
                  {
                    col1: "寄附金控除 → 寄附先の名称",
                    col2: "○○市/○○町",
                    col3: "寄附金受領証明書",
                  },
                  {
                    col1: "寄附金控除 → 寄附金額",
                    col2: "○○円",
                    col3: "寄附金受領証明書",
                  },
                ]}
              />
              {donations.length > 0 && (
                <div className="mt-2">
                  <p className="text-sm font-medium mb-2">以下の寄附を入力してください:</p>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm border-collapse">
                      <thead>
                        <tr className="bg-muted">
                          <th className="border px-3 py-2 text-left font-medium">寄附日</th>
                          <th className="border px-3 py-2 text-left font-medium">自治体名</th>
                          <th className="border px-3 py-2 text-right font-medium">金額</th>
                        </tr>
                      </thead>
                      <tbody>
                        {donations.map((d) => (
                          <tr key={d.id} className="even:bg-muted/30">
                            <td className="border px-3 py-2">{d.date}</td>
                            <td className="border px-3 py-2">{d.municipality}</td>
                            <td className="border px-3 py-2 text-right">{fmt(d.amount)}円</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
              <p className="text-xs text-muted-foreground mt-1">
                XMLデータをお持ちの場合は、e-Taxに一括読込できます。寄附先ごとに手入力する必要はありません。
              </p>
            </StepCard>
          )}

          {/* ステップ6 */}
          {hasSideJob && data.needsFiling && (
            <StepCard step="6" title="住民税の納付方法（副業がある方）">
              <ol className="space-y-1 text-sm list-decimal list-inside">
                <li>確定申告書 第二表の「住民税に関する事項」を開く</li>
                <li>
                  「給与、公的年金等以外の所得に係る住民税の徴収方法」で{" "}
                  <strong>「自分で納付」</strong>を選択
                </li>
              </ol>
              <div className="flex items-start gap-2 bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 rounded p-3 text-xs text-orange-800 dark:text-orange-300">
                <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>
                  これを選ばないと、副業の住民税が会社の給与から天引きされ、会社に副業がバレる可能性があります。
                </p>
              </div>
            </StepCard>
          )}

          {/* ステップ7 */}
          <StepCard step="7" title="申告書の送信">
            <ol className="space-y-2 text-sm list-decimal list-inside">
              <li>入力内容を確認（確認画面で計算結果が表示される）</li>
              <li>
                <span>このツールの計算結果と比較してください:</span>
                {hasIncomeTax && (
                  <div className="mt-1 pl-4 text-muted-foreground text-xs">
                    ・所得税額（概算）: {fmt(data.incomeTax!)}円
                    <br />
                    ・多少の差異（数百円〜数千円）は端数処理の違いによるものです
                  </div>
                )}
              </li>
              <li>マイナンバーカードで電子署名</li>
              <li>送信完了</li>
            </ol>
          </StepCard>
        </div>
      </section>

      {/* Section 3: 転記メモ */}
      {hasAnyData && (
        <section>
          <Button
            variant="outline"
            onClick={() => setShowPrintMemo((v) => !v)}
            className="gap-2"
          >
            <Printer className="h-4 w-4" />
            転記メモを{showPrintMemo ? "閉じる" : "表示"}
            {showPrintMemo ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
          {showPrintMemo && (
            <div className="mt-4 border rounded-lg p-6 print-area">
              <PrintMemo data={data} donations={donations} />
              <Button
                variant="outline"
                size="sm"
                className="mt-4 no-print"
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4 mr-2" />
                印刷する（Ctrl+P）
              </Button>
            </div>
          )}
        </section>
      )}

      {/* Section 4: よくあるつまずきポイント */}
      <section className="space-y-6">
        <h2 className="text-xl font-bold">よくあるつまずきポイント</h2>

        <div className="space-y-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">e-Taxにログインできない場合</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>マイナンバーカードの暗証番号（数字4桁）を確認する</li>
              <li>ICカードリーダーのドライバーが正しくインストールされているか確認する</li>
              <li>スマートフォンでマイナポータルアプリを使う方法も試してみてください</li>
            </ul>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">源泉徴収票の見方がわからない場合</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>「支払金額」= あなたの年収（税込み）</li>
              <li>「給与所得控除後の金額」= 給与収入から給与所得控除を引いた金額</li>
              <li>「所得控除の額の合計額」= 各種控除を合計した金額</li>
              <li>「源泉徴収税額」= 会社が代わりに納めた所得税額</li>
            </ul>
            <p className="text-xs text-muted-foreground mt-2">源泉徴収票転記ガイドは今後追加予定です</p>
          </div>

          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">計算結果がe-Taxと合わない場合</h3>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>端数処理の違い（100円未満切捨て等）で数百円〜数千円の差が出ることがあります</li>
              <li>源泉徴収票の値を優先してください</li>
              <li>このツールの結果はあくまで概算です</li>
            </ul>
          </div>
        </div>
      </section>
    </div>
  );
}
