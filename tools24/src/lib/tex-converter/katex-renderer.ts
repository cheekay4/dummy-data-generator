import katex from "katex";

export interface RenderResult {
  html: string;
  error?: string;
}

export function renderLatex(latex: string, displayMode: boolean): RenderResult {
  try {
    const html = katex.renderToString(latex, {
      displayMode,
      throwOnError: true,
      strict: false,
      trust: false,
      output: "htmlAndMathml",
    });
    return { html };
  } catch (err: unknown) {
    const message =
      err instanceof katex.ParseError
        ? translateKaTeXError(err)
        : err instanceof Error
          ? err.message
          : "不明なエラーが発生しました";
    // Return error HTML so preview still renders partial output
    try {
      const html = katex.renderToString(latex, {
        displayMode,
        throwOnError: false,
        strict: false,
        trust: false,
        output: "htmlAndMathml",
      });
      return { html, error: message };
    } catch {
      return { html: "", error: message };
    }
  }
}

export function translateKaTeXError(error: katex.ParseError): string {
  const msg = error.message;

  if (msg.includes("Undefined control sequence")) {
    const match = msg.match(/\\([a-zA-Z]+)/);
    const cmd = match ? `\\${match[1]}` : "";
    return `未定義のコマンド: ${cmd}。コマンド名のスペルを確認してください。`;
  }

  if (msg.includes("Missing {") || msg.includes("Expected {")) {
    return "開き波括弧 { が不足しています。";
  }

  if (msg.includes("Missing }") || msg.includes("Expected }")) {
    return "閉じ波括弧 } が不足しています。";
  }

  if (msg.includes("Extra }")) {
    return "余分な閉じ波括弧 } があります。";
  }

  if (msg.includes("Extra {")) {
    return "余分な開き波括弧 { があります。";
  }

  if (msg.includes("Missing \\right")) {
    return "\\right が不足しています。\\left と \\right はペアで使用してください。";
  }

  if (msg.includes("Missing \\left")) {
    return "\\left が不足しています。\\left と \\right はペアで使用してください。";
  }

  if (msg.includes("Double superscript")) {
    return "上付き文字（^）が二重に指定されています。";
  }

  if (msg.includes("Double subscript")) {
    return "下付き文字（_）が二重に指定されています。";
  }

  if (msg.includes("Missing $")) {
    return "数式モードの区切り $ が不足しています。";
  }

  if (msg.includes("\\begin{") && msg.includes("ended by")) {
    return "環境の \\begin と \\end が一致していません。";
  }

  if (msg.includes("No such environment")) {
    const match = msg.match(/environment: (\w+)/);
    const env = match ? match[1] : "";
    return `未定義の環境: ${env}。環境名を確認してください。`;
  }

  if (msg.includes("Too many")) {
    return "要素が多すぎます。行列の列数や引数の数を確認してください。";
  }

  if (msg.includes("Expected 'EOF'")) {
    return "予期しない入力があります。数式の構文を確認してください。";
  }

  return `LaTeX エラー: ${msg}`;
}
