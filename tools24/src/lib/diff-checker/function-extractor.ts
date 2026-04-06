/**
 * 関数抽出・比較エンジン
 * JS/TS/Python/Go/Ruby のコードから関数定義を抽出し、差分を比較する
 */

export type SupportedLanguage = "javascript" | "typescript" | "python" | "go" | "ruby" | "text";

export interface FunctionInfo {
  name: string;
  startLine: number;
  endLine: number;
  body: string;
  signature: string;
}

export interface FunctionComparison {
  added: string[];
  removed: string[];
  changed: string[];
}

/** 言語ごとの関数定義パターン */
const FUNCTION_PATTERNS: Record<Exclude<SupportedLanguage, "text">, RegExp[]> = {
  javascript: [
    // function declaration
    /^[ \t]*(?:export\s+)?(?:async\s+)?function\s+(\w+)\s*\(/,
    // arrow / const declaration
    /^[ \t]*(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(?/,
    // method in class / object
    /^[ \t]*(?:async\s+)?(\w+)\s*\([^)]*\)\s*\{/,
  ],
  typescript: [
    /^[ \t]*(?:export\s+)?(?:async\s+)?function\s+(\w+)/,
    /^[ \t]*(?:export\s+)?(?:const|let|var)\s+(\w+)\s*=\s*(?:async\s+)?\(?/,
    /^[ \t]*(?:async\s+)?(\w+)\s*\([^)]*\)\s*(?::\s*\S+)?\s*\{/,
  ],
  python: [
    /^[ \t]*(?:async\s+)?def\s+(\w+)\s*\(/,
    /^[ \t]*class\s+(\w+)\s*[:(]/,
  ],
  go: [
    /^func\s+(\w+)\s*\(/,
    /^func\s+\([^)]+\)\s+(\w+)\s*\(/,
  ],
  ruby: [
    /^[ \t]*def\s+(\w+)/,
    /^[ \t]*class\s+(\w+)/,
  ],
};

/** ブロック終了を判定するためのインデントベースの言語かどうか */
function isIndentBased(lang: SupportedLanguage): boolean {
  return lang === "python" || lang === "ruby";
}

/**
 * コードから関数定義を抽出する
 */
export function extractFunctions(code: string, lang: SupportedLanguage): FunctionInfo[] {
  if (lang === "text") return [];

  const lines = code.split("\n");
  const patterns = FUNCTION_PATTERNS[lang];
  const functions: FunctionInfo[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    for (const pattern of patterns) {
      const match = pattern.exec(line);
      if (match) {
        const name = match[1];
        // 同じ名前の関数が既に登録されている場合はスキップ（メソッド誤検出防止）
        if (name === "if" || name === "for" || name === "while" || name === "switch" || name === "return") {
          continue;
        }
        const endLine = findFunctionEnd(lines, i, lang);
        const body = lines.slice(i, endLine + 1).join("\n");
        functions.push({
          name,
          startLine: i + 1,
          endLine: endLine + 1,
          body,
          signature: line.trim(),
        });
        break;
      }
    }
  }

  return functions;
}

/**
 * 関数ブロックの終端行を見つける
 */
function findFunctionEnd(lines: string[], startIdx: number, lang: SupportedLanguage): number {
  if (isIndentBased(lang)) {
    return findIndentBasedEnd(lines, startIdx);
  }
  return findBraceBasedEnd(lines, startIdx);
}

/** インデントベース言語（Python/Ruby）の関数終端を検出 */
function findIndentBasedEnd(lines: string[], startIdx: number): number {
  const startLine = lines[startIdx];
  const baseIndent = startLine.length - startLine.trimStart().length;
  let endIdx = startIdx;

  for (let i = startIdx + 1; i < lines.length; i++) {
    const line = lines[i];
    // 空行はスキップ
    if (line.trim() === "") {
      endIdx = i;
      continue;
    }
    const currentIndent = line.length - line.trimStart().length;
    if (currentIndent <= baseIndent) {
      break;
    }
    endIdx = i;
  }

  return endIdx;
}

/** ブレースベース言語（JS/TS/Go）の関数終端を検出 */
function findBraceBasedEnd(lines: string[], startIdx: number): number {
  let braceCount = 0;
  let foundOpen = false;

  for (let i = startIdx; i < lines.length; i++) {
    const line = lines[i];
    for (const ch of line) {
      if (ch === "{") {
        braceCount++;
        foundOpen = true;
      } else if (ch === "}") {
        braceCount--;
      }
    }
    if (foundOpen && braceCount <= 0) {
      return i;
    }
  }

  // ブレースが見つからない場合は開始行のみ
  return startIdx;
}

/**
 * コード内容からプログラミング言語を推測する
 */
export function detectLanguage(code: string): SupportedLanguage {
  const lines = code.split("\n").slice(0, 30);
  const sample = lines.join("\n");

  // Go の特徴
  if (/^package\s+\w+/m.test(sample) || /^func\s+/m.test(sample) || /^import\s*\(/m.test(sample)) {
    return "go";
  }

  // Python の特徴
  if (/^(from|import)\s+\w+/m.test(sample) || /^def\s+\w+\s*\(/m.test(sample) || /:\s*$/m.test(sample) && /^\s{4}/m.test(sample)) {
    return "python";
  }

  // Ruby の特徴
  if (/^require\s+['"]/.test(sample) || /^def\s+\w+/m.test(sample) && /^end\s*$/m.test(sample)) {
    return "ruby";
  }

  // TypeScript の特徴（JSより先に判定）
  if (/:\s*(string|number|boolean|void|Promise|React)\b/.test(sample) || /interface\s+\w+/.test(sample) || /type\s+\w+\s*=/.test(sample)) {
    return "typescript";
  }

  // JavaScript の特徴
  if (/\b(const|let|var|function|=>|require\s*\()\b/.test(sample) || /\bimport\s+/.test(sample)) {
    return "javascript";
  }

  return "text";
}

/**
 * 2つのコードの関数リストを比較する
 */
export function compareFunctions(funcsA: FunctionInfo[], funcsB: FunctionInfo[]): FunctionComparison {
  const namesA = new Set(funcsA.map((f) => f.name));
  const namesB = new Set(funcsB.map((f) => f.name));
  const mapA = new Map(funcsA.map((f) => [f.name, f]));
  const mapB = new Map(funcsB.map((f) => [f.name, f]));

  const added: string[] = [];
  const removed: string[] = [];
  const changed: string[] = [];

  // B にあって A にない → 追加
  for (const name of namesB) {
    if (!namesA.has(name)) {
      added.push(name);
    }
  }

  // A にあって B にない → 削除
  for (const name of namesA) {
    if (!namesB.has(name)) {
      removed.push(name);
    }
  }

  // 両方にある → 内容比較
  for (const name of namesA) {
    if (namesB.has(name)) {
      const funcA = mapA.get(name);
      const funcB = mapB.get(name);
      if (funcA && funcB && funcA.body !== funcB.body) {
        changed.push(name);
      }
    }
  }

  return { added, removed, changed };
}
