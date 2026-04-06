export interface JSMinifyOptions {
  removeComments: boolean;
  collapseWhitespace: boolean;
  removeConsoleLog: boolean;
  shortenVariables: boolean;
}

function fallbackMinify(code: string, options: JSMinifyOptions): string {
  let result = code;

  // コメント削除（単行・複数行）
  if (options.removeComments) {
    // 文字列リテラルを保護しながら削除するのは複雑なので正規表現ベースで
    result = result.replace(/\/\*[\s\S]*?\*\//g, '');
    result = result.replace(/\/\/[^\n]*/g, '');
  }

  // console.log 削除
  if (options.removeConsoleLog) {
    result = result.replace(/console\.(log|warn|error|info|debug)\s*\([^)]*\)\s*;?/g, '');
  }

  // 空白圧縮
  if (options.collapseWhitespace) {
    result = result.replace(/\n\s*\n/g, '\n');
    result = result.replace(/[ \t]+/g, ' ');
    result = result.replace(/\s*([{};:,=+\-*/<>!&|()[\]])\s*/g, '$1');
    result = result.trim();
  }

  return result;
}

export async function minifyJS(code: string, options: JSMinifyOptions): Promise<string> {
  try {
    const { minify } = await import('terser');
    const result = await minify(code, {
      compress: {
        drop_console: options.removeConsoleLog,
        passes: 2,
      },
      mangle: options.shortenVariables,
      format: {
        comments: options.removeComments ? false : 'all',
      },
    });
    return result.code ?? fallbackMinify(code, options);
  } catch {
    return fallbackMinify(code, options);
  }
}
