import { describe, expect, it } from "vitest";
import { getScopeIds, getStructureFacts, listScope } from "../src/facts/getStructureFacts.js";

const scope = listScope();

describe("層B 構造事実テーブルの整合性", () => {
  it("scope は 50〜80 構造（仕様 §3.1）", () => {
    expect(scope.structures.length).toBeGreaterThanOrEqual(50);
    expect(scope.structures.length).toBeLessThanOrEqual(80);
  });

  it("scope の全 FMA ID に層B レコードが存在する", () => {
    for (const s of scope.structures) {
      const f = getStructureFacts(s.fmaId);
      expect(f.fmaId).toBe(s.fmaId);
      expect(f.category).toBe(s.category);
    }
  });

  it("筋レコードは起始・停止・支配神経・作用を必ず持つ", () => {
    const muscles = scope.structures.filter((s) => s.category === "muscle");
    expect(muscles.length).toBeGreaterThanOrEqual(15);
    for (const m of muscles) {
      const f = getStructureFacts(m.fmaId);
      expect(f.origin, `${f.nameJa} origin`).toBeTruthy();
      expect(f.insertion, `${f.nameJa} insertion`).toBeTruthy();
      expect(f.action, `${f.nameJa} action`).toBeTruthy();
      expect(f.innervation, `${f.nameJa} innervation`).toBeTruthy();
      expect(f.innervation!.length).toBeGreaterThan(0);
    }
  });

  it("支配神経の FMA ID は scope 内の nerve カテゴリに解決される", () => {
    for (const s of scope.structures) {
      const f = getStructureFacts(s.fmaId);
      for (const nerveId of f.innervation ?? []) {
        const nerve = getStructureFacts(nerveId);
        expect(nerve.category, `${f.nameJa} → ${nerveId}`).toBe("nerve");
      }
    }
  });

  it("全レコードが日本語・英語・ラテン語名と出典を持つ", () => {
    for (const s of scope.structures) {
      const f = getStructureFacts(s.fmaId);
      expect(f.nameJa).toBeTruthy();
      expect(f.nameEn).toBeTruthy();
      expect(f.nameLa).toBeTruthy();
      expect(f.source).toBeTruthy();
      expect(f.review.reviewStatus).toBe("draft"); // 教員レビュー前は全件 draft
    }
  });

  it("nameJa と aliasesJa に重複がない", () => {
    for (const s of scope.structures) {
      const f = getStructureFacts(s.fmaId);
      expect(f.aliasesJa).not.toContain(f.nameJa);
    }
  });

  it("scope の ID 集合と listScope が一致する", () => {
    expect(getScopeIds().size).toBe(scope.structures.length);
  });
});
