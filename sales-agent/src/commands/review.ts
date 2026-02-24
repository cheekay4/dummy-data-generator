import readline from 'readline/promises';
import chalk from 'chalk';
import { getLeadsByStatus, getLeadById, approveEmail, updateLeadStatus } from '../services/lead-db.js';
import { createClient } from '@supabase/supabase-js';
import { env } from '../config/env.js';

const supabase = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

/**
 * ドラフト一覧を表示し、対話的に承認/却下を行う
 */
export async function reviewCommand(): Promise<void> {
  const leads = await getLeadsByStatus('draft_ready');

  if (leads.length === 0) {
    console.log(chalk.yellow('レビュー待ちのドラフトがありません。'));
    return;
  }

  console.log(chalk.bold(`\n${leads.length} 件のドラフトをレビューします\n`));

  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });

  for (const lead of leads) {
    // ドラフトを取得
    const { data: drafts } = await supabase
      .from('sales_emails')
      .select('*')
      .eq('lead_id', lead.id)
      .eq('status', 'draft')
      .order('created_at', { ascending: false })
      .limit(1);

    const draft = drafts?.[0];
    if (!draft) continue;

    console.log(chalk.bold('─'.repeat(60)));
    console.log(chalk.cyan(`宛先: ${lead.company_name} <${lead.email}>`));
    console.log(chalk.cyan(`ICP スコア: ${lead.icp_score} | 業態: ${lead.industry_detail.business_type}`));
    console.log('');
    console.log(chalk.bold('件名:'), draft.subject);
    console.log('');
    console.log(chalk.bold('本文:'));
    console.log(draft.body_text);
    console.log('');

    const answer = await rl.question(
      chalk.yellow('[a] 承認  [s] スキップ  [d] 却下  [q] 終了 > '),
    );

    switch (answer.toLowerCase().trim()) {
      case 'a':
        await approveEmail(draft.id);
        await updateLeadStatus(lead.id, 'approved');
        console.log(chalk.green('✓ 承認しました'));
        break;
      case 'd':
        await updateLeadStatus(lead.id, 'new');
        console.log(chalk.red('✗ 却下しました（ステータスを new に戻しました）'));
        break;
      case 'q':
        console.log('レビューを中断しました。');
        rl.close();
        return;
      default:
        console.log('スキップしました。');
    }

    console.log('');
  }

  rl.close();
  console.log(chalk.green('✓ 全ドラフトのレビューが完了しました'));
}
