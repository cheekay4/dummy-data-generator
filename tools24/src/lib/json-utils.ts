// JSON整形
export function beautifyJson(input: string, indent = 2): { result: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed, null, indent) };
  } catch (e) {
    return { result: "", error: parseJsonError(e) };
  }
}

// JSON圧縮
export function minifyJson(input: string): { result: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    return { result: JSON.stringify(parsed) };
  } catch (e) {
    return { result: "", error: parseJsonError(e) };
  }
}

// JSONバリデーション
export function validateJson(input: string): { valid: boolean; error?: string; line?: number } {
  try {
    JSON.parse(input);
    return { valid: true };
  } catch (e) {
    const error = parseJsonError(e);
    const line = extractErrorLine(e);
    return { valid: false, error, line };
  }
}

// JSON → CSV変換（配列のオブジェクトを想定）
export function jsonToCsv(input: string): { result: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    if (!Array.isArray(parsed)) {
      return { result: "", error: "CSV変換にはJSONの最上位が配列である必要があります" };
    }
    if (parsed.length === 0) {
      return { result: "", error: "配列が空です" };
    }
    const headers = Object.keys(parsed[0]);
    const rows = parsed.map((row: Record<string, unknown>) =>
      headers
        .map((h) => {
          const v = row[h];
          if (v === null || v === undefined) return "";
          const s = typeof v === "object" ? JSON.stringify(v) : String(v);
          return s.includes(",") || s.includes('"') || s.includes("\n")
            ? `"${s.replace(/"/g, '""')}"`
            : s;
        })
        .join(",")
    );
    return { result: [headers.join(","), ...rows].join("\n") };
  } catch (e) {
    return { result: "", error: parseJsonError(e) };
  }
}

// JSON → XML変換
export function jsonToXml(input: string): { result: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    const xml = objToXml(parsed, "root", 0);
    return { result: `<?xml version="1.0" encoding="UTF-8"?>\n${xml}` };
  } catch (e) {
    return { result: "", error: parseJsonError(e) };
  }
}

function objToXml(obj: unknown, tagName: string, depth: number): string {
  const indent = "  ".repeat(depth);
  const tag = sanitizeXmlTag(tagName);

  if (obj === null) return `${indent}<${tag} xsi:nil="true"/>`;
  if (typeof obj !== "object") {
    const escaped = String(obj)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");
    return `${indent}<${tag}>${escaped}</${tag}>`;
  }
  if (Array.isArray(obj)) {
    return obj
      .map((item) => objToXml(item, "item", depth))
      .join("\n");
  }
  const children = Object.entries(obj as Record<string, unknown>)
    .map(([k, v]) => objToXml(v, k, depth + 1))
    .join("\n");
  return `${indent}<${tag}>\n${children}\n${indent}</${tag}>`;
}

function sanitizeXmlTag(name: string): string {
  return name.replace(/[^a-zA-Z0-9_-]/g, "_").replace(/^[0-9-]/, "_$&");
}

// JSON → TypeScript型生成
export function jsonToTypeScript(input: string): { result: string; error?: string } {
  try {
    const parsed = JSON.parse(input);
    const interfaces: string[] = [];
    const rootType = generateType(parsed, "Root", interfaces);
    const deduplicated = deduplicateInterfaces(interfaces);
    const result =
      deduplicated.join("\n\n") + (deduplicated.length ? "\n\n" : "") + `export type Root = ${rootType};`;
    return { result };
  } catch (e) {
    return { result: "", error: parseJsonError(e) };
  }
}

function generateType(value: unknown, name: string, interfaces: string[]): string {
  if (value === null) return "null";
  if (typeof value === "string") return "string";
  if (typeof value === "number") return "number";
  if (typeof value === "boolean") return "boolean";
  if (Array.isArray(value)) {
    if (value.length === 0) return "unknown[]";
    const itemType = generateType(value[0], name + "Item", interfaces);
    return `${itemType}[]`;
  }
  if (typeof value === "object") {
    const entries = Object.entries(value as Record<string, unknown>);
    const fields = entries
      .map(([k, v]) => {
        const childName = toPascalCase(k);
        const type = generateType(v, childName, interfaces);
        const optional = v === null ? "?" : "";
        return `  ${k}${optional}: ${type};`;
      })
      .join("\n");
    const interfaceStr = `export interface ${toPascalCase(name)} {\n${fields}\n}`;
    interfaces.push(interfaceStr);
    return toPascalCase(name);
  }
  return "unknown";
}

function toPascalCase(s: string): string {
  return s.replace(/(^|[^a-zA-Z0-9])([a-zA-Z0-9])/g, (_, __, c) => c.toUpperCase());
}

function deduplicateInterfaces(interfaces: string[]): string[] {
  const seen = new Set<string>();
  return interfaces.reverse().filter((i) => {
    const name = i.match(/export interface (\w+)/)?.[1];
    if (!name || seen.has(name)) return false;
    seen.add(name);
    return true;
  }).reverse();
}

// エラーメッセージを日本語で返す
function parseJsonError(e: unknown): string {
  if (!(e instanceof SyntaxError)) return "不明なエラー";
  const msg = e.message;

  if (msg.includes("Unexpected token")) {
    const match = msg.match(/Unexpected token '?(.+?)'?/);
    if (match) return `予期しないトークン「${match[1]}」が見つかりました`;
    return "予期しないトークンが見つかりました";
  }
  if (msg.includes("Unexpected end")) return "JSONが途中で終わっています";
  if (msg.includes("Expected")) {
    const match = msg.match(/Expected '(.+?)'/);
    if (match) return `「${match[1]}」が必要です`;
  }
  if (msg.includes("Unterminated string")) return "文字列が閉じられていません";
  if (msg.includes("Expected double-quoted")) return "プロパティ名はダブルクォートで囲む必要があります";
  return msg;
}

function extractErrorLine(e: unknown): number | undefined {
  if (!(e instanceof SyntaxError)) return undefined;
  const match = e.message.match(/line (\d+)/);
  if (match) return parseInt(match[1], 10);
  return undefined;
}
