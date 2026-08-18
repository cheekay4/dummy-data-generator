import { getCasePublic, getCaseTruth, listCases } from "../cases/caseDb.js";
import { buildPatientSystemPrompt } from "./patientActor.js";
import { collectAllowedStructures } from "./debrief.js";

/**
 * 1セッションの API 原価見積もり（仕様 §2.5 / §9）。
 * 実プロンプトの文字数から保守的に見積もる（キャッシュ割引は見込まない）。
 *
 * 前提（保守的に設定）:
 * - 日本語 ≈ 1 トークン/文字（実際は 0.7〜1.0 程度）
 * - 為替 155 円/USD
 * - 価格: Haiku 4.5 $1/$5、Sonnet 5 $3/$15（導入価格でなく正価）/ 100万トークン
 */
export const COST_ASSUMPTIONS = {
  tokensPerChar: 1.0,
  jpyPerUsd: 155,
  prices: {
    patientActor: { inUsdPerMTok: 1, outUsdPerMTok: 5 },   // Haiku 4.5
    examiner: { inUsdPerMTok: 3, outUsdPerMTok: 15 },      // Sonnet 5（正価）
  },
  interviewTurns: 5,
  questionChars: 40,
  replyChars: 90,
  reasoningChars: 200,
  debriefOutputChars: 500,
} as const;

export interface SessionCostEstimate {
  patientJpy: number;
  debriefJpy: number;
  totalJpy: number;
  detail: {
    patientSystemTokens: number;
    patientTotalInputTokens: number;
    patientTotalOutputTokens: number;
    debriefInputTokens: number;
    debriefOutputTokens: number;
  };
}

const t = (chars: number): number => Math.ceil(chars * COST_ASSUMPTIONS.tokensPerChar);

/** 実症例のプロンプトを組み立てて原価を見積もる */
export function estimateSessionCost(caseId?: string): SessionCostEstimate {
  const a = COST_ASSUMPTIONS;
  const id = caseId ?? listCases()[0]!.id;

  // 患者役: システムプロンプト + 会話履歴が毎ターン再送される
  const systemTokens = t(buildPatientSystemPrompt(getCasePublic(id)).length);
  let patientIn = 0;
  let patientOut = 0;
  for (let turn = 1; turn <= a.interviewTurns; turn++) {
    const historyTokens = (turn - 1) * t(a.questionChars + a.replyChars);
    patientIn += systemTokens + historyTokens + t(a.questionChars);
    patientOut += t(a.replyChars);
  }

  // 講評: 事実ブロック + 結果サマリ → 400字程度の講評
  const truth = getCaseTruth(id);
  const factsBlockChars = JSON.stringify(collectAllowedStructures(truth).factsBlock).length;
  const debriefIn = t(factsBlockChars) + t(800) /* 指示文 */ + t(300) /* 結果 */ + t(a.reasoningChars);
  const debriefOut = t(a.debriefOutputChars);

  const usd =
    (patientIn * a.prices.patientActor.inUsdPerMTok +
      patientOut * a.prices.patientActor.outUsdPerMTok) /
    1e6;
  const debriefUsd =
    (debriefIn * a.prices.examiner.inUsdPerMTok + debriefOut * a.prices.examiner.outUsdPerMTok) /
    1e6;

  return {
    patientJpy: usd * a.jpyPerUsd,
    debriefJpy: debriefUsd * a.jpyPerUsd,
    totalJpy: (usd + debriefUsd) * a.jpyPerUsd,
    detail: {
      patientSystemTokens: systemTokens,
      patientTotalInputTokens: patientIn,
      patientTotalOutputTokens: patientOut,
      debriefInputTokens: debriefIn,
      debriefOutputTokens: debriefOut,
    },
  };
}
