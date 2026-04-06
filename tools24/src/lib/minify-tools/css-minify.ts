export interface CSSMinifyOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  removeLastSemicolon: boolean;
  shortenColors: boolean;
  removeZeroUnits: boolean;
}

export function minifyCSS(css: string, options: CSSMinifyOptions): string {
  let result = css;

  // コメント削除
  if (options.removeComments) {
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
  }

  // 空白圧縮
  if (options.collapseWhitespace) {
    result = result.replace(/\s+/g, ' ');
    result = result.replace(/\s*([{};:,>~+])\s*/g, '$1');
    result = result.replace(/;\s*}/g, '}');
    result = result.trim();
  }

  // 末尾セミコロン削除
  if (options.removeLastSemicolon) {
    result = result.replace(/;}/g, '}');
  }

  // カラー短縮 (#aabbcc → #abc)
  if (options.shortenColors) {
    result = result.replace(/#([0-9a-f])\1([0-9a-f])\2([0-9a-f])\3/gi, '#$1$2$3');
    // rgb(0,0,0) → #000
    result = result.replace(/rgb\(\s*0\s*,\s*0\s*,\s*0\s*\)/gi, '#000');
    result = result.replace(/rgb\(\s*255\s*,\s*255\s*,\s*255\s*\)/gi, '#fff');
  }

  // ゼロ単位削除 (0px → 0, 0em → 0)
  if (options.removeZeroUnits) {
    result = result.replace(/\b0(px|em|rem|%|vh|vw|pt|cm|mm|in|ex|ch|vmin|vmax)\b/g, '0');
  }

  return result;
}
