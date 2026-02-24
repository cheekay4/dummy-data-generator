import chalk from 'chalk';
import { generateCommand } from './generate.js';
import { SAFETY } from '../config/constants.js';

interface PipelineOptions {
  url: string;
  depth: number;
  minIcp: number;
  limit: number;
}

/**
 * scrape → generate をパイプラインとして実行する
 * （send は必ず review を挟むため、パイプラインには含めない）
 */
export async function pipelineCommand(options: PipelineOptions): Promise<void> {
  console.log(chalk.bold('\n── Pipeline: Scrape → Analyze → Generate ──\n'));

  // Step 1: Scrape
  console.log(chalk.bold('Step 1: スクレイピング'));
  const { scrapeCommand } = await import('./scrape.js');
  await scrapeCommand(options.url, { depth: options.depth, minIcp: options.minIcp });

  console.log('');

  // Step 2: Generate
  console.log(chalk.bold('Step 2: 分析 & ドラフト生成'));
  await generateCommand({ limit: options.limit, minIcp: options.minIcp });

  console.log('');
  console.log(chalk.bold('─'.repeat(50)));
  console.log(chalk.green('✓ パイプライン完了'));
  console.log(chalk.yellow('  次のステップ: node dist/index.js review'));
}
