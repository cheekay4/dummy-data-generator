"use client";

import { useState, useCallback } from "react";
import { ArrowRightLeft, FileCode2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { computeLineDiff, generateUnifiedPatch, type DiffResult } from "@/lib/diff-checker/diff-engine";
import {
  extractFunctions,
  detectLanguage,
  compareFunctions,
  type SupportedLanguage,
  type FunctionComparison,
} from "@/lib/diff-checker/function-extractor";
import { FunctionChangePanel } from "@/components/diff-checker/function-change-panel";
import { DiffViewer } from "@/components/diff-checker/diff-viewer";
import { DiffStatsBar } from "@/components/diff-checker/diff-stats-bar";
import { ExportSection } from "@/components/diff-checker/export-section";

type LanguageOption = "auto" | SupportedLanguage;

const LANGUAGE_OPTIONS: { value: LanguageOption; label: string }[] = [
  { value: "auto", label: "自動検出" },
  { value: "javascript", label: "JavaScript / TypeScript" },
  { value: "python", label: "Python" },
  { value: "go", label: "Go" },
  { value: "ruby", label: "Ruby" },
  { value: "text", label: "テキスト" },
];

const SAMPLE_A = `function greet(name) {
  return "Hello, " + name;
}

function add(a, b) {
  return a + b;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = date.getMonth() + 1;
  const d = date.getDate();
  return y + "-" + m + "-" + d;
}`;

const SAMPLE_B = `function greet(name) {
  return \`Hello, \${name}!\`;
}

function add(a, b) {
  return a + b;
}

function subtract(a, b) {
  return a - b;
}

function formatDate(date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return \`\${y}-\${m}-\${d}\`;
}`;

export function DiffCheckerMain(): React.ReactElement {
  const [textA, setTextA] = useState("");
  const [textB, setTextB] = useState("");
  const [language, setLanguage] = useState<LanguageOption>("auto");
  const [diffResult, setDiffResult] = useState<DiffResult | null>(null);
  const [unifiedPatch, setUnifiedPatch] = useState("");
  const [funcComparison, setFuncComparison] = useState<FunctionComparison | null>(null);
  const [resolvedLang, setResolvedLang] = useState<SupportedLanguage>("text");

  const handleCompare = useCallback((): void => {
    // 差分計算
    const result = computeLineDiff(textA, textB);
    setDiffResult(result);

    // unified patch 生成
    const patch = generateUnifiedPatch(textA, textB);
    setUnifiedPatch(patch);

    // 言語検出 + 関数抽出
    const lang: SupportedLanguage =
      language === "auto"
        ? detectLanguage(textA + "\n" + textB)
        : language === "javascript"
          ? "javascript"
          : language;
    setResolvedLang(lang);

    if (lang !== "text") {
      const funcsA = extractFunctions(textA, lang);
      const funcsB = extractFunctions(textB, lang);
      const comparison = compareFunctions(funcsA, funcsB);
      setFuncComparison(comparison);
    } else {
      setFuncComparison(null);
    }
  }, [textA, textB, language]);

  const handleLoadSample = useCallback((): void => {
    setTextA(SAMPLE_A);
    setTextB(SAMPLE_B);
    // 結果をリセット
    setDiffResult(null);
    setFuncComparison(null);
    setUnifiedPatch("");
  }, []);

  return (
    <div className="space-y-6">
      {/* 入力エリア */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1.5">
            Before（変更前）
          </label>
          <Textarea
            value={textA}
            onChange={(e) => setTextA(e.target.value)}
            placeholder="変更前のコードまたはテキストを貼り付け..."
            className="font-mono text-sm min-h-[360px] resize-y"
            rows={15}
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1.5">
            After（変更後）
          </label>
          <Textarea
            value={textB}
            onChange={(e) => setTextB(e.target.value)}
            placeholder="変更後のコードまたはテキストを貼り付け..."
            className="font-mono text-sm min-h-[360px] resize-y"
            rows={15}
          />
        </div>
      </div>

      {/* コントロール */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2">
          <label htmlFor="lang-select" className="text-sm text-muted-foreground whitespace-nowrap">
            言語:
          </label>
          <select
            id="lang-select"
            value={language}
            onChange={(e) => setLanguage(e.target.value as LanguageOption)}
            className="rounded-md border bg-background px-3 py-1.5 text-sm"
          >
            {LANGUAGE_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={handleCompare} disabled={!textA && !textB}>
          <ArrowRightLeft className="h-4 w-4 mr-1.5" />
          比較する
        </Button>

        <Button variant="outline" onClick={handleLoadSample}>
          <FileCode2 className="h-4 w-4 mr-1.5" />
          サンプルを読み込む
        </Button>
      </div>

      {/* 結果エリア */}
      {diffResult && (
        <div className="space-y-4">
          {/* 関数変更パネル（コード言語のみ） */}
          {funcComparison && resolvedLang !== "text" && (
            <FunctionChangePanel comparison={funcComparison} />
          )}

          {/* 統計バー */}
          <DiffStatsBar stats={diffResult.stats} />

          {/* Diff ビューワー */}
          <DiffViewer
            lineDiffs={diffResult.lineDiffs}
            textA={textA}
            textB={textB}
          />

          {/* エクスポート */}
          <ExportSection unifiedDiff={unifiedPatch} />
        </div>
      )}
    </div>
  );
}
