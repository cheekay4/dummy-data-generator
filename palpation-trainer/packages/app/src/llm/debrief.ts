import { MODEL_ROLES } from "../config/models.js";
import { getStructureFacts } from "../facts/getStructureFacts.js";
import type { PalpationJudgment } from "../scoring/palpation.js";
import type { IdentificationResult } from "../scoring/identification.js";
import type { CaseTruth } from "../types/case.js";
import type { FmaId, StructureFacts } from "../types/anatomy.js";
import { maskUnknownTerms, validateAnatomicalTerms } from "./factGuard.js";
import type { LlmTransport, LlmUsage } from "./transport.js";

/**
 * 講評 LLM（仕様 §6.1 L3 / §2.2 / §6.3）。
 * - スコアは決定論層（L1/L2）で算出済みの値を「表示するだけ」。LLM はコメントのみ生成する
 * - 解剖学的事実は注入した事実ブロック（getStructureFacts の返り値）からの引用に限る
 * - 出力は factGuard で検証し、違反時は1回だけ再試行 → それでも残ればマスク
 */

interface FactsBlockEntry {
  fmaId: FmaId;
  nameJa: string;
  origin?: string;
  insertion?: string;
  innervationJa?: string[];
  action?: string;
  description?: string;
}

function toFactsEntry(f: StructureFacts): FactsBlockEntry {
  const entry: FactsBlockEntry = { fmaId: f.fmaId, nameJa: f.nameJa };
  if (f.origin !== undefined) entry.origin = f.origin;
  if (f.insertion !== undefined) entry.insertion = f.insertion;
  if (f.innervation !== undefined)
    entry.innervationJa = f.innervation.map((n) => getStructureFacts(n).nameJa);
  if (f.action !== undefined) entry.action = f.action;
  if (f.description !== undefined) entry.description = f.description;
  return entry;
}

/** 講評で言及してよい構造の集合（事実ブロック）を truth から構築する */
export function collectAllowedStructures(truth: CaseTruth): {
  allowedFmaIds: Set<FmaId>;
  factsBlock: FactsBlockEntry[];
} {
  const ids = new Set<FmaId>([
    ...truth.responsibleMuscles,
    ...truth.innervation,
    ...truth.targetLandmarks.map((l) => l.fmaId),
    ...truth.distractors.map((d) => d.fmaId),
  ]);
  // 事実ブロック内で支配神経名を引用するため、参照先の神経も許可集合に含める
  for (const id of [...ids]) {
    for (const n of getStructureFacts(id).innervation ?? []) ids.add(n);
  }
  return {
    allowedFmaIds: ids,
    factsBlock: [...ids].map((id) => toFactsEntry(getStructureFacts(id))),
  };
}

export interface DebriefInput {
  transport: LlmTransport;
  truth: CaseTruth;
  palpation: PalpationJudgment;
  muscles: IdentificationResult;
  nerves: IdentificationResult;
  interviewCoveredCategories: string[];
  studentReasoning: string;
}

export interface DebriefResult {
  feedback: string;
  factGuardViolations: string[];
  retried: boolean;
  usage: LlmUsage;
}

function buildSystemPrompt(factsBlockJson: string): string {
  return `あなたは理学療法士等養成校の実技試験（触診部位同定）の講評者です。学生の解答結果に対する定性フィードバックを日本語で書いてください。

# 事実ブロック（この症例に関する解剖学的事実。出典: 本システムの構造事実テーブル）
${factsBlockJson}

# 厳守事項
- 解剖学的事実（起始・停止・支配神経・作用・位置）は上の事実ブロックに書かれている内容だけを使う。ブロックに無い事実が必要になったら「当システムには該当データがありません」と書く。推測で補完しない
- スコアは既に決定論的に算出済み。数値を変更・再計算・上書きしない。講評はコメントのみ
- これは教育用の模擬症例であり、実在の患者への診断・治療助言ではない。臨床助言の形をとらない
- 構成: (1)良かった点 (2)惜しかった点と根拠（事実ブロックを引用） (3)次の練習への一言。全体で400字程度
- 事実ブロックに無い筋名・神経名を絶対に書かない`;
}

function buildUserPrompt(input: DebriefInput): string {
  const lm = input.palpation.nearest;
  const nearestText =
    lm === null
      ? "クリックなし"
      : `最近傍ランドマークまで ${lm.distanceMm.toFixed(1)}mm（${lm.withinRadius ? "許容範囲内" : "範囲外"}）`;
  return `# 学生の結果（決定論層で採点済み）
- 問診でカバーした項目: ${input.interviewCoveredCategories.join("、") || "なし"}
- 触診: ${nearestText}／重み付きスコア ${(input.palpation.weightedScore * 100).toFixed(0)}%
- 責任筋の解答: 正解 ${input.muscles.correct.length}・見逃し ${input.muscles.missed.length}・誤答 ${input.muscles.extra.length}（F1 ${(input.muscles.score * 100).toFixed(0)}%）
- 支配神経の解答: 正解 ${input.nerves.correct.length}・見逃し ${input.nerves.missed.length}・誤答 ${input.nerves.extra.length}（F1 ${(input.nerves.score * 100).toFixed(0)}%）
- 学生の考察（自由記述）: ${input.studentReasoning || "（記入なし）"}

この結果への講評を書いてください。`;
}

export async function runDebrief(input: DebriefInput): Promise<DebriefResult> {
  const { allowedFmaIds, factsBlock } = collectAllowedStructures(input.truth);
  const system = buildSystemPrompt(JSON.stringify(factsBlock, null, 1));
  const userPrompt = buildUserPrompt(input);

  const first = await input.transport.complete({
    model: MODEL_ROLES.examiner,
    system,
    messages: [{ role: "user", content: userPrompt }],
    maxTokens: 1200,
    disableThinking: true,
  });

  let text = first.text.trim();
  let usage = first.usage;
  let check = validateAnatomicalTerms(text, allowedFmaIds);
  let retried = false;

  if (!check.ok) {
    retried = true;
    const warning = `前回の出力に事実ブロック外の用語が含まれていました: ${[...check.unknownTerms, ...check.uninjectedTerms].join("、")}。事実ブロックにある構造名だけを使って書き直してください。`;
    const second = await input.transport.complete({
      model: MODEL_ROLES.examiner,
      system,
      messages: [
        { role: "user", content: userPrompt },
        { role: "assistant", content: text },
        { role: "user", content: warning },
      ],
      maxTokens: 1200,
      disableThinking: true,
    });
    text = second.text.trim();
    usage = {
      inputTokens: usage.inputTokens + second.usage.inputTokens,
      outputTokens: usage.outputTokens + second.usage.outputTokens,
    };
    check = validateAnatomicalTerms(text, allowedFmaIds);
  }

  if (!check.ok) {
    // 最終手段: 未知用語をマスクして返す（フェイルクローズ。§10 正確性 > 体験）
    text = maskUnknownTerms(text, [...check.unknownTerms, ...check.uninjectedTerms]);
  }

  return {
    feedback: text,
    factGuardViolations: [...check.unknownTerms, ...check.uninjectedTerms],
    retried,
    usage,
  };
}
