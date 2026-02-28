import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, buildSystemPromptWithTone, buildUserPrompt } from '@/lib/prompts'
import { PERSONA_MODIFIERS, applyModifier } from '@/lib/constants'
import type { GenerateReplyRequest, GenerateReplyResult, ReplyProfile } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

// In-memory rate limiting for trial (no login): IP -> { count, date }
const rateLimitMap = new Map<string, { count: number; date: string }>()
const TRIAL_LIMIT = 1

function getToday(): string {
  // JST基準
  const now = new Date()
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000)
  return jst.toISOString().split('T')[0]
}

function getRemainingTrial(ip: string): number {
  const entry = rateLimitMap.get(ip)
  const today = getToday()
  if (!entry || entry.date !== today) return TRIAL_LIMIT
  return Math.max(0, TRIAL_LIMIT - entry.count)
}

function consumeTrial(ip: string): boolean {
  const today = getToday()
  const entry = rateLimitMap.get(ip)
  if (!entry || entry.date !== today) {
    rateLimitMap.set(ip, { count: 1, date: today })
    return true
  }
  if (entry.count >= TRIAL_LIMIT) return false
  entry.count++
  return true
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getSupabaseAdmin(): any {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { createClient } = require('@supabase/supabase-js')
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )
}

async function callClaude(
  req: GenerateReplyRequest,
  profile?: ReplyProfile | null,
  recentReplies?: string[]
): Promise<GenerateReplyResult> {
  // modifierがある場合はprofileに適用
  let effectiveProfile = profile ?? null
  if (effectiveProfile && req.modifierId) {
    const mod = PERSONA_MODIFIERS.find((m) => m.id === req.modifierId)
    if (mod) {
      const applied = applyModifier(
        {
          agreeableness: effectiveProfile.agreeableness,
          extraversion: effectiveProfile.extraversion,
          conscientiousness: effectiveProfile.conscientiousness,
          openness: effectiveProfile.openness,
        },
        mod.modifiers
      )
      effectiveProfile = { ...effectiveProfile, ...applied }
    }
  }

  const systemPrompt = effectiveProfile
    ? buildSystemPrompt(effectiveProfile, recentReplies)
    : buildSystemPromptWithTone(req.tone)

  const userPrompt = buildUserPrompt(req)

  const message = await client.messages.create({
    model: 'claude-sonnet-4-5-20250929',
    max_tokens: 2000,
    temperature: 0.9,
    system: systemPrompt,
    messages: [{ role: 'user', content: userPrompt }],
  })

  const text = message.content[0].type === 'text' ? message.content[0].text : ''
  const cleaned = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim()
  return JSON.parse(cleaned) as GenerateReplyResult
}

export async function POST(request: NextRequest) {
  const forwarded = request.headers.get('x-forwarded-for')
  const ip = forwarded ? forwarded.split(',')[0].trim() : 'unknown'

  let body: GenerateReplyRequest
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ success: false, error: 'リクエストの形式が正しくありません。' }, { status: 400 })
  }

  if (!body.reviewText?.trim()) {
    return NextResponse.json({ success: false, error: '口コミ本文を入力してください。' }, { status: 400 })
  }
  if (body.reviewText.length > 5000) {
    return NextResponse.json({ success: false, error: '口コミ本文は5,000文字以内で入力してください。' }, { status: 400 })
  }
  if (!body.rating || body.rating < 1 || body.rating > 5) {
    return NextResponse.json({ success: false, error: '星評価を選択してください（1〜5）。' }, { status: 400 })
  }

  // Supabase設定済みの場合は認証確認
  const isSupabaseConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY
  )

  let userId: string | null = null
  let userPlan: 'free' | 'pro' = 'free'
  let profile: ReplyProfile | null = null
  let recentReplies: string[] = []

  if (isSupabaseConfigured) {
    // Authorizationヘッダーからトークン取得
    const authHeader = request.headers.get('authorization')
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.replace('Bearer ', '')
      try {
        const { createClient } = await import('@supabase/supabase-js')
        const supabase = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        )
        const { data: { user } } = await supabase.auth.getUser(token)
        if (user) {
          userId = user.id
          // プラン取得
          const admin = getSupabaseAdmin()
          const { data: profileData } = await admin
            .from('profiles')
            .select('plan')
            .eq('id', user.id)
            .single()
          userPlan = profileData?.plan ?? 'free'
        }
      } catch {
        // トークン検証失敗は無視（お試しとして扱う）
      }
    }
  }

  // レート制限チェック
  if (userId && isSupabaseConfigured) {
    if (userPlan === 'pro') {
      // Pro: 無制限
    } else {
      // Free: 5回/日
      const admin = getSupabaseAdmin()
      const today = getToday()
      const { data: usage } = await admin
        .from('daily_usage')
        .select('count')
        .eq('user_id', userId)
        .eq('usage_date', today)
        .single()

      const currentCount = usage?.count ?? 0
      const FREE_DAILY_LIMIT = 5

      if (currentCount >= FREE_DAILY_LIMIT) {
        return NextResponse.json(
          {
            success: false,
            error: '本日の無料利用回数（5回）を使い切りました。Proにアップグレードすると無制限でご利用いただけます。',
            remainingToday: 0,
          },
          { status: 429 }
        )
      }

      // カウント更新
      await admin.from('daily_usage').upsert(
        { user_id: userId, usage_date: today, count: currentCount + 1 },
        { onConflict: 'user_id,usage_date' }
      )

      const remaining = Math.max(0, FREE_DAILY_LIMIT - currentCount - 1)

      // プロファイル取得
      if (body.profileId) {
        const { data: p } = await admin
          .from('reply_profiles')
          .select('*')
          .eq('id', body.profileId)
          .eq('user_id', userId)
          .single()
        profile = p
      }

      let result: GenerateReplyResult
      try {
        result = await callClaude(body, profile, [])
      } catch {
        try {
          result = await callClaude(body, profile, [])
        } catch {
          return NextResponse.json(
            { success: false, error: '返信の生成に失敗しました。しばらくしてからもう一度お試しください。', remainingToday: remaining },
            { status: 500 }
          )
        }
      }

      return NextResponse.json({ success: true, data: result, remainingToday: remaining })
    }

    // Pro ユーザー処理
    const admin = getSupabaseAdmin()

    if (body.profileId) {
      const { data: p } = await admin
        .from('reply_profiles')
        .select('*')
        .eq('id', body.profileId)
        .eq('user_id', userId)
        .single()
      profile = p
    }

    // 重複回避: 直近5件の返信取得
    const { data: history } = await admin
      .from('reply_history')
      .select('selected_reply')
      .eq('user_id', userId)
      .not('selected_reply', 'is', null)
      .order('created_at', { ascending: false })
      .limit(5)

    recentReplies = (history ?? [])
      .map((h: { selected_reply: string | null }) => h.selected_reply)
      .filter(Boolean) as string[]

    let result: GenerateReplyResult
    try {
      result = await callClaude(body, profile, recentReplies)
    } catch {
      try {
        result = await callClaude(body, profile, recentReplies)
      } catch {
        return NextResponse.json(
          { success: false, error: '返信の生成に失敗しました。しばらくしてからもう一度お試しください。', remainingToday: Infinity },
          { status: 500 }
        )
      }
    }

    // Pro: 履歴保存
    await admin.from('reply_history').insert({
      user_id: userId,
      profile_id: body.profileId ?? null,
      review_text: body.reviewText,
      rating: body.rating,
      platform: body.platform,
      sentiment: result.sentiment,
      customer_analysis: result.customerAnalysis,
    })

    return NextResponse.json({ success: true, data: result, remainingToday: Infinity })
  }

  // 未ログイン（お試し）: IPベース1回/日
  if (getRemainingTrial(ip) <= 0) {
    return NextResponse.json(
      {
        success: false,
        error: 'お試し利用は1日1回までです。ログインすると1日5回まで無料でご利用いただけます。',
        remainingToday: 0,
      },
      { status: 429 }
    )
  }

  if (!consumeTrial(ip)) {
    return NextResponse.json(
      { success: false, error: 'お試し利用は1日1回までです。', remainingToday: 0 },
      { status: 429 }
    )
  }

  let result: GenerateReplyResult
  try {
    result = await callClaude(body, null, [])
  } catch {
    try {
      result = await callClaude(body, null, [])
    } catch {
      return NextResponse.json(
        { success: false, error: '返信の生成に失敗しました。しばらくしてからもう一度お試しください。', remainingToday: 0 },
        { status: 500 }
      )
    }
  }

  return NextResponse.json({ success: true, data: result, remainingToday: 0 })
}
