import { describe, test, expect } from "vitest";
import { calcMedicalDeduction } from "../medical-deduction";

describe("calcMedicalDeduction（医療費控除）", () => {
  test("医療費150,000円、保険金0、所得4,000,000円 → 控除50,000円", () => {
    // 足切り: 100,000（所得200万以上）
    // 控除: 150,000 - 100,000 = 50,000
    const { deduction, threshold } = calcMedicalDeduction(150_000, 0, 4_000_000);
    expect(threshold).toBe(100_000);
    expect(deduction).toBe(50_000);
  });

  test("医療費150,000円、保険金0、所得1,500,000円 → 足切り75,000円、控除75,000円", () => {
    // 足切り: floor(1,500,000 * 0.05) = 75,000
    // 控除: 150,000 - 75,000 = 75,000
    const { deduction, threshold } = calcMedicalDeduction(150_000, 0, 1_500_000);
    expect(threshold).toBe(75_000);
    expect(deduction).toBe(75_000);
  });

  test("医療費2,500,000円、保険金0、所得5,000,000円 → 控除2,000,000円（上限）", () => {
    // 足切り: 100,000
    // 実質: 2,500,000 - 100,000 = 2,400,000
    // 上限2,000,000のためキャップ
    const { deduction } = calcMedicalDeduction(2_500_000, 0, 5_000_000);
    expect(deduction).toBe(2_000_000);
  });

  test("保険金が医療費を超える → 控除0円", () => {
    // 実質負担: max(0, 100,000 - 200,000) = 0
    const { deduction, netExpense } = calcMedicalDeduction(100_000, 200_000, 5_000_000);
    expect(netExpense).toBe(0);
    expect(deduction).toBe(0);
  });

  test("医療費0円 → 控除0円", () => {
    const { deduction } = calcMedicalDeduction(0, 0, 5_000_000);
    expect(deduction).toBe(0);
  });

  test("所得0円 → 足切り0円", () => {
    // 所得0のため5%も0
    const { threshold } = calcMedicalDeduction(150_000, 0, 0);
    expect(threshold).toBe(0);
  });
});
