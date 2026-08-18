import { describe, expect, it } from "vitest";
import { OutOfScopeError } from "../src/facts/errors.js";
import { getStructureFacts } from "../src/facts/getStructureFacts.js";

describe("getStructureFacts（仕様 §2.2 / §3.1）", () => {
  it("三角筋（FMA32521）の事実を返す", () => {
    const f = getStructureFacts("FMA32521");
    expect(f.nameJa).toBe("三角筋");
    expect(f.innervation).toEqual(["FMA37072"]); // 腋窩神経
  });

  it("scope 外の構造は OutOfScopeError（例: 大殿筋 FMA22314）", () => {
    expect(() => getStructureFacts("FMA22314")).toThrow(OutOfScopeError);
  });

  it("存在しない FMA ID も OutOfScopeError", () => {
    expect(() => getStructureFacts("FMA99999999")).toThrow(OutOfScopeError);
  });

  it("決定論性: 同一入力に対して常に同一の値を返す（仕様 §2.3）", () => {
    const a = getStructureFacts("FMA9629");
    const b = getStructureFacts("FMA9629");
    expect(a).toEqual(b);
    expect(a).toBe(b); // 同一参照（読み取り専用テーブル）
  });
});
