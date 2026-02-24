"use client";

import { useMemo } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { validateJson } from "@/lib/json-utils";

interface JsonValidateProps {
  input: string;
}

export function JsonValidate({ input }: JsonValidateProps) {
  const result = useMemo(() => {
    if (!input.trim()) return null;
    return validateJson(input);
  }, [input]);

  if (!result) {
    return (
      <div className="text-sm text-muted-foreground p-4 text-center">
        左のテキストエリアにJSONを入力すると、バリデーション結果が表示されます
      </div>
    );
  }

  if (result.valid) {
    return (
      <Alert className="border-green-500/50 bg-green-50 dark:bg-green-950/20">
        <svg
          className="w-4 h-4 text-green-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        <AlertTitle className="text-green-700 dark:text-green-400">有効なJSONです</AlertTitle>
        <AlertDescription className="text-green-600 dark:text-green-500">
          JSONの構文は正しいです。
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Alert variant="destructive">
      <svg
        className="w-4 h-4"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        strokeWidth={2}
      >
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
      </svg>
      <AlertTitle>JSONエラー</AlertTitle>
      <AlertDescription>
        {result.line && <span className="font-mono">行{result.line}: </span>}
        {result.error}
      </AlertDescription>
    </Alert>
  );
}
