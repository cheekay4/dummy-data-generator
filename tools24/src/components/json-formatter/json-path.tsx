"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { JSONPath } from "jsonpath-plus";

interface JsonPathProps {
  input: string;
}

export function JsonPathSearch({ input }: JsonPathProps) {
  const [query, setQuery] = useState("$");
  const [result, setResult] = useState<{ output?: string; error?: string } | null>(null);
  const [copied, setCopied] = useState(false);

  const handleSearch = useCallback(() => {
    if (!input.trim()) {
      setResult({ error: "左のエリアにJSONを入力してください" });
      return;
    }
    if (!query.trim()) {
      setResult({ error: "JSONPathクエリを入力してください" });
      return;
    }
    try {
      const parsed = JSON.parse(input);
      const found = JSONPath({ path: query, json: parsed });
      setResult({ output: JSON.stringify(found, null, 2) });
    } catch (e) {
      setResult({ error: e instanceof Error ? e.message : "検索エラー" });
    }
  }, [input, query]);

  const handleCopy = async () => {
    if (!result?.output) return;
    await navigator.clipboard.writeText(result.output);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          placeholder="例: $.store.book[0].title"
          className="flex-1 font-mono text-sm border rounded-md px-3 py-2 bg-background outline-none focus:ring-2 focus:ring-ring"
        />
        <Button onClick={handleSearch}>検索</Button>
      </div>

      <div className="text-xs text-muted-foreground space-y-1">
        <p>例: <code className="font-mono bg-muted px-1 rounded">$</code> (全体)、
          <code className="font-mono bg-muted px-1 rounded">$.name</code> (プロパティ)、
          <code className="font-mono bg-muted px-1 rounded">$.items[0]</code> (配列要素)、
          <code className="font-mono bg-muted px-1 rounded">$..name</code> (再帰検索)
        </p>
      </div>

      {result?.error && (
        <Alert variant="destructive">
          <AlertDescription>{result.error}</AlertDescription>
        </Alert>
      )}

      {result?.output !== undefined && !result.error && (
        <div className="flex flex-col gap-2">
          <div className="flex justify-end">
            <Button variant="outline" size="sm" onClick={handleCopy}>
              {copied ? "コピーしました ✓" : "コピー"}
            </Button>
          </div>
          <textarea
            readOnly
            value={result.output}
            className="w-full h-64 font-mono text-sm border rounded-md p-3 bg-muted/30 resize-none outline-none"
          />
        </div>
      )}
    </div>
  );
}
