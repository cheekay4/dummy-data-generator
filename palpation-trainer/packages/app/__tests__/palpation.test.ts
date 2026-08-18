import { describe, expect, it } from "vitest";
import { judgePalpation, type Landmark } from "../src/scoring/palpation.js";

const acromion: Landmark = {
  fmaId: "FMA23260",
  center: [-180, -40, 1400],
  radiusMm: 20,
  radiusRationale: "テスト用",
  weight: 2,
};
const epicondyle: Landmark = {
  fmaId: "FMA23442",
  center: [-200, -60, 1080],
  radiusMm: 15,
  radiusRationale: "テスト用",
  weight: 1,
};

describe("judgePalpation（仕様 §5.2 / §6.1 L1 決定論）", () => {
  it("半径内クリックは withinRadius=true", () => {
    const j = judgePalpation([-180, -40, 1390], [acromion]);
    expect(j.results[0]!.withinRadius).toBe(true);
    expect(j.results[0]!.distanceMm).toBeCloseTo(10);
    expect(j.weightedScore).toBe(1);
  });

  it("半径ちょうどは命中扱い（境界は inclusive）", () => {
    const j = judgePalpation([-180, -40, 1420], [acromion]);
    expect(j.results[0]!.distanceMm).toBeCloseTo(20);
    expect(j.results[0]!.withinRadius).toBe(true);
  });

  it("半径外クリックは外れ、nearest が距離を返す", () => {
    const j = judgePalpation([-180, -40, 1300], [acromion, epicondyle]);
    expect(j.results.every((r) => !r.withinRadius)).toBe(true);
    expect(j.nearest!.fmaId).toBe("FMA23260");
    expect(j.weightedScore).toBe(0);
  });

  it("weight による重み付け（acromion のみ命中 → 2/3）", () => {
    const j = judgePalpation([-180, -40, 1400], [acromion, epicondyle]);
    expect(j.weightedScore).toBeCloseTo(2 / 3);
  });

  it("決定論性: 同一入力 → 同一結果（仕様 §2.3）", () => {
    const a = judgePalpation([-181.5, -42.25, 1401], [acromion, epicondyle]);
    const b = judgePalpation([-181.5, -42.25, 1401], [acromion, epicondyle]);
    expect(a).toEqual(b);
  });

  it("ランドマーク0件でも安全（nearest=null, score=0）", () => {
    const j = judgePalpation([0, 0, 0], []);
    expect(j.nearest).toBeNull();
    expect(j.weightedScore).toBe(0);
  });
});
