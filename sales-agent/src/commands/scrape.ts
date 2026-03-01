import chalk from 'chalk';
import ora from 'ora';
import { scrapeWithDepth } from '../services/scraper.js';
import { extractEmailsFromText, validateEmails } from '../services/email-extractor.js';
import { getExistingEmails, upsertLeads } from '../services/lead-db.js';
import { SAFETY } from '../config/constants.js';
import type { ProductId } from '../config/products.js';

interface ScrapeOptions {
  depth: number;
  minIcp: number;
  product?: ProductId;
}

/**
 * URLをスクレイピングしてリードを収集する
 */
export async function scrapeCommand(url: string, options: ScrapeOptions): Promise<void> {
  const spinner = ora(`スクレイピング中: ${url}`).start();

  try {
    const pages = await scrapeWithDepth(url, options.depth);
    spinner.succeed(`${pages.length} ページを取得しました`);

    const existingEmails = await getExistingEmails();
    spinner.start('メールアドレスを検証中...');

    const allEmails: string[] = [];
    const sourceMap = new Map<string, string>();

    for (const page of pages) {
      const emails = extractEmailsFromText(page.pageContent);
      emails.push(...page.emails);
      for (const email of emails) {
        allEmails.push(email);
        if (!sourceMap.has(email)) sourceMap.set(email, page.url);
      }
    }

    const validated = await validateEmails(
      [...new Set(allEmails)],
      url,
      existingEmails,
    );

    const mxValid = validated.filter((e) => e.mxValid);
    spinner.succeed(`${validated.length} 件中 ${mxValid.length} 件の有効メールアドレスを取得`);

    if (mxValid.length === 0) {
      console.log(chalk.yellow('有効なメールアドレスが見つかりませんでした。'));
      return;
    }

    // リードとして保存（company_name は後工程の analyze で補完）
    const leads = mxValid.map((e) => ({
      company_name: new URL(sourceMap.get(e.address) ?? url).hostname,
      email: e.address,
      website_url: sourceMap.get(e.address) ?? url,
      industry: 'other' as const,
      product: options.product,
      industry_detail: {
        business_type: '未分析',
        key_services: [],
        target_customers: '',
        pain_points: [],
        online_presence: {
          has_line: false,
          has_newsletter: false,
          has_ec: false,
          sns_platforms: [],
        },
        personalization_angle: '',
      },
      source_url: url,
      status: 'new' as const,
      icp_score: 0,
      personalization_hooks: [],
    }));

    const saved = await upsertLeads(leads);
    console.log(chalk.green(`✓ ${saved.length} 件のリードを保存しました`));
  } catch (err) {
    spinner.fail('スクレイピングに失敗しました');
    throw err;
  }
}
