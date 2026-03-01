#!/usr/bin/env node
import { Command } from 'commander';
import chalk from 'chalk';
import { scrapeCommand } from './commands/scrape.js';
import { generateCommand } from './commands/generate.js';
import { reviewCommand } from './commands/review.js';
import { sendCommand } from './commands/send.js';
import { pipelineCommand } from './commands/pipeline.js';
import { monitorCommand, reviewRepliesCommand } from './commands/replies.js';
import { getAuthUrl, exchangeCode } from './services/gmail.js';
import { getRecentStats } from './services/lead-db.js';
import { SAFETY } from './config/constants.js';

const program = new Command();

program
  .name('sales-agent')
  .description('MsgScore 営業自動化エージェント')
  .version('1.0.0');

// ─── Gmail 認証 ─────────────────────────────────────────────
program
  .command('auth')
  .description('Gmail OAuth2 認証を開始する（初回セットアップ）')
  .action(() => {
    const url = getAuthUrl();
    console.log(chalk.bold('\nGmail OAuth2 認証手順:'));
    console.log('1. 以下のURLをブラウザで開いてください:\n');
    console.log(chalk.cyan(url));
    console.log('\n2. Googleアカウントでログインし、アクセスを許可してください');
    console.log('3. リダイレクトされたURLの "code=" 以降をコピーしてください');
    console.log('4. 以下を実行: node dist/index.js auth:callback <コード>');
  });

program
  .command('auth:callback <code>')
  .description('OAuth2 認証コードをリフレッシュトークンに交換する')
  .action(async (code: string) => {
    try {
      const token = await exchangeCode(code);
      console.log(chalk.green('\n✓ 認証成功！'));
      console.log('以下をコピーして .env の GMAIL_REFRESH_TOKEN に設定してください:\n');
      console.log(chalk.yellow(token));
    } catch (err) {
      console.error(chalk.red('認証に失敗しました:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

// ─── Phase 1: リード収集・生成・レビュー・送信 ──────────────
program
  .command('scrape <url>')
  .description('URLをスクレイピングしてリードを収集する')
  .option('-d, --depth <number>', 'クロール深度', '0')
  .option('-p, --product <product>', '対象プロダクト (msgscore | review-reply-ai)')
  .option('--min-icp <number>', 'ICP スコア最低値（分析後フィルタ）', String(SAFETY.ICP_SCORE_THRESHOLD))
  .action(async (url: string, opts) => {
    try {
      await scrapeCommand(url, {
        depth: parseInt(opts.depth, 10),
        minIcp: parseInt(opts.minIcp, 10),
        product: opts.product,
      });
    } catch (err) {
      console.error(chalk.red('エラー:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command('generate')
  .description('未分析リードを分析しメールドラフトを生成する')
  .option('-l, --limit <number>', '処理件数の上限', '20')
  .option('-p, --product <product>', '対象プロダクト (msgscore | review-reply-ai)')
  .option('--min-icp <number>', 'ICP スコア最低値', String(SAFETY.ICP_SCORE_THRESHOLD))
  .action(async (opts) => {
    try {
      await generateCommand({
        limit: parseInt(opts.limit, 10),
        minIcp: parseInt(opts.minIcp, 10),
        product: opts.product,
      });
    } catch (err) {
      console.error(chalk.red('エラー:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command('review')
  .description('ドラフトを対話的にレビューして承認/却下する')
  .action(async () => {
    try {
      await reviewCommand();
    } catch (err) {
      console.error(chalk.red('エラー:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command('send')
  .description('承認済みメールを送信する')
  .option('--dry-run', '送信をシミュレーションする（実際には送信しない）')
  .action(async (opts) => {
    try {
      await sendCommand({ dryRun: !!opts.dryRun });
    } catch (err) {
      console.error(chalk.red('エラー:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command('pipeline')
  .description('scrape → generate をまとめて実行する')
  .requiredOption('-u, --url <url>', '起点URL')
  .option('-d, --depth <number>', 'クロール深度', '0')
  .option('-l, --limit <number>', '生成件数上限', '20')
  .option('-p, --product <product>', '対象プロダクト (msgscore | review-reply-ai)')
  .option('--min-icp <number>', 'ICP スコア最低値', String(SAFETY.ICP_SCORE_THRESHOLD))
  .action(async (opts) => {
    try {
      await pipelineCommand({
        url: opts.url,
        depth: parseInt(opts.depth, 10),
        limit: parseInt(opts.limit, 10),
        minIcp: parseInt(opts.minIcp, 10),
        product: opts.product,
      });
    } catch (err) {
      console.error(chalk.red('エラー:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

// ─── Phase 2: 返信監視・対応 ────────────────────────────────
program
  .command('replies:monitor')
  .description('受信トレイを確認して返信を取り込み、AI分析・ドラフト生成を行う')
  .action(async () => {
    try {
      await monitorCommand();
    } catch (err) {
      console.error(chalk.red('エラー:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program
  .command('replies:review')
  .description('AI生成の返信ドラフトをレビューして送信する')
  .action(async () => {
    try {
      await reviewRepliesCommand();
    } catch (err) {
      console.error(chalk.red('エラー:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

// ─── 統計 ───────────────────────────────────────────────────
program
  .command('stats')
  .description('直近の送信統計を表示する')
  .option('-d, --days <number>', '表示日数', '7')
  .action(async (opts) => {
    try {
      const stats = await getRecentStats(parseInt(opts.days, 10));
      console.log(chalk.bold('\n送信統計:'));
      console.log('日付       | 送信 | 開封 | 返信 | 好意的');
      console.log('─'.repeat(45));
      for (const s of stats) {
        console.log(
          `${s.date} | ${String(s.emails_sent).padStart(4)} | ${String(s.emails_opened).padStart(4)} | ${String(s.replies_received).padStart(4)} | ${String(s.positive_replies).padStart(6)}`,
        );
      }
    } catch (err) {
      console.error(chalk.red('エラー:'), err instanceof Error ? err.message : err);
      process.exit(1);
    }
  });

program.parseAsync(process.argv).catch((err) => {
  console.error(chalk.red('Fatal:'), err);
  process.exit(1);
});
