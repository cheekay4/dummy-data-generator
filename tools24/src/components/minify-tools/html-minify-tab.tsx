'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import CodeEditor from './code-editor';
import CodeOutput from './code-output';
import SizeComparison from './size-comparison';
import { minifyHTML, type HTMLMinifyOptions } from '@/lib/minify-tools/html-minify';

export default function HtmlMinifyTab() {
  const [input, setInput] = useState('');
  const [opts, setOpts] = useState<HTMLMinifyOptions>({
    removeComments: true,
    collapseWhitespace: true,
    removeOptionalTags: true,
  });

  const output = input ? minifyHTML(input, opts) : '';

  const toggle = (key: keyof HTMLMinifyOptions) => {
    setOpts({ ...opts, [key]: !opts[key] });
  };

  return (
    <div className="space-y-4">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="html"
        onFile={setInput}
        placeholder="HTMLコードを貼り付け、またはファイルをドロップ..."
      />
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Checkbox id="htmlComments" checked={opts.removeComments} onCheckedChange={() => toggle('removeComments')} />
          <Label htmlFor="htmlComments">コメント削除</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="htmlWhitespace" checked={opts.collapseWhitespace} onCheckedChange={() => toggle('collapseWhitespace')} />
          <Label htmlFor="htmlWhitespace">空白圧縮</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="htmlOptional" checked={opts.removeOptionalTags} onCheckedChange={() => toggle('removeOptionalTags')} />
          <Label htmlFor="htmlOptional">省略可能タグ削除</Label>
        </div>
      </div>
      {output && <SizeComparison original={input} compressed={output} />}
      <CodeOutput value={output} filename="index.min.html" />
    </div>
  );
}
