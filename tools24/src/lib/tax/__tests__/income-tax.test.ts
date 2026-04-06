import { describe, test, expect } from "vitest";
import {
  calcEmploymentIncomeDeduction,
  calcBasicDeduction,
  calcIncomeTax,
  calcReconstructionTax,
  calculateIncomeTax,
  type IncomeTaxInput,
} from "../income-tax";

// デフォルト入力（控除なしシンプルケース）
function makeInput(salary: number): IncomeTaxInput {
  return {
    salary,
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

// ────────────────────────────────────────────────────────
// 給与所得控除
// ────────────────────────────────────────────────────────
describe("calcEmploymentIncomeDeduction（給与所得控除）", () => {
  test("年収1,625,000円 → 控除550,000円", () => {
    expect(calcEmploymentIncomeDeduction(1_625_000)).toBe(550_000);
  });

  test("年収1,625,001円 → 0.4倍-10万の計算", () => {
    // revenue * 0.4 - 100_000 = 1,625,001 * 0.4 - 100,000 = 650,000.4 - 100,000 = 550,000.4
    // Math.floorなし（そのまま返す）: 550,000.4
    const result = calcEmploymentIncomeDeduction(1_625_001);
    expect(result).toBeCloseTo(550_000.4, 0);
  });

  test("年収1,800,000円 → 控除620,000円", () => {
    // 1,800,000 * 0.4 - 100,000 = 720,000 - 100,000 = 620,000
    expect(calcEmploymentIncomeDeduction(1_800_000)).toBe(620_000);
  });

  test("年収3,600,000円 → 控除1,160,000円", () => {
    // 3,600,000 * 0.3 + 80,000 = 1,080,000 + 80,000 = 1,160,000
    expect(calcEmploymentIncomeDeduction(3_600_000)).toBe(1_160_000);
  });

  test("年収6,600,000円 → 控除1,760,000円", () => {
    // 6,600,000 * 0.2 + 440,000 = 1,320,000 + 440,000 = 1,760,000
    expect(calcEmploymentIncomeDeduction(6_600_000)).toBe(1_760_000);
  });

  test("年収8,500,000円 → 控除1,950,000円", () => {
    // 8,500,000 * 0.1 + 1,100,000 = 850,000 + 1,100,000 = 1,950,000
    expect(calcEmploymentIncomeDeduction(8_500_000)).toBe(1_950_000);
  });

  test("年収8,500,001円 → 控除1,950,000円（上限）", () => {
    expect(calcEmploymentIncomeDeduction(8_500_001)).toBe(1_950_000);
  });

  test("年収10,000,000円 → 控除1,950,000円（上限）", () => {
    expect(calcEmploymentIncomeDeduction(10_000_000)).toBe(1_950_000);
  });
});

// ────────────────────────────────────────────────────────
// 基礎控除
// ────────────────────────────────────────────────────────
describe("calcBasicDeduction（基礎控除）", () => {
  test("合計所得24,000,000円以下 → 基礎控除480,000円", () => {
    expect(calcBasicDeduction(24_000_000)).toBe(480_000);
    expect(calcBasicDeduction(0)).toBe(480_000);
    expect(calcBasicDeduction(10_000_000)).toBe(480_000);
  });

  test("合計所得24,000,001円 → 基礎控除320,000円", () => {
    expect(calcBasicDeduction(24_000_001)).toBe(320_000);
  });

  test("合計所得24,500,001円 → 基礎控除160,000円", () => {
    expect(calcBasicDeduction(24_500_001)).toBe(160_000);
  });

  test("合計所得25,000,001円 → 基礎控除0円", () => {
    expect(calcBasicDeduction(25_000_001)).toBe(0);
  });
});

// ────────────────────────────────────────────────────────
// 所得税率（速算表の境界値）
// ────────────────────────────────────────────────────────
describe("calcIncomeTax（所得税率と税額）", () => {
  test("課税所得1,950,000円 → 税率5%、税額97,500円", () => {
    const { tax, rate } = calcIncomeTax(1_950_000);
    expect(rate).toBe(0.05);
    expect(tax).toBe(97_500); // 1,950,000 * 0.05 - 0 = 97,500
  });

  test("課税所得1,950,001円 → 税率10%", () => {
    const { tax, rate } = calcIncomeTax(1_950_001);
    expect(rate).toBe(0.10);
    // 1,950,001 * 0.10 - 97,500 = 195,000.1 - 97,500 = 97,500.1 → floor = 97,500
    expect(tax).toBe(97_500);
  });

  test("課税所得3,300,000円 → 税率10%、税額232,500円", () => {
    const { tax, rate } = calcIncomeTax(3_300_000);
    expect(rate).toBe(0.10);
    expect(tax).toBe(232_500); // 3,300,000 * 0.10 - 97,500 = 330,000 - 97,500
  });

  test("課税所得3,300,001円 → 税率20%", () => {
    const { rate } = calcIncomeTax(3_300_001);
    expect(rate).toBe(0.20);
  });

  test("課税所得6,950,000円 → 税率20%、税額962,500円", () => {
    const { tax, rate } = calcIncomeTax(6_950_000);
    expect(rate).toBe(0.20);
    expect(tax).toBe(962_500); // 6,950,000 * 0.20 - 427,500 = 1,390,000 - 427,500
  });

  test("課税所得6,950,001円 → 税率23%", () => {
    const { rate } = calcIncomeTax(6_950_001);
    expect(rate).toBe(0.23);
  });

  test("課税所得9,000,000円 → 税率23%、税額1,434,000円", () => {
    const { tax, rate } = calcIncomeTax(9_000_000);
    expect(rate).toBe(0.23);
    expect(tax).toBe(1_434_000); // 9,000,000 * 0.23 - 636,000 = 2,070,000 - 636,000
  });

  test("課税所得18,000,000円 → 税率33%、税額4,404,000円", () => {
    const { tax, rate } = calcIncomeTax(18_000_000);
    expect(rate).toBe(0.33);
    expect(tax).toBe(4_404_000); // 18,000,000 * 0.33 - 1,536,000 = 5,940,000 - 1,536,000
  });

  test("課税所得40,000,000円 → 税率40%、税額13,204,000円", () => {
    const { tax, rate } = calcIncomeTax(40_000_000);
    expect(rate).toBe(0.40);
    expect(tax).toBe(13_204_000); // 40,000,000 * 0.40 - 2,796,000 = 16,000,000 - 2,796,000
  });

  test("課税所得40,000,001円 → 税率45%", () => {
    const { rate } = calcIncomeTax(40_000_001);
    expect(rate).toBe(0.45);
  });
});

// ────────────────────────────────────────────────────────
// 復興特別所得税
// ────────────────────────────────────────────────────────
describe("calcReconstructionTax（復興特別所得税）", () => {
  test("所得税額100,000円 → 復興税2,100円", () => {
    // 100,000 * 0.021 = 2,100
    expect(calcReconstructionTax(100_000)).toBe(2_100);
  });

  test("所得税額0円 → 復興税0円", () => {
    expect(calcReconstructionTax(0)).toBe(0);
  });
});

// ────────────────────────────────────────────────────────
// 統合テスト（年収から最終税額まで）
// ────────────────────────────────────────────────────────
describe("calculateIncomeTax（統合テスト）", () => {
  test("年収5,000,000円、控除なし → 所得税+復興税 = 214,920円", () => {
    // 給与所得: 5,000,000 - (5,000,000 * 0.2 + 440,000) = 5,000,000 - 1,440,000 = 3,560,000
    // 基礎控除: 480,000
    // 課税所得: floor((3,560,000 - 480,000) / 1000) * 1000 = 3,080,000
    // 所得税: floor(3,080,000 * 0.10 - 97,500) = 210,500
    // 復興税: floor(210,500 * 0.021) = 4,420
    // 合計: 214,920
    const result = calculateIncomeTax(makeInput(5_000_000));
    expect(result.totalTax).toBe(214_920);
    expect(result.employmentIncome).toBe(3_560_000);
    expect(result.taxableIncome).toBe(3_080_000);
    expect(result.incomeTax).toBe(210_500);
    expect(result.reconstructionTax).toBe(4_420);
  });

  test("年収3,000,000円、控除なし → 所得税+復興税 = 78,617円", () => {
    // 給与所得: 3,000,000 - (3,000,000 * 0.3 + 80,000) = 3,000,000 - 980,000 = 2,020,000
    // 基礎控除: 480,000
    // 課税所得: floor((2,020,000 - 480,000) / 1000) * 1000 = 1,540,000
    // 所得税: floor(1,540,000 * 0.05) = 77,000
    // 復興税: floor(77,000 * 0.021) = 1,617
    // 合計: 78,617
    const result = calculateIncomeTax(makeInput(3_000_000));
    expect(result.totalTax).toBe(78_617);
    expect(result.employmentIncome).toBe(2_020_000);
    expect(result.taxableIncome).toBe(1_540_000);
    expect(result.incomeTax).toBe(77_000);
    expect(result.reconstructionTax).toBe(1_617);
  });

  test("年収50,000,000円、控除なし → 所得税+復興税 = 17,179,856円", () => {
    // 給与所得: 50,000,000 - 1,950,000 = 48,050,000
    // 基礎控除: 0（合計所得2500万超）
    // 課税所得: floor(48,050,000 / 1000) * 1000 = 48,050,000
    // 所得税: floor(48,050,000 * 0.45 - 4,796,000) = floor(21,622,500 - 4,796,000) = 16,826,500
    // 復興税: floor(16,826,500 * 0.021) = floor(353,356.5) = 353,356
    // 合計: 17,179,856
    const result = calculateIncomeTax(makeInput(50_000_000));
    expect(result.totalTax).toBe(17_179_856);
    expect(result.employmentIncome).toBe(48_050_000);
    expect(result.basicDeduction).toBe(0);
    expect(result.taxableIncome).toBe(48_050_000);
    expect(result.incomeTax).toBe(16_826_500);
    expect(result.reconstructionTax).toBe(353_356);
  });
});
