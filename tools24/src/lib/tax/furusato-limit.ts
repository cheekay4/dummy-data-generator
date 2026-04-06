import {
  calcEmploymentIncome,
  calcBasicDeduction,
  getIncomeTaxRate,
  calcIncomeTax,
} from "./income-tax";

/** ふるさと納税の控除上限額を計算
 * 自己負担2,000円になる寄附上限 = 住民税所得割額 × 20% ÷ (90% - 所得税率 × 1.021) + 2,000
 */
export function calcFurusatoLimit(params: {
  salary: number;
  otherIncome: number;
  socialInsurance: number;
  lifeInsurance: number;
  earthquakeInsurance: number;
  medicalDeduction: number;
  housingLoanCredit: number;
  spouseDeduction: number; // 0, 380_000, or 特別控除額
  dependentDeduction: number; // 扶養控除合計額
}): {
  limit: number;
  taxableIncome: number;
  incomeTaxRate: number;
  residentTaxDeduction: number;
} {
  // 1. 給与所得を計算（給与所得控除を適用）
  const employmentIncome = calcEmploymentIncome(params.salary);

  // 2. 合計所得
  const totalIncome = employmentIncome + params.otherIncome;

  // 3. 所得控除合計
  const deductions =
    params.socialInsurance +
    Math.min(params.lifeInsurance, 120_000) +
    Math.min(params.earthquakeInsurance, 50_000) +
    params.medicalDeduction +
    params.spouseDeduction +
    params.dependentDeduction +
    calcBasicDeduction(totalIncome); // 基礎控除

  // 4. 課税所得
  const taxableIncome = Math.max(0, Math.floor((totalIncome - deductions) / 1000) * 1000);

  // 5. 所得税率を取得
  const incomeTaxRate = getIncomeTaxRate(taxableIncome);

  // 5b. 住宅ローン控除が所得税を超える場合、ふるさと納税の所得税メリットは0
  const { tax: incomeTaxBeforeCredit } = calcIncomeTax(taxableIncome);
  const incomeTaxWithReconstruction = Math.floor(incomeTaxBeforeCredit * 1.021);
  const effectiveIncomeTaxRate = incomeTaxWithReconstruction <= params.housingLoanCredit
    ? 0
    : incomeTaxRate;

  // 6. 住民税の課税所得（住民税の基礎控除は43万円）
  const residentTaxDeductions =
    params.socialInsurance +
    Math.min(params.lifeInsurance, 120_000) +
    Math.min(params.earthquakeInsurance, 50_000) +
    params.medicalDeduction +
    params.spouseDeduction +
    params.dependentDeduction +
    430_000; // 住民税の基礎控除

  const residentTaxableIncome = Math.max(0, totalIncome - residentTaxDeductions);

  // 7. 住民税所得割額（税率10%）
  const residentTaxDeduction = Math.floor(residentTaxableIncome * 0.1);

  // 8. 控除上限額
  const denominator = 0.9 - effectiveIncomeTaxRate * 1.021;
  const limit = denominator <= 0
    ? 0
    : Math.floor(residentTaxDeduction * 0.2 / denominator + 2_000);

  return {
    limit: Math.max(0, limit),
    taxableIncome,
    incomeTaxRate,
    residentTaxDeduction,
  };
}

/** 扶養控除額を計算するヘルパー */
export function calcDependentDeduction(dependents: {
  under16: number;    // 控除なし（住民税の非課税限度額に影響）
  age16to18: number;  // 一般 38万円
  age19to22: number;  // 特定 63万円
  age23to69: number;  // 一般 38万円
  age70plus: number;  // 老人 48万円
}): number {
  return (
    dependents.age16to18 * 380_000 +
    dependents.age19to22 * 630_000 +
    dependents.age23to69 * 380_000 +
    dependents.age70plus * 480_000
  );
}
