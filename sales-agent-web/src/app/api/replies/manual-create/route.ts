import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { classifyIntent } from '@/lib/services/intent-classifier'
import { generateReplyDraft } from '@/lib/services/reply-generator'
import { searchKnowledge, assessCoverage } from '@/lib/services/knowledge-search'
import { PRODUCTS } from '@/config/products'
import type { Lead } from '@/lib/types'

/**
 * 受信メール（インバウンド）を手動登録し、AI処理を即時実行する
 */
export async function POST(req: NextRequest) {
  const body = await req.json()
  const { lead_id, reply_body, subject, product_interest } = body as {
    lead_id: string
    reply_body: string
    subject?: string
    product_interest?: 'review-reply-ai' | 'msgscore' | 'both'
  }

  if (!lead_id || !reply_body) {
    return NextResponse.json({ error: 'lead_id and reply_body are required' }, { status: 400 })
  }

  // リード取得
  const { data: lead, error: leadErr } = await supabase
    .from('sales_leads')
    .select('*')
    .eq('id', lead_id)
    .single()

  if (leadErr || !lead) {
    return NextResponse.json({ error: 'Lead not found' }, { status: 404 })
  }

  const typedLead = lead as Lead
  const product = typedLead.product ?? 'review-reply-ai'
  const emailSubject = subject || '（手動登録）'

  // 仮の sales_email を作成（FK 用）
  const { data: placeholderEmail, error: emailErr } = await supabase
    .from('sales_emails')
    .insert({
      lead_id,
      subject: emailSubject,
      body_text: '（インバウンド — 手動登録）',
      body_html: '<p>（インバウンド — 手動登録）</p>',
      status: 'sent',
      email_type: 'initial',
    })
    .select('id')
    .single()

  if (emailErr || !placeholderEmail) {
    return NextResponse.json({ error: 'Failed to create placeholder email' }, { status: 500 })
  }

  // sales_reply を作成
  const { data: reply, error: replyErr } = await supabase
    .from('sales_replies')
    .insert({
      email_id: placeholderEmail.id,
      lead_id,
      reply_body,
      human_approved: false,
    })
    .select('id')
    .single()

  if (replyErr || !reply) {
    return NextResponse.json({ error: 'Failed to create reply' }, { status: 500 })
  }

  // リードステータスを replied に更新
  await supabase
    .from('sales_leads')
    .update({ status: 'replied', updated_at: new Date().toISOString() })
    .eq('id', lead_id)

  // AI 処理（即時実行）
  try {
    const analysis = await classifyIntent(reply_body, emailSubject)

    await supabase
      .from('sales_replies')
      .update({
        intent: analysis.intent,
        intent_confidence: analysis.confidence,
      })
      .eq('id', reply.id)

    // unsubscribe 自動処理
    if (analysis.intent === 'unsubscribe') {
      await supabase.from('sales_leads')
        .update({ status: 'unsubscribed', unsubscribed_at: new Date().toISOString() })
        .eq('id', lead_id)
    }

    // ドラフト生成
    if (!['out_of_office', 'unsubscribe'].includes(analysis.intent)) {
      const knowledgeHits = await searchKnowledge(reply_body, product)
      const coverage = assessCoverage(knowledgeHits)
      const needsResearch = coverage === 'none' && analysis.intent === 'question'

      // 「両方」の場合は両プロダクト情報を補足コンテキストとして渡す
      let bothProductContext: string | undefined
      if (product_interest === 'both') {
        const rr = PRODUCTS['review-reply-ai']
        const ms = PRODUCTS['msgscore']
        bothProductContext = `相手は以下の2つの商品に興味があります。両方について簡潔に紹介してください。\n1. ${rr.name}: ${rr.tagline} (${rr.url})\n   料金: ${rr.priceFree} / Pro ${rr.pricePro}\n2. ${ms.name}: ${ms.tagline} (${ms.url})\n   料金: ${ms.priceFree} / Pro ${ms.pricePro}`
      }

      const draft = await generateReplyDraft({
        lead: typedLead,
        analysis,
        originalReplyBody: reply_body,
        originalSubject: emailSubject,
        knowledgeHits: knowledgeHits.length > 0 ? knowledgeHits : undefined,
        product,
        bothProductContext,
      })

      if (draft.body) {
        await supabase
          .from('sales_replies')
          .update({
            ai_draft_response: draft.body,
            ai_draft_subject: draft.subject,
            knowledge_hits: knowledgeHits.length > 0 ? knowledgeHits : null,
            needs_research: needsResearch,
            reply_stage: needsResearch ? 'needs_research' : 'initial',
          })
          .eq('id', reply.id)
      }
    }

    return NextResponse.json({
      ok: true,
      reply_id: reply.id,
      intent: analysis.intent,
    })
  } catch (err) {
    // AI処理に失敗してもレコードは作成済み（次回 check-replies で再処理可能）
    return NextResponse.json({
      ok: true,
      reply_id: reply.id,
      intent: null,
      ai_error: err instanceof Error ? err.message : String(err),
    })
  }
}
