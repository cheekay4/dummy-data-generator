import { describe, test, expect } from "vitest";
import { calcPensionDeduction } from "../income-tax";

describe("calcPensionDeduction（公的年金等控除）", () => {
  describe("65歳以上", () => {
    test("65歳以上、年金3,000,000円 → 控除1,100,000円、所得1,900,000円", () => {
      // 3,300,000以下 → 控除1,100,000
      const deduction = calcPensionDeduction(3_000_000, true);
      expect(deduction).toBe(1_100_000);
      const income = Math.max(0, 3_000_000 - deduction);
      expect(income).toBe(1_900_000);
    });

    test("65歳以上、年金3,300,001円 → 次の段階の計算", () => {
      // 3,300,001 * 0.25 + 275,000 = 825,000.25 + 275,000 = floor = 1,100,000
      const deduction = calcPensionDeduction(3_300_001, true);
      expect(deduction).toBe(1_100_000);
    });

    test("65歳以上、年金4,100,000円 → 控除1,300,000円", () => {
      // floor(4,100,000 * 0.25 + 275,000) = floor(1,025,000 + 275,000) = 1,300,000
      const deduction = calcPensionDeduction(4_100_000, true);
      expect(deduction).toBe(1_300_000);
    });
  });

  describe("65歳未満", () => {
    test("65歳未満、年金1,300,000円 → 控除600,000円、所得700,000円", () => {
      // 1,300,000以下 → 控除600,000
      const deduction = calcPensionDeduction(1_300_000, false);
      expect(deduction).toBe(600_000);
      const income = Math.max(0, 1_300_000 - deduction);
      expect(income).toBe(700_000);
    });

    test("65歳未満、年金1,200,000円 → 控除600,000円、所得600,000円", () => {
      const deduction = calcPensionDeduction(1_200_000, false);
      expect(deduction).toBe(600_000);
      const income = Math.max(0, 1_200_000 - deduction);
      expect(income).toBe(600_000);
    });

    test("65歳未満、年金600,000円以下 → 控除600,000円、所得0円", () => {
      // 所得 = max(0, 600,000 - 600,000) = 0
      const deduction = calcPensionDeduction(600_000, false);
      expect(deduction).toBe(600_000);
      const income = Math.max(0, 600_000 - deduction);
      expect(income).toBe(0);
    });

    test("65歳未満、年金1,300,001円 → 次の段階の計算", () => {
      // floor(1,300,001 * 0.25 + 275,000) = floor(325,000.25 + 275,000) = 600,000
      const deduction = calcPensionDeduction(1_300_001, false);
      expect(deduction).toBe(600_000);
    });
  });
});
