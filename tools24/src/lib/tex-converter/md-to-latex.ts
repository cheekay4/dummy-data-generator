/**
 * Markdown → LaTeX 変換
 * Markdown 記法を LaTeX コマンドに変換し、プリアンブル付きの完全なドキュメントを生成する
 */
export function markdownToLatex(md: string): string {
  let tex = md;

  // 特殊文字のエスケープ（数式ブロック内は除く）
  tex = escapeOutsideMath(tex);

  // コードブロック → verbatim（先に処理、内部の変換を防ぐため）
  tex = tex.replace(
    /```[\w]*\n([\s\S]*?)```/g,
    "\\begin{verbatim}\n$1\\end{verbatim}",
  );

  // インラインコード → \texttt
  tex = tex.replace(/`([^`]+)`/g, "\\texttt{$1}");

  // 数式ブロック $$ ... $$ → equation 環境
  tex = tex.replace(
    /\$\$([\s\S]*?)\$\$/g,
    (_match, content: string) => {
      const trimmed = content.trim();
      if (trimmed.includes("\\\\") || trimmed.includes("&")) {
        return `\\begin{align}\n${trimmed}\n\\end{align}`;
      }
      return `\\begin{equation}\n${trimmed}\n\\end{equation}`;
    },
  );

  // 見出し（# → \section）— 行頭のみ
  tex = tex.replace(/^#### (.+)$/gm, "\\paragraph{$1}");
  tex = tex.replace(/^### (.+)$/gm, "\\subsubsection{$1}");
  tex = tex.replace(/^## (.+)$/gm, "\\subsection{$1}");
  tex = tex.replace(/^# (.+)$/gm, "\\section{$1}");

  // 太字 **text** → \textbf
  tex = tex.replace(/\*\*(.+?)\*\*/g, "\\textbf{$1}");

  // 斜体 *text* → \textit（太字処理後なので ** は残っていない）
  tex = tex.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "\\textit{$1}");

  // リンク [text](url) → \href
  tex = tex.replace(/\[([^\]]+)\]\(([^)]+)\)/g, "\\href{$2}{$1}");

  // 箇条書き（連続する - 行を itemize 環境に）
  tex = convertBulletList(tex);

  // 番号付きリスト（連続する 1. 行を enumerate 環境に）
  tex = convertNumberedList(tex);

  // 引用 > → quote 環境
  tex = convertBlockquote(tex);

  // 水平線 --- → \hrulefill
  tex = tex.replace(/^(-{3,}|\*{3,}|_{3,})$/gm, "\\hrulefill");

  // プリアンブルを付与
  const preamble = [
    "\\documentclass[a4paper,11pt]{article}",
    "\\usepackage[utf8]{inputenc}",
    "\\usepackage[T1]{fontenc}",
    "\\usepackage{amsmath,amssymb,amsfonts}",
    "\\usepackage{hyperref}",
    "\\usepackage{geometry}",
    "\\geometry{margin=2.5cm}",
    "",
    "\\begin{document}",
    "",
  ].join("\n");

  const postamble = "\n\n\\end{document}\n";

  return preamble + tex.trim() + postamble;
}

function escapeOutsideMath(text: string): string {
  // 数式ブロック（$...$, $$...$$）とコードブロックの外側のみエスケープ
  const parts = text.split(/(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$|```[\s\S]*?```|`[^`]+`)/);
  return parts
    .map((part, i) => {
      // 奇数インデックスは数式/コード部分なのでスキップ
      if (i % 2 === 1) return part;
      // 特殊文字をエスケープ
      let escaped = part;
      escaped = escaped.replace(/\\/g, "\\textbackslash{}");
      escaped = escaped.replace(/&/g, "\\&");
      escaped = escaped.replace(/%/g, "\\%");
      escaped = escaped.replace(/#/g, "\\#");
      escaped = escaped.replace(/_/g, "\\_");
      escaped = escaped.replace(/\{/g, "\\{");
      escaped = escaped.replace(/\}/g, "\\}");
      escaped = escaped.replace(/~/g, "\\~{}");
      return escaped;
    })
    .join("");
}

function convertBulletList(text: string): string {
  return text.replace(
    /(^[ \t]*- .+$(\n|$))+/gm,
    (block) => {
      const items = block
        .trim()
        .split("\n")
        .filter((line) => line.trim().startsWith("- "))
        .map((line) => `  \\item ${line.replace(/^[ \t]*- /, "").trim()}`)
        .join("\n");
      return `\\begin{itemize}\n${items}\n\\end{itemize}\n`;
    },
  );
}

function convertNumberedList(text: string): string {
  return text.replace(
    /(^[ \t]*\d+\. .+$(\n|$))+/gm,
    (block) => {
      const items = block
        .trim()
        .split("\n")
        .filter((line) => /^\s*\d+\.\s/.test(line))
        .map((line) => `  \\item ${line.replace(/^[ \t]*\d+\.\s*/, "").trim()}`)
        .join("\n");
      return `\\begin{enumerate}\n${items}\n\\end{enumerate}\n`;
    },
  );
}

function convertBlockquote(text: string): string {
  return text.replace(
    /(^> .+$(\n|$))+/gm,
    (block) => {
      const content = block
        .trim()
        .split("\n")
        .map((line) => line.replace(/^>\s?/, "").trim())
        .join("\n");
      return `\\begin{quote}\n${content}\n\\end{quote}\n`;
    },
  );
}
