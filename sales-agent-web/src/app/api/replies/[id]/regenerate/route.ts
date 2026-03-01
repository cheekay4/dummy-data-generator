import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { classifyIntent } from '@/lib/services/intent-classifier'
import { generateReplyDraft } from '@/lib/services/reply-generator'
import { searchKnowledge, assessCoverage } from '@/lib/services/knowledge-search'
import type { Lead } from '@/lib/types'

/**
 * ドラフト再生成 API
 * ナレッジ追加後に呼び出して、より正確な返信ドラフトを生成する
 */
export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params

  // 対象の返信を取得
  const { data: reply, error } = await supabase
    .from('sales_replies')
    .select('*, lead:lead_id(*)')
    .eq('id', id)
    .single()

  if (error || !reply) {
    return NextResponse.json({ error: '返信が見つかりません' }, { status: 404 })
  }

  if (reply.human_approved) {
    return NextResponse.json({ error: '既に承認済みです' }, { status: 400 })
  }

  // 元のメール件名を取得
  const { data: origEmail } = await supabase
    .from('sales_emails')
    .select('subject')
    .eq('id', reply.email_id)
    .single()

  const subject = origEmail?.subject ?? ''
  const lead = reply.lead as Lead

  // Intent が未分類の場合は再分類
  let analysis = {
    intent: reply.intent ?? 'question',
    confidence: reply.intent_confidence ?? 0.5,
    summary: '',
    key_questions: [] as string[],
    suggested_action: '',
    research_needed: false,
    research_topics: [] as string[],
  }
  if (!reply.intent) {
    analysis = await classifyIntent(reply.reply_body ?? '', subject)
    await supabase
      .from('sales_replies')
      .update({ intent: analysis.intent, intent_confidence: analysis.confidence })
      .eq('id', id)
  }

  // ナレッジ再検索
  const product = lead.product ?? 'review-reply-ai'
  const knowledgeHits = await searchKnowledge(reply.reply_body ?? '', product)
  const coverage = assessCoverage(knowledgeHits)

  // ドラフト再生成
  const draft = await generateReplyDraft({
    lead,
    analysis,
    originalReplyBody: reply.reply_body ?? '',
    originalSubject: subject,
    knowledgeHits: knowledgeHits.length > 0 ? knowledgeHits : undefined,
    product,
  })

  // 更新
  await supabase
    .from('sales_replies')
    .update({
      ai_draft_response: draft.body,
      ai_draft_subject: draft.subject,
      knowledge_hits: knowledgeHits.length > 0 ? knowledgeHits : null,
      needs_research: coverage === 'none' && analysis.intent === 'question',
      reply_stage: coverage === 'none' && analysis.intent === 'question' ? 'needs_research' : 'regenerated',
      escalation_reason: coverage === 'none' && analysis.intent === 'question'
        ? 'ナレッジに該当情報なし — 追加後に再度お試しください'
        : null,
    })
    .eq('id', id)

  return NextResponse.json({
    ok: true,
    coverage,
    knowledge_hits: knowledgeHits.length,
    draft_preview: draft.body.slice(0, 100),
  })
}
