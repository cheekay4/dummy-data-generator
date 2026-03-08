import { NextRequest } from 'next/server'
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY })

interface RequestBody {
  conversation: Array<{ role: 'user' | 'assistant'; content: string }>
  templateDisplayName: string
  outputSections: string[]
  extractedKnowledgeSummary: string
  manualTitle: string
}

const GENERATION_PROMPT = `以下のインタビュー記録をもとに、後任者向けの引き継ぎマニュアルを生成してください。

【出力フォーマット】
- Markdownで出力
- 見出しは ## と ### を使用
- 手順はナンバリング（1. 2. 3.）
- 重要なポイントは > 引用ブロックで強調
- 表が適切な場合は Markdown テーブルを使用
- 「前任者のコツ」「注意」「ポイント」は 💡 ⚠️ 📌 の絵文字で視覚的に区別

【マニュアルの構成（このセクション順に出力すること）】
{sections}

【絶対に守るルール】
- インタビューで出てこなかった情報を捏造しない
- 曖昧だった箇所は「※ 詳細は前任者に要確認」と明記する
- 後任者が読んだ時に「次に何をすればいいか」が常に明確であること
- 専門用語には（）で補足説明を入れる
- 出力はMarkdownのみ（前置き・後書きの文章は不要）

【マニュアルタイトル】
{manual_title}

【抽出済み情報のサマリー】
{extracted_knowledge_summary}

【インタビュー記録】
{conversation_history}`

export async function POST(req: NextRequest) {
  try {
    const body: RequestBody = await req.json()
    const { conversation, templateDisplayName, outputSections, extractedKnowledgeSummary, manualTitle } = body

    const conversationHistory = conversation
      .map(m => `【${m.role === 'user' ? '担当者' : 'AI'}】${m.content}`)
      .join('\n\n')

    const sectionsText = outputSections.map((s, i) => `${i + 1}. ${s}`).join('\n')

    const prompt = GENERATION_PROMPT
      .replace('{sections}', sectionsText)
      .replace('{manual_title}', `${manualTitle}（${templateDisplayName}）`)
      .replace('{extracted_knowledge_summary}', extractedKnowledgeSummary || '（情報なし）')
      .replace('{conversation_history}', conversationHistory)

    // Streaming response
    const stream = await client.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      messages: [{ role: 'user', content: prompt }],
    })

    const encoder = new TextEncoder()
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of stream) {
            if (
              chunk.type === 'content_block_delta' &&
              chunk.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(chunk.delta.text))
            }
          }
          controller.close()
        } catch (err) {
          controller.error(err)
        }
      },
    })

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/plain; charset=utf-8',
        'Transfer-Encoding': 'chunked',
        'Cache-Control': 'no-cache',
      },
    })
  } catch (error) {
    console.error('/api/generate error:', error)
    return new Response(
      JSON.stringify({ error: 'マニュアル生成に失敗しました。再度お試しください。' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
