import Anthropic from '@anthropic-ai/sdk';
import { buildSystemPrompt, buildUserPrompt } from '@/lib/keigo/prompts';
import type { RecipientType, EmailType, AdjustmentType } from '@/lib/keigo/types';
import { getStripe } from '@/lib/stripe/client';

// TODO: 将来は chrome-extension://EXTENSION_ID に絞る
const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, X-License-Key',
};

// Chrome拡張から送られてくる簡易フォーマットの型
type ExtScene = 'reply' | 'request' | 'apologize' | 'thanks' | 'check';
type ExtRecipient = 'superior' | 'client' | 'colleague' | 'other';
type ExtTone = 'polite' | 'formal' | 'casual';

const sceneToEmailType: Record<ExtScene, EmailType> = {
  reply: 'custom',
  request: 'request',
  apologize: 'apology',
  thanks: 'thanks',
  check: 'inquiry',
};

const extRecipientMap: Record<ExtRecipient, RecipientType> = {
  superior: 'boss',
  client: 'external',
  colleague: 'colleague',
  other: 'external',
};

const extToneMap: Record<ExtTone, number> = {
  polite: 50,
  formal: 20,
  casual: 75,
};

const extToneDescMap: Record<ExtTone, string> = {
  polite: '丁寧語・です・ます調。読みやすく自然なビジネスメール。',
  formal: 'かしこまった文語調。「拝啓」「敬具」等の頭語・結語も適宜使用。社外・目上への正式な文書レベル。',
  casual: 'やや砕けた口語調。友人・同僚への軽いメール。敬語は最低限にとどめ、話し言葉に近い表現を使う。',
};

async function validateLicenseKey(key: string): Promise<boolean> {
  try {
    const stripe = getStripe();
    const customers = await stripe.customers.search({
      query: `metadata['license_key']:'${key}'`,
      limit: 1,
    });
    if (!customers.data[0]) return false;
    const subs = await stripe.subscriptions.list({
      customer: customers.data[0].id,
      status: 'active',
      limit: 1,
    });
    return subs.data.length > 0;
  } catch {
    return false;
  }
}

export async function OPTIONS() {
  return new Response(null, { status: 200, headers: CORS_HEADERS });
}

export async function POST(request: Request) {
  if (!process.env.ANTHROPIC_API_KEY) {
    return Response.json(
      { error: 'APIキーが設定されていません' },
      { status: 500, headers: CORS_HEADERS }
    );
  }

  // ライセンスキー検証
  const licenseKey = request.headers.get('X-License-Key');
  let isPro = false;
  if (licenseKey) {
    isPro = await validateLicenseKey(licenseKey);
  }

  const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

  try {
    const body = await request.json();

    // リクエストフォーマット検出: Chrome拡張（text/scene/recipient/tone文字列）vs Webフォーマット
    let recipient: RecipientType;
    let emailType: EmailType;
    let tone: number;
    let subject: string;
    let content: string;
    let senderName: string | undefined;
    let senderCompany: string | undefined;
    let recipientName: string | undefined;
    let recipientCompany: string | undefined;
    let adjustment: AdjustmentType;

    let toneInstruction: string | undefined;

    if (typeof body.text === 'string') {
      // Chrome拡張フォーマット
      const extScene = body.scene as ExtScene;
      const extRecipient = body.recipient as ExtRecipient;
      const extTone = body.tone as ExtTone;

      content = body.text;
      emailType = sceneToEmailType[extScene] ?? 'custom';
      recipient = extRecipientMap[extRecipient] ?? 'external';
      tone = extToneMap[extTone] ?? 50;
      subject = '';
      toneInstruction = extToneDescMap[extTone] ?? extToneDescMap.polite;
    } else {
      // 既存Webフォーマット
      ({
        recipient,
        emailType,
        tone,
        subject,
        content,
        senderName,
        senderCompany,
        recipientName,
        recipientCompany,
        adjustment,
      } = body as {
        recipient: RecipientType;
        emailType: EmailType;
        tone: number;
        subject: string;
        content: string;
        senderName?: string;
        senderCompany?: string;
        recipientName?: string;
        recipientCompany?: string;
        adjustment?: AdjustmentType;
      });
    }

    if (!content?.trim()) {
      return Response.json(
        { error: '本文を入力してください' },
        { status: 400, headers: CORS_HEADERS }
      );
    }

    let systemPrompt = buildSystemPrompt(recipient, emailType, tone ?? 50, adjustment);
    if (toneInstruction) {
      systemPrompt += `\n\n## 文体・丁寧さ（最優先）\n${toneInstruction}\n上記の文体を必ず守ること。特にcasualの場合は敬語を最小限にすること。`;
    }
    const userPrompt = buildUserPrompt({
      subject,
      content,
      senderName,
      senderCompany,
      recipientName,
      recipientCompany,
    });

    const message = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 2000,
      system: systemPrompt,
      messages: [{ role: 'user', content: userPrompt }],
    });

    const rawText =
      message.content[0].type === 'text' ? message.content[0].text : '';

    const responseText = rawText
      .replace(/^```(?:json)?\s*/i, '')
      .replace(/\s*```$/i, '')
      .trim();

    return Response.json({ result: responseText, isPro }, { headers: CORS_HEADERS });
  } catch (err) {
    const message = err instanceof Error ? err.message : '生成に失敗しました';
    return Response.json({ error: message }, { status: 500, headers: CORS_HEADERS });
  }
}
