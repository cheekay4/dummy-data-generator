"use client";

import { useState, useMemo, useCallback } from "react";
import { Copy, Trash2, Check, ClipboardPaste } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/character-counter/stat-card";
import { CharBreakdown } from "@/components/character-counter/char-breakdown";
import { countText } from "@/lib/character-counter/count";

const SAMPLE_TEXT = `東京都渋谷区で開催されるAIカンファレンスに参加しました。
今回のテーマは「生成AIの実務活用」で、約500名の参加者が集まりました。

主な発表内容:
1. LLMを活用した業務効率化の事例紹介
2. プロンプトエンジニアリングのベストプラクティス
3. AIガバナンスと倫理的課題

次回は2026年4月に大阪で開催予定です。
詳細はWebサイト(https://example.com)をご確認ください。`;

export function CharacterCounter(): React.ReactElement {
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

  const handleSample = useCallback(() => {
    setText(SAMPLE_TEXT);
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative">
        <Textarea
          placeholder="ここにテキストを入力してください..."
          className="min-h-[260px] resize-y font-mono text-base leading-relaxed"
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
          <Button
            variant="outline"
            size="sm"
            onClick={handleSample}
          >
            <ClipboardPaste className="mr-1.5 h-4 w-4" />
            サンプル
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="文字数（スペース含む）" value={result.charsWithSpaces} />
        <StatCard label="文字数（スペースなし）" value={result.charsWithoutSpaces} />
        <StatCard label="単語数" value={result.words} />
        <StatCard label="行数" value={result.lines} />
      </div>

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

      <CharBreakdown breakdown={result.breakdown} />
    </div>
  );
}
