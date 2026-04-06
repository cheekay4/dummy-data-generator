import { describe, test, expect } from "vitest";
import { calcHousingLoanDeduction } from "../housing-loan-deduction";

describe("calcHousingLoanDeduction（住宅ローン控除）", () => {
  test("認定住宅、2024年、残高3,000万 → 控除210,000円", () => {
    // 限度額4,500万 > 残高3,000万 → 対象3,000万
    // floor((30,000,000 * 0.007) / 100) * 100 = floor(210,000 / 100) * 100 = 210,000
    const { deduction, applicableBalance } = calcHousingLoanDeduction({
      moveInYear: 2024,
      housingType: "certified",
      yearEndBalance: 30_000_000,
      controlYear: 1,
    });
    expect(applicableBalance).toBe(30_000_000);
    expect(deduction).toBe(210_000);
  });

  test("認定住宅、2024年、残高5,000万 → 対象4,500万（限度額）、控除315,000円", () => {
    // 限度額4,500万 < 残高5,000万 → 対象4,500万
    // floor((45,000,000 * 0.007) / 100) * 100 = floor(315,000 / 100) * 100 = 315,000
    const { deduction, applicableBalance } = calcHousingLoanDeduction({
      moveInYear: 2024,
      housingType: "certified",
      yearEndBalance: 50_000_000,
      controlYear: 1,
    });
    expect(applicableBalance).toBe(45_000_000);
    expect(deduction).toBe(315_000);
  });

  test("省エネ基準、2025年、残高3,000万 → 対象3,000万（限度額内）、控除210,000円", () => {
    // 限度額3,000万 = 残高3,000万
    const { deduction, applicableBalance } = calcHousingLoanDeduction({
      moveInYear: 2025,
      housingType: "energy_efficient",
      yearEndBalance: 30_000_000,
      controlYear: 1,
    });
    expect(applicableBalance).toBe(30_000_000);
    expect(deduction).toBe(210_000);
  });

  test("その他新築（経過措置）、2024年 → 借入限度額2,000万、残高3,000万 → 控除140,000円", () => {
    // 2024年のgeneral_new限度額: 2,000万
    // 対象: min(30,000,000, 20,000,000) = 20,000,000
    // floor((20,000,000 * 0.007) / 100) * 100 = 140,000
    const { deduction, applicableBalance } = calcHousingLoanDeduction({
      moveInYear: 2024,
      housingType: "general_new",
      yearEndBalance: 30_000_000,
      controlYear: 1,
    });
    expect(applicableBalance).toBe(20_000_000);
    expect(deduction).toBe(140_000);
  });

  test("中古その他、2024年、残高2,500万 → 対象2,000万（限度額）、控除140,000円", () => {
    // 限度額2,000万 < 残高2,500万
    const { deduction, applicableBalance } = calcHousingLoanDeduction({
      moveInYear: 2024,
      housingType: "general_used",
      yearEndBalance: 25_000_000,
      controlYear: 1,
    });
    expect(applicableBalance).toBe(20_000_000);
    expect(deduction).toBe(140_000);
  });

  test("控除14年目（新築認定住宅）→ 控除0円（期間超過）", () => {
    // 控除期間13年、14年目は超過
    const { deduction } = calcHousingLoanDeduction({
      moveInYear: 2024,
      housingType: "certified",
      yearEndBalance: 30_000_000,
      controlYear: 14,
    });
    expect(deduction).toBe(0);
  });

  test("控除11年目（中古その他）→ 控除0円（期間超過）", () => {
    // 中古は10年、11年目は超過
    const { deduction } = calcHousingLoanDeduction({
      moveInYear: 2024,
      housingType: "general_used",
      yearEndBalance: 20_000_000,
      controlYear: 11,
    });
    expect(deduction).toBe(0);
  });

  test("残高0円 → 控除0円", () => {
    const { deduction } = calcHousingLoanDeduction({
      moveInYear: 2024,
      housingType: "certified",
      yearEndBalance: 0,
      controlYear: 1,
    });
    expect(deduction).toBe(0);
  });
});
