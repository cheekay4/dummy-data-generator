'use client';

import { useCallback } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';

interface CodeEditorProps {
  value: string;
  onChange: (v: string) => void;
  language: string;
  placeholder?: string;
  onFile?: (content: string) => void;
}

export default function CodeEditor({
  value,
  onChange,
  language,
  placeholder,
  onFile,
}: CodeEditorProps) {
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const file = e.dataTransfer.files[0];
      if (!file || !onFile) return;
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (typeof ev.target?.result === 'string') {
          onFile(ev.target.result);
        }
      };
      reader.readAsText(file, 'utf-8');
    },
    [onFile]
  );

  const SAMPLES: Record<string, string> = {
    html: '<!DOCTYPE html>\n<html lang="ja">\n  <head>\n    <meta charset="UTF-8">\n    <!-- サンプルページ -->\n    <title>サンプル</title>\n  </head>\n  <body>\n    <p>こんにちは世界</p>\n  </body>\n</html>',
    css: 'body {\n  margin: 0px;\n  padding: 0em;\n  font-family: sans-serif;\n  color: #333333;\n  background-color: #ffffff;\n}\n/* コメント */\n.container {\n  max-width: 1200px;\n  margin: 0px auto;\n}',
    js: '// サンプルコード\nfunction greet(name) {\n  console.log("Hello, " + name);\n  return "Hello, " + name;\n}\n\nconst result = greet("世界");\nconsole.log(result);',
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <p className="text-xs text-muted-foreground">{value.length} 文字</p>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => { const s = SAMPLES[language]; if (s) onChange(s); }}
          >
            サンプル
          </Button>
          <Button variant="outline" size="sm" onClick={() => onChange('')}>
            クリア
          </Button>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? `${language.toUpperCase()} コードを貼り付け...`}
        className="min-h-[200px] font-mono text-sm"
        rows={20}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      />
    </div>
  );
}
