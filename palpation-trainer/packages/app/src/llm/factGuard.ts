import { getScopeIds, getStructureFacts } from "../facts/getStructureFacts.js";
import type { FmaId } from "../types/anatomy.js";

/**
 * 解剖学的事実の生成禁止の強制（仕様 §2.2。DECISIONS.md D-012）。
 * LLM 出力から「◯◯筋」「◯◯神経」形式の候補語を抽出し、層B に存在するかを判定する。
 * 層B に無い筋名・神経名 = ハルシネーション候補として検出できる（§9 のテスト要件）。
 */

/** 解剖学用語ではない一般語 */
const GENERIC_ALLOW = new Set([
  // 筋・神経の固有名ではない一般語（役割語・総称）
  "筋肉", "背筋", "腹筋", "筋力", "腕力", "握力", "表情筋", "拮抗筋", "主働筋", "協働筋",
  "対象筋", "責任筋", "該当筋", "当該筋", "原因筋", "触診筋", "深層筋", "表層筋", "浅層筋",
  "回旋筋", "外旋筋", "内旋筋", "外転筋", "内転筋", "屈筋", "伸筋", "挙上筋", "固定筋",
  "支配神経", "末梢神経", "中枢神経", "運動神経", "感覚神経", "自律神経", "脳神経", "皮神経", "交感神経", "副交感神経",
]);

const TERM_PATTERN = /[一-龯ァ-ヶー]{1,12}(?:筋|神経)/gu;

interface DbTerm {
  term: string;
  fmaId: FmaId;
}

function buildDbTerms(): DbTerm[] {
  const out: DbTerm[] = [];
  for (const id of getScopeIds()) {
    const f = getStructureFacts(id);
    for (const term of [f.nameJa, ...f.aliasesJa]) {
      if (term.length >= 2) out.push({ term, fmaId: f.fmaId });
    }
  }
  // 最長一致を優先するため長い順に
  return out.sort((a, b) => b.term.length - a.term.length);
}

const DB_TERMS: readonly DbTerm[] = buildDbTerms();

export interface FactGuardResult {
  ok: boolean;
  /** 層B に存在しない解剖学用語らしき語（ハルシネーション候補） */
  unknownTerms: string[];
  /** 層B には存在するが、この講評に注入した事実ブロックに含まれない構造の用語 */
  uninjectedTerms: string[];
}

/** candidate の末尾が DB 用語に一致するものを探す（「右上腕二頭筋」→「上腕二頭筋」） */
function matchDbTerm(candidate: string): DbTerm | null {
  for (const t of DB_TERMS) {
    if (candidate === t.term || candidate.endsWith(t.term)) return t;
  }
  return null;
}

/**
 * text 中の筋名・神経名を検査する。
 * allowedFmaIds: この応答で言及してよい構造（講評に注入した事実ブロックの構造）
 */
export function validateAnatomicalTerms(
  text: string,
  allowedFmaIds: ReadonlySet<FmaId>
): FactGuardResult {
  const unknownTerms = new Set<string>();
  const uninjectedTerms = new Set<string>();

  for (const match of text.matchAll(TERM_PATTERN)) {
    const candidate = match[0];
    // DB 照合を先に行う（「広背筋」が役割語「背筋」に吸われないよう、固有名を優先）
    const db = matchDbTerm(candidate);
    if (db !== null) {
      if (!allowedFmaIds.has(db.fmaId)) uninjectedTerms.add(db.term);
      continue;
    }
    // 役割語・筋群名は完全一致でのみ許可する。
    // 末尾一致にすると「腓腹筋」（スコープ外の実在筋）が「腹筋」に吸われて検出漏れになるため不可。
    // 複合語（例:「触診対象筋」）の偽陽性は再試行で解消され、リーク方向の誤りにはならない
    if (GENERIC_ALLOW.has(candidate)) continue;
    unknownTerms.add(candidate);
  }

  return {
    ok: unknownTerms.size === 0 && uninjectedTerms.size === 0,
    unknownTerms: [...unknownTerms],
    uninjectedTerms: [...uninjectedTerms],
  };
}

/** 検出した未知用語をマスクする（再試行後も残った場合の最終手段） */
export function maskUnknownTerms(text: string, unknownTerms: readonly string[]): string {
  let out = text;
  for (const term of unknownTerms) {
    out = out.split(term).join("（データ未収載の構造）");
  }
  return out;
}
