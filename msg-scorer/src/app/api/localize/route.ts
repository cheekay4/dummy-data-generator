import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { createClient } from '@/lib/supabase/server';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function POST(req: NextRequest) {
  // 認証チェック（ログイン必須）
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'ログインが必要です' }, { status: 401 });

  const { text, targetLocale = 'en-US', targetMarket = 'US' } = await req.json() as {
    text: string;
    targetLocale?: string;
    targetMarket?: string;
  };

  if (!text?.trim()) {
    return NextResponse.json({ error: 'テキストが必要です' }, { status: 400 });
  }
  if (text.length > 5000) {
    return NextResponse.json({ error: 'テキストは5000文字以内にしてください' }, { status: 400 });
  }

  const systemPrompt = `You are an expert cross-cultural marketing consultant and copywriter specializing in adapting Japanese marketing content for international markets.

Your task is NOT simple translation — it's a cultural "remake" that:
1. Preserves the original intent, key selling points, and emotional appeal
2. Adapts the communication style to ${targetMarket} market expectations and business customs
3. Uses natural, idiomatic ${targetLocale} language that resonates with the target audience
4. Adjusts:
   - Honorific/formal language → natural professional tone for ${targetMarket}
   - Japanese-specific references → globally understood equivalents
   - Seasonal/cultural context → ${targetMarket}-relevant framing
   - CTA phrasing → assertive, action-oriented (western standard)
   - Numbers/dates → ${targetLocale} format

Output ONLY valid JSON in this exact format (no markdown, no explanation):
{
  "remade": "The remade text in ${targetLocale}",
  "notes": [
    "Key adaptation note 1 (what changed and why)",
    "Key adaptation note 2",
    "Key adaptation note 3"
  ],
  "toneUsed": "Brief description of the tone applied (e.g., 'Professional yet approachable')"
}`;

  const userPrompt = `Please remake the following Japanese marketing/content text for the ${targetMarket} market:

---
${text}
---`;

  try {
    const message = await client.messages.create({
      model: 'claude-sonnet-4-6',
      max_tokens: 2000,
      temperature: 0.5,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const raw = message.content[0].type === 'text' ? message.content[0].text : '';
    let parsed: { remade: string; notes: string[]; toneUsed: string };

    try {
      parsed = JSON.parse(raw);
    } catch {
      const match = raw.match(/```(?:json)?\s*([\s\S]+?)\s*```/);
      if (match) {
        parsed = JSON.parse(match[1]);
      } else {
        throw new Error('JSON parse failed');
      }
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('Localize error:', err);
    return NextResponse.json({ error: 'リメイクに失敗しました。もう一度お試しください。' }, { status: 500 });
  }
}
