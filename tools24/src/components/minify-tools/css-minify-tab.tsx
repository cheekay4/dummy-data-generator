'use client';

import { useState } from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import CodeEditor from './code-editor';
import CodeOutput from './code-output';
import SizeComparison from './size-comparison';
import { minifyCSS, type CSSMinifyOptions } from '@/lib/minify-tools/css-minify';

export default function CssMinifyTab() {
  const [input, setInput] = useState('');
  const [opts, setOpts] = useState<CSSMinifyOptions>({
    removeComments: true,
    collapseWhitespace: true,
    removeLastSemicolon: true,
    shortenColors: true,
    removeZeroUnits: true,
  });

  const output = input ? minifyCSS(input, opts) : '';

  const toggle = (key: keyof CSSMinifyOptions) => {
    setOpts({ ...opts, [key]: !opts[key] });
  };

  return (
    <div className="space-y-4">
      <CodeEditor
        value={input}
        onChange={setInput}
        language="css"
        onFile={setInput}
        placeholder="CSSコードを貼り付け、またはファイルをドロップ..."
      />
      <div className="flex flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Checkbox id="cssComments" checked={opts.removeComments} onCheckedChange={() => toggle('removeComments')} />
          <Label htmlFor="cssComments">コメント削除</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cssWhitespace" checked={opts.collapseWhitespace} onCheckedChange={() => toggle('collapseWhitespace')} />
          <Label htmlFor="cssWhitespace">空白圧縮</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cssSemicolon" checked={opts.removeLastSemicolon} onCheckedChange={() => toggle('removeLastSemicolon')} />
          <Label htmlFor="cssSemicolon">末尾セミコロン削除</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cssColors" checked={opts.shortenColors} onCheckedChange={() => toggle('shortenColors')} />
          <Label htmlFor="cssColors">カラー短縮</Label>
        </div>
        <div className="flex items-center gap-2">
          <Checkbox id="cssZero" checked={opts.removeZeroUnits} onCheckedChange={() => toggle('removeZeroUnits')} />
          <Label htmlFor="cssZero">0単位削除</Label>
        </div>
      </div>
      {output && <SizeComparison original={input} compressed={output} />}
      <CodeOutput value={output} filename="style.min.css" />
    </div>
  );
}
