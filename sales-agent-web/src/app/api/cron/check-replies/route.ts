import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { getThreadMessages, type ThreadMessage } from '@/lib/gmail'
import { classifyIntent } from '@/lib/services/intent-classifier'
import { generateReplyDraft } from '@/lib/services/reply-generator'
import { shouldSendAck, sendAck } from '@/lib/services/ack-sender'
import { generateFollowup } from '@/lib/services/followup-generator'
import { searchKnowledge, assessCoverage } from '@/lib/services/knowledge-search'
import { extractVoc } from '@/lib/services/voc-extractor'
import { getUnsubscribeUrl } from '@/lib/hmac'
import type { Lead, EmailType } from '@/lib/types'

const THREAD_BATCH_SIZE = 10
const AI_PROCESS_LIMIT = 1 // 10秒タイムアウト対策: AI処理は1件/回

/**
 * 返信ポーリング Cron（5分間隔）
 * 送信済みメールのスレッドを確認し、新着返信を処理する
 */
export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const auth = req.headers.get('authorization')
  if (!cronSecret || auth !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const senderEmail = (process.env.SENDER_EMAIL ?? '').toLowerCase()
  let newReplies = 0
  let bounces = 0
  let aiProcessed = 0
  const errors: string[] = []

  // ========================================
  // Part 1: 新着返信の検出と保存
  // ========================================
  const { data: sentEmails } = await supabase
    .from('sales_emails')
    .select('id, lead_id, gmail_thread_id, subject')
    .eq('status', 'sent')
    .not('gmail_thread_id', 'is', null)
    .eq('email_type', 'initial')
    .limit(THREAD_BATCH_SIZE)

  if (sentEmails?.length) {
    // 既知の返信 messageId を取得
    const { data: knownReplies } = await supabase
      .from('sales_replies')
      .select('gmail_message_id')
    const knownIds = new Set((knownReplies ?? []).map((r) => r.gmail_message_id))

    // 既知の送信メール messageId も取得（自分のメッセージ除外用）
    const { data: sentMsgIds } = await supabase
      .from('sales_emails')
      .select('gmail_message_id')
      .not('gmail_message_id', 'is', null)
    const ownIds = new Set((sentMsgIds ?? []).map((e) => e.gmail_message_id))

    for (const sent of sentEmails) {
      try {
        const messages = await getThreadMessages(sent.gmail_thread_id)

        for (const msg of messages) {
          if (!msg.messageId) continue
          if (knownIds.has(msg.messageId)) continue
          if (ownIds.has(msg.messageId)) continue

          // 送信者フィルタ（自分の送信を除外）
          if (msg.from.toLowerCase().includes(senderEmail) && senderEmail) continue

          // バウンス検知
          if (isBounce(msg)) {
            await handleBounce(sent.id, sent.lead_id, msg)
            bounces++
            knownIds.add(msg.messageId)
            continue
          }

          // 新規返信を保存
          await supabase.from('sales_replies').insert({
            email_id: sent.id,
            lead_id: sent.lead_id,
            gmail_message_id: msg.messageId,
            reply_body: msg.body,
            human_approved: false,
          })

          // リードステータスを replied に
          await supabase
            .from('sales_leads')
            .update({ status: 'replied', updated_at: new Date().toISOString() })
            .eq('id', sent.lead_id)

          // pending フォローアップをキャンセル
          await supabase
            .from('sales_next_actions')
            .update({ status: 'cancelled' })
            .eq('lead_id', sent.lead_id)
            .eq('status', 'pending')

          knownIds.add(msg.messageId)
          newReplies++
        }
      } catch (err) {
        errors.push(`Thread ${sent.gmail_thread_id}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }

  // ========================================
  // Part 2: 未分類返信の AI 処理
  // ========================================
  const { data: unprocessed } = await supabase
    .from('sales_replies')
    .select('*, lead:lead_id(*)')
    .is('intent', null)
    .order('created_at', { ascending: true })
    .limit(AI_PROCESS_LIMIT)

  for (const reply of unprocessed ?? []) {
    try {
      // 元のメール件名を取得
      const { data: origEmail } = await supabase
        .from('sales_emails')
        .select('subject, gmail_thread_id')
        .eq('id', reply.email_id)
        .single()

      const subject = origEmail?.subject ?? ''

      // Intent 分類
      const analysis = await classifyIntent(reply.reply_body ?? '', subject)

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
          .eq('id', reply.lead_id)
      }

      const lead = reply.lead as Lead
      const product = lead.product ?? 'review-reply-ai'

      // ACK 送信判定
      if (origEmail?.gmail_thread_id) {
        // 同一スレッドで ACK 済みか確認
        const { data: existingAck } = await supabase
          .from('sales_emails')
          .select('id')
          .eq('gmail_thread_id', origEmail.gmail_thread_id)
          .eq('email_type', 'ack')
          .limit(1)

        const threadAlreadyAcked = (existingAck?.length ?? 0) > 0

        if (shouldSendAck({
          headers: {},
          body: reply.reply_body ?? '',
          intent: analysis.intent,
          threadAlreadyAcked,
        })) {
          await sendAck({
            to: lead.email,
            companyName: lead.company_name,
            threadId: origEmail.gmail_thread_id,
            originalSubject: subject,
            leadId: reply.lead_id,
            replyId: reply.id,
          })
        }
      }

      // ドラフト生成（out_of_office, unsubscribe 以外）
      if (!['out_of_office', 'unsubscribe'].includes(analysis.intent)) {
        // ナレッジ検索 + カバレッジ判定
        const knowledgeHits = await searchKnowledge(reply.reply_body ?? '', product)
        const coverage = assessCoverage(knowledgeHits)
        const needsResearch = coverage === 'none' && analysis.intent === 'question'

        // 会話履歴を取得（マルチターン対応）
        let conversationHistory: { role: 'us' | 'them'; body: string }[] | undefined
        if (origEmail?.gmail_thread_id) {
          try {
            const threadMsgs = await getThreadMessages(origEmail.gmail_thread_id)
            conversationHistory = threadMsgs
              .filter((m) => m.body.trim().length > 0)
              .map((m) => ({
                role: (m.from.toLowerCase().includes(senderEmail) && senderEmail ? 'us' : 'them') as 'us' | 'them',
                body: m.body,
              }))
          } catch {
            // スレッド取得失敗はスキップ
          }
        }

        const draft = await generateReplyDraft({
          lead,
          analysis,
          originalReplyBody: reply.reply_body ?? '',
          originalSubject: subject,
          knowledgeHits: knowledgeHits.length > 0 ? knowledgeHits : undefined,
          conversationHistory: conversationHistory?.length ? conversationHistory : undefined,
          product,
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
              escalation_reason: needsResearch ? 'ナレッジに該当情報なし — 確認後に再生成してください' : null,
              conversation_history: conversationHistory?.length ? conversationHistory : null,
            })
            .eq('id', reply.id)
        }

        // conversation_phase 判定 + total_exchanges 更新
        const phase = determinePhase(analysis.intent, lead.total_exchanges ?? 0)
        await supabase.from('sales_leads').update({
          conversation_phase: phase,
          phase_changed_at: new Date().toISOString(),
          total_exchanges: (lead.total_exchanges ?? 0) + 1,
        }).eq('id', reply.lead_id)
      }

      // VoC 抽出（非ブロッキング — 失敗しても処理は続行）
      if (!['out_of_office', 'unsubscribe'].includes(analysis.intent)) {
        await extractVoc({
          replyBody: reply.reply_body ?? '',
          replyId: reply.id,
          leadId: reply.lead_id,
          product,
        }).catch(() => { /* VoC 抽出失敗はスキップ */ })
      }

      aiProcessed++
    } catch (err) {
      errors.push(`AI処理 reply_id=${reply.id}: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // ========================================
  // Part 3: フォローアップ処理
  // ========================================
  let followupsProcessed = 0
  const FOLLOWUP_LIMIT = 1 // タイムアウト対策: 1件/回

  // AI処理を実行していない場合のみフォローアップ処理（タイムアウト対策）
  if (aiProcessed === 0) {
    const { data: pendingActions } = await supabase
      .from('sales_next_actions')
      .select('*, lead:lead_id(*)')
      .eq('status', 'pending')
      .lte('scheduled_at', new Date().toISOString())
      .order('scheduled_at', { ascending: true })
      .limit(FOLLOWUP_LIMIT)

    for (const action of pendingActions ?? []) {
      try {
        const lead = action.lead as Lead

        // replied / unsubscribed / bounced のリードはスキップ
        if (['replied', 'unsubscribed', 'bounced'].includes(lead.status)) {
          await supabase.from('sales_next_actions')
            .update({ status: 'cancelled', completed_at: new Date().toISOString() })
            .eq('id', action.id)
          continue
        }

        const context = action.context as { original_subject?: string; original_body?: string }
        const followupType = action.action_type as Extract<EmailType, 'followup_1' | 'followup_2' | 'reapproach'>

        // フォロー文面を AI 生成
        const followup = await generateFollowup({
          lead,
          originalSubject: context.original_subject ?? '',
          originalBody: context.original_body ?? '',
          followupType,
          product: lead.product,
        })

        // 配信停止フッターを追加
        const unsubUrl = getUnsubscribeUrl(lead.id)
        const footerText = `\n\n──\nこのメールの配信停止: ${unsubUrl}`
        const footerHtml = `<hr style="margin-top:24px;border:none;border-top:1px solid #e7e5e4"><p style="font-size:11px;color:#a8a29e;margin-top:8px">このメールの配信を停止するには<a href="${unsubUrl}" style="color:#a8a29e">こちら</a>をクリックしてください。</p>`

        // ドラフトとして保存（承認待ち）
        await supabase.from('sales_emails').insert({
          lead_id: lead.id,
          subject: followup.subject,
          body_text: followup.bodyText + footerText,
          body_html: followup.bodyHtml + footerHtml,
          status: 'draft',
          email_type: followupType,
        })

        // アクションを完了に
        await supabase.from('sales_next_actions')
          .update({ status: 'completed', completed_at: new Date().toISOString() })
          .eq('id', action.id)

        // followup_1 完了後 → followup_2 を7日後にキュー
        if (followupType === 'followup_1') {
          const scheduledAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString()
          await supabase.from('sales_next_actions').insert({
            lead_id: lead.id,
            email_id: action.email_id,
            action_type: 'followup_2',
            scheduled_at: scheduledAt,
            status: 'pending',
            context: action.context,
          })
        }

        followupsProcessed++
      } catch (err) {
        errors.push(`Followup action_id=${action.id}: ${err instanceof Error ? err.message : String(err)}`)
      }
    }
  }

  return NextResponse.json({
    ok: true,
    threads_checked: sentEmails?.length ?? 0,
    new_replies: newReplies,
    bounces,
    ai_processed: aiProcessed,
    followups_processed: followupsProcessed,
    errors: errors.length ? errors : undefined,
  })
}

// ========================================
// フェーズ判定ヘルパー
// ========================================

function determinePhase(intent: string, totalExchanges: number): string {
  if (intent === 'unsubscribe') return 'closed_lost'
  if (intent === 'not_interested' || intent === 'soft_decline') return 'closed_lost'
  if (intent === 'interested' && totalExchanges >= 2) return 'negotiation'
  if (intent === 'interested') return 'qualified'
  if (intent === 'internal_review') return 'evaluation'
  if (intent === 'question') return 'discovery'
  if (intent === 'out_of_office') return 'paused'
  return 'initial'
}

// ========================================
// バウンス検知ヘルパー
// ========================================

function isBounce(msg: ThreadMessage): boolean {
  const from = msg.from.toLowerCase()
  return (
    from.includes('mailer-daemon') ||
    from.includes('mail delivery subsystem') ||
    from.includes('postmaster@')
  )
}

async function handleBounce(emailId: string, leadId: string, msg: ThreadMessage) {
  const body = msg.body.toLowerCase()
  const isHard = /5[5-9]\d|user unknown|does not exist|no such user|address rejected/i.test(body)
  const bounceReason = isHard ? 'hard_bounce' : 'soft_bounce'

  await supabase.from('sales_emails').update({
    status: 'bounced',
    bounce_reason: bounceReason,
    bounced_at: new Date().toISOString(),
  }).eq('id', emailId)

  if (isHard) {
    await supabase.from('sales_leads').update({
      status: 'bounced',
      bounced_at: new Date().toISOString(),
    }).eq('id', leadId)
  }

  // pending アクションをキャンセル
  await supabase.from('sales_next_actions')
    .update({ status: 'cancelled' })
    .eq('lead_id', leadId)
    .eq('status', 'pending')
}
