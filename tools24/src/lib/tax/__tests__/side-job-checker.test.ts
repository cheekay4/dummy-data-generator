import { describe, test, expect } from "vitest";
import { checkSideJob } from "../side-job-checker";

const baseParams = {
  salary: 5_000_000,
  sideJobWithholding: 0,
};

describe("checkSideJob（副業申告判定）", () => {
  describe("フリーランス", () => {
    test("フリーランス、所得200,001円 → 要申告", () => {
      // 収入200,001 - 経費0 = 所得200,001 > 200,000
      const result = checkSideJob({ ...baseParams, sideJobType: "freelance", sideJobRevenue: 200_001, sideJobExpenses: 0 });
      expect(result.needsFiling).toBe(true);
      expect(result.sideJobIncome).toBe(200_001);
    });

    test("フリーランス、所得200,000円 → 不要", () => {
      // 200,000 <= 200,000
      const result = checkSideJob({ ...baseParams, sideJobType: "freelance", sideJobRevenue: 200_000, sideJobExpenses: 0 });
      expect(result.needsFiling).toBe(false);
    });

    test("フリーランス、所得199,999円 → 不要", () => {
      const result = checkSideJob({ ...baseParams, sideJobType: "freelance", sideJobRevenue: 199_999, sideJobExpenses: 0 });
      expect(result.needsFiling).toBe(false);
    });

    test("フリーランス、経費控除後所得で判定する", () => {
      // 収入300,000 - 経費100,000 = 所得200,000 → 不要
      const result = checkSideJob({ ...baseParams, sideJobType: "freelance", sideJobRevenue: 300_000, sideJobExpenses: 100_000 });
      expect(result.needsFiling).toBe(false);
      expect(result.sideJobIncome).toBe(200_000);
    });
  });

  describe("アルバイト・パート", () => {
    test("アルバイト、収入200,001円 → 要申告", () => {
      // part_timeは収入（sideJobRevenue）で判定
      const result = checkSideJob({ ...baseParams, sideJobType: "part_time", sideJobRevenue: 200_001, sideJobExpenses: 0 });
      expect(result.needsFiling).toBe(true);
    });

    test("アルバイト、収入200,000円 → 不要", () => {
      const result = checkSideJob({ ...baseParams, sideJobType: "part_time", sideJobRevenue: 200_000, sideJobExpenses: 0 });
      expect(result.needsFiling).toBe(false);
    });
  });

  describe("退職ケース", () => {
    test("退職ケース → 常に要申告", () => {
      const result = checkSideJob({ ...baseParams, sideJobType: "retired", sideJobRevenue: 0, sideJobExpenses: 0 });
      expect(result.needsFiling).toBe(true);
    });

    test("退職ケース、収入0円でも要申告", () => {
      const result = checkSideJob({ salary: 0, sideJobType: "retired", sideJobRevenue: 0, sideJobExpenses: 0, sideJobWithholding: 0 });
      expect(result.needsFiling).toBe(true);
    });
  });

  describe("株式（特定口座源泉あり）", () => {
    test("株式（特定口座源泉あり）→ 申告不要を選択可能", () => {
      const result = checkSideJob({ ...baseParams, sideJobType: "stock", sideJobRevenue: 500_000, sideJobExpenses: 0 });
      expect(result.needsFiling).toBe(false);
    });
  });
});
