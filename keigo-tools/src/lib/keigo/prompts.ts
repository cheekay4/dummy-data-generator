import type { RecipientType, EmailType, AdjustmentType } from './types';

function getRecipientDescription(recipient: RecipientType): string {
  switch (recipient) {
    case 'external':
      return '社外の取引先・顧客。最も丁寧な敬語を使用すること。';
    case 'boss':
      return '社内の上司。丁寧な敬語を使用するが、過度に形式張らない。';
    case 'colleague':
      return '社内の同僚・後輩。ですます調を基本としつつ、やや砕けた表現も可。';
    case 'recruiter':
      return '就活における採用担当者。フォーマルな敬語を使用すること。';
  }
}

function getEmailTypeDescription(emailType: EmailType): string {
  switch (emailType) {
    case 'thanks':
      return 'お礼・感謝のメール。感謝の気持ちを丁寧に伝える。';
    case 'apology':
      return 'お詫び・謝罪のメール。誠実に謝罪し、再発防止を伝える。';
    case 'request':
      return '依頼・お願いのメール。相手の負担に配慮しつつ丁寧に依頼する。';
    case 'report':
      return '報告・連絡のメール。事実を簡潔・明確に伝える。';
    case 'inquiry':
      return '確認・問い合わせのメール。質問事項を明確に示す。';
    case 'schedule':
      return '日程調整のメール。候補日程を明示し、相手の都合を伺う。';
    case 'reminder':
      return '催促・リマインドのメール。角が立たないよう配慮しつつ確認を促す。';
    case 'decline':
      return 'お断り・辞退のメール。相手を傷つけず丁寧に断る。';
    case 'greeting':
      return '挨拶のメール（着任・異動・退職）。今後の関係に配慮した表現を使う。';
    case 'proposal':
      return '見積もり・提案のメール。提案内容を明確に伝え、検討を促す。';
    case 'invitation':
      return '招待・案内のメール。参加を促しつつ、詳細を明確に伝える。';
    case 'congratulation':
      return 'お祝いのメール。相手の喜びを共に祝う温かみのある表現を使う。';
    case 'condolence':
      return 'お悔やみのメール。哀悼の意を丁寧かつ控えめに伝える。';
    case 'custom':
      return '自由形式のメール。内容に合わせた適切な敬語を使用する。';
  }
}

export function buildSystemPrompt(
  recipient: RecipientType,
  emailType: EmailType,
  tone: number,
  adjustment?: AdjustmentType
): string {
  const toneLevel =
    adjustment === 'more-formal'
      ? Math.max(0, tone - 20)
      : adjustment === 'more-casual'
      ? Math.min(100, tone + 20)
      : tone;

  return `あなたは日本語ビジネスメールの専門家です。
ユーザーが入力したカジュアルな文章や箇条書きを、適切な敬語のビジネスメールに変換してください。

## 相手との関係
${getRecipientDescription(recipient)}

## メールの種類
${getEmailTypeDescription(emailType)}

## トーンレベル: ${toneLevel}/100
${toneLevel < 30 ? '最大限フォーマルな敬語を使用。二重敬語にならない範囲で最も丁寧に。' : ''}
${toneLevel >= 30 && toneLevel < 70 ? '標準的なビジネス敬語。堅すぎず、かつ失礼にならないバランス。' : ''}
${toneLevel >= 70 ? '親しみやすい敬語。「です・ます」調を基本としつつ、柔らかい表現を使用。' : ''}

## 出力形式
以下のJSON形式で出力してください。JSON以外の文字は一切出力しないでください。

{
  "subject": "件名（ユーザーが指定していない場合は自動生成）",
  "body": "メール本文（改行は\\nで表現）",
  "techniques": [
    {
      "original": "元の表現",
      "converted": "変換後の表現",
      "explanation": "使用した敬語テクニックの解説"
    }
  ]
}

## ルール
1. 宛名（○○様）、挨拶文、本文、結び、署名の構成を守る
2. 「お忙しいところ恐れ入りますが」等のクッション言葉を適切に使用
3. 二重敬語（「おっしゃられる」等）は使わない
4. 「させていただく」の乱用を避ける（許可が不要な場面では使わない）
5. 相手の行為には尊敬語、自分の行為には謙譲語を正しく使い分ける
6. 件名は30文字以内で内容が分かるようにする
7. 署名は名前・所属が提供されている場合のみ付ける`;
}

export function buildUserPrompt(params: {
  subject: string;
  content: string;
  senderName?: string;
  senderCompany?: string;
  recipientName?: string;
  recipientCompany?: string;
}): string {
  const lines: string[] = [];

  if (params.recipientName || params.recipientCompany) {
    lines.push('## 相手の情報');
    if (params.recipientCompany) lines.push(`会社名: ${params.recipientCompany}`);
    if (params.recipientName) lines.push(`名前: ${params.recipientName}`);
    lines.push('');
  }

  if (params.senderName || params.senderCompany) {
    lines.push('## 送信者の情報（署名用）');
    if (params.senderCompany) lines.push(`所属: ${params.senderCompany}`);
    if (params.senderName) lines.push(`名前: ${params.senderName}`);
    lines.push('');
  }

  if (params.subject) {
    lines.push('## 件名（指定あり）');
    lines.push(params.subject);
    lines.push('');
  }

  lines.push('## メールの内容（箇条書き・カジュアルな文章）');
  lines.push(params.content);

  return lines.join('\n');
}
