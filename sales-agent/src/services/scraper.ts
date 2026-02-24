import { chromium } from 'playwright';
import { SCRAPER } from '../config/constants.js';
import type { ScrapedPage } from '../types/index.js';

/**
 * robots.txtを確認してクロール許可を判定する
 */
async function checkRobotsTxt(url: string): Promise<boolean> {
  try {
    const { origin } = new URL(url);
    const robotsUrl = `${origin}/robots.txt`;
    const res = await fetch(robotsUrl, { signal: AbortSignal.timeout(5000) });
    if (!res.ok) return true; // robots.txtなし → クロール許可とみなす

    const text = await res.text();
    const lines = text.split('\n');
    let userAgentMatch = false;
    for (const line of lines) {
      const trimmed = line.trim().toLowerCase();
      if (trimmed.startsWith('user-agent:')) {
        const agent = trimmed.split(':')[1]?.trim();
        userAgentMatch = agent === '*' || agent === 'googlebot';
      }
      if (userAgentMatch && trimmed.startsWith('disallow:')) {
        const disallowed = trimmed.split(':')[1]?.trim();
        if (disallowed === '/') return false;
        const parsedUrl = new URL(url);
        if (disallowed && parsedUrl.pathname.startsWith(disallowed)) return false;
      }
    }
    return true;
  } catch {
    return true; // 取得できなければ許可とみなす
  }
}

/**
 * Playwrightでページをスクレイピングし、メールアドレスと本文を抽出する
 */
export async function scrapePage(url: string): Promise<ScrapedPage> {
  const allowed = await checkRobotsTxt(url);
  if (!allowed) {
    throw new Error(`robots.txt によりクロールが禁止されています: ${url}`);
  }

  let attempt = 0;
  while (attempt <= SCRAPER.RETRY_COUNT) {
    const browser = await chromium.launch({ headless: true });
    try {
      const context = await browser.newContext({
        userAgent: SCRAPER.USER_AGENT,
        locale: 'ja-JP',
      });
      const page = await context.newPage();

      await page.goto(url, {
        waitUntil: 'domcontentloaded',
        timeout: SCRAPER.TIMEOUT_MS,
      });
      await page.waitForTimeout(SCRAPER.WAIT_AFTER_LOAD_MS);

      const title = await page.title();
      const bodyText = await page.evaluate(() => document.body?.innerText ?? '');

      // メールアドレス抽出（正規表現 + mailto）
      const emailRegex = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;
      const textEmails = bodyText.match(emailRegex) ?? [];

      const mailtoEmails = await page.evaluate(() => {
        const links = Array.from(document.querySelectorAll('a[href^="mailto:"]'));
        return links.map((a) => (a as HTMLAnchorElement).href.replace('mailto:', '').split('?')[0]);
      });

      const emails = [...new Set([...textEmails, ...mailtoEmails])];

      return {
        url,
        title,
        emails,
        pageContent: bodyText.slice(0, 5000),
      };
    } catch (err) {
      attempt++;
      if (attempt > SCRAPER.RETRY_COUNT) throw err;
      await new Promise((r) => setTimeout(r, 2000 * attempt));
    } finally {
      await browser.close();
    }
  }
  throw new Error('スクレイピングに失敗しました');
}

/**
 * リストページから各企業URLを収集し、depth分まで再帰的にスクレイピングする
 */
export async function scrapeWithDepth(
  startUrl: string,
  depth: number = 0,
): Promise<ScrapedPage[]> {
  const results: ScrapedPage[] = [];
  const visited = new Set<string>();

  async function crawl(url: string, currentDepth: number) {
    if (visited.has(url)) return;
    visited.add(url);

    const page = await scrapePage(url);
    results.push(page);

    if (currentDepth < depth) {
      // 同一ドメイン内のリンクのみ追跡
      const browser = await chromium.launch({ headless: true });
      try {
        const context = await browser.newContext({ userAgent: SCRAPER.USER_AGENT });
        const p = await context.newPage();
        await p.goto(url, { waitUntil: 'domcontentloaded', timeout: SCRAPER.TIMEOUT_MS });
        const origin = new URL(url).origin;
        const links = await p.evaluate((o: string) => {
          return Array.from(document.querySelectorAll('a[href]'))
            .map((a) => (a as HTMLAnchorElement).href)
            .filter((href) => href.startsWith(o))
            .slice(0, 20);
        }, origin);
        await browser.close();

        for (const link of links) {
          await crawl(link, currentDepth + 1);
        }
      } catch {
        await browser.close();
      }
    }
  }

  await crawl(startUrl, 0);
  return results;
}
