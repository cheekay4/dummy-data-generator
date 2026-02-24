// 景表法リスク NGワード（共通5語）
export const DEFAULT_NG_WORDS = ['最安値', '業界No.1', '絶対', '確実', '保証'] as const;

export function detectNgWords(text: string, extraWords: string[] = []): string[] {
  const all = [...DEFAULT_NG_WORDS, ...extraWords];
  return all.filter((word) => text.includes(word));
}
