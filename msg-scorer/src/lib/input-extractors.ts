// ─────────────────────────────────────────────────────────────────
// HTML extraction
// ─────────────────────────────────────────────────────────────────
export function extractTextFromHtml(html: string): string {
  let text = html
    .replace(/<head[\s\S]*?<\/head>/gi, '')
    .replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '');

  text = text
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<\/div>/gi, '\n')
    .replace(/<\/li>/gi, '\n')
    .replace(/<p[^>]*>/gi, '')
    .replace(/<div[^>]*>/gi, '')
    .replace(/<li[^>]*>/gi, '');

  // img alt → [画像: alt]
  text = text.replace(/<img[^>]*alt="([^"]+)"[^>]*>/gi, '[画像: $1]');
  text = text.replace(/<img[^>]*>/gi, '');
  text = text.replace(/<[^>]+>/g, '');

  // HTMLエンティティ
  text = text
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");

  text = text.replace(/[ \t]+/g, ' ');
  text = text.replace(/\n{3,}/g, '\n\n');
  return text.trim();
}

// ─────────────────────────────────────────────────────────────────
// JSON extraction
// ─────────────────────────────────────────────────────────────────
type JsonRecord = Record<string, unknown>;

export function extractTextFromJson(input: string): { text: string; error?: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    return { text: '', error: '有効なJSONではありません' };
  }

  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    return { text: '', error: 'オブジェクト形式のJSONを貼り付けてください' };
  }

  const json = parsed as JsonRecord;
  const getString = (keys: string[]): string => {
    for (const k of keys) {
      const v = json[k];
      if (typeof v === 'string' && v.trim()) return v.trim();
    }
    return '';
  };

  const subject = getString(['subject', 'title', 'email_subject', 'Subject', 'Title', 'EmailSubject']);
  const body = getString(['body', 'content', 'text', 'email_body', 'message', 'Body', 'Content', 'Text', 'EmailBody', 'Message']);
  const combined = [subject, body].filter(Boolean).join('\n');
  if (!combined) return { text: '', error: 'subject / body などのキーが見つかりませんでした' };
  return { text: combined };
}

// ─────────────────────────────────────────────────────────────────
// LINE JSON extraction
// ─────────────────────────────────────────────────────────────────
interface LineMessage {
  type: string;
  text?: string;
  altText?: string;
  contents?: FlexNode;
  template?: {
    type: string;
    text?: string;
    columns?: Array<{ text?: string }>;
  };
}

interface FlexNode {
  type: string;
  text?: string;
  contents?: FlexNode[];
  body?: FlexNode;
  header?: FlexNode;
  footer?: FlexNode;
}

function extractFlexTexts(node: FlexNode): string[] {
  const texts: string[] = [];
  if (node.type === 'text' && typeof node.text === 'string') texts.push(node.text);
  node.contents?.forEach(c => texts.push(...extractFlexTexts(c)));
  if (node.body)   texts.push(...extractFlexTexts(node.body));
  if (node.header) texts.push(...extractFlexTexts(node.header));
  if (node.footer) texts.push(...extractFlexTexts(node.footer));
  return texts;
}

function extractSingleLineMessage(msg: LineMessage): string {
  if (msg.type === 'text') return msg.text ?? '';
  if (msg.type === 'flex') {
    const parts: string[] = [];
    if (msg.altText) parts.push(msg.altText);
    if (msg.contents) parts.push(...extractFlexTexts(msg.contents));
    return parts.join('\n');
  }
  if (msg.type === 'template') {
    const parts: string[] = [];
    if (msg.altText) parts.push(msg.altText);
    if (msg.template?.text) parts.push(msg.template.text);
    msg.template?.columns?.forEach(c => { if (c.text) parts.push(c.text); });
    return parts.join('\n');
  }
  return msg.altText ?? '';
}

export function extractTextFromLineJson(input: string): { text: string; error?: string } {
  let parsed: unknown;
  try {
    parsed = JSON.parse(input);
  } catch {
    return { text: '', error: '有効なJSONではありません' };
  }

  let messages: LineMessage[];
  if (Array.isArray(parsed)) {
    messages = parsed as LineMessage[];
  } else if (typeof parsed === 'object' && parsed !== null) {
    const obj = parsed as { messages?: unknown; type?: string };
    if (Array.isArray(obj.messages)) {
      messages = obj.messages as LineMessage[];
    } else {
      messages = [parsed as LineMessage];
    }
  } else {
    return { text: '', error: '有効なLINE JSONではありません' };
  }

  const texts = messages.map(extractSingleLineMessage).filter(Boolean);
  if (!texts.length) return { text: '', error: 'メッセージテキストが見つかりませんでした' };
  return { text: texts.join('\n\n') };
}
