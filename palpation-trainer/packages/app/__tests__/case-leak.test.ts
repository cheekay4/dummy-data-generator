import { describe, expect, it } from "vitest";
import { getCasePublic, getCaseTruth, listCases } from "../src/cases/caseDb.js";
import { getStructureFacts } from "../src/facts/getStructureFacts.js";
import type { CaseDefinition, CasePublic } from "../src/types/case.js";

/** 患者役呼び出しの引数型は CasePublic のみ（§2.4）を模した関数 */
function patientActorPromptInput(pub: CasePublic): string {
  return JSON.stringify(pub);
}

describe("正解データのリーク防止（§2.4 / §9）", () => {
  it("型テスト: CaseDefinition を患者役に渡すとコンパイルエラーになる", () => {
    const def = {} as CaseDefinition;
    // @ts-expect-error CaseDefinition（truth を含む）は CasePublic に代入不可
    patientActorPromptInput(def);
    // 正しい呼び出しは通る
    expect(() => patientActorPromptInput(getCasePublic(listCases()[0]!.id))).not.toThrow();
  });

  it("ランタイムテスト: public の直列化に truth 由来の文字列が含まれない", () => {
    for (const c of listCases()) {
      const pubJson = JSON.stringify(getCasePublic(c.id));
      const truth = getCaseTruth(c.id);

      expect(pubJson, `${c.id}: FMA ID`).not.toContain("FMA");
      expect(pubJson, `${c.id}: 診断ラベル`).not.toContain(truth.diagnosisLabel);
      for (const m of truth.responsibleMuscles) {
        const f = getStructureFacts(m);
        expect(pubJson, `${c.id}: 筋名 ${f.nameJa}`).not.toContain(f.nameJa);
        expect(pubJson, `${c.id}: 筋名 ${f.nameEn}`).not.toContain(f.nameEn);
      }
      for (const n of truth.innervation) {
        const f = getStructureFacts(n);
        expect(pubJson, `${c.id}: 神経名 ${f.nameJa}`).not.toContain(f.nameJa);
      }
      for (const d of truth.distractors) {
        expect(pubJson, `${c.id}: distractor`).not.toContain(d.reason);
      }
      for (const lm of truth.targetLandmarks) {
        expect(pubJson, `${c.id}: 座標`).not.toContain(String(lm.center[0]));
      }
    }
  });

  it("public と truth のアクセサは別オブジェクトを返す（変異が DB を汚染しない）", () => {
    const id = listCases()[0]!.id;
    const a = getCasePublic(id);
    a.chiefComplaint = "改変テスト";
    expect(getCasePublic(id).chiefComplaint).not.toBe("改変テスト");
    const t = getCaseTruth(id);
    t.diagnosisLabel = "改変テスト";
    expect(getCaseTruth(id).diagnosisLabel).not.toBe("改変テスト");
  });
});
