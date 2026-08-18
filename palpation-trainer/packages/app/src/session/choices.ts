import { getCaseTruth } from "../cases/caseDb.js";
import { getStructureFacts, listScope } from "../facts/getStructureFacts.js";
import type { FmaId } from "../types/anatomy.js";

/**
 * identification フェーズの選択肢生成（仕様 §6.2【判断】。DECISIONS.md D-015）。
 * - truth.distractors を必ず含める
 * - 正解 + distractor + 同カテゴリのフィラーで構成し、消去法で当てられないようにする
 * - 生成は caseId から決定論的（シード付きシャッフル）。同一症例では常に同一の選択肢
 */

export interface Choice {
  fmaId: FmaId;
  nameJa: string;
}

function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function seededShuffle<T>(items: readonly T[], seed: number): T[] {
  const arr = [...items];
  const rand = mulberry32(seed);
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}

function buildFor(
  caseId: string,
  kind: "muscle" | "nerve",
  answerIds: readonly FmaId[],
  distractorIds: readonly FmaId[],
  optionCount: number
): Choice[] {
  const used = new Set<FmaId>([...answerIds, ...distractorIds]);
  const fillerPool = listScope()
    .structures.filter((s) => s.category === kind && !used.has(s.fmaId))
    .map((s) => s.fmaId)
    .sort();
  const fillerCount = Math.max(0, optionCount - used.size);
  const fillers = seededShuffle(fillerPool, hashString(`${caseId}:${kind}:filler`)).slice(
    0,
    fillerCount
  );
  const all = seededShuffle(
    [...used, ...fillers],
    hashString(`${caseId}:${kind}:order`)
  );
  return all.map((fmaId) => ({ fmaId, nameJa: getStructureFacts(fmaId).nameJa }));
}

export interface IdentificationChoices {
  muscles: Choice[];
  nerves: Choice[];
}

export function buildIdentificationChoices(caseId: string): IdentificationChoices {
  const truth = getCaseTruth(caseId);
  const muscleDistractors = truth.distractors
    .filter((d) => d.kind === "muscle")
    .map((d) => d.fmaId);
  const nerveDistractors = truth.distractors
    .filter((d) => d.kind === "nerve")
    .map((d) => d.fmaId);
  return {
    muscles: buildFor(caseId, "muscle", truth.responsibleMuscles, muscleDistractors, 8),
    nerves: buildFor(caseId, "nerve", truth.innervation, nerveDistractors, 6),
  };
}
