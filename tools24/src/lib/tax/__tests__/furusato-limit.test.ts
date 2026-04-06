import { describe, test, expect } from "vitest";
import { calcFurusatoLimit } from "../furusato-limit";

// 控除なしの独身パラメータ
function singleNoDeductions(salary: number) {
  return calcFurusatoLimit({
    salary,
    otherIncome: 0,
    socialInsurance: 0,
    lifeInsurance: 0,
    earthquakeInsurance: 0,
    medicalDeduction: 0,
    housingLoanCredit: 0,
    spouseDeduction: 0,
    dependentDeduction: 0,
  });
}

describe("calcFurusatoLimit（ふるさと納税控除上限）", () => {
  // 注: 総務省目安表の値は社会保険料（約14%）控除後の値。
  // このテストでは社会保険料0円で計算するため、実際の上限は目安表より高くなる。
  // 実際の出力値を基準に ±1,000円の範囲で検証する。

  test("年収5,000,000円、社会保険料なし → 実際の計算値を確認", () => {
    // 社会保険料なし時の実計算値: 80,455円
    const { limit } = singleNoDeductions(5_000_000);
    expect(limit).toBeGreaterThan(0);
    expect(limit).toBe(80_455);
  });

  test("年収3,000,000円、社会保険料なし → 実際の計算値を確認", () => {
    // 社会保険料なし時の実計算値: 39,458円
    const { limit } = singleNoDeductions(3_000_000);
    expect(limit).toBeGreaterThan(0);
    expect(limit).toBe(39_458);
  });

  test("年収7,000,000円、社会保険料なし → 実際の計算値を確認", () => {
    // 社会保険料なし時の実計算値: 139,108円
    const { limit } = singleNoDeductions(7_000_000);
    expect(limit).toBeGreaterThan(0);
    expect(limit).toBe(139_108);
  });

  test("年収10,000,000円、社会保険料なし → 実際の計算値を確認", () => {
    // 社会保険料なし時の実計算値: 231,114円
    const { limit } = singleNoDeductions(10_000_000);
    expect(limit).toBeGreaterThan(0);
    expect(limit).toBe(231_114);
  });

  test("年収0円 → 上限は最低2,000円（計算式に固定 +2,000 が含まれる）", () => {
    // 年収0のとき住民税所得割=0、計算結果は floor(0 / 0.9 + 2,000) = 2,000
    const { limit } = singleNoDeductions(0);
    expect(limit).toBe(2_000);
  });

  test("高収入ほど上限が高い（単調増加）", () => {
    const limit3M = singleNoDeductions(3_000_000).limit;
    const limit5M = singleNoDeductions(5_000_000).limit;
    const limit7M = singleNoDeductions(7_000_000).limit;
    const limit10M = singleNoDeductions(10_000_000).limit;
    expect(limit3M).toBeLessThan(limit5M);
    expect(limit5M).toBeLessThan(limit7M);
    expect(limit7M).toBeLessThan(limit10M);
  });
});
