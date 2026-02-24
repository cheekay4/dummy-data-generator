import chalk from 'chalk';
import ora from 'ora';
import { monitorInbox } from '../services/reply-monitor.js';
import { classifyIntent } from '../services/intent-classifier.js';
import { researchForReply } from '../services/researcher.js';
import { generateReplyDraft } from '../services/reply-generator.js';
import {
  getPendingReplies,
  updateReplyDraft,
  approveReply,
  getLeadById,
} from '../services/lead-db.js';
import { sendReply } from '../services/gmail.js';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';
import readline from 'readline/promises';
import fs from 'fs/promises';
import path from 'path';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

/**
 * 受信トレイを監視して返信を取り込み、AI分析・ドラフト生成まで行う（バックグラウンドステップ）
 */
export async function monitorCommand(): Promise<void> {
  const spinner = ora('受信トレイを確認中...').start();

  const { saved, replies } = await monitorInbox();

  if (saved === 0) {
    spinner.succeed('新着返信はありません');
    return;
  }

  spinner.succeed(`${saved} 件の新着返信を取得`);

  for (const reply of replies) {
    const sp = ora(`分析中: ${reply.gmail_message_id}`).start();

    try {
      // 送信済みメールの件名を取得
      const { data: emailData } = await supabase
        .from('sales_emails')
        .select('subject, lead_id')
        .eq('id', reply.email_id)
        .single();

      const lead = emailData?.lead_id ? await getLeadById(emailData.lead_id) : null;

      // ナレッジ読み込み
      let knowledgeContext = '';
      try {
        const faqPath = new URL('../../knowledge/product-faq.json', import.meta.url).pathname;
        const faq = JSON.parse(await fs.readFile(faqPath, 'utf-8')) as Array<{ q: string; a: string }>;
        knowledgeContext = faq.map((item) => `Q: ${item.q}\nA: ${item.a}`).join('\n\n');
      } catch {
        knowledgeContext = 'MsgScoreはメール・LINE配信文をAIがスコアリングするツールです。';
      }

      // 意図分類
      const analysis = await classifyIntent(
        reply.reply_body,
        emailData?.subject ?? 'MsgScoreのご紹介',
      );

      // リサーチ（必要な場合）
      const researchResult = lead
        ? await researchForReply(lead, analysis, knowledgeContext)
        : { topics: {}, summary: '' };

      // 返信ドラフト生成
      let draftResponse = '';
      if (lead && analysis.intent !== 'out_of_office') {
        draftResponse = await generateReplyDraft(
          lead,
          analysis,
          researchResult.topics,
          reply.reply_body,
        );
      }

      await updateReplyDraft(reply.id, {
        intent: analysis.intent,
        intent_confidence: analysis.confidence,
        ai_draft_response: draftResponse || null,
        ai_research_notes: researchResult.topics,
      });

      sp.succeed(
        `分析完了: ${analysis.intent}（信頼度: ${Math.round(analysis.confidence * 100)}%）`,
      );
    } catch (err) {
      sp.fail(`分析エラー: ${err instanceof Error ? err.message : String(err)}`);
    }
  }
}

/**
 * AI 生成の返信ドラフトを対話的にレビュー・送信する
 */
export async function reviewRepliesCommand(): Promise<void> {
  const pending = await getPendingReplies();

  if (pending.length === 0) {
    console.log(chalk.yellow('レビュー待ちの返信ドラフトがありません。'));
    return;
  }

  console.log(chalk.bold(`\n${pending.length} 件の返信ドラフトをレビューします\n`));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  for (const reply of pending) {
    const { data: emailData } = await supabase
      .from('sales_emails')
      .select('subject, lead_id, gmail_thread_id')
      .eq('id', reply.email_id)
      .single();

    const lead = emailData?.lead_id ? await getLeadById(emailData.lead_id) : null;

    console.log(chalk.bold('─'.repeat(60)));
    console.log(chalk.cyan(`送信先: ${lead?.company_name ?? '不明'} <${lead?.email ?? '不明'}>`));
    console.log(chalk.cyan(`意図: ${reply.intent} (信頼度: ${Math.round((reply.intent_confidence ?? 0) * 100)}%)`));
    console.log('');
    console.log(chalk.bold('相手の返信:'));
    console.log(reply.reply_body.slice(0, 300));
    console.log('');
    console.log(chalk.bold('AI 返信ドラフト:'));
    console.log(reply.ai_draft_response ?? '（ドラフトなし）');
    console.log('');

    const answer = await rl.question(
      chalk.yellow('[a] 送信  [s] スキップ  [q] 終了 > '),
    );

    switch (answer.toLowerCase().trim()) {
      case 'a':
        if (
          lead?.email &&
          emailData?.subject &&
          emailData?.gmail_thread_id &&
          reply.ai_draft_response
        ) {
          await sendReply({
            to: lead.email,
            subject: emailData.subject,
            bodyText: reply.ai_draft_response,
            threadId: emailData.gmail_thread_id,
          });
          await approveReply(reply.id);
          console.log(chalk.green('✓ 送信しました'));
        } else {
          console.log(chalk.red('送信に必要な情報が不足しています'));
        }
        break;
      case 'q':
        rl.close();
        return;
      default:
        console.log('スキップしました。');
    }
  }

  rl.close();
}
