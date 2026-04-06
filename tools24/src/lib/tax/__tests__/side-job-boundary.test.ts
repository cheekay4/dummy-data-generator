import { describe, test, expect } from "vitest";
import { checkSideJob } from "../side-job-checker";

const base = { salary: 5_000_000, sideJobWithholding: 0 };

describe("副業20万円ライン境界値", () => {
  test("フリーランス: 収入200,001 - 経費0 = 所得200,001 → 要申告", () => {
    const result = checkSideJob({ ...base, sideJobType: "freelance", sideJobRevenue: 200_001, sideJobExpenses: 0 });
    expect(result.needsFiling).toBe(true);
    expect(result.sideJobIncome).toBe(200_001);
  });

  test("フリーランス: 収入200,000 - 経費0 = 所得200,000 → 不要", () => {
    const result = checkSideJob({ ...base, sideJobType: "freelance", sideJobRevenue: 200_000, sideJobExpenses: 0 });
    expect(result.needsFiling).toBe(false);
    expect(result.sideJobIncome).toBe(200_000);
  });

  test("フリーランス: 収入200,001 - 経費1 = 所得200,000 → 不要", () => {
    const result = checkSideJob({ ...base, sideJobType: "freelance", sideJobRevenue: 200_001, sideJobExpenses: 1 });
    expect(result.needsFiling).toBe(false);
    expect(result.sideJobIncome).toBe(200_000);
  });

  test("フリーランス: 収入300,000 - 経費100,001 = 所得199,999 → 不要", () => {
    const result = checkSideJob({ ...base, sideJobType: "freelance", sideJobRevenue: 300_000, sideJobExpenses: 100_001 });
    expect(result.needsFiling).toBe(false);
    expect(result.sideJobIncome).toBe(199_999);
  });

  test("フリーランス: 所得0円 → 不要", () => {
    const result = checkSideJob({ ...base, sideJobType: "freelance", sideJobRevenue: 0, sideJobExpenses: 0 });
    expect(result.needsFiling).toBe(false);
    expect(result.sideJobIncome).toBe(0);
  });

  test("アルバイト: 収入200,001 → 要申告（収入で判定）", () => {
    const result = checkSideJob({ ...base, sideJobType: "part_time", sideJobRevenue: 200_001, sideJobExpenses: 0 });
    expect(result.needsFiling).toBe(true);
  });

  test("アルバイト: 収入200,000 → 不要", () => {
    const result = checkSideJob({ ...base, sideJobType: "part_time", sideJobRevenue: 200_000, sideJobExpenses: 0 });
    expect(result.needsFiling).toBe(false);
  });

  test("退職: 金額に関わらず → 要申告", () => {
    // 収入0でも退職は常に申告必要
    const result = checkSideJob({ ...base, sideJobType: "retired", sideJobRevenue: 0, sideJobExpenses: 0 });
    expect(result.needsFiling).toBe(true);
  });

  test("退職: 高額でも同じく → 要申告", () => {
    const result = checkSideJob({ ...base, sideJobType: "retired", sideJobRevenue: 10_000_000, sideJobExpenses: 0 });
    expect(result.needsFiling).toBe(true);
  });

  test("フリーランス: 経費が収入を上回っても所得は0円以下にならない", () => {
    const result = checkSideJob({ ...base, sideJobType: "freelance", sideJobRevenue: 100_000, sideJobExpenses: 200_000 });
    expect(result.sideJobIncome).toBe(0);
    expect(result.needsFiling).toBe(false);
  });
});
