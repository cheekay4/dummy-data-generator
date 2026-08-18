import { describe, expect, it } from "vitest";
import { getCaseTruth, listCases } from "../src/cases/caseDb.js";
import { runDebrief } from "../src/llm/debrief.js";
import { estimateSessionCost } from "../src/llm/cost.js";
import { MockTransport } from "../src/llm/transport.js";
import { scoreIdentification } from "../src/scoring/identification.js";
import { judgePalpation } from "../src/scoring/palpation.js";

function debriefInput(
  transport: MockTransport
): Parameters<typeof runDebrief>[0] {
  const truth = getCaseTruth("case-01-supraspinatus-tendinopathy");
  return {
    transport,
    truth,
    palpation: judgePalpation([-170, -60, 1350], truth.targetLandmarks),
    muscles: scoreIdentification(truth.responsibleMuscles, truth.responsibleMuscles),
    nerves: scoreIdentification(truth.innervation, truth.innervation),
    interviewCoveredCategories: ["疼痛部位", "夜間痛"],
    studentReasoning: "外転時の痛みと夜間痛から判断しました",
  };
}

describe("講評（§6.1 L3 / §2.2 / D-012）", () => {
  it("正常な講評はそのまま返す", async () => {
    const transport = new MockTransport([
      "触診は大結節を正確に捉えられました。棘上筋は肩甲上神経支配である点も正答です。",
    ]);
    const r = await runDebrief(debriefInput(transport));
    expect(r.retried).toBe(false);
    expect(r.factGuardViolations).toEqual([]);
    expect(transport.requests[0]!.model).not.toMatch(/fable|opus/i);
    expect(transport.requests[0]!.disableThinking).toBe(true);
  });

  it("DB に無い筋名を出したら再試行し、警告を渡す", async () => {
    const transport = new MockTransport([
      "上腕橈骨筋の関与が考えられます",
      "棘上筋の触診は良好でした",
    ]);
    const r = await runDebrief(debriefInput(transport));
    expect(r.retried).toBe(true);
    expect(r.factGuardViolations).toEqual([]);
    expect(transport.requests).toHaveLength(2);
    expect(transport.requests[1]!.messages.at(-1)!.content).toContain("上腕橈骨筋");
    expect(r.feedback).toBe("棘上筋の触診は良好でした");
  });

  it("再試行後も違反が残る場合はマスクして返す（フェイルクローズ）", async () => {
    const transport = new MockTransport([
      "腓腹筋が原因です",
      "やはり腓腹筋が原因です",
    ]);
    const r = await runDebrief(debriefInput(transport));
    expect(r.retried).toBe(true);
    expect(r.factGuardViolations).toContain("腓腹筋");
    expect(r.feedback).not.toContain("腓腹筋");
    expect(r.feedback).toContain("（データ未収載の構造）");
  });

  it("スコアはプロンプトに埋め込むのみで、LLM出力から数値を取り込まない", async () => {
    const transport = new MockTransport(["スコアは100点満点です！"]);
    const r = await runDebrief(debriefInput(transport));
    // 返り値にスコアは存在しない（feedback のみ）= L3 はスコアに関与できない
    expect(Object.keys(r)).toEqual(["feedback", "factGuardViolations", "retried", "usage"]);
  });
});

describe("identification 採点（§5.3 決定論）", () => {
  it("完全一致で F1=1、同一入力で同一結果", () => {
    const a = scoreIdentification(["FMA9629"], ["FMA9629"]);
    const b = scoreIdentification(["FMA9629"], ["FMA9629"]);
    expect(a.score).toBe(1);
    expect(a).toEqual(b);
  });

  it("部分一致・誤答の計上", () => {
    const r = scoreIdentification(["FMA9629", "FMA32521"], ["FMA9629", "FMA32546"]);
    expect(r.correct).toEqual(["FMA9629"]);
    expect(r.missed).toEqual(["FMA32546"]);
    expect(r.extra).toEqual(["FMA32521"]);
    expect(r.score).toBeCloseTo(0.5);
  });
});

describe("API 原価（§2.5 / §9）", () => {
  it("全症例で 1 セッション 4 円以下（保守的前提・キャッシュなし）", () => {
    for (const c of listCases()) {
      const e = estimateSessionCost(c.id);
      expect(e.totalJpy, `${c.id}: ${e.totalJpy.toFixed(2)}円`).toBeLessThanOrEqual(4);
    }
  });
});
