import { describe, test, expect } from "vitest";
import {
  calcEmploymentIncome,
  calcEmploymentIncomeDeduction,
  calculateIncomeTax,
  type IncomeTaxInput,
} from "../income-tax";
import { calcMedicalDeduction } from "../medical-deduction";
import { calcLifeInsuranceDeduction } from "../life-insurance-deduction";
import { calcHousingLoanDeduction } from "../housing-loan-deduction";
import { calcFurusatoLimit } from "../furusato-limit";

function zeroInput(): IncomeTaxInput {
  return {
    salary: 0,
    sideIncome: 0,
    sideExpenses: 0,
    socialInsurance: 0,
    lifeInsurance: 0,
    earthquakeInsurance: 0,
    medicalDeduction: 0,
    furusatoDeduction: 0,
    spouseDeduction: "none",
    dependents: { general: 0, specific: 0, elderly: 0 },
  };
}

function zeroFurusatoParams() {
  return {
    salary: 0,
    otherIncome: 0,
    socialInsurance: 0,
    lifeInsurance: 0,
    earthquakeInsurance: 0,
    medicalDeduction: 0,
    housingLoanCredit: 0,
    spouseDeduction: 0,
    dependentDeduction: 0,
  };
}

describe("エッジケース: 異常値でクラッシュしない", () => {
  // ────── 0値 ──────
  test("年収0円 → クラッシュせず結果を返す", () => {
    const result = calcEmploymentIncome(0);
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBe(0);
  });

  test("全入力0 → 税額0円", () => {
    const result = calculateIncomeTax(zeroInput());
    expect(result.totalTax).toBe(0);
    expect(result.incomeTax).toBe(0);
    expect(result.reconstructionTax).toBe(0);
  });

  // ────── 極大値 ──────
  test("年収9,999,999,999円 → クラッシュせず計算", () => {
    const result = calculateIncomeTax({ ...zeroInput(), salary: 9_999_999_999 });
    expect(Number.isFinite(result.totalTax)).toBe(true);
    expect(result.totalTax).toBeGreaterThan(0);
  });

  test("医療費9,999,999,999円 → 控除上限200万円", () => {
    const { deduction } = calcMedicalDeduction(9_999_999_999, 0, 5_000_000);
    expect(deduction).toBe(2_000_000);
  });

  test("住宅ローン残高100億円 → 借入限度額でキャップ", () => {
    // 認定住宅2024年: 限度額4,500万
    const { applicableBalance, deduction } = calcHousingLoanDeduction({
      moveInYear: 2024,
      housingType: "certified",
      yearEndBalance: 10_000_000_000,
      controlYear: 1,
    });
    expect(applicableBalance).toBe(45_000_000);
    expect(Number.isFinite(deduction)).toBe(true);
    expect(deduction).toBeGreaterThan(0);
  });

  // ────── 負の値 ──────
  test("年収-1円 → 0以上の有限値を返す（NaN/Infinityにならない）", () => {
    const result = calcEmploymentIncome(-1);
    expect(Number.isFinite(result)).toBe(true);
    expect(result).toBeGreaterThanOrEqual(0);
  });

  test("医療費マイナス → 控除0円、クラッシュしない", () => {
    const { deduction, netExpense } = calcMedicalDeduction(-50_000, 0, 5_000_000);
    expect(Number.isFinite(deduction)).toBe(true);
    expect(deduction).toBe(0);
    // netExpense = max(0, -50,000 - 0) = 0
    expect(netExpense).toBeGreaterThanOrEqual(0);
  });

  // ────── 保険金が医療費を超える ──────
  test("医療費100,000、保険金200,000 → 控除0円（マイナスにならない）", () => {
    const result = calcMedicalDeduction(100_000, 200_000, 5_000_000);
    expect(result.deduction).toBe(0);
    expect(result.netExpense).toBe(0);
  });

  // ────── 小数 ──────
  test("年収5,000,000.5円 → 有限値を返す（クラッシュしない）", () => {
    const result = calcEmploymentIncome(5_000_000.5);
    expect(Number.isFinite(result)).toBe(true);
  });

  test("生命保険料に小数 → 有限値を返す", () => {
    const result = calcLifeInsuranceDeduction({
      generalNew: 30_000.5,
      generalOld: 0,
      medicalNew: 0,
      pensionNew: 0,
      pensionOld: 0,
    });
    expect(Number.isFinite(result.total)).toBe(true);
    expect(result.total).toBeGreaterThanOrEqual(0);
  });

  // ────── 住宅ローン控除期間超過 ──────
  test("新築（認定住宅）で14年目 → 控除0円", () => {
    const { deduction } = calcHousingLoanDeduction({
      moveInYear: 2024,
      housingType: "certified",
      yearEndBalance: 30_000_000,
      controlYear: 14,
    });
    expect(deduction).toBe(0);
  });

  test("中古（その他）で11年目 → 控除0円", () => {
    const { deduction } = calcHousingLoanDeduction({
      moveInYear: 2024,
      housingType: "general_used",
      yearEndBalance: 20_000_000,
      controlYear: 11,
    });
    expect(deduction).toBe(0);
  });

  // ────── ふるさと納税 低所得 ──────
  test("年収0円のふるさと納税上限 → 0以上、クラッシュしない", () => {
    const { limit } = calcFurusatoLimit(zeroFurusatoParams());
    expect(Number.isFinite(limit)).toBe(true);
    expect(limit).toBeGreaterThanOrEqual(0);
  });

  test("年収1,000,000円のふるさと納税上限 → 正の値 or 0、クラッシュしない", () => {
    const { limit } = calcFurusatoLimit({ ...zeroFurusatoParams(), salary: 1_000_000 });
    expect(Number.isFinite(limit)).toBe(true);
    expect(limit).toBeGreaterThanOrEqual(0);
  });

  // ────── 給与所得控除の境界 ──────
  test("給与所得控除の計算結果が常に有限正値", () => {
    const salaries = [0, 1, 1_625_000, 1_625_001, 1_800_000, 3_600_000, 6_600_000, 8_500_000, 8_500_001, 100_000_000];
    for (const salary of salaries) {
      const deduction = calcEmploymentIncomeDeduction(salary);
      expect(Number.isFinite(deduction)).toBe(true);
      expect(deduction).toBeGreaterThanOrEqual(0);
    }
  });
});
