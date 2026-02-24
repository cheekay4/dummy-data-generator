"use client";

import { useState, useMemo } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { JsonInput } from "./json-input";
import { JsonOutput } from "./json-output";
import { JsonValidate } from "./json-validate";
import { JsonToCsv } from "./json-to-csv";
import { JsonToYaml } from "./json-to-yaml";
import { JsonToXml } from "./json-to-xml";
import { JsonToTypeScript } from "./json-to-typescript";
import { JsonPathSearch } from "./json-path";
import { JsonDiff } from "./json-diff";
import { beautifyJson, minifyJson } from "@/lib/json-utils";

export function FeatureTabs() {
  const [input, setInput] = useState("");
  const [activeTab, setActiveTab] = useState("beautify");

  const beautified = useMemo(() => {
    if (!input.trim()) return "";
    return beautifyJson(input).result ?? "";
  }, [input]);

  const minified = useMemo(() => {
    if (!input.trim()) return "";
    return minifyJson(input).result ?? "";
  }, [input]);

  const TABS = [
    { value: "beautify", label: "整形" },
    { value: "minify", label: "圧縮" },
    { value: "validate", label: "バリデーション" },
    { value: "csv", label: "→CSV" },
    { value: "yaml", label: "→YAML" },
    { value: "xml", label: "→XML" },
    { value: "typescript", label: "→TypeScript型" },
    { value: "jsonpath", label: "JSONPath検索" },
    { value: "diff", label: "diff比較" },
  ];

  const isDiffTab = activeTab === "diff";

  return (
    <div className="w-full">
      {/* タブ切替 */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex flex-wrap h-auto gap-1 p-1 mb-4 w-full justify-start bg-muted rounded-lg">
          {TABS.map((t) => (
            <TabsTrigger
              key={t.value}
              value={t.value}
              className="text-xs sm:text-sm px-2 sm:px-3 py-1.5"
            >
              {t.label}
            </TabsTrigger>
          ))}
        </TabsList>

        {/* diff比較は特殊レイアウト */}
        <TabsContent value="diff">
          <JsonDiff />
        </TabsContent>

        {/* その他は左右2カラム */}
        {!isDiffTab && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* 左: 入力 */}
            <JsonInput value={input} onChange={setInput} />

            {/* 右: 各機能の出力 */}
            <div className="flex flex-col h-full">
              <TabsContent value="beautify" className="mt-0 flex-1">
                <JsonOutput value={beautified} label="整形結果" downloadName="formatted.json" />
              </TabsContent>
              <TabsContent value="minify" className="mt-0 flex-1">
                <JsonOutput value={minified} label="圧縮結果" downloadName="minified.json" />
              </TabsContent>
              <TabsContent value="validate" className="mt-0 flex-1">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">バリデーション結果</span>
                  <JsonValidate input={input} />
                </div>
              </TabsContent>
              <TabsContent value="csv" className="mt-0 flex-1">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">CSV変換結果</span>
                  <JsonToCsv input={input} />
                </div>
              </TabsContent>
              <TabsContent value="yaml" className="mt-0 flex-1">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">YAML変換結果</span>
                  <JsonToYaml input={input} />
                </div>
              </TabsContent>
              <TabsContent value="xml" className="mt-0 flex-1">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">XML変換結果</span>
                  <JsonToXml input={input} />
                </div>
              </TabsContent>
              <TabsContent value="typescript" className="mt-0 flex-1">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">TypeScript型定義</span>
                  <JsonToTypeScript input={input} />
                </div>
              </TabsContent>
              <TabsContent value="jsonpath" className="mt-0 flex-1">
                <div className="flex flex-col gap-2">
                  <span className="text-sm font-medium">JSONPath検索</span>
                  <JsonPathSearch input={input} />
                </div>
              </TabsContent>
            </div>
          </div>
        )}
      </Tabs>
    </div>
  );
}
