import { describe, test, expect } from "vitest";
import { calcLifeInsuranceDeduction } from "../life-insurance-deduction";

// ヘルパー: 一般新のみ指定
function generalNew(generalNew: number) {
  return calcLifeInsuranceDeduction({ generalNew, generalOld: 0, medicalNew: 0, pensionNew: 0, pensionOld: 0 });
}
// ヘルパー: 一般旧のみ指定
function generalOld(generalOld: number) {
  return calcLifeInsuranceDeduction({ generalNew: 0, generalOld, medicalNew: 0, pensionNew: 0, pensionOld: 0 });
}

describe("新制度（一般）", () => {
  test("新制度20,000円 → 控除20,000円（全額）", () => {
    expect(generalNew(20_000).general).toBe(20_000);
  });

  test("新制度20,001円 → 20,000超の計算", () => {
    // floor(20,001 * 0.5 + 10,000) = floor(10,000.5 + 10,000) = 20,000
    expect(generalNew(20_001).general).toBe(20_000);
  });

  test("新制度40,000円 → 控除30,000円", () => {
    // floor(40,000 * 0.5 + 10,000) = 30,000
    expect(generalNew(40_000).general).toBe(30_000);
  });

  test("新制度80,000円 → 控除40,000円（上限）", () => {
    // floor(80,000 * 0.25 + 20,000) = 40,000
    expect(generalNew(80_000).general).toBe(40_000);
  });

  test("新制度80,001円 → 控除40,000円（上限）", () => {
    expect(generalNew(80_001).general).toBe(40_000);
  });
});

describe("旧制度（一般）", () => {
  test("旧制度25,000円 → 控除25,000円（全額）", () => {
    expect(generalOld(25_000).general).toBe(25_000);
  });

  test("旧制度50,000円 → 控除37,500円", () => {
    // floor(50,000 * 0.5 + 12,500) = 37,500
    expect(generalOld(50_000).general).toBe(37_500);
  });

  test("旧制度100,000円 → 控除50,000円（上限）", () => {
    // floor(100,000 * 0.25 + 25,000) = 50,000
    expect(generalOld(100_000).general).toBe(50_000);
  });

  test("旧制度100,001円 → 控除50,000円（上限）", () => {
    expect(generalOld(100_001).general).toBe(50_000);
  });
});

describe("新旧混在（最有利判定）", () => {
  test("一般新40,000円 + 一般旧60,000円 → 合算・旧のみともに40,000円（同額）", () => {
    // 新のみ: floor(40,000 * 0.5 + 10,000) = 30,000
    // 旧のみ: 60,000は「50,000超〜100,000以下」区間 → floor(60,000 * 0.25 + 25,000) = 40,000
    // 合算: min(30,000 + 40,000, 40,000) = 40,000
    // → oldOnly(40,000) > combined(40,000) が false → 合算採用（40,000）
    const result = calcLifeInsuranceDeduction({ generalNew: 40_000, generalOld: 60_000, medicalNew: 0, pensionNew: 0, pensionOld: 0 });
    expect(result.general).toBe(40_000);
  });

  test("一般新80,000円 + 一般旧30,000円 → 合算が有利", () => {
    // 旧のみ: floor(30,000 * 0.5 + 12,500) = 27,500
    // 合算: min(floor(80,000 * 0.25 + 20,000) + floor(30,000 * 0.5 + 12,500), 40,000)
    //       = min(40,000 + 27,500, 40,000) = 40,000
    // → 合算40,000 > 旧のみ27,500 → 合算を採用
    const result = calcLifeInsuranceDeduction({ generalNew: 80_000, generalOld: 30_000, medicalNew: 0, pensionNew: 0, pensionOld: 0 });
    expect(result.general).toBe(40_000);
    expect(result.generalMethod).toBe("新旧合算");
  });
});

describe("3区分合計", () => {
  test("一般新80,000 + 介護医療80,000 + 個人年金新80,000 → 合計120,000円", () => {
    // 各区分: 40,000 + 40,000 + 40,000 = 120,000
    const result = calcLifeInsuranceDeduction({ generalNew: 80_000, generalOld: 0, medicalNew: 80_000, pensionNew: 80_000, pensionOld: 0 });
    expect(result.general).toBe(40_000);
    expect(result.medical).toBe(40_000);
    expect(result.pension).toBe(40_000);
    expect(result.total).toBe(120_000);
  });

  test("3区分全て大きい値 → 上限120,000円", () => {
    // 各区分40,000ずつ → 合計上限120,000
    const result = calcLifeInsuranceDeduction({ generalNew: 200_000, generalOld: 0, medicalNew: 200_000, pensionNew: 200_000, pensionOld: 0 });
    expect(result.total).toBe(120_000);
  });
});
