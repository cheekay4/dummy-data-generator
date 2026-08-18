import { describe, expect, it } from "vitest";
import { getCasePublic, getCaseTruth, listCases } from "../src/cases/caseDb.js";
import { getStructureFacts } from "../src/facts/getStructureFacts.js";
import { maskUnknownTerms, validateAnatomicalTerms } from "../src/llm/factGuard.js";
import { buildPatientSystemPrompt, runInterviewTurn } from "../src/llm/patientActor.js";
import { filterPatientReply } from "../src/llm/patientFilter.js";
import { MockTransport } from "../src/llm/transport.js";
import type { FmaId } from "../src/types/anatomy.js";

describe("患者役プロンプトに truth が渡らない（§2.4 / §9）", () => {
  it("全症例のシステムプロンプトに truth 由来の文字列が含まれない", () => {
    for (const c of listCases()) {
      const prompt = buildPatientSystemPrompt(getCasePublic(c.id));
      const truth = getCaseTruth(c.id);
      expect(prompt, `${c.id}: FMA`).not.toContain("FMA");
      expect(prompt, `${c.id}: 診断`).not.toContain(truth.diagnosisLabel);
      for (const m of truth.responsibleMuscles) {
        expect(prompt, c.id).not.toContain(getStructureFacts(m).nameJa);
      }
      for (const lm of truth.targetLandmarks) {
        expect(prompt, c.id).not.toContain(String(lm.center[0]));
      }
    }
  });
});

describe("患者役の後段フィルタ（§1.3 / §9 / D-011）", () => {
  it.each([
    ["解剖学用語", "棘上筋のあたりが痛いんです"],
    ["解剖学用語(神経)", "腋窩神経が悪いのかもしれません"],
    ["診断名の断定", "これは五十肩だと思われます"],
    ["受診助言", "あなたも早めに整形外科を受診してください"],
    ["検査助言", "MRIを受けてください"],
    ["役割逸脱", "私はAIなので痛みはありません"],
  ])("%s を検出して差し替える", (_label, text) => {
    const r = filterPatientReply(text);
    expect(r.ok).toBe(false);
    expect(r.safeText).not.toBe(text);
    expect(r.violations.length).toBeGreaterThan(0);
  });

  it.each([
    "肩の外側が痛いです。夜に目が覚めることもあります",
    "湿布を貼ると少し楽になります。病院にはまだ行っていません",
    "肩甲骨のあたりが重だるい感じです",
    "鎖骨の下のあたりですね。押すと痛いです",
  ])("自然な患者発話は通す: %s", (text) => {
    expect(filterPatientReply(text).ok).toBe(true);
  });
});

describe("事実生成の禁止強制（§2.2 / §9 / D-012）", () => {
  const allowed = new Set<FmaId>(["FMA9629", "FMA37025"]); // 棘上筋・肩甲上神経

  it("DB に存在しない筋名・神経名を検出する", () => {
    const r = validateAnatomicalTerms(
      "上腕橈骨筋と腓腹筋、そして大腿神経が関与します",
      allowed
    );
    expect(r.ok).toBe(false);
    expect(r.unknownTerms).toEqual(
      expect.arrayContaining(["上腕橈骨筋", "腓腹筋", "大腿神経"])
    );
  });

  it("注入した構造の用語は許可、DB内でも未注入の構造は検出", () => {
    const r = validateAnatomicalTerms("棘上筋は肩甲上神経支配ですが、三角筋も念のため確認を", allowed);
    expect(r.unknownTerms).toEqual([]);
    expect(r.uninjectedTerms).toContain("三角筋");
  });

  it("接頭辞付き（右上腕二頭筋）は DB 用語として解決される", () => {
    const r = validateAnatomicalTerms("右上腕二頭筋を触診", new Set<FmaId>(["FMA37670"]));
    expect(r.ok).toBe(true);
  });

  it("一般語（筋肉・背筋）は検出しない", () => {
    const r = validateAnatomicalTerms("筋肉のはたらきと背筋を伸ばす姿勢が大切です", allowed);
    expect(r.ok).toBe(true);
  });

  it("役割語（支配神経・運動神経・主働筋）は検出しない（ライブテストで発見した偽陽性の回帰）", () => {
    const r = validateAnatomicalTerms(
      "棘上筋の支配神経を確認しましょう。運動神経と感覚神経の区別、主働筋の同定が大切です",
      allowed
    );
    expect(r.ok).toBe(true);
  });

  it("役割語・筋群名（対象筋・責任筋・回旋筋腱板の『回旋筋』）は検出しない", () => {
    const r = validateAnatomicalTerms(
      "触診の対象筋と責任筋の同定では、回旋筋腱板の役割と外転筋の協調を意識しましょう",
      allowed
    );
    expect(r.ok).toBe(true);
  });

  it("マスク処理", () => {
    expect(maskUnknownTerms("腓腹筋が原因", ["腓腹筋"])).toBe("（データ未収載の構造）が原因");
  });
});

describe("患者役ターン実行（MockTransport）", () => {
  const casePublic = getCasePublic(listCases()[0]!.id);

  it("正常応答はそのまま返す", async () => {
    const transport = new MockTransport(["肩の外側です。夜も少しうずきます。"]);
    const r = await runInterviewTurn({ transport, casePublic, history: [], question: "どこが痛みますか" });
    expect(r.reply).toBe("肩の外側です。夜も少しうずきます。");
    expect(r.filter.ok).toBe(true);
    expect(transport.requests[0]!.model).not.toMatch(/fable|opus/i);
  });

  it("違反応答は安全な返答に差し替える", async () => {
    const transport = new MockTransport(["おそらく棘上筋の腱板炎だと思われます"]);
    const r = await runInterviewTurn({ transport, casePublic, history: [], question: "原因は何だと思いますか" });
    expect(r.filter.ok).toBe(false);
    expect(r.reply).not.toContain("棘上筋");
  });
});

describe("factGuard の優先順位（固有名 > 役割語）", () => {
  it("広背筋（DB固有名）は役割語『背筋』に吸われず、未注入として検出される", () => {
    const r = validateAnatomicalTerms("広背筋の関与も考えられます", new Set<FmaId>(["FMA9629"]));
    expect(r.uninjectedTerms).toContain("広背筋");
  });
});
