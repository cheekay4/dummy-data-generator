import chalk from 'chalk';
import ora from 'ora';
import { sendEmail } from '../services/gmail.js';
import {
  getApprovedEmails,
  markEmailSent,
  updateLeadStatus,
  getTodaySentCount,
  incrementDailySentCount,
  getLeadById,
} from '../services/lead-db.js';
import { SAFETY } from '../config/constants.js';

interface SendOptions {
  dryRun: boolean;
}

/**
 * 承認済みメールを送信する
 */
export async function sendCommand(options: SendOptions): Promise<void> {
  const todaySent = await getTodaySentCount();
  const limit = SAFETY.DAILY_SEND_LIMIT;

  if (todaySent >= limit) {
    console.log(chalk.red(`日次送信上限（${limit}通）に達しています。明日再実行してください。`));
    return;
  }

  const remaining = limit - todaySent;
  const emails = await getApprovedEmails(Math.min(remaining, SAFETY.MAX_BATCH_SIZE));

  if (emails.length === 0) {
    console.log(chalk.yellow('送信対象の承認済みメールがありません。'));
    return;
  }

  console.log(chalk.bold(`\n${emails.length} 件を送信します（本日残り枠: ${remaining}）\n`));

  if (options.dryRun) {
    console.log(chalk.cyan('[DRY RUN] 実際には送信しません'));
    for (const email of emails) {
      const lead = await getLeadById(email.lead_id);
      console.log(
        chalk.cyan(`  → ${lead?.company_name ?? email.lead_id} <${lead?.email}> | ${email.subject}`),
      );
    }
    return;
  }

  let sent = 0;
  let failed = 0;

  for (const email of emails) {
    const lead = await getLeadById(email.lead_id);
    if (!lead) {
      console.log(chalk.red(`リードが見つかりません: ${email.lead_id}`));
      failed++;
      continue;
    }

    const sp = ora(`送信中: ${lead.company_name} <${lead.email}>`).start();

    try {
      const { messageId, threadId } = await sendEmail({
        to: lead.email,
        subject: email.subject,
        bodyText: email.body_text,
        bodyHtml: email.body_html,
        dailySentToday: todaySent + sent,
      });

      await markEmailSent(email.id, messageId, threadId);
      await updateLeadStatus(lead.id, 'sent');
      await incrementDailySentCount();

      sp.succeed(`送信完了: ${lead.company_name} <${lead.email}>`);
      sent++;

      // 最小インターバル待機
      if (sent < emails.length) {
        sp.start(`次の送信まで ${SAFETY.MIN_SEND_INTERVAL_SEC} 秒待機中...`);
        await new Promise((r) => setTimeout(r, SAFETY.MIN_SEND_INTERVAL_SEC * 1000));
        sp.stop();
      }
    } catch (err) {
      sp.fail(
        `送信失敗: ${lead.email} — ${err instanceof Error ? err.message : String(err)}`,
      );
      failed++;
    }
  }

  console.log('');
  console.log(chalk.green(`✓ ${sent} 件送信完了`));
  if (failed > 0) console.log(chalk.red(`  ${failed} 件送信失敗`));
}
