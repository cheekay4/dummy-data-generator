import * as fs from 'fs/promises';
import * as path from 'path';
import { format } from 'date-fns';

export interface ArticleForBackup {
  title: string;
  content: string;
  tags: string[];
  gap_score: number;
  created_at: Date;
  topic_name: string;
}

/**
 * 生成した記事をMarkdownファイルとして保存
 * @param articles 保存する記事の配列
 * @param outputDir 保存先ディレクトリ（デフォルト: outputs/）
 */
export async function saveArticlesToMarkdown(
  articles: ArticleForBackup[],
  outputDir: string = path.join(process.cwd(), 'outputs')
): Promise<string[]> {
  const savedFiles: string[] = [];

  console.log(`[GitHub Backup] ${articles.length}件の記事をMarkdownで保存中...`);

  for (const article of articles) {
    try {
      // ファイル名を生成: YYYYMMDD_HHMM_トピック名.md
      const timestamp = format(article.created_at, 'yyyyMMdd_HHmm');
      const sanitizedTopicName = sanitizeFileName(article.topic_name);
      const fileName = `${timestamp}_${sanitizedTopicName}.md`;
      const filePath = path.join(outputDir, fileName);

      // Markdownコンテンツを生成
      const markdownContent = generateMarkdownContent(article);

      // ファイルに書き込み
      await fs.writeFile(filePath, markdownContent, 'utf-8');

      savedFiles.push(filePath);
      console.log(`[GitHub Backup] 保存完了: ${fileName}`);
    } catch (error) {
      console.error(`[GitHub Backup] 保存エラー (${article.title}):`, error);
    }
  }

  console.log(`[GitHub Backup] ${savedFiles.length}件のMarkdownファイルを保存しました`);
  return savedFiles;
}

/**
 * Markdownフロントマターと本文を生成
 */
function generateMarkdownContent(article: ArticleForBackup): string {
  const frontmatter = [
    '---',
    `title: ${article.title}`,
    `tags: ${article.tags.join(', ')}`,
    `gap_score: ${article.gap_score.toFixed(2)}`,
    `created_at: ${article.created_at.toISOString()}`,
    '---',
    '',
  ].join('\n');

  return frontmatter + article.content;
}

/**
 * ファイル名として使用できない文字をサニタイズ
 * Windows環境対応
 */
function sanitizeFileName(name: string): string {
  // Windows/Mac/Linuxで禁止されている文字を除去
  return name
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, '')
    .replace(/\s+/g, '_')
    .substring(0, 50); // 長すぎる場合は切り詰め
}

/**
 * outputs/ディレクトリが存在することを確認（なければ作成）
 */
export async function ensureOutputDirectory(outputDir: string = path.join(process.cwd(), 'outputs')): Promise<void> {
  try {
    await fs.access(outputDir);
  } catch {
    console.log(`[GitHub Backup] outputs/ディレクトリを作成します: ${outputDir}`);
    await fs.mkdir(outputDir, { recursive: true });
  }
}
