"use client";

import "katex/dist/katex.min.css";

import { useState, useCallback, useRef, useEffect } from "react";
import { Copy, Check, Download, Eye, EyeOff } from "lucide-react";
import { renderLatex } from "@/lib/tex-converter/katex-renderer";
import { latexToMarkdown } from "@/lib/tex-converter/latex-to-md";
import { markdownToLatex } from "@/lib/tex-converter/md-to-latex";
import { sampleFormulas } from "@/lib/tex-converter/samples";

type TabMode = "preview" | "latex-to-md" | "md-to-latex";

const tabs: { key: TabMode; label: string }[] = [
  { key: "preview", label: "数式プレビュー" },
  { key: "latex-to-md", label: "LaTeX → Markdown" },
  { key: "md-to-latex", label: "Markdown → LaTeX" },
];

export function TexConverterMain(): React.ReactElement {
  const [mode, setMode] = useState<TabMode>("preview");

  return (
    <div className="space-y-4">
      {/* タブ切り替え */}
      <div className="flex border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setMode(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px ${
              mode === tab.key
                ? "border-primary text-primary"
                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* タブコンテンツ */}
      {mode === "preview" && <FormulaPreviewTab />}
      {mode === "latex-to-md" && <LatexToMdTab />}
      {mode === "md-to-latex" && <MdToLatexTab />}
    </div>
  );
}

/* ─────────────── Tab 1: 数式プレビュー ─────────────── */

function FormulaPreviewTab(): React.ReactElement {
  const [latex, setLatex] = useState<string>("x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}");
  const [displayMode, setDisplayMode] = useState<boolean>(true);
  const [rendered, setRendered] = useState<{ html: string; error?: string }>({ html: "" });
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  // デバウンス付きレンダリング
  useEffect(() => {
    if (timerRef.current) clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      if (latex.trim()) {
        setRendered(renderLatex(latex, displayMode));
      } else {
        setRendered({ html: "" });
      }
    }, 100);
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [latex, displayMode]);

  const handleCopy = useCallback(async (text: string, field: string): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  }, []);

  return (
    <div className="space-y-4">
      {/* サンプル数式ボタン */}
      <div>
        <p className="text-sm text-muted-foreground mb-2">サンプル数式:</p>
        <div className="flex flex-wrap gap-2">
          {sampleFormulas.map((sample) => (
            <button
              key={sample.label}
              onClick={() => setLatex(sample.latex)}
              className="px-3 py-1.5 text-xs rounded-md border bg-muted/50 hover:bg-muted transition-colors"
            >
              {sample.label}
            </button>
          ))}
        </div>
      </div>

      {/* 入力エリア */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-medium">LaTeX 入力</label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={displayMode}
              onChange={(e) => setDisplayMode(e.target.checked)}
              className="rounded"
            />
            ディスプレイモード
          </label>
        </div>
        <textarea
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          placeholder="LaTeX 数式を入力..."
          rows={4}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
          spellCheck={false}
        />
      </div>

      {/* エラー表示 */}
      {rendered.error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {rendered.error}
        </div>
      )}

      {/* プレビュー */}
      {rendered.html && (
        <div>
          <p className="text-sm font-medium mb-2">プレビュー</p>
          <div
            className="rounded-md border bg-background p-6 overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: rendered.html }}
          />
        </div>
      )}

      {/* コピーボタン群 */}
      {latex.trim() && (
        <div className="flex flex-wrap gap-2">
          <CopyButton
            label="LaTeX をコピー"
            text={latex}
            field="latex"
            copiedField={copiedField}
            onCopy={handleCopy}
          />
          <CopyButton
            label="HTML をコピー"
            text={rendered.html}
            field="html"
            copiedField={copiedField}
            onCopy={handleCopy}
          />
          <CopyButton
            label="$$ 付きコピー"
            text={displayMode ? `$$\n${latex}\n$$` : `$${latex}$`}
            field="dollar"
            copiedField={copiedField}
            onCopy={handleCopy}
          />
        </div>
      )}
    </div>
  );
}

/* ─────────────── Tab 2: LaTeX → Markdown ─────────────── */

function LatexToMdTab(): React.ReactElement {
  const [latex, setLatex] = useState<string>("");
  const [showPreview, setShowPreview] = useState<boolean>(false);

  const markdown = latex.trim() ? latexToMarkdown(latex) : "";

  const handleDownload = useCallback((): void => {
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.md";
    a.click();
    URL.revokeObjectURL(url);
  }, [markdown]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 入力 */}
        <div>
          <label className="text-sm font-medium mb-2 block">LaTeX 入力</label>
          <textarea
            value={latex}
            onChange={(e) => setLatex(e.target.value)}
            placeholder={"\\section{タイトル}\n\\textbf{太字テキスト}を入力..."}
            rows={12}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            spellCheck={false}
          />
        </div>

        {/* 出力 */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-medium">Markdown 出力</label>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setShowPreview(!showPreview)}
                className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
              >
                {showPreview ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {showPreview ? "コード表示" : "プレビュー"}
              </button>
            </div>
          </div>
          {showPreview ? (
            <div className="w-full rounded-md border bg-background px-3 py-2 text-sm min-h-[288px] overflow-auto prose prose-sm dark:prose-invert max-w-none">
              <MarkdownPreview markdown={markdown} />
            </div>
          ) : (
            <textarea
              value={markdown}
              readOnly
              rows={12}
              className="w-full rounded-md border bg-muted/30 px-3 py-2 text-sm font-mono resize-y"
              placeholder="変換結果がここに表示されます..."
            />
          )}
        </div>
      </div>

      {/* アクションボタン */}
      {markdown && (
        <div className="flex gap-2">
          <ClipboardCopyButton text={markdown} label="Markdown をコピー" />
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" />
            .md ダウンロード
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────── Tab 3: Markdown → LaTeX ─────────────── */

function MdToLatexTab(): React.ReactElement {
  const [md, setMd] = useState<string>("");

  const latex = md.trim() ? markdownToLatex(md) : "";

  const handleDownload = useCallback((): void => {
    const blob = new Blob([latex], { type: "application/x-tex;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "converted.tex";
    a.click();
    URL.revokeObjectURL(url);
  }, [latex]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* 入力 */}
        <div>
          <label className="text-sm font-medium mb-2 block">Markdown 入力</label>
          <textarea
            value={md}
            onChange={(e) => setMd(e.target.value)}
            placeholder={"# タイトル\n**太字テキスト**を入力..."}
            rows={12}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-ring resize-y"
            spellCheck={false}
          />
        </div>

        {/* 出力 */}
        <div>
          <label className="text-sm font-medium mb-2 block">LaTeX 出力</label>
          <textarea
            value={latex}
            readOnly
            rows={12}
            className="w-full rounded-md border bg-muted/30 px-3 py-2 text-sm font-mono resize-y"
            placeholder="変換結果がここに表示されます..."
          />
        </div>
      </div>

      {/* アクションボタン */}
      {latex && (
        <div className="flex gap-2">
          <ClipboardCopyButton text={latex} label="LaTeX をコピー" />
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border hover:bg-muted transition-colors"
          >
            <Download className="w-4 h-4" />
            .tex ダウンロード
          </button>
        </div>
      )}
    </div>
  );
}

/* ─────────────── 共通コンポーネント ─────────────── */

function CopyButton({
  label,
  text,
  field,
  copiedField,
  onCopy,
}: {
  label: string;
  text: string;
  field: string;
  copiedField: string | null;
  onCopy: (text: string, field: string) => Promise<void>;
}): React.ReactElement {
  const isCopied = copiedField === field;
  return (
    <button
      onClick={() => onCopy(text, field)}
      disabled={!text}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border hover:bg-muted transition-colors disabled:opacity-50"
    >
      {isCopied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      {isCopied ? "コピー済み" : label}
    </button>
  );
}

function ClipboardCopyButton({ text, label }: { text: string; label: string }): React.ReactElement {
  const [copied, setCopied] = useState<boolean>(false);

  const handleCopy = useCallback(async (): Promise<void> => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-md border hover:bg-muted transition-colors"
    >
      {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
      {copied ? "コピー済み" : label}
    </button>
  );
}

function MarkdownPreview({ markdown }: { markdown: string }): React.ReactElement {
  // Simple markdown rendering for preview: headings, bold, italic, code, lists
  const lines = markdown.split("\n");
  const elements: React.ReactElement[] = [];
  let key = 0;

  for (const line of lines) {
    key++;
    if (line.startsWith("### ")) {
      elements.push(<h3 key={key}>{line.slice(4)}</h3>);
    } else if (line.startsWith("## ")) {
      elements.push(<h2 key={key}>{line.slice(3)}</h2>);
    } else if (line.startsWith("# ")) {
      elements.push(<h1 key={key}>{line.slice(2)}</h1>);
    } else if (line.startsWith("- ")) {
      elements.push(
        <li key={key} style={{ listStyleType: "disc", marginLeft: "1.5em" }}>
          {line.slice(2)}
        </li>,
      );
    } else if (/^\d+\.\s/.test(line)) {
      elements.push(
        <li key={key} style={{ listStyleType: "decimal", marginLeft: "1.5em" }}>
          {line.replace(/^\d+\.\s/, "")}
        </li>,
      );
    } else if (line.startsWith("$$") || line.startsWith("```")) {
      elements.push(
        <pre key={key} className="bg-muted/50 p-2 rounded text-xs">
          {line}
        </pre>,
      );
    } else if (line.trim() === "") {
      elements.push(<br key={key} />);
    } else {
      elements.push(<p key={key}>{line}</p>);
    }
  }

  return <>{elements}</>;
}
