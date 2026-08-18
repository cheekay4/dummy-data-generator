import { describe, expect, it } from "vitest";
import { getCasePublic, getCaseTruth, listCases } from "../src/cases/caseDb.js";
import { getStructureFacts } from "../src/facts/getStructureFacts.js";

describe("症例 DB（§7.2 内訳 / §9 整合性）", () => {
  const cases = listCases();

  it("10 症例が存在する", () => {
    expect(cases).toHaveLength(10);
  });

  it("難易度の内訳: 初級4 / 中級4 / 上級2（D-007）", () => {
    const count = { basic: 0, intermediate: 0, advanced: 0 };
    for (const c of cases) count[c.difficulty]++;
    expect(count).toEqual({ basic: 4, intermediate: 4, advanced: 2 });
  });

  it("複数筋関与の症例が2件以上ある（§7.2）", () => {
    const multi = cases.filter((c) => getCaseTruth(c.id).responsibleMuscles.length >= 2);
    expect(multi.length).toBeGreaterThanOrEqual(2);
  });

  it("truth の参照 FMA ID は全て scope 内で解決できる", () => {
    for (const c of cases) {
      const t = getCaseTruth(c.id);
      for (const id of [
        ...t.responsibleMuscles,
        ...t.innervation,
        ...t.targetLandmarks.map((l) => l.fmaId),
        ...t.distractors.map((d) => d.fmaId),
      ]) {
        expect(() => getStructureFacts(id), `${c.id}:${id}`).not.toThrow();
      }
    }
  });

  it("ランドマーク座標は人体の範囲内（ネイティブ mm）", () => {
    for (const c of cases) {
      for (const lm of getCaseTruth(c.id).targetLandmarks) {
        const [x, y, z] = lm.center;
        expect(x, `${c.id} X`).toBeGreaterThan(-340);
        expect(x, `${c.id} X`).toBeLessThan(340);
        expect(y, `${c.id} Y`).toBeGreaterThan(-250);
        expect(y, `${c.id} Y`).toBeLessThan(50);
        expect(z, `${c.id} Z`).toBeGreaterThan(900); // 肩〜上腕領域は概ね体幹上部
        expect(z, `${c.id} Z`).toBeLessThan(1500);
        expect(lm.radiusRationale.length).toBeGreaterThan(10);
      }
    }
  });

  it("責任筋と誤答選択肢（distractor）が重複しない", () => {
    for (const c of cases) {
      const t = getCaseTruth(c.id);
      const answers = new Set([...t.responsibleMuscles, ...t.innervation]);
      for (const d of t.distractors) {
        expect(answers.has(d.fmaId), `${c.id}: ${d.fmaId}`).toBe(false);
      }
    }
  });

  it("persona.cooperativeness は MVP では high 固定で、forbidden が機能している（§7.3）", () => {
    for (const c of cases) {
      const p = getCasePublic(c.id);
      expect(p.persona.cooperativeness).toBe("high");
      expect(p.forbidden.length).toBeGreaterThan(0);
    }
  });
});
