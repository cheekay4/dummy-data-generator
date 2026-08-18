/**
 * L2: 問診項目カバレッジの決定論的判定（仕様 §6.1。DECISIONS.md D-014）。
 * 質問文をキーワード照合で問診カテゴリに対応付ける。LLM は使わない。
 * カテゴリ名は全症例で共通（10種）。
 */

export const INTERVIEW_CATEGORY_KEYWORDS: Record<string, readonly string[]> = {
  "発症・きっかけ": ["いつから", "いつ頃", "きっかけ", "始ま", "発症", "何か", "原因になる", "契機"],
  "疼痛部位": ["どこ", "場所", "部位", "どのあたり", "どの辺", "指で", "示して"],
  "疼痛の性質": ["どんな痛み", "どのような痛み", "どういう痛み", "ズキズキ", "性質", "痛みの感じ", "鋭い", "鈍い"],
  "夜間痛": ["夜", "寝て", "寝る", "睡眠", "眠れ", "就寝", "目が覚め"],
  "増悪動作": ["どんな時", "どういう時", "どんな動き", "どういう動き", "悪化", "強くなる", "つらい動作", "痛くなる動", "増え", "ひどくなる"],
  "軽快因子": ["楽に", "和ら", "まし", "軽くな", "落ち着", "改善"],
  "職業・生活": ["仕事", "職業", "お仕事", "日常", "生活", "家事"],
  "スポーツ・趣味": ["運動", "スポーツ", "趣味", "部活", "トレーニング"],
  "既往・全身状態": ["既往", "持病", "病気", "健康", "体調", "疾患", "手術", "以前に"],
  "しびれ・感覚": ["しびれ", "痺れ", "感覚", "麻痺", "ジンジン"],
};

export const ALL_INTERVIEW_CATEGORIES: readonly string[] = Object.keys(
  INTERVIEW_CATEGORY_KEYWORDS
);

/** 1つの質問文が対応する問診カテゴリを返す（決定論） */
export function matchQuestionCategories(question: string): string[] {
  const matched: string[] = [];
  for (const [category, keywords] of Object.entries(INTERVIEW_CATEGORY_KEYWORDS)) {
    if (keywords.some((k) => question.includes(k))) matched.push(category);
  }
  return matched;
}

/** 質問リスト全体がカバーした問診カテゴリ（重複除去・カテゴリ表順） */
export function coveredCategories(questions: readonly string[]): string[] {
  const covered = new Set<string>();
  for (const q of questions) {
    for (const c of matchQuestionCategories(q)) covered.add(c);
  }
  return ALL_INTERVIEW_CATEGORIES.filter((c) => covered.has(c));
}
