/**
 * ナレッジ検索サービス
 * 返信本文からキーワードを抽出し、sales_knowledge テーブルを検索する
 */

import { supabase } from '@/lib/supabase'
import type { KnowledgeEntry } from '@/lib/types'

/** 検索結果 */
export interface KnowledgeHit {
  id: string
  category: string
  question: string
  answer: string
  relevance: 'high' | 'medium'
}

/** 質問に一致するキーワードパターン */
const KEYWORD_PATTERNS: { pattern: RegExp; keywords: string[] }[] = [
  { pattern: /料金|価格|いくら|費用|コスト|月額|無料/i, keywords: ['料金', '価格', '無料'] },
  { pattern: /機能|できる|対応|使える|使い方/i, keywords: ['機能', '対応', '使い方'] },
  { pattern: /競合|他社|比較|違い|メリット/i, keywords: ['競合', '比較', 'メリット'] },
  { pattern: /セキュリティ|安全|個人情報|データ/i, keywords: ['セキュリティ', '安全', 'データ'] },
  { pattern: /解約|やめ|キャンセル|退会/i, keywords: ['解約', 'キャンセル'] },
  { pattern: /業種|業界|対応.*業/i, keywords: ['業種', '業界'] },
  { pattern: /多言語|英語|外国語|翻訳/i, keywords: ['多言語', '外国語'] },
  { pattern: /チーム|複数人|共有|メンバー/i, keywords: ['チーム', '複数人'] },
  { pattern: /プロファイル|設定|カスタマイズ|個性/i, keywords: ['プロファイル', 'カスタマイズ'] },
  { pattern: /口コミ|レビュー|返信|評価/i, keywords: ['口コミ', 'レビュー', '返信'] },
  { pattern: /スコア|予測|分析|改善/i, keywords: ['スコア', '予測', '分析'] },
  { pattern: /登録|アカウント|ログイン/i, keywords: ['登録', 'アカウント'] },
  { pattern: /ネガティブ|低評価|クレーム|苦情/i, keywords: ['ネガティブ', '低評価'] },
]

/**
 * 返信本文からキーワードを抽出
 */
function extractKeywords(text: string): string[] {
  const keywords: string[] = []
  for (const { pattern, keywords: kws } of KEYWORD_PATTERNS) {
    if (pattern.test(text)) {
      keywords.push(...kws)
    }
  }
  return [...new Set(keywords)]
}

/**
 * ナレッジ検索
 * 返信テキストからキーワードを抽出し、sales_knowledge を検索
 */
export async function searchKnowledge(
  replyText: string,
  product?: string
): Promise<KnowledgeHit[]> {
  const keywords = extractKeywords(replyText)
  if (keywords.length === 0) return []

  // キーワードでOR検索（question/answer/keywords 配列を横断）
  let query = supabase
    .from('sales_knowledge')
    .select('*')
    .order('usage_count', { ascending: false })
    .limit(5)

  if (product) {
    query = query.eq('product', product)
  }

  // テキスト検索: question と answer をキーワードで OR フィルタ
  const orConditions = keywords
    .map((kw) => `question.ilike.%${kw}%,answer.ilike.%${kw}%`)
    .join(',')
  query = query.or(orConditions)

  const { data } = await query

  if (!data?.length) return []

  const hits: KnowledgeHit[] = (data as KnowledgeEntry[]).map((entry) => {
    // キーワード配列とのマッチ数で relevance を判定
    const entryKeywords = entry.keywords ?? []
    const matchCount = keywords.filter(
      (kw) =>
        entryKeywords.some((ek) => ek.includes(kw)) ||
        entry.question.includes(kw) ||
        entry.answer.includes(kw)
    ).length
    return {
      id: entry.id,
      category: entry.category,
      question: entry.question,
      answer: entry.answer,
      relevance: matchCount >= 2 ? 'high' as const : 'medium' as const,
    }
  })

  // usage_count をインクリメント
  for (const hit of hits) {
    const current = (data as KnowledgeEntry[]).find((d) => d.id === hit.id)
    await supabase
      .from('sales_knowledge')
      .update({ usage_count: (current?.usage_count ?? 0) + 1 })
      .eq('id', hit.id)
  }

  return hits
}

/** ナレッジカバレッジ判定 */
export type KnowledgeCoverage = 'full' | 'partial' | 'none'

/**
 * 返信内容に対してナレッジがどの程度カバーしているか判定
 * - full: high relevance のヒットが1件以上
 * - partial: medium のみ
 * - none: ヒットなし
 */
export function assessCoverage(hits: KnowledgeHit[]): KnowledgeCoverage {
  if (hits.length === 0) return 'none'
  if (hits.some((h) => h.relevance === 'high')) return 'full'
  return 'partial'
}
