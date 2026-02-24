"use client";

import { useState, useMemo, useCallback } from "react";
import { Copy, Trash2, Check } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/stat-card";
import { CharBreakdown } from "@/components/char-breakdown";
import { countText } from "@/lib/count";

export function CharacterCounter() {
  const [text, setText] = useState("");
  const [copied, setCopied] = useState(false);

  const result = useMemo(() => countText(text), [text]);

  const handleCopy = useCallback(async () => {
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [text]);

  const handleClear = useCallback(() => {
    setText("");
  }, []);

  return (
    <div className="space-y-6">
      {/* テキスト入力エリア */}
      <div className="relative">
        <Textarea
          placeholder="ここにテキストを入力してください..."
          className="h-64 resize-y text-base leading-relaxed"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <div className="mt-2 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            disabled={text.length === 0}
          >
            {copied ? (
              <Check className="mr-1.5 h-4 w-4" />
            ) : (
              <Copy className="mr-1.5 h-4 w-4" />
            )}
            {copied ? "コピー済み" : "コピー"}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleClear}
            disabled={text.length === 0}
          >
            <Trash2 className="mr-1.5 h-4 w-4" />
            クリア
          </Button>
        </div>
      </div>

      {/* 基本統計 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="文字数（スペース含む）" value={result.charsWithSpaces} />
        <StatCard label="文字数（スペースなし）" value={result.charsWithoutSpaces} />
        <StatCard label="単語数" value={result.words} />
        <StatCard label="行数" value={result.lines} />
      </div>

      {/* 追加情報 */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <StatCard label="バイト数（UTF-8）" value={result.bytes.toLocaleString()} />
        <StatCard
          label="Twitter残り文字数"
          value={result.twitterRemaining}
          className={
            result.twitterRemaining < 0
              ? "border-destructive bg-destructive/10 text-destructive"
              : undefined
          }
        />
        <StatCard
          label="原稿用紙（400字詰め）"
          value={`${result.manuscriptPages} 枚`}
        />
      </div>

      {/* 文字種別内訳 */}
      <CharBreakdown breakdown={result.breakdown} />
    </div>
  );
}
