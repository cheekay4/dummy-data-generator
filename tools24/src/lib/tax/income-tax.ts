/** 給与所得控除（令和5年分〜） */
export function calcEmploymentIncomeDeduction(revenue: number): number {
  if (revenue <= 1_625_000) return 550_000;
  if (revenue <= 1_800_000) return revenue * 0.4 - 100_000;
  if (revenue <= 3_600_000) return revenue * 0.3 + 80_000;
  if (revenue <= 6_600_000) return revenue * 0.2 + 440_000;
  if (revenue <= 8_500_000) return revenue * 0.1 + 1_100_000;
  return 1_950_000;
}

/** 基礎控除 */
export function calcBasicDeduction(totalIncome: number): number {
  if (totalIncome <= 24_000_000) return 480_000;
  if (totalIncome <= 24_500_000) return 320_000;
  if (totalIncome <= 25_000_000) return 160_000;
  return 0;
}

/** 所得税率テーブル（令和5年分〜） */
export const TAX_BRACKETS = [
  { limit: 1_950_000, rate: 0.05, deduction: 0, label: "195万円以下" },
  { limit: 3_300_000, rate: 0.10, deduction: 97_500, label: "195万円超〜330万円以下" },
  { limit: 6_950_000, rate: 0.20, deduction: 427_500, label: "330万円超〜695万円以下" },
  { limit: 9_000_000, rate: 0.23, deduction: 636_000, label: "695万円超〜900万円以下" },
  { limit: 18_000_000, rate: 0.33, deduction: 1_536_000, label: "900万円超〜1,800万円以下" },
  { limit: 40_000_000, rate: 0.40, deduction: 2_796_000, label: "1,800万円超〜4,000万円以下" },
  { limit: Infinity, rate: 0.45, deduction: 4_796_000, label: "4,000万円超" },
] as const;

/** 所得税額を計算 */
export function calcIncomeTax(taxableIncome: number): { tax: number; rate: number; bracket: typeof TAX_BRACKETS[number] } {
  if (taxableIncome <= 0) {
    return { tax: 0, rate: 0, bracket: TAX_BRACKETS[0] };
  }

  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) {
      const tax = Math.floor(taxableIncome * bracket.rate - bracket.deduction);
      return { tax: Math.max(0, tax), rate: bracket.rate, bracket };
    }
  }

  // Should not reach here
  const last = TAX_BRACKETS[TAX_BRACKETS.length - 1];
  return {
    tax: Math.floor(taxableIncome * last.rate - last.deduction),
    rate: last.rate,
    bracket: last,
  };
}

/** 復興特別所得税（所得税額 × 2.1%） */
export function calcReconstructionTax(incomeTax: number): number {
  return Math.floor(incomeTax * 0.021);
}

/** 給与所得（給与収入 - 給与所得控除） */
export function calcEmploymentIncome(salary: number): number {
  return Math.max(0, salary - calcEmploymentIncomeDeduction(salary));
}

/** 課税所得に対する所得税率を取得 */
export function getIncomeTaxRate(taxableIncome: number): number {
  if (taxableIncome <= 0) return 0;
  for (const bracket of TAX_BRACKETS) {
    if (taxableIncome <= bracket.limit) return bracket.rate;
  }
  return TAX_BRACKETS[TAX_BRACKETS.length - 1].rate;
}

/** 公的年金等控除（令和5年分〜、合計所得1,000万円以下） */
export function calcPensionDeduction(pensionIncome: number, isOver65: boolean): number {
  if (isOver65) {
    if (pensionIncome <= 3_300_000) return 1_100_000;
    if (pensionIncome <= 4_100_000) return Math.floor(pensionIncome * 0.25 + 275_000);
    if (pensionIncome <= 7_700_000) return Math.floor(pensionIncome * 0.15 + 685_000);
    if (pensionIncome <= 10_000_000) return Math.floor(pensionIncome * 0.05 + 1_455_000);
    return 1_955_000;
  } else {
    if (pensionIncome <= 1_300_000) return 600_000;
    if (pensionIncome <= 4_100_000) return Math.floor(pensionIncome * 0.25 + 275_000);
    if (pensionIncome <= 7_700_000) return Math.floor(pensionIncome * 0.15 + 685_000);
    if (pensionIncome <= 10_000_000) return Math.floor(pensionIncome * 0.05 + 1_455_000);
    return 1_955_000;
  }
}

export interface IncomeTaxInput {
  salary: number;
  sideIncome: number;
  sideExpenses: number;
  socialInsurance: number;
  lifeInsurance: number;
  earthquakeInsurance: number;
  medicalDeduction: number;
  furusatoDeduction: number;
  spouseDeduction: "none" | "spouse" | "special";
  dependents: {
    general: number;
    specific: number;
    elderly: number;
  };
  // 年金（任意）
  pensionIncome?: number;
  isOver65?: boolean;
}

export interface IncomeTaxResult {
  salaryRevenue: number;
  employmentDeduction: number;
  employmentIncome: number;
  sideIncome: number;
  pensionIncome: number;
  pensionDeduction: number;
  pensionIncomeNet: number;
  totalIncome: number;
  basicDeduction: number;
  totalDeductions: number;
  deductionBreakdown: { label: string; amount: number }[];
  taxableIncome: number;
  incomeTax: number;
  reconstructionTax: number;
  totalTax: number;
  taxRate: number;
}

export function calculateIncomeTax(input: IncomeTaxInput): IncomeTaxResult {
  // 給与所得
  const employmentDeduction = calcEmploymentIncomeDeduction(input.salary);
  const employmentIncome = Math.max(0, input.salary - employmentDeduction);

  // 副業所得
  const sideIncome = Math.max(0, input.sideIncome - input.sideExpenses);

  // 年金所得
  const pensionIncome = input.pensionIncome ?? 0;
  const pensionDeduction = pensionIncome > 0
    ? calcPensionDeduction(pensionIncome, input.isOver65 ?? false)
    : 0;
  const pensionIncomeNet = Math.max(0, pensionIncome - pensionDeduction);

  // 合計所得
  const totalIncome = employmentIncome + sideIncome + pensionIncomeNet;

  // 基礎控除
  const basicDeduction = calcBasicDeduction(totalIncome);

  // 配偶者控除
  let spouseDeductionAmount = 0;
  if (input.spouseDeduction === "spouse") spouseDeductionAmount = 380_000;
  else if (input.spouseDeduction === "special") spouseDeductionAmount = 380_000;

  // 扶養控除
  const dependentDeduction =
    input.dependents.general * 380_000 +
    input.dependents.specific * 630_000 +
    input.dependents.elderly * 480_000;

  // 生命保険料控除（上限12万円）
  const lifeInsurance = Math.min(input.lifeInsurance, 120_000);

  // 地震保険料控除（上限5万円）
  const earthquakeInsurance = Math.min(input.earthquakeInsurance, 50_000);

  // 控除内訳
  const deductionBreakdown: { label: string; amount: number }[] = [
    { label: "基礎控除", amount: basicDeduction },
    { label: "社会保険料控除", amount: input.socialInsurance },
    { label: "生命保険料控除", amount: lifeInsurance },
    { label: "地震保険料控除", amount: earthquakeInsurance },
    { label: "医療費控除", amount: input.medicalDeduction },
    { label: "寄附金控除（ふるさと納税）", amount: Math.max(0, input.furusatoDeduction - 2_000) },
    { label: "配偶者控除", amount: spouseDeductionAmount },
    { label: "扶養控除", amount: dependentDeduction },
  ].filter((d) => d.amount > 0);

  // 所得控除合計
  const totalDeductions = deductionBreakdown.reduce((sum, d) => sum + d.amount, 0);

  // 課税所得
  const taxableIncome = Math.max(0, Math.floor((totalIncome - totalDeductions) / 1000) * 1000);

  // 所得税
  const { tax: incomeTax, rate: taxRate } = calcIncomeTax(taxableIncome);

  // 復興特別所得税
  const reconstructionTax = calcReconstructionTax(incomeTax);

  // 合計
  const totalTax = incomeTax + reconstructionTax;

  return {
    salaryRevenue: input.salary,
    employmentDeduction,
    employmentIncome,
    sideIncome,
    pensionIncome,
    pensionDeduction,
    pensionIncomeNet,
    totalIncome,
    basicDeduction,
    totalDeductions,
    deductionBreakdown,
    taxableIncome,
    incomeTax,
    reconstructionTax,
    totalTax,
    taxRate,
  };
}
