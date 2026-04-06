export interface HTMLMinifyOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  removeOptionalTags: boolean;
}

export function minifyHTML(html: string, options: HTMLMinifyOptions): string {
  // pre/code/textarea/script/style 内のコンテンツを退避
  const preserved: string[] = [];
  let result = html.replace(
    /(<(pre|code|textarea|script|style)[^>]*>)([\s\S]*?)(<\/\2>)/gi,
    (_match, openTag: string, _tagName: string, content: string, closeTag: string) => {
      const placeholder = `\x00PRESERVED_${preserved.length}\x00`;
      preserved.push(openTag + content + closeTag);
      return placeholder;
    }
  );

  // コメント削除
  if (options.removeComments) {
    result = result.replace(/<!--[\s\S]*?-->/g, '');
  }

  // 空白圧縮
  if (options.collapseWhitespace) {
    result = result.replace(/>\s+</g, '> <');
    result = result.replace(/\s{2,}/g, ' ');
    result = result.trim();
  }

  // オプショナルタグ削除
  if (options.removeOptionalTags) {
    result = result.replace(/<\/(p|li|td|th|tr|thead|tbody|tfoot|option)>/gi, '');
  }

  // 退避コンテンツを復元
  result = result.replace(/\x00PRESERVED_(\d+)\x00/g, (_m, idx: string) => preserved[Number(idx)]);

  return result;
}
