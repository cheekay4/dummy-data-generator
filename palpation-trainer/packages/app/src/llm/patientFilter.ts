import { getScopeIds, getStructureFacts } from "../facts/getStructureFacts.js";

/**
 * 患者役出力の後段フィルタ（仕様 §1.3 の二重防御の2段目。DECISIONS.md D-011）。
 * 決定論的な語彙・パターン検出で、診断の断定・受診助言・解剖学用語・役割逸脱を検出する。
 * LLM 判定は使わない（レイテンシ +0ms、偽陰性は語彙網羅で最小化）。
 */

/** 患者が口にしてよい一般語彙（骨・皮膚・肩関節は日常語のため許可） */
const ALLOWED_CATEGORIES = new Set(["bone", "skin", "joint"]);

function buildAnatomyTermList(): string[] {
  const terms: string[] = [];
  for (const id of getScopeIds()) {
    const f = getStructureFacts(id);
    if (ALLOWED_CATEGORIES.has(f.category)) continue;
    terms.push(f.nameJa, ...f.aliasesJa);
  }
  return [...new Set(terms)].filter((t) => t.length >= 2);
}

const ANATOMY_TERMS: readonly string[] = buildAnatomyTermList();

/** 診断名・病名の断定に使われやすい語彙（症例DBのラベルに依存しない一般リスト） */
const DIAGNOSIS_TERMS: readonly string[] = [
  "五十肩", "四十肩", "凍結肩", "腱板断裂", "腱板損傷", "腱板炎", "腱炎", "腱鞘炎",
  "インピンジメント", "石灰沈着", "頚椎症", "頸椎症", "ヘルニア", "胸郭出口症候群",
  "翼状肩甲", "神経麻痺", "トリガーポイント", "筋膜炎", "関節炎", "脱臼", "捻挫", "骨折",
];

/** 受診・治療の助言パターン（患者自身の過去の行動描写は対象外になるよう文型で限定） */
const ADVICE_PATTERNS: readonly RegExp[] = [
  /(受診|通院|病院|クリニック|整形外科|医療機関|専門医|医者|医師)[^。]{0,15}(してください|なさってください|した方が|したほうが|すべき|をおすすめ|をお勧め|を勧め|に行ってください|に行った方が|に行ったほうが)/u,
  /(レントゲン|MRI|エコー|検査)[^。]{0,12}(を受けてください|した方が|したほうが|すべき|をおすすめ|をお勧め)/u,
  /(だと思われます|と診断|の疑いがあります|に間違いありません|で確定)/u,
];

/** ロールプレイ逸脱（AI であることの言及等） */
const ROLE_BREAK_PATTERNS: readonly RegExp[] = [
  /(AI|人工知能|言語モデル|アシスタント|システムプロンプト|プロンプト)/u,
];

const SAFE_FALLBACK =
  "すみません、難しいことはよく分からなくて……。痛いところや困っていることなら、お答えできます。";

export interface PatientFilterResult {
  ok: boolean;
  violations: string[];
  /** ok=false のときに UI に出す差し替え応答 */
  safeText: string;
}

/** 患者役の出力を検査する。違反があれば安全な応答に差し替える */
export function filterPatientReply(text: string): PatientFilterResult {
  const violations: string[] = [];

  for (const term of ANATOMY_TERMS) {
    if (text.includes(term)) violations.push(`解剖学用語: ${term}`);
  }
  for (const term of DIAGNOSIS_TERMS) {
    if (text.includes(term)) violations.push(`診断名: ${term}`);
  }
  for (const p of ADVICE_PATTERNS) {
    const m = text.match(p);
    if (m !== null) violations.push(`助言・断定: ${m[0]}`);
  }
  for (const p of ROLE_BREAK_PATTERNS) {
    const m = text.match(p);
    if (m !== null) violations.push(`役割逸脱: ${m[0]}`);
  }

  return {
    ok: violations.length === 0,
    violations,
    safeText: violations.length === 0 ? text : SAFE_FALLBACK,
  };
}
