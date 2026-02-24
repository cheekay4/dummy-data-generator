"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DataPreview } from "./data-preview";
import { toCsv } from "@/lib/dummy/formatters/to-csv";
import { toTsv } from "@/lib/dummy/formatters/to-tsv";
import { toJson } from "@/lib/dummy/formatters/to-json";
import { toSql } from "@/lib/dummy/formatters/to-sql";
import { Copy, Download, Check, Trash2 } from "lucide-react";

type Props = {
  data: Record<string, string>[];
  headers: string[];
  onClear: () => void;
};

export function OutputFormatTabs({ data, headers, onClear }: Props) {
  const [format, setFormat] = useState("table");
  const [tableName, setTableName] = useState("dummy_data");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const formattedOutput = useMemo(() => {
    try {
      setError(null);
      switch (format) {
        case "json":
          return toJson(data);
        case "csv":
          return toCsv(data, headers);
        case "tsv":
          return toTsv(data, headers);
        case "sql":
          return toSql(data, headers, tableName);
        default:
          return "";
      }
    } catch (e) {
      const message = e instanceof Error ? e.message : "フォーマット変換中にエラーが発生しました";
      setError(message);
      return "";
    }
  }, [format, data, headers, tableName]);

  const handleCopy = async () => {
    try {
      const text = format === "table" ? toTsv(data, headers) : formattedOutput;
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setError("クリップボードへのコピーに失敗しました");
    }
  };

  const handleDownload = () => {
    try {
      let content: string;
      let filename: string;
      let mimeType: string;

      switch (format) {
        case "json":
          content = toJson(data);
          filename = "dummy_data.json";
          mimeType = "application/json";
          break;
        case "csv":
          content = toCsv(data, headers);
          filename = "dummy_data.csv";
          mimeType = "text/csv";
          break;
        case "tsv":
          content = toTsv(data, headers);
          filename = "dummy_data.tsv";
          mimeType = "text/tab-separated-values";
          break;
        case "sql":
          content = toSql(data, headers, tableName);
          filename = "dummy_data.sql";
          mimeType = "application/sql";
          break;
        default:
          content = toCsv(data, headers);
          filename = "dummy_data.csv";
          mimeType = "text/csv";
      }

      const bom = "\uFEFF";
      const blob = new Blob([bom + content], { type: `${mimeType};charset=utf-8` });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setError("ダウンロードに失敗しました");
    }
  };

  return (
    <div className="space-y-4">
      {error && (
        <div className="p-3 rounded-md bg-destructive/10 text-destructive text-sm flex items-center justify-between">
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => setError(null)}>
            閉じる
          </Button>
        </div>
      )}

      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={handleCopy} disabled={data.length === 0}>
          {copied ? <Check className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
          {copied ? "コピーしました" : "コピー"}
        </Button>
        <Button variant="outline" size="sm" onClick={handleDownload} disabled={data.length === 0}>
          <Download className="h-4 w-4 mr-1" />
          ダウンロード
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => { onClear(); setError(null); }}
          disabled={data.length === 0}
        >
          <Trash2 className="h-4 w-4 mr-1" />
          クリア
        </Button>
        {data.length > 0 && (
          <span className="text-sm text-muted-foreground ml-auto">
            {data.length.toLocaleString()}件のデータ
          </span>
        )}
      </div>

      <Tabs value={format} onValueChange={setFormat}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="table">テーブル</TabsTrigger>
          <TabsTrigger value="json">JSON</TabsTrigger>
          <TabsTrigger value="csv">CSV</TabsTrigger>
          <TabsTrigger value="tsv">TSV</TabsTrigger>
          <TabsTrigger value="sql">SQL</TabsTrigger>
        </TabsList>
        <TabsContent value="table">
          <DataPreview data={data} headers={headers} />
        </TabsContent>
        <TabsContent value="json">
          <pre className="overflow-auto max-h-[600px] p-4 bg-muted rounded-md text-xs font-mono whitespace-pre-wrap break-all">
            {data.length > 0 ? formattedOutput : "データがありません"}
          </pre>
        </TabsContent>
        <TabsContent value="csv">
          <pre className="overflow-auto max-h-[600px] p-4 bg-muted rounded-md text-xs font-mono whitespace-pre-wrap break-all">
            {data.length > 0 ? formattedOutput : "データがありません"}
          </pre>
        </TabsContent>
        <TabsContent value="tsv">
          <pre className="overflow-auto max-h-[600px] p-4 bg-muted rounded-md text-xs font-mono whitespace-pre-wrap break-all">
            {data.length > 0 ? formattedOutput : "データがありません"}
          </pre>
        </TabsContent>
        <TabsContent value="sql">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Label htmlFor="tableName" className="whitespace-nowrap">テーブル名:</Label>
              <Input
                id="tableName"
                value={tableName}
                onChange={(e) => setTableName(e.target.value)}
                className="max-w-[200px]"
              />
            </div>
            <pre className="overflow-auto max-h-[600px] p-4 bg-muted rounded-md text-xs font-mono whitespace-pre-wrap break-all">
              {data.length > 0 ? formattedOutput : "データがありません"}
            </pre>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
