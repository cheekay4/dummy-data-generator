// @vitest-environment jsdom
import { describe, test, expect, beforeEach } from "vitest";
import { saveTaxData, loadTaxData, clearTaxData } from "../storage";

beforeEach(() => {
  localStorage.clear();
});

describe("localStorage耐性", () => {
  test("空の状態で loadTaxData → 空オブジェクトを返す", () => {
    const data = loadTaxData();
    expect(data).toEqual({});
  });

  test("saveTaxData → loadTaxData で値が取れる", () => {
    saveTaxData({ salary: 5_000_000 });
    const data = loadTaxData();
    expect(data.salary).toBe(5_000_000);
  });

  test("部分更新: salary保存後にmedicalDeduction保存 → 両方残る", () => {
    saveTaxData({ salary: 5_000_000 });
    saveTaxData({ medicalDeduction: 50_000 });
    const data = loadTaxData();
    expect(data.salary).toBe(5_000_000);
    expect(data.medicalDeduction).toBe(50_000);
  });

  test("clearTaxData → データが空になる", () => {
    saveTaxData({ salary: 5_000_000 });
    clearTaxData();
    const data = loadTaxData();
    expect(data).toEqual({});
  });

  test("破損データ: 不正なJSONが入っていてもクラッシュしない", () => {
    localStorage.setItem("kakutei-tools-data", "{broken json!!!");
    const data = loadTaxData();
    expect(data).toEqual({});
  });

  test("型不整合: salaryが文字列でもクラッシュしない", () => {
    localStorage.setItem("kakutei-tools-data", '{"salary":"abc"}');
    expect(() => loadTaxData()).not.toThrow();
    const data = loadTaxData();
    // 値が読めてもクラッシュしないことを確認
    expect(data).toBeDefined();
  });

  test("localStorage使用不可でもクラッシュしない", () => {
    const original = localStorage.setItem.bind(localStorage);
    localStorage.setItem = () => { throw new Error("QuotaExceeded"); };
    expect(() => saveTaxData({ salary: 5_000_000 })).not.toThrow();
    localStorage.setItem = original;
  });

  test("lastUpdatedが自動設定される", () => {
    saveTaxData({ salary: 5_000_000 });
    const data = loadTaxData();
    expect(data.lastUpdated).toBeDefined();
    expect(new Date(data.lastUpdated!).getTime()).not.toBeNaN();
  });

  test("複数フィールドを一度に保存できる", () => {
    saveTaxData({
      salary: 5_000_000,
      incomeTax: 214_920,
      medicalDeduction: 50_000,
      furusatoLimit: 61_000,
    });
    const data = loadTaxData();
    expect(data.salary).toBe(5_000_000);
    expect(data.incomeTax).toBe(214_920);
    expect(data.medicalDeduction).toBe(50_000);
    expect(data.furusatoLimit).toBe(61_000);
  });

  test("同じキーを上書き保存すると最新値が返る", () => {
    saveTaxData({ salary: 3_000_000 });
    saveTaxData({ salary: 5_000_000 });
    const data = loadTaxData();
    expect(data.salary).toBe(5_000_000);
  });
});
