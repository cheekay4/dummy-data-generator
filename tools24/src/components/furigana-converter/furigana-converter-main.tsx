"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Copy, Trash2, Check, ClipboardPaste, Download, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ModeSelector } from "@/components/furigana-converter/mode-selector";
import { getTokenizer } from "@/lib/furigana-converter/tokenizer";
import { convertTokens, type ConversionMode } from "@/lib/furigana-converter/converter";

const SAMPLE_TEXT = `東京都渋谷区で確定申告の相談をする。
新宿御苑の桜が満開になった。
人工知能の研究が急速に進んでいる。`;

export function FuriganaConverterMain(): React.ReactElement {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [mode, setMode] = useState<ConversionMode>("hiragana");
  const [kanjiOnly, setKanjiOnly] = useState(true);
  const [loading, setLoading] = useState(false);
  const [dictLoading, setDictLoading] = useState(false);
  const [dictReady, setDictReady] = useState(false);
  const [copied, setCopied] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout>>();

  // Load dictionary on mount
  useEffect(() => {
    setDictLoading(true);
    getTokenizer()
      .then(() => {
        setDictReady(true);
        setDictLoading(false);
      })
      .catch(() => {
        setDictLoading(false);
      });
  }, []);

  // Convert on input/mode/option change
  useEffect(() => {
    if (!dictReady || !input.trim()) {
      setOutput("");
      return;
    }

    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const tokenizer = await getTokenizer();
        const tokens = tokenizer.tokenize(input);
        const result = convertTokens(tokens, mode, kanjiOnly);
        setOutput(result);
      } catch {
        setOutput("変換エラーが発生しました");
      }
      setLoading(false);
    }, 300);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [input, mode, kanjiOnly, dictReady]);

  const handleCopy = useCallback(async (): Promise<void> => {
    await navigator.clipboard.writeText(output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [output]);

  const handleDownload = useCallback((): void => {
    const blob = new Blob([output], { type: "text/plain;charset=utf-8" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "furigana-output.txt";
    a.click();
    URL.revokeObjectURL(a.href);
  }, [output]);

  return (
    <div className="space-y-6">
      {dictLoading && (
        <div className="flex items-center gap-2 rounded-xl border bg-card p-3 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          辞書を読み込み中...（初回のみ数秒かかります）
        </div>
      )}

      {/* Input */}
      <div>
        <Textarea
          placeholder={"漢字を含むテキストを入力\n例: 東京都渋谷区で確定申告の相談をする"}
          className="min-h-[200px] resize-y font-mono text-base leading-relaxed"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <div className="mt-2 flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={() => setInput("")} disabled={!input}>
            <Trash2 className="mr-1.5 h-4 w-4" />
            クリア
          </Button>
          <Button variant="outline" size="sm" onClick={() => setInput(SAMPLE_TEXT)}>
            <ClipboardPaste className="mr-1.5 h-4 w-4" />
            サンプル
          </Button>
          <span className="ml-auto text-xs text-muted-foreground">{input.length} 文字</span>
        </div>
      </div>

      {/* Mode selector */}
      <ModeSelector mode={mode} onChange={setMode} />

      {/* Options */}
      <div className="flex items-center gap-4">
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={kanjiOnly}
            onChange={(e) => setKanjiOnly(e.target.checked)}
            className="rounded"
          />
          漢字のみ変換
        </label>
      </div>

      {/* Output */}
      <div>
        <label className="text-sm font-medium">変換結果</label>
        <div className="relative mt-1.5">
          <Textarea
            readOnly
            value={loading ? "変換中..." : output}
            className="min-h-[200px] resize-y font-mono text-base leading-relaxed bg-muted/30"
            placeholder="変換結果がここに表示されます"
          />
        </div>
        <div className="mt-2 flex gap-2">
          <Button variant="outline" size="sm" onClick={handleCopy} disabled={!output}>
            {copied ? <Check className="mr-1.5 h-4 w-4" /> : <Copy className="mr-1.5 h-4 w-4" />}
            {copied ? "コピー済み" : "コピー"}
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload} disabled={!output}>
            <Download className="mr-1.5 h-4 w-4" />
            ダウンロード
          </Button>
        </div>
      </div>
    </div>
  );
}
