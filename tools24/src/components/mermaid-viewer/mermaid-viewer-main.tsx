"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Copy, Download, Check, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TEMPLATES } from "@/lib/mermaid-viewer/templates";
import { renderMermaid } from "@/lib/mermaid-viewer/renderer";

type Theme = "default" | "dark" | "forest" | "neutral";

const THEMES: { value: Theme; label: string }[] = [
  { value: "default", label: "デフォルト" },
  { value: "dark", label: "ダーク" },
  { value: "forest", label: "フォレスト" },
  { value: "neutral", label: "ニュートラル" },
];

export function MermaidViewerMain(): React.ReactElement {
  const [code, setCode] = useState(TEMPLATES[0].code);
  const [svg, setSvg] = useState("");
  const [error, setError] = useState("");
  const [theme, setTheme] = useState<Theme>("default");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const previewRef = useRef<HTMLDivElement>(null);

  const doRender = useCallback(
    async (text: string, t: Theme) => {
      if (!text.trim()) {
        setSvg("");
        setError("");
        return;
      }
      setLoading(true);
      const result = await renderMermaid(text, t);
      setSvg(result.svg);
      setError(result.error ?? "");
      setLoading(false);
    },
    []
  );

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doRender(code, theme), 300);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [code, theme, doRender]);

  const handleTemplate = useCallback((templateCode: string) => {
    setCode(templateCode);
  }, []);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [code]);

  const handleDownloadSVG = useCallback(() => {
    if (!svg) return;
    const blob = new Blob([svg], { type: "image/svg+xml" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "diagram.svg";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [svg]);

  const handleDownloadPNG = useCallback(async () => {
    if (!previewRef.current) return;
    const svgEl = previewRef.current.querySelector("svg");
    if (!svgEl) return;

    const serializer = new XMLSerializer();
    const svgStr = serializer.serializeToString(svgEl);
    const canvas = document.createElement("canvas");
    const scale = 2;
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width * scale;
      canvas.height = img.height * scale;
      const ctx = canvas.getContext("2d")!;
      ctx.scale(scale, scale);
      ctx.drawImage(img, 0, 0);
      canvas.toBlob((blob) => {
        if (!blob) return;
        const a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "diagram.png";
        a.click();
        URL.revokeObjectURL(a.href);
      });
    };
    img.src = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgStr)))}`;
  }, []);

  return (
    <div className="space-y-4">
      {/* Template tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {TEMPLATES.map((t) => (
          <button
            key={t.id}
            onClick={() => handleTemplate(t.code)}
            className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
              code === t.code
                ? "border-blue-500 bg-blue-500/10 text-blue-500"
                : "border-[var(--surface-border)] hover:border-blue-500/50"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Main layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        {/* Editor */}
        <div className="lg:col-span-2 space-y-2">
          <Textarea
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="min-h-[400px] font-mono text-sm leading-relaxed resize-y"
            placeholder={`graph TD\n  A[開始] --> B{条件}\n  B -- Yes --> C[処理]`}
          />
          <div className="flex gap-2">
            <Button variant="outline" size="sm" onClick={() => setCode("")}>
              クリア
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? <Check className="mr-1.5 h-3.5 w-3.5" /> : <Copy className="mr-1.5 h-3.5 w-3.5" />}
              {copied ? "コピー済み" : "コードをコピー"}
            </Button>
          </div>
        </div>

        {/* Preview */}
        <div className="lg:col-span-3 space-y-2">
          {/* Theme + Actions */}
          <div className="flex items-center gap-2 flex-wrap">
            {THEMES.map((t) => (
              <button
                key={t.value}
                onClick={() => setTheme(t.value)}
                className={`rounded-lg border px-2.5 py-1 text-xs transition-colors ${
                  theme === t.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-[var(--surface-border)] hover:border-foreground/50"
                }`}
              >
                {t.label}
              </button>
            ))}
            <div className="ml-auto flex gap-1.5">
              <Button variant="outline" size="sm" onClick={handleDownloadSVG} disabled={!svg}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                SVG
              </Button>
              <Button variant="outline" size="sm" onClick={handleDownloadPNG} disabled={!svg}>
                <Download className="mr-1.5 h-3.5 w-3.5" />
                PNG
              </Button>
            </div>
          </div>

          {/* Preview area */}
          <div className="min-h-[400px] rounded-xl border border-[var(--surface-border)] bg-muted/30 p-4 overflow-auto">
            {loading && (
              <div className="flex items-center justify-center h-48 gap-2 text-sm text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" />
                レンダリング中...
              </div>
            )}
            {error && !loading && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/5 p-3 text-sm text-red-500">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <p>構文エラー: {error.replace(/Error: /g, "").slice(0, 200)}</p>
              </div>
            )}
            {svg && !loading && (
              <div
                ref={previewRef}
                className="flex justify-center [&_svg]:max-w-full"
                dangerouslySetInnerHTML={{ __html: svg }}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
