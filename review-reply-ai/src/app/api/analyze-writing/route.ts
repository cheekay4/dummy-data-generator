import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import { ANALYSIS_SYSTEM_PROMPT } from '@/lib/prompts'
import type { AnalyzeWritingResult } from '@/lib/types'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

export async function POST(request: NextRequest) {
  let body: { samples: string[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'リクエストの形式が正しくありません。' }, { status: 400 })
  }

  if (!body.samples || body.samples.length < 2) {
    return NextResponse.json({ error: '最低2件の文章サンプルを入力してください。' }, { status: 400 })
  }

  const validSamples = body.samples.filter((s) => s.trim().length >= 30)
  if (validSamples.length < 2) {
    return NextResponse.json({ error: '各文章は30文字以上入力してください。' }, { status: 400 })
  }

  const userContent = `以下の文章サンプルを分析してください。

${validSamples.map((s, i) => `【サンプル${i + 1}】\n${s}`).join('\n\n')}`

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 1000,
      temperature: 0.3,
      system: ANALYSIS_SYSTEM_PROMPT,
      messages: [{ role: 'user', content: userContent }],
    })

    const text = message.content[0].type === 'text' ? message.content[0].text : ''
    const cleaned = text.replace(/```(?:json)?\n?/g, '').replace(/```/g, '').trim()
    const result = JSON.parse(cleaned) as AnalyzeWritingResult

    return NextResponse.json({ success: true, data: result })
  } catch (e) {
    console.error('analyze-writing error:', e)
    return NextResponse.json({ error: '分析に失敗しました。もう一度お試しください。' }, { status: 500 })
  }
}
