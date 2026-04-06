'use client';

import { useState, useEffect, useRef } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import CodeEditor from './code-editor';
import CodeOutput from './code-output';
import SizeComparison from './size-comparison';
import { minifyJS, type JSMinifyOptions } from '@/lib/minify-tools/js-minify';

export default function JsMinifyTab() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');
  const [opts, setOpts] = useState<JSMinifyOptions>({
    removeComments: true,
    collapseWhitespace: true,
    removeConsoleLog: false,
    shortenVariables: false,
  });
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!input) { setOutput(''); return; }
    debounceRef.current = setTimeout(async () => {
      const result = await minifyJS(input, opts);
      setOutput(result);
    }, 300);
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [input, opts]);

  const toggle = (key: keyof JSMinifyOptions) => {
    setOpts({ ...opts, [key]: !opts[key] });
  };

  return (
    <div className="space-y-4">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="js"
        onFile={setInput}
        placeholder="JavaScriptコードを貼り付け、またはファイルをドロップ..."
      />
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Checkbox id="jsComments" checked={opts.removeComments} onCheckedChange={() => toggle('removeComments')} />
          <Label htmlFor="jsComments">コメント削除</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="jsWhitespace" checked={opts.collapseWhitespace} onCheckedChange={() => toggle('collapseWhitespace')} />
          <Label htmlFor="jsWhitespace">空白圧縮</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="jsConsole" checked={opts.removeConsoleLog} onCheckedChange={() => toggle('removeConsoleLog')} />
          <Label htmlFor="jsConsole">console.log削除</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="jsVars" checked={opts.shortenVariables} onCheckedChange={() => toggle('shortenVariables')} />
          <Label htmlFor="jsVars">
            変数名短縮
            <span className="ml-1 text-yellow-600 dark:text-yellow-400">⚠️ 動作確認推奨</span>
          </Label>
        </div>
      </div>
      {output && <SizeComparison original={input} compressed={output} />}
      <CodeOutput value={output} filename="script.min.js" />
    </div>
  );
}
