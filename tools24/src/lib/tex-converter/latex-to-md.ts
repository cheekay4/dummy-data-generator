/**
 * LaTeX → Markdown 変換
 * 基本的な LaTeX コマンドを Markdown 記法に変換する
 */
export function latexToMarkdown(latex: string): string {
  let md = latex;

  // プリアンブル除去（\documentclass ~ \begin{document}）
  md = md.replace(
    /\\documentclass[\s\S]*?\\begin\{document\}\s*/,
    "",
  );
  md = md.replace(/\\end\{document\}\s*$/, "");

  // パッケージ・設定コマンド除去
  md = md.replace(/\\usepackage(\[.*?\])?\{.*?\}\s*/g, "");
  md = md.replace(/\\title\{(.*?)\}/g, "# $1");
  md = md.replace(/\\author\{.*?\}\s*/g, "");
  md = md.replace(/\\date\{.*?\}\s*/g, "");
  md = md.replace(/\\maketitle\s*/g, "");

  // コメント除去（行頭・行中の % コメント、ただし \% はスキップ）
  md = md.replace(/(?<!\\)%.*$/gm, "");

  // セクション
  md = md.replace(/\\section\*?\{(.*?)\}/g, "# $1");
  md = md.replace(/\\subsection\*?\{(.*?)\}/g, "## $1");
  md = md.replace(/\\subsubsection\*?\{(.*?)\}/g, "### $1");
  md = md.replace(/\\paragraph\*?\{(.*?)\}/g, "#### $1");

  // テキスト装飾
  md = md.replace(/\\textbf\{(.*?)\}/g, "**$1**");
  md = md.replace(/\\textit\{(.*?)\}/g, "*$1*");
  md = md.replace(/\\emph\{(.*?)\}/g, "*$1*");
  md = md.replace(/\\texttt\{(.*?)\}/g, "`$1`");
  md = md.replace(/\\underline\{(.*?)\}/g, "$1");

  // ハイパーリンク
  md = md.replace(/\\href\{(.*?)\}\{(.*?)\}/g, "[$2]($1)");
  md = md.replace(/\\url\{(.*?)\}/g, "$1");

  // 数式環境 → $$ ブロック
  md = md.replace(
    /\\begin\{(equation|align|gather|displaymath)\*?\}([\s\S]*?)\\end\{\1\*?\}/g,
    (_match, _env, content: string) => {
      const cleaned = content.trim().replace(/\\\\/g, " \\\\\n");
      return `\n$$\n${cleaned}\n$$\n`;
    },
  );

  // インライン数式 \( ... \) → $ ... $
  md = md.replace(/\\\((.*?)\\\)/g, "$$$1$$");

  // ディスプレイ数式 \[ ... \] → $$ ... $$
  md = md.replace(/\\\[([\s\S]*?)\\\]/g, "\n$$$$$1$$$$\n");

  // itemize 環境 → 箇条書き
  md = md.replace(
    /\\begin\{itemize\}([\s\S]*?)\\end\{itemize\}/g,
    (_match, content: string) => convertItems(content, "- "),
  );

  // enumerate 環境 → 番号付きリスト
  md = md.replace(
    /\\begin\{enumerate\}([\s\S]*?)\\end\{enumerate\}/g,
    (_match, content: string) => convertNumberedItems(content),
  );

  // verbatim 環境 → コードブロック
  md = md.replace(
    /\\begin\{verbatim\}([\s\S]*?)\\end\{verbatim\}/g,
    "\n```\n$1\n```\n",
  );

  // quote 環境 → 引用
  md = md.replace(
    /\\begin\{quote\}([\s\S]*?)\\end\{quote\}/g,
    (_match, content: string) => {
      const lines = content
        .trim()
        .split("\n")
        .map((line) => `> ${line.trim()}`)
        .join("\n");
      return `\n${lines}\n`;
    },
  );

  // 特殊文字のエスケープ解除
  md = md.replace(/\\&/g, "&");
  md = md.replace(/\\%/g, "%");
  md = md.replace(/\\\$/g, "$");
  md = md.replace(/\\#/g, "#");
  md = md.replace(/\\_/g, "_");
  md = md.replace(/\\{/g, "{");
  md = md.replace(/\\}/g, "}");
  md = md.replace(/\\~/g, "~");
  md = md.replace(/\\textbackslash(\{\})?/g, "\\");

  // 改行コマンド
  md = md.replace(/\\newline/g, "\n");
  md = md.replace(/\\\\(\s*)/g, "\n");
  md = md.replace(/\\par\b/g, "\n\n");

  // 残りの LaTeX コマンドで影響のないものを除去
  md = md.replace(/\\(clearpage|newpage|noindent|bigskip|medskip|smallskip|vspace\{.*?\}|hspace\{.*?\}|label\{.*?\})\s*/g, "");

  // 連続空行を2行に正規化
  md = md.replace(/\n{3,}/g, "\n\n");

  return md.trim();
}

function convertItems(content: string, prefix: string): string {
  const items = content
    .split(/\\item\s*/)
    .filter((item) => item.trim().length > 0)
    .map((item) => `${prefix}${item.trim()}`);
  return `\n${items.join("\n")}\n`;
}

function convertNumberedItems(content: string): string {
  let counter = 0;
  const items = content
    .split(/\\item\s*/)
    .filter((item) => item.trim().length > 0)
    .map((item) => {
      counter++;
      return `${counter}. ${item.trim()}`;
    });
  return `\n${items.join("\n")}\n`;
}
