import { describe, expect, it } from "vitest";
import { getCaseTruth, listCases } from "../src/cases/caseDb.js";
import { getStructureFacts } from "../src/facts/getStructureFacts.js";
import { buildIdentificationChoices } from "../src/session/choices.js";
import { createOsceSession } from "../src/session/engine.js";
import {
  ALL_INTERVIEW_CATEGORIES,
  coveredCategories,
  matchQuestionCategories,
} from "../src/scoring/interviewCoverage.js";
import { scoreTask } from "../src/scoring/scoreTask.js";
import type { Task } from "../src/types/session.js";

const CASE_ID = "case-01-supraspinatus-tendinopathy";

describe("osce セッション生成（§4.1）", () => {
  it("interview → palpation → identification → debrief の4タスク", () => {
    const s = createOsceSession(CASE_ID, "s1");
    expect(s.mode).toBe("osce");
    expect(s.tasks.map((t) => t.type)).toEqual([
      "interview",
      "palpation",
      "identification",
      "debrief",
    ]);
    expect(new Set(s.tasks.map((t) => t.id)).size).toBe(4);
  });
});

describe("L2 問診カバレッジ（§6.1 / D-014）", () => {
  it("カテゴリ表は全症例の historyScript キーを網羅している", () => {
    for (const c of listCases()) {
      const s = createOsceSession(c.id, "x");
      expect(s.tasks[0]!.caseId).toBe(c.id);
    }
    // 全症例のカテゴリが判定表に存在する（データとの同期テスト）
    expect(ALL_INTERVIEW_CATEGORIES).toHaveLength(10);
  });

  it.each([
    ["いつから痛みますか？", "発症・きっかけ"],
    ["どこが痛みますか？", "疼痛部位"],
    ["夜は眠れていますか？", "夜間痛"],
    ["どんな動きで痛くなりますか？", "増悪動作"],
    ["お仕事は何をされていますか？", "職業・生活"],
    ["しびれはありますか？", "しびれ・感覚"],
  ])("「%s」→ %s", (q, expected) => {
    expect(matchQuestionCategories(q)).toContain(expected);
  });

  it("決定論: 同一の質問リスト → 同一のカバレッジ", () => {
    const qs = ["いつから痛いですか", "夜は眠れますか", "どこが痛みますか"];
    expect(coveredCategories(qs)).toEqual(coveredCategories(qs));
    expect(coveredCategories(qs)).toEqual(["発症・きっかけ", "疼痛部位", "夜間痛"]);
  });
});

describe("scoreTask（§4.1 / §2.3 決定論）", () => {
  const session = createOsceSession(CASE_ID, "s2");
  const [interview, palpation, identification, debrief] = session.tasks as [Task, Task, Task, Task];

  it("同一解答 → 同一スコア（§9）", () => {
    const attempt = {
      taskId: palpation.id,
      type: "palpation" as const,
      point: [-172.8, -57.5, 1351] as [number, number, number],
    };
    const a = scoreTask(palpation, attempt);
    const b = scoreTask(palpation, attempt);
    expect(a).toEqual(b);
    expect(a.scored).toBe(true);
    expect(a.score).toBeGreaterThan(0);
  });

  it("interview: カバレッジがスコアになる", () => {
    const s = scoreTask(interview, {
      taskId: interview.id,
      type: "interview",
      questions: ["いつから痛いですか", "どこが痛みますか"],
    });
    expect(s.score).toBeCloseTo(2 / 10);
    expect(s.detail.covered).toEqual(["発症・きっかけ", "疼痛部位"]);
  });

  it("identification: 筋・神経 F1 の平均", () => {
    const truth = getCaseTruth(CASE_ID);
    const s = scoreTask(identification, {
      taskId: identification.id,
      type: "identification",
      muscles: truth.responsibleMuscles,
      nerves: [],
      reasoning: "",
    });
    expect(s.score).toBeCloseTo(0.5);
  });

  it("palpation: 未回答は 0 点", () => {
    const s = scoreTask(palpation, { taskId: palpation.id, type: "palpation", point: null });
    expect(s.score).toBe(0);
  });

  it("debrief は公式スコアに算入されない（scored=false）", () => {
    const s = scoreTask(debrief, { taskId: debrief.id, type: "debrief" });
    expect(s.scored).toBe(false);
  });

  it("task と attempt の不一致は拒否", () => {
    expect(() =>
      scoreTask(palpation, { taskId: interview.id, type: "interview", questions: [] })
    ).toThrow();
  });
});

describe("選択肢生成（§6.2 / D-015）", () => {
  it("全症例: distractor を必ず含み、正解も含む。決定論的", () => {
    for (const c of listCases()) {
      const truth = getCaseTruth(c.id);
      const a = buildIdentificationChoices(c.id);
      const b = buildIdentificationChoices(c.id);
      expect(a).toEqual(b); // 同一症例 → 同一の選択肢・同一の並び

      const muscleIds = a.muscles.map((x) => x.fmaId);
      const nerveIds = a.nerves.map((x) => x.fmaId);
      for (const m of truth.responsibleMuscles) expect(muscleIds, c.id).toContain(m);
      for (const n of truth.innervation) expect(nerveIds, c.id).toContain(n);
      for (const d of truth.distractors) {
        const pool = d.kind === "muscle" ? muscleIds : nerveIds;
        expect(pool, `${c.id}: distractor ${d.fmaId}`).toContain(d.fmaId);
      }
      // 正解が消去法で当たらないよう、選択肢は正解数より十分多い
      expect(muscleIds.length).toBeGreaterThanOrEqual(truth.responsibleMuscles.length + 4);
      expect(nerveIds.length).toBeGreaterThanOrEqual(truth.innervation.length + 3);
      // カテゴリ整合
      for (const id of muscleIds) expect(getStructureFacts(id).category).toBe("muscle");
      for (const id of nerveIds) expect(getStructureFacts(id).category).toBe("nerve");
    }
  });
});
