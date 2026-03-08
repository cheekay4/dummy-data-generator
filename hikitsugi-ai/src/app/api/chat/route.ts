import { NextRequest, NextResponse } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'
import type { InterviewPhase } from '@/lib/types'
import { PHASE_LABELS, PHASE_ORDER } from '@/lib/templates'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

const SYSTEM_PROMPT = `あなたは「引き継ぎの専門家」です。
退職・異動する担当者から業務ナレッジを引き出す、プロのインタビュアーとして振る舞います。

【あなたの目的】
ユーザーが持つ業務の暗黙知（手順・判断基準・コツ・例外処理・人間関係のポイント）を
対話を通じて漏れなく引き出し、後任者が読むだけで業務を遂行できるマニュアルを作成すること。

【インタビューの進め方】
1. まず業務の全体像を把握する（何の業務か、頻度は、関係者は誰か）
2. 次に手順を時系列で深掘りする（「具体的にはどうやりますか？」「その次は？」）
3. 判断基準を引き出す（「どういう場合にAを選びますか？Bとの違いは？」）
4. 例外・トラブル対応を聞く（「うまくいかないケースは？」「その時どうしますか？」）
5. 暗黙のコツを引き出す（「後任者に一番伝えたいことは？」「みんなが見落としがちなポイントは？」）

【質問のルール】
- 1回の返答で質問は1つだけ（複数質問は絶対にしない）
- 前の回答を必ず要約・確認してから次の質問に進む
- 専門用語が出たら「それは後任者にも伝わる言葉ですか？」と確認する
- 曖昧な回答には「具体的には？」「例えば？」と深掘りする
- ユーザーが「もう思い出せない」「特にない」と言ったら無理に深掘りしない

【トーン】
- 敬語（ですます調）
- 温かく、急かさない
- 「ありがとうございます、それは後任者にとってとても助かる情報です」等の肯定を挟む

【業種テンプレート・現在フェーズの情報】
{template_context}

【これまでの対話で判明した情報の要約】
{extracted_knowledge_summary}

【現在のステップ】
{current_phase}（ステップ順: 全体像 → 手順 → 判断基準 → 例外 → コツ）

【重要：返答フォーマット】
会話テキストを返した後、必ず以下のXMLタグをそのまま末尾に付けること（ユーザーには表示されない内部データ）:

<metadata>
{"extracted_knowledge": [{"title": "項目名", "content": "内容（50文字以内）", "phase": "フェーズキー"}], "should_advance_phase": false, "phase_coverage": 0.5}
</metadata>

extracted_knowledge: 直前のユーザー回答から抽出した情報（0〜3件）
should_advance_phase: 現フェーズの主要質問を十分カバーしたらtrue（phase_coverage >= 0.8）
phase_coverage: 0.0〜1.0の数値（現フェーズの質問カバー率）`

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

interface RequestBody {
  messages: ChatMessage[]
  templateKey: string
  templateDisplayName: string
  questionFlow: Record<string, string[]>
  currentPhase: InterviewPhase
  currentPhaseIndex: number
  extractedKnowledgeSummary: string
}

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json()
    const {
      messages,
      templateDisplayName,
      questionFlow,
      currentPhase,
      currentPhaseIndex,
      extractedKnowledgeSummary,
    } = body

    // Build template context for current phase
    const currentQuestions = questionFlow[currentPhase] ?? []
    const phaseName = PHASE_LABELS[currentPhase]
    const templateContext = `業種: ${templateDisplayName}
現在のステップ「${phaseName}」で聞くべき質問（参考）:
${currentQuestions.map((q, i) => `${i + 1}. ${q}`).join('\n')}
残りのステップ: ${PHASE_ORDER.slice(currentPhaseIndex + 1).map(p => PHASE_LABELS[p]).join(' → ')}`

    const systemPrompt = SYSTEM_PROMPT
      .replace('{template_context}', templateContext)
      .replace('{extracted_knowledge_summary}', extractedKnowledgeSummary || '（まだ情報が収集されていません）')
      .replace('{current_phase}', phaseName)

    // Convert messages to Anthropic format (strip extractedKnowledge from content)
    const anthropicMessages = messages.map(m => ({
      role: m.role as 'user' | 'assistant',
      content: m.content,
    }))

    const response = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 1024,
      system: systemPrompt,
      messages: anthropicMessages,
    })

    const rawText = response.content[0].type === 'text' ? response.content[0].text : ''

    // Parse metadata from XML tag
    const metadataMatch = rawText.match(/<metadata>([\s\S]*?)<\/metadata>/)
    let extractedKnowledge: Array<{ title: string; content: string; phase: string }> = []
    let shouldAdvancePhase = false
    let phaseCoverage = 0

    if (metadataMatch) {
      try {
        const meta = JSON.parse(metadataMatch[1].trim())
        extractedKnowledge = meta.extracted_knowledge ?? []
        shouldAdvancePhase = meta.should_advance_phase ?? false
        phaseCoverage = meta.phase_coverage ?? 0
      } catch {
        // Metadata parse failed — continue without it
      }
    }

    // Strip metadata from displayed text
    const displayText = rawText.replace(/<metadata>[\s\S]*?<\/metadata>/g, '').trim()

    return NextResponse.json({
      response: displayText,
      extractedKnowledge,
      shouldAdvancePhase,
      phaseCoverage,
    })
  } catch (error) {
    console.error('/api/chat error:', error)
    const message = error instanceof Error ? error.message : 'Unknown error'
    if (message.includes('rate_limit') || message.includes('overloaded')) {
      return NextResponse.json(
        { error: 'rate_limit', message: '少し時間を空けてからもう一度お試しください。' },
        { status: 429 }
      )
    }
    return NextResponse.json(
      { error: 'api_error', message: 'AIとの通信に失敗しました。再度お試しください。' },
      { status: 500 }
    )
  }
}
