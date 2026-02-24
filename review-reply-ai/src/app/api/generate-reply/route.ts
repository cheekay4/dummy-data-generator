import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { SYSTEM_PROMPT, buildUserPrompt } from '@/lib/prompts'
import type { GenerateReplyRequest, GenerateReplyResult } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// In-memory rate limiting: IP -> { count, date }
const rateLimitMap = new Map<string, { count: number; date: string }>()
const DAILY_LIMIT = 3

function getToday(): string {
  return new Date().toISOString().split('T')[0]
}

function getRemainingCount(ip: string): number {
  const entry = rateLimitMap.get(ip)
  const today = getToday()
  if (!entry || entry.date !== today) return DAILY_LIMIT
  return Math.max(0, DAILY_LIMIT - entry.count)
}

function consumeCount(ip: string): boolean {
  const today = getToday()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.date !== today) {
    rateLimitMap.set(ip, { count: 1, date: today })
    return true
  }
  if (entry.count >= DAILY_LIMIT) return false
  entry.count++
  return true
}

async function callClaude(req: GenerateReplyRequest): Promise<GenerateReplyResult> {
  const userPrompt = buildUserPrompt(req)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''

  // Strip markdown code fences if present
  const cleaned = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim()

  return JSON.parse(cleaned) as GenerateReplyResult
}

export async function POST(request: NextRequest) {
  // Get client IP
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

  const remaining = getRemainingCount(ip)

  if (remaining <= 0) {
    return NextResponse.json(
      { success: false, error: '本日の無料利用回数（3回）を使い切りました。Proにアップグレードすると無制限でご利用いただけます。', remainingToday: 0 },
      { status: 429 }
    )
  }

  let body: GenerateReplyRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'リクエストの形式が正しくありません。' }, { status: 400 })
  }

  // Validate required fields
  if (!body.reviewText?.trim()) {
    return NextResponse.json({ success: false, error: '口コミ本文を入力してください。' }, { status: 400 })
  }
  if (body.reviewText.length > 5000) {
    return NextResponse.json({ success: false, error: '口コミ本文は5,000文字以内で入力してください。' }, { status: 400 })
  }
  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ success: false, error: '星評価を選択してください（1〜5）。' }, { status: 400 })
  }
  if (!body.platform || !body.businessType || !body.tone) {
    return NextResponse.json({ success: false, error: '必須項目を選択してください。' }, { status: 400 })
  }

  // Consume rate limit
  if (!consumeCount(ip)) {
    return NextResponse.json(
      { success: false, error: '本日の無料利用回数（3回）を使い切りました。', remainingToday: 0 },
      { status: 429 }
    )
  }

  const newRemaining = getRemainingCount(ip)

  // Call Claude with retry on JSON parse failure
  let result: GenerateReplyResult
  try {
    result = await callClaude(body)
  } catch (e) {
    // Retry once
    try {
      result = await callClaude(body)
    } catch {
      return NextResponse.json(
        { success: false, error: '返信の生成に失敗しました。しばらくしてからもう一度お試しください。', remainingToday: newRemaining },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ success: true, data: result, remainingToday: newRemaining })
}
