import chalk from 'chalk';
import ora from 'ora';
import { analyzeIndustry } from '../services/industry-analyzer.js';
import { generateEmailDrafts } from '../services/message-generator.js';
import { scrapePage } from '../services/scraper.js';
import {
  getLeadsByStatus,
  updateLeadAnalysis,
  updateLeadStatus,
  saveDraft,
} from '../services/lead-db.js';
import { SAFETY } from '../config/constants.js';

interface GenerateOptions {
  limit: number;
  minIcp: number;
}

/**
 * 新規リードを分析し、メールドラフトを生成する
 */
export async function generateCommand(options: GenerateOptions): Promise<void> {
  const spinner = ora('リードを取得中...').start();

  const leads = await getLeadsByStatus('new', options.limit);
  spinner.succeed(`${leads.length} 件の未分析リードを取得`);

  if (leads.length === 0) {
    console.log(chalk.yellow('処理対象のリードがありません。先に scrape を実行してください。'));
    return;
  }

  let generated = 0;
  let skipped = 0;

  for (const lead of leads) {
    const sp = ora(`分析中: ${lead.email}`).start();

    try {
      // Webページを再スクレイピング（より詳細なコンテンツ取得）
      let pageContent = '';
      let title = '';
      try {
        const page = await scrapePage(lead.website_url ?? lead.source_url);
        pageContent = page.pageContent;
        title = page.title;
      } catch {
        // スクレイピング失敗でも続行（ドメインホスト名を使う）
        pageContent = `企業名: ${lead.company_name}`;
        title = lead.company_name;
      }

      // 業界分析
      const analysis = await analyzeIndustry(lead.website_url ?? lead.source_url, title, pageContent);
      await updateLeadAnalysis(lead.id, {
        company_name: analysis.company_name,
        industry: analysis.industry,
        industry_detail: analysis.industry_detail,
        icp_score: analysis.icp_score,
      });

      // ICP スコアが閾値未満はスキップ
      if (analysis.icp_score < options.minIcp) {
        sp.warn(`スキップ（ICP: ${analysis.icp_score}）: ${lead.email}`);
        await updateLeadStatus(lead.id, 'analyzed');
        skipped++;
        continue;
      }

      // メール生成（A/B 2バリアント）
      const updatedLead = {
        ...lead,
        company_name: analysis.company_name,
        industry: analysis.industry,
        industry_detail: analysis.industry_detail,
        icp_score: analysis.icp_score,
      };

      const draftList = await generateEmailDrafts(updatedLead);
      for (const draft of draftList) {
        await saveDraft(draft);
      }
      await updateLeadStatus(lead.id, 'draft_ready');

      const scoreInfo = draftList[0]?.msgscore != null ? ` MsgScore: ${draftList[0].msgscore}` : '';
      sp.succeed(`生成完了（ICP: ${analysis.icp_score}${scoreInfo}）: ${analysis.company_name} <${lead.email}> — ${draftList.length}バリアント`);
      generated++;
    } catch (err) {
      sp.fail(`エラー: ${lead.email} — ${err instanceof Error ? err.message : String(err)}`);
    }
  }

  console.log('');
  console.log(chalk.green(`✓ ${generated} 件のドラフトを生成`));
  if (skipped > 0) console.log(chalk.yellow(`  ${skipped} 件をスコア不足でスキップ`));
}
