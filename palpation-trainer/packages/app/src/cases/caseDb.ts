import { z } from "zod";
import { getStructureFacts } from "../facts/getStructureFacts.js";
import {
  caseDefinitionSchema,
  type CaseDefinition,
  type CaseDifficulty,
  type CasePublic,
  type CaseTruth,
} from "../types/case.js";
import { DataIntegrityError } from "../facts/errors.js";
import case01 from "../data/cases/case-01-supraspinatus-tendinopathy.json" with { type: "json" };
import case02 from "../data/cases/case-02-biceps-long-head.json" with { type: "json" };
import case03 from "../data/cases/case-03-trapezius-levator.json" with { type: "json" };
import case04 from "../data/cases/case-04-infraspinatus-tp.json" with { type: "json" };
import case05 from "../data/cases/case-05-subscapularis-stiffness.json" with { type: "json" };
import case06 from "../data/cases/case-06-thrower-posterior.json" with { type: "json" };
import case07 from "../data/cases/case-07-serratus-winging.json" with { type: "json" };
import case08 from "../data/cases/case-08-deltoid-overuse.json" with { type: "json" };
import case09 from "../data/cases/case-09-rhomboid-interscapular.json" with { type: "json" };
import case10 from "../data/cases/case-10-brachialis-climber.json" with { type: "json" };

const definitions: CaseDefinition[] = z
  .array(caseDefinitionSchema)
  .parse([case01, case02, case03, case04, case05, case06, case07, case08, case09, case10]);

// ロード時整合性チェック: 参照 FMA ID が全て scope 内で、カテゴリが正しいこと（§3.1/§9）
for (const c of definitions) {
  for (const m of c.truth.responsibleMuscles) {
    if (getStructureFacts(m).category !== "muscle")
      throw new DataIntegrityError(`${c.id}: ${m} は muscle ではない`);
  }
  for (const n of c.truth.innervation) {
    if (getStructureFacts(n).category !== "nerve")
      throw new DataIntegrityError(`${c.id}: ${n} は nerve ではない`);
  }
  for (const lm of c.truth.targetLandmarks) {
    getStructureFacts(lm.fmaId); // scope 外なら OutOfScopeError
  }
  for (const d of c.truth.distractors) {
    if (getStructureFacts(d.fmaId).category !== d.kind)
      throw new DataIntegrityError(`${c.id}: distractor ${d.fmaId} の kind 不一致`);
  }
}
const ids = definitions.map((c) => c.id);
if (new Set(ids).size !== ids.length) throw new DataIntegrityError("症例 ID が重複");

const byId = new Map(definitions.map((c) => [c.id, c]));

function mustGet(caseId: string): CaseDefinition {
  const c = byId.get(caseId);
  if (c === undefined) throw new DataIntegrityError(`症例が存在しない: ${caseId}`);
  return c;
}

export interface CaseMeta {
  id: string;
  difficulty: CaseDifficulty;
}

export function listCases(): CaseMeta[] {
  return definitions.map((c) => ({ id: c.id, difficulty: c.difficulty }));
}

/**
 * 患者役 LLM に渡してよいのはこの返り値のみ（§2.4）。
 * CaseDefinition 全体や CaseTruth を患者役の呼び出しに渡してはならない。
 */
export function getCasePublic(caseId: string): CasePublic {
  return structuredClone(mustGet(caseId).public);
}

/** 採点・講評側のみが使用する（患者役セッションとはコンテキストを分離する）（§2.4） */
export function getCaseTruth(caseId: string): CaseTruth {
  return structuredClone(mustGet(caseId).truth);
}
