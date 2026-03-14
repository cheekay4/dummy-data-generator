import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import type { TranscribeResponse } from '@/lib/types'

export const runtime = 'nodejs'

const MAX_FILE_SIZE = 25 * 1024 * 1024 // 25MB

export async function POST(req: NextRequest): Promise<NextResponse<TranscribeResponse>> {
  // Supabase Auth セッション検証
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 })
  }

  // TRANSCRIBE_PROVIDER チェック
  const provider = process.env.TRANSCRIBE_PROVIDER

  if (!provider) {
    return NextResponse.json(
      { error: '音声文字起こし機能は現在利用できません。TRANSCRIBE_PROVIDERを設定してください' },
      { status: 503 }
    )
  }

  // FormData からファイル取得
  let formData: FormData
  try {
    formData = await req.formData()
  } catch {
    return NextResponse.json({ error: 'リクエストの解析に失敗しました' }, { status: 400 })
  }

  const audio = formData.get('audio')
  const mimeType = formData.get('mimeType')?.toString() ?? ''

  if (!audio || !(audio instanceof File)) {
    return NextResponse.json({ error: '音声ファイルが見つかりません' }, { status: 400 })
  }

  // ファイルサイズチェック
  if (audio.size > MAX_FILE_SIZE) {
    return NextResponse.json(
      { error: 'ファイルサイズが上限(25MB)を超えています' },
      { status: 400 }
    )
  }

  // MIME type チェック
  const effectiveMimeType = mimeType || audio.type
  if (!effectiveMimeType.startsWith('audio/')) {
    return NextResponse.json(
      { error: '対応していない音声形式です' },
      { status: 400 }
    )
  }

  // Groq Whisper API への転送
  if (provider === 'groq') {
    const groqApiKey = process.env.GROQ_API_KEY
    if (!groqApiKey) {
      return NextResponse.json(
        { error: '音声文字起こし機能は現在利用できません。TRANSCRIBE_PROVIDERを設定してください' },
        { status: 503 }
      )
    }

    try {
      const groqForm = new FormData()
      groqForm.append('file', audio)
      groqForm.append('model', 'whisper-large-v3')

      const groqRes = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${groqApiKey}`,
        },
        body: groqForm,
      })

      if (!groqRes.ok) {
        const errText = await groqRes.text()
        console.error('Groq API error:', groqRes.status, errText)
        return NextResponse.json(
          { error: '音声文字起こしに失敗しました' },
          { status: 502 }
        )
      }

      const result = await groqRes.json() as { text: string }
      return NextResponse.json({ text: result.text })
    } catch (error) {
      console.error('/api/transcribe groq error:', error)
      return NextResponse.json(
        { error: '音声文字起こしに失敗しました' },
        { status: 502 }
      )
    }
  }

  // provider が groq 以外
  return NextResponse.json(
    { error: '音声文字起こし機能は現在利用できません。TRANSCRIBE_PROVIDERを設定してください' },
    { status: 503 }
  )
}
