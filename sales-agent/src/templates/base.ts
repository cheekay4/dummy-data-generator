import { env } from '../config/env.js';

const UNSUBSCRIBE_EMAIL = env.SENDER_EMAIL;
const SITE_URL = 'https://msgscore.jp';

/**
 * 特定電子メール法に基づくフッターを付与する
 */
function buildLegalFooter(): { text: string; html: string } {
  const text = [
    '',
    '---',
    `送信者: ${env.SENDER_NAME}`,
    `メールアドレス: ${env.SENDER_EMAIL}`,
    '',
    `このメールの配信を停止するには、以下のアドレスへ空のメールを送信してください。`,
    `${UNSUBSCRIBE_EMAIL}（件名: unsubscribe）`,
    '',
    `MsgScore: ${SITE_URL}`,
  ].join('\n');

  const html = `
<hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0;">
<p style="font-size:11px;color:#9ca3af;line-height:1.6;">
  送信者: ${env.SENDER_NAME}（${env.SENDER_EMAIL}）<br>
  このメールの配信を停止するには
  <a href="mailto:${UNSUBSCRIBE_EMAIL}?subject=unsubscribe" style="color:#9ca3af;">こちらへメール</a>
  をお送りください。<br>
  <a href="${SITE_URL}" style="color:#9ca3af;">MsgScore</a>
</p>
`;

  return { text, html };
}

/**
 * 本文 + 法令フッターを結合した最終メール本文を返す
 */
export function buildBaseEmail(
  bodyText: string,
  bodyHtml: string,
): { bodyText: string; bodyHtml: string } {
  const footer = buildLegalFooter();

  return {
    bodyText: bodyText + footer.text,
    bodyHtml: `
<!DOCTYPE html>
<html lang="ja">
<head><meta charset="UTF-8"></head>
<body style="font-family:'Helvetica Neue',Arial,sans-serif;font-size:14px;color:#374151;line-height:1.8;max-width:560px;margin:0 auto;padding:24px 16px;">
  ${bodyHtml}
  ${footer.html}
</body>
</html>
`.trim(),
  };
}
