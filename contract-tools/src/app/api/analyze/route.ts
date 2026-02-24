import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt } from '@/lib/contract/prompts';
import type { ContractType, PositionType } from '@/lib/contract/types';

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json({ error: 'APIキーが設定されていません' }, { status: 500 });
  }

  try {
    const { contractText, contractType, position } = (await request.json()) as {
      contractText: string;
      contractType: ContractType;
      position: PositionType;
    };

    if (!contractText?.trim()) {
      return Response.json({ error: '契約書テキストを入力してください' }, { status: 400 });
    }

    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const systemPrompt = buildSystemPrompt(contractType ?? 'auto', position ?? 'neutral');

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4000,
      system: systemPrompt,
      messages: [{ role: 'user', content: contractText }],
    });

    const responseText = message.content[0].type === 'text' ? message.content[0].text : '';

    // Strip markdown code fences if present
    const cleaned = responseText.replace(/^```(?:json)?\s*/i, '').replace(/\s*```$/i, '').trim();

    let parsed;
    try {
      parsed = JSON.parse(cleaned);
    } catch {
      // Fallback: return error structure
      parsed = {
        contractType: '判定不能',
        riskScore: -1,
        summary: responseText,
        keyPoints: [],
        risks: [],
        articles: [],
        missingClauses: [],
      };
    }

    return Response.json({ result: parsed });
  } catch (err) {
    const message = err instanceof Error ? err.message : '分析に失敗しました';
    return Response.json({ error: message }, { status: 500 });
  }
}
