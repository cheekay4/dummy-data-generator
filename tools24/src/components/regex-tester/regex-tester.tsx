"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

// ===== Types =====

interface MatchResult {
  index: number;
  text: string;
  groups: (string | undefined)[];
}

interface RegexToken {
  raw: string;
  description: string;
  category: "escape" | "quantifier" | "anchor" | "class" | "group" | "literal" | "special";
}

interface FlagsState {
  g: boolean;
  i: boolean;
  m: boolean;
  s: boolean;
  u: boolean;
}

// ===== Presets =====

const PRESETS = [
  {
    label: "郵便番号",
    pattern: "\\d{3}-\\d{4}",
    flags: { g: true, i: false, m: false, s: false, u: false },
    sample:
      "〒100-0001 東京都千代田区\n999-9999\n1234567\n123-4567\n100-0001\n〒600-8001 京都市下京区",
    description: "日本の郵便番号（NNN-NNNN形式）",
  },
  {
    label: "携帯電話",
    pattern: "0[789]0-\\d{4}-\\d{4}",
    flags: { g: true, i: false, m: false, s: false, u: false },
    sample:
      "090-1234-5678\n080-9876-5432\n070-1111-2222\n03-1234-5678\n090-1234-567",
    description: "日本の携帯電話番号（090/080/070）",
  },
  {
    label: "固定電話",
    pattern: "0\\d{1,4}-\\d{1,4}-\\d{4}",
    flags: { g: true, i: false, m: false, s: false, u: false },
    sample:
      "03-1234-5678\n06-9876-5432\n0120-123-456\n0570-123-456\n00-0000-0000",
    description: "日本の固定電話番号",
  },
  {
    label: "メールアドレス",
    pattern: "[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}",
    flags: { g: true, i: false, m: false, s: false, u: false },
    sample:
      "user@example.com\ntest.user+tag@sub.domain.co.jp\ninvalid@\n@nodomain.com\nhello@world.io",
    description: "メールアドレスの基本パターン",
  },
  {
    label: "全角カタカナ",
    pattern: "[\\u30A0-\\u30FF]+",
    flags: { g: true, i: false, m: false, s: false, u: true },
    sample: "アイウエオ\nhello world\nカタカナとひらがな混在\nテスト123\nアBC",
    description: "全角カタカナのみにマッチ",
  },
  {
    label: "全角ひらがな",
    pattern: "[\\u3040-\\u309F]+",
    flags: { g: true, i: false, m: false, s: false, u: true },
    sample: "あいうえお\nhello world\nひらがなとカタカナ混在\nてすと123\nあBC",
    description: "全角ひらがなのみにマッチ",
  },
  {
    label: "日付 YYYY/MM/DD",
    pattern: "\\d{4}/\\d{2}/\\d{2}",
    flags: { g: true, i: false, m: false, s: false, u: false },
    sample:
      "2024/02/20\n2024-02-20\n2024.02.20\n2024/13/40\n本日は2025/01/01です",
    description: "YYYY/MM/DD形式の日付",
  },
  {
    label: "マイナンバー",
    pattern: "\\b\\d{12}\\b",
    flags: { g: true, i: false, m: false, s: false, u: false },
    sample:
      "123456789012\n12345678901\n1234567890123\n000000000000\nMY:123456789012",
    description: "12桁の数字（マイナンバー形式）",
  },
  {
    label: "URL",
    pattern: "https?://[\\w/:%#\\$&\\?\\(\\)~\\.=\\+\\-]+",
    flags: { g: true, i: false, m: false, s: false, u: false },
    sample:
      "https://example.com\nhttp://test.co.jp/path?q=1&r=2\nhttps://sub.domain.example.com/path\nftp://notsupported.com",
    description: "HTTP / HTTPS の URL",
  },
] as const;

const FLAG_DESCS: Record<string, string> = {
  g: "グローバル（全件マッチ）",
  i: "大文字小文字を無視",
  m: "複数行モード（^ $が各行に適用）",
  s: "dotAll（. が改行にもマッチ）",
  u: "Unicode モード（\\u{…} や絵文字対応）",
};

const CATEGORY_COLOR: Record<RegexToken["category"], string> = {
  escape: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  quantifier: "bg-orange-100 text-orange-800 dark:bg-orange-900/40 dark:text-orange-300",
  anchor: "bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300",
  class: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  group: "bg-pink-100 text-pink-800 dark:bg-pink-900/40 dark:text-pink-300",
  literal: "bg-muted text-muted-foreground",
  special: "bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300",
};

// ===== Logic =====

function buildFlagStr(flags: FlagsState): string {
  return (["g", "i", "m", "s", "u"] as const).filter((f) => flags[f]).join("");
}

function buildRegex(
  pattern: string,
  flags: FlagsState
): { regex: RegExp | null; error: string | null } {
  if (!pattern.trim()) return { regex: null, error: null };
  try {
    return { regex: new RegExp(pattern, buildFlagStr(flags)), error: null };
  } catch (e) {
    const msg = e instanceof Error ? e.message : "不正な正規表現です";
    return { regex: null, error: `エラー: ${msg}` };
  }
}

/**
 * 壊滅的バックトラッキング（ReDoS）を引き起こしやすいパターンを検出する。
 * 例: (a+)+, (a|aa)*, (x+){2,} など、量化されたグループに外側の量指定子が付くケース。
 */
function hasDangerousPattern(pattern: string): boolean {
  // ネストされた量指定子: (内部に+/*/{を含むグループ) の後に +/*/{
  return /\([^()]*[+*]\s*\)[+*{]/.test(pattern) ||
    /\([^()]*\{[0-9,]+\}\s*\)[+*{]/.test(pattern);
}

function getAllMatches(regex: RegExp, str: string): MatchResult[] {
  if (!str) return [];
  const results: MatchResult[] = [];
  const gFlags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
  const gRegex = new RegExp(regex.source, gFlags);
  try {
    let m: RegExpExecArray | null;
    while ((m = gRegex.exec(str)) !== null) {
      if (results.length >= 500) break;
      results.push({
        index: m.index,
        text: m[0],
        groups: Array.from(m).slice(1),
      });
      if (m[0].length === 0) gRegex.lastIndex++;
    }
  } catch {
    // ignore
  }
  return results;
}

function buildSegments(
  text: string,
  regex: RegExp
): Array<{ text: string; matched: boolean }> {
  const segments: Array<{ text: string; matched: boolean }> = [];
  if (!text) return [{ text: "", matched: false }];

  const gFlags = regex.flags.includes("g") ? regex.flags : regex.flags + "g";
  const gRegex = new RegExp(regex.source, gFlags);
  let lastIndex = 0;
  let count = 0;

  try {
    let m: RegExpExecArray | null;
    while ((m = gRegex.exec(text)) !== null) {
      if (count++ > 1000) break;
      const idx = m.index;
      if (idx > lastIndex) {
        segments.push({ text: text.slice(lastIndex, idx), matched: false });
      }
      if (m[0].length > 0) {
        segments.push({ text: m[0], matched: true });
        lastIndex = idx + m[0].length;
      } else {
        lastIndex = idx + 1;
        gRegex.lastIndex++;
      }
    }
  } catch {
    return [{ text, matched: false }];
  }

  if (lastIndex < text.length) {
    segments.push({ text: text.slice(lastIndex), matched: false });
  }
  return segments;
}

function tokenizePattern(pattern: string): RegexToken[] {
  const tokens: RegexToken[] = [];
  let i = 0;

  while (i < pattern.length) {
    const ch = pattern[i];

    // ── Escape sequences ──────────────────────────────────────────
    if (ch === "\\") {
      const next = pattern[i + 1] ?? "";

      // \uNNNN or \u{NNNN}
      if (next === "u") {
        if (pattern[i + 2] === "{") {
          const end = pattern.indexOf("}", i + 3);
          if (end !== -1) {
            const hex = pattern.substring(i + 3, end);
            tokens.push({
              raw: `\\u{${hex}}`,
              description: `Unicodeコードポイント U+${hex.toUpperCase()}`,
              category: "escape",
            });
            i = end + 1;
            continue;
          }
        } else if (i + 5 < pattern.length + 1) {
          const hex = pattern.substring(i + 2, i + 6);
          if (/^[0-9a-fA-F]{4}$/.test(hex)) {
            tokens.push({
              raw: `\\u${hex}`,
              description: `Unicodeコードポイント U+${hex.toUpperCase()}`,
              category: "escape",
            });
            i += 6;
            continue;
          }
        }
      }

      // \xNN
      if (next === "x") {
        const hex = pattern.substring(i + 2, i + 4);
        if (/^[0-9a-fA-F]{2}$/.test(hex)) {
          tokens.push({
            raw: `\\x${hex}`,
            description: `文字コード U+00${hex.toUpperCase()}`,
            category: "escape",
          });
          i += 4;
          continue;
        }
      }

      const ESCAPE_MAP: Record<string, string> = {
        d: "数字（0〜9）1文字",
        D: "数字以外の文字1文字",
        w: "単語文字（英数字・アンダースコア）1文字",
        W: "単語文字以外の文字1文字",
        s: "空白文字（スペース・タブ・改行等）1文字",
        S: "空白文字以外の文字1文字",
        b: "単語境界（アサーション、幅ゼロ）",
        B: "単語境界以外（アサーション）",
        n: "改行（LF, U+000A）",
        t: "タブ文字（U+0009）",
        r: "キャリッジリターン（CR, U+000D）",
        v: "垂直タブ（U+000B）",
        f: "フォームフィード（U+000C）",
        "0": "NUL文字（U+0000）",
        "1": "後方参照: 1番目のキャプチャグループの値",
        "2": "後方参照: 2番目のキャプチャグループの値",
        "3": "後方参照: 3番目のキャプチャグループの値",
        "4": "後方参照: 4番目のキャプチャグループの値",
        "5": "後方参照: 5番目のキャプチャグループの値",
        "6": "後方参照: 6番目のキャプチャグループの値",
        "7": "後方参照: 7番目のキャプチャグループの値",
        "8": "後方参照: 8番目のキャプチャグループの値",
        "9": "後方参照: 9番目のキャプチャグループの値",
      };

      const desc = ESCAPE_MAP[next] ?? `文字「${next}」（エスケープ）`;
      tokens.push({ raw: ch + next, description: desc, category: next in ESCAPE_MAP ? "escape" : "literal" });
      i += 2;
      continue;
    }

    // ── Character class [...] ────────────────────────────────────
    if (ch === "[") {
      let j = i + 1;
      const negated = j < pattern.length && pattern[j] === "^";
      if (negated) j++;
      // First ] after [ or [^ is literal
      if (j < pattern.length && pattern[j] === "]") j++;
      // Find closing ]
      while (j < pattern.length && pattern[j] !== "]") {
        if (pattern[j] === "\\") j++;
        j++;
      }
      const raw = pattern.substring(i, Math.min(j + 1, pattern.length));
      const content = pattern.substring(i + 1 + (negated ? 1 : 0), j);

      const friendly: Record<string, string> = {
        "a-z": "小文字英字（a〜z）",
        "A-Z": "大文字英字（A〜Z）",
        "0-9": "数字（0〜9）",
        "a-zA-Z": "英字（大小文字）",
        "a-zA-Z0-9": "英数字",
        "a-zA-Z0-9_": "英数字・アンダースコア",
        "\\u3040-\\u309F": "ひらがな",
        "\\u30A0-\\u30FF": "カタカナ",
        "\\u4E00-\\u9FFF": "漢字（CJK統合漢字）",
      };
      const shortContent = content.length > 30 ? content.slice(0, 30) + "…" : content;
      const knownDesc = friendly[content];
      const contentDesc = knownDesc ?? `${shortContent}`;
      const desc = negated
        ? `[${shortContent}]以外の1文字（否定文字クラス）`
        : knownDesc
          ? `${contentDesc}の1文字（文字クラス）`
          : `[${contentDesc}]のいずれか1文字（文字クラス）`;

      tokens.push({ raw, description: desc, category: "class" });
      i = j + 1;
      continue;
    }

    // ── Groups ────────────────────────────────────────────────────
    if (ch === "(") {
      if (pattern.startsWith("(?:", i)) {
        tokens.push({ raw: "(?:", description: "非キャプチャグループ（番号なし）開始", category: "group" });
        i += 3;
      } else if (pattern.startsWith("(?<=", i)) {
        tokens.push({ raw: "(?<=", description: "肯定後読み: 直前にこれが続く場合にマッチ", category: "group" });
        i += 4;
      } else if (pattern.startsWith("(?<!", i)) {
        tokens.push({ raw: "(?<!", description: "否定後読み: 直前にこれが続かない場合にマッチ", category: "group" });
        i += 4;
      } else if (pattern.startsWith("(?=", i)) {
        tokens.push({ raw: "(?=", description: "肯定先読み: 直後にこれが続く場合にマッチ", category: "group" });
        i += 3;
      } else if (pattern.startsWith("(?!", i)) {
        tokens.push({ raw: "(?!", description: "否定先読み: 直後にこれが続かない場合にマッチ", category: "group" });
        i += 3;
      } else if (pattern.startsWith("(?<", i)) {
        const nameEnd = pattern.indexOf(">", i + 3);
        if (nameEnd !== -1) {
          const name = pattern.substring(i + 3, nameEnd);
          tokens.push({ raw: `(?<${name}>`, description: `名前付きキャプチャグループ「${name}」開始`, category: "group" });
          i = nameEnd + 1;
        } else {
          tokens.push({ raw: "(?<", description: "名前付きキャプチャグループ（不完全）", category: "group" });
          i += 3;
        }
      } else {
        tokens.push({ raw: "(", description: "キャプチャグループ開始（$1, $2...で参照可能）", category: "group" });
        i += 1;
      }
      continue;
    }

    if (ch === ")") {
      tokens.push({ raw: ")", description: "グループ終了", category: "group" });
      i++;
      continue;
    }

    // ── Quantifier {n,m} ─────────────────────────────────────────
    if (ch === "{") {
      const close = pattern.indexOf("}", i + 1);
      if (close !== -1) {
        const content = pattern.substring(i + 1, close);
        const qm = content.match(/^(\d+)(?:,(\d*))?$/);
        if (qm) {
          const lazy = pattern[close + 1] === "?";
          const raw = pattern.substring(i, close + 1 + (lazy ? 1 : 0));
          const [, min, max] = qm;
          let desc =
            max === undefined
              ? `直前をちょうど${min}回繰り返し`
              : max === ""
                ? `直前を${min}回以上繰り返し`
                : `直前を${min}〜${max}回繰り返し`;
          if (lazy) desc += "（最短マッチ）";
          tokens.push({ raw, description: desc, category: "quantifier" });
          i = close + 1 + (lazy ? 1 : 0);
          continue;
        }
      }
      tokens.push({ raw: ch, description: '文字「{」', category: "literal" });
      i++;
      continue;
    }

    // ── Simple quantifiers ───────────────────────────────────────
    if (ch === "*") {
      const lazy = pattern[i + 1] === "?";
      tokens.push({ raw: lazy ? "*?" : "*", description: lazy ? "直前を0回以上（最短マッチ）" : "直前を0回以上繰り返し（最長マッチ）", category: "quantifier" });
      i += lazy ? 2 : 1;
      continue;
    }
    if (ch === "+") {
      const lazy = pattern[i + 1] === "?";
      tokens.push({ raw: lazy ? "+?" : "+", description: lazy ? "直前を1回以上（最短マッチ）" : "直前を1回以上繰り返し（最長マッチ）", category: "quantifier" });
      i += lazy ? 2 : 1;
      continue;
    }
    if (ch === "?") {
      const lazy = pattern[i + 1] === "?";
      tokens.push({ raw: lazy ? "??" : "?", description: lazy ? "直前を0または1回（最短マッチ）" : "直前を0または1回（省略可能）", category: "quantifier" });
      i += lazy ? 2 : 1;
      continue;
    }

    // ── Anchors ───────────────────────────────────────────────────
    if (ch === "^") {
      tokens.push({ raw: "^", description: "先頭アンカー: 文字列の先頭（mフラグで各行の先頭）", category: "anchor" });
      i++;
      continue;
    }
    if (ch === "$") {
      tokens.push({ raw: "$", description: "末尾アンカー: 文字列の末尾（mフラグで各行の末尾）", category: "anchor" });
      i++;
      continue;
    }

    // ── Dot & Alternation ─────────────────────────────────────────
    if (ch === ".") {
      tokens.push({ raw: ".", description: "任意の1文字（改行を除く。sフラグで改行も含む）", category: "class" });
      i++;
      continue;
    }
    if (ch === "|") {
      tokens.push({ raw: "|", description: "選択（OR）: 左辺または右辺のどちらかにマッチ", category: "special" });
      i++;
      continue;
    }

    // ── Literal ───────────────────────────────────────────────────
    tokens.push({ raw: ch, description: `文字「${ch}」（リテラル）`, category: "literal" });
    i++;
  }

  return tokens;
}

// ===== Sub-components =====

function HighlightedText({
  text,
  regex,
}: {
  text: string;
  regex: RegExp | null;
}) {
  if (!text) {
    return (
      <div className="text-sm text-muted-foreground italic">
        テスト文字列を入力するとここにハイライト表示されます
      </div>
    );
  }

  if (!regex) {
    return (
      <pre className="whitespace-pre-wrap font-mono text-sm break-all">{text}</pre>
    );
  }

  const segments = buildSegments(text, regex);

  return (
    <pre className="whitespace-pre-wrap font-mono text-sm break-all">
      {segments.map((seg, i) =>
        seg.matched ? (
          <mark
            key={i}
            className="bg-yellow-300 dark:bg-yellow-600 rounded-[2px] px-px"
          >
            {seg.text}
          </mark>
        ) : (
          <span key={i}>{seg.text}</span>
        )
      )}
    </pre>
  );
}

// ===== Main Component =====

export function RegexTester() {
  const [pattern, setPattern] = useState("");
  const [flags, setFlags] = useState<FlagsState>({
    g: true,
    i: false,
    m: false,
    s: false,
    u: false,
  });
  const [testStr, setTestStr] = useState("");
  const [replaceStr, setReplaceStr] = useState("");
  const [activeTab, setActiveTab] = useState("matches");
  const [shareMsg, setShareMsg] = useState("");
  const [patternCopied, setPatternCopied] = useState(false);

  // Debounced values (300ms)
  const [dPattern, setDPattern] = useState("");
  const [dTest, setDTest] = useState("");
  const [dReplace, setDReplace] = useState("");

  useEffect(() => {
    const t = setTimeout(() => setDPattern(pattern), 300);
    return () => clearTimeout(t);
  }, [pattern]);

  useEffect(() => {
    const t = setTimeout(() => setDTest(testStr), 300);
    return () => clearTimeout(t);
  }, [testStr]);

  useEffect(() => {
    const t = setTimeout(() => setDReplace(replaceStr), 300);
    return () => clearTimeout(t);
  }, [replaceStr]);

  // Load from URL params on mount
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const p = params.get("p");
    const f = params.get("f");
    const t = params.get("t");
    if (p) setPattern(decodeURIComponent(p));
    if (f) {
      setFlags({
        g: f.includes("g"),
        i: f.includes("i"),
        m: f.includes("m"),
        s: f.includes("s"),
        u: f.includes("u"),
      });
    }
    if (t) setTestStr(decodeURIComponent(t));
  }, []);

  // Derived
  const { regex, error } = useMemo(() => buildRegex(dPattern, flags), [dPattern, flags]);
  const isDangerousPattern = useMemo(() => hasDangerousPattern(dPattern), [dPattern]);
  const matches = useMemo(
    () => (regex && !isDangerousPattern ? getAllMatches(regex, dTest) : []),
    [regex, dTest, isDangerousPattern]
  );
  const tokens = useMemo(() => (dPattern ? tokenizePattern(dPattern) : []), [dPattern]);

  const replacedStr = useMemo(() => {
    if (!regex || !dTest || dReplace === "") return null;
    try {
      return dTest.replace(regex, dReplace);
    } catch {
      return "置換エラー: 無効な置換パターン";
    }
  }, [regex, dTest, dReplace]);

  const flagStr = buildFlagStr(flags);
  const hasGroups = matches.some((m) => m.groups.length > 0);

  const handleLoadPreset = useCallback(
    (p: (typeof PRESETS)[number]) => {
      setPattern(p.pattern);
      setFlags({ ...p.flags });
      setTestStr(p.sample);
    },
    []
  );

  const handleToggleFlag = useCallback((flag: keyof FlagsState) => {
    setFlags((prev) => ({ ...prev, [flag]: !prev[flag] }));
  }, []);

  const handleCopyPattern = useCallback(() => {
    navigator.clipboard.writeText(pattern).then(() => {
      setPatternCopied(true);
      setTimeout(() => setPatternCopied(false), 2000);
    });
  }, [pattern]);

  const handleShare = useCallback(() => {
    const params = new URLSearchParams();
    params.set("p", encodeURIComponent(pattern));
    params.set("f", flagStr);
    params.set("t", encodeURIComponent(testStr.slice(0, 3000)));
    const url =
      window.location.origin +
      window.location.pathname +
      "?" +
      params.toString();
    navigator.clipboard.writeText(url).then(() => {
      setShareMsg("URLをコピーしました");
      setTimeout(() => setShareMsg(""), 2500);
    });
  }, [pattern, flagStr, testStr]);

  return (
    <div className="space-y-5">
      {/* ── プリセット ── */}
      <section>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-medium">プリセット:</span>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {PRESETS.map((p) => (
            <button
              key={p.label}
              type="button"
              onClick={() => handleLoadPreset(p)}
              title={p.description}
              className="text-xs px-2.5 py-1.5 border rounded-md hover:bg-accent transition-colors whitespace-nowrap shrink-0"
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── Section 1: パターン入力 ── */}
      <section className="border rounded-xl p-4 bg-card space-y-3">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-xs text-muted-foreground font-mono shrink-0">/</span>

          {/* Pattern input */}
          <input
            type="text"
            value={pattern}
            onChange={(e) => setPattern(e.target.value)}
            placeholder="正規表現パターンを入力..."
            spellCheck={false}
            className="flex-1 min-w-0 h-9 px-3 text-sm font-mono border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />

          <span className="text-xs text-muted-foreground font-mono shrink-0">
            /{flagStr}
          </span>

          <Button size="sm" variant="outline" onClick={handleCopyPattern}>
            {patternCopied ? "✓" : "コピー"}
          </Button>
          <Button size="sm" variant="outline" onClick={handleShare}>
            {shareMsg || "共有リンク"}
          </Button>
        </div>

        {/* フラグ */}
        <div className="flex flex-wrap gap-2">
          {(["g", "i", "m", "s", "u"] as const).map((f) => (
            <button
              key={f}
              type="button"
              title={FLAG_DESCS[f]}
              onClick={() => handleToggleFlag(f)}
              className={cn(
                "h-7 px-2.5 text-xs font-mono rounded border transition-colors",
                flags[f]
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent"
              )}
            >
              {f}
            </button>
          ))}
          {flagStr && (
            <span className="text-xs text-muted-foreground self-center">
              {(["g", "i", "m", "s", "u"] as const)
                .filter((f) => flags[f])
                .map((f) => FLAG_DESCS[f])
                .join("、")}
            </span>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="text-sm text-destructive bg-destructive/10 rounded-md px-3 py-2 font-mono">
            {error}
          </div>
        )}

        {/* ReDoS 危険パターン警告 */}
        {isDangerousPattern && !error && (
          <div className="text-sm text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-md px-3 py-2">
            ⚠️ このパターンは壊滅的バックトラッキング（ReDoS）を引き起こす可能性があります。自動評価を停止しました。パターンを見直してください（例: <code className="font-mono text-xs">(a+)+</code> は危険です）。
          </div>
        )}
      </section>

      {/* ── Section 2: テスト文字列 ── */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium">テスト文字列</span>
          {regex && !error && (
            <Badge variant={matches.length > 0 ? "default" : "secondary"}>
              {matches.length > 0 ? `${matches.length}件マッチ` : "マッチなし"}
            </Badge>
          )}
        </div>

        <textarea
          value={testStr}
          onChange={(e) => setTestStr(e.target.value)}
          placeholder="テストしたいテキストをここに貼り付けてください..."
          spellCheck={false}
          rows={10}
          className="w-full px-3 py-2 text-sm font-mono border rounded-lg bg-background resize-y focus:outline-none focus:ring-1 focus:ring-ring"
        />

        {/* ハイライトプレビュー */}
        {(regex || testStr) && (
          <div>
            <div className="text-xs text-muted-foreground mb-1.5 flex items-center gap-2">
              マッチハイライト
              {matches.length > 0 && (
                <span className="inline-flex items-center gap-1">
                  <span className="inline-block w-3 h-3 bg-yellow-300 dark:bg-yellow-600 rounded-sm" />
                  <span>= マッチ箇所</span>
                </span>
              )}
            </div>
            <div className="px-3 py-2 border rounded-lg bg-muted/20 min-h-[80px] max-h-64 overflow-y-auto">
              <HighlightedText text={dTest} regex={isDangerousPattern ? null : regex} />
            </div>
          </div>
        )}
      </section>

      {/* ── Section 3: 結果タブ ── */}
      <section>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="flex flex-wrap h-auto gap-1 p-1 w-full justify-start bg-muted rounded-lg">
            <TabsTrigger value="matches" className="text-sm">
              マッチ結果
              {matches.length > 0 && (
                <span className="ml-1.5 text-xs bg-primary/20 text-primary rounded-full px-1.5 py-0.5 leading-none">
                  {matches.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="replace" className="text-sm">
              置換
            </TabsTrigger>
            <TabsTrigger value="explain" className="text-sm">
              解説
              {tokens.length > 0 && (
                <span className="ml-1.5 text-xs bg-primary/20 text-primary rounded-full px-1.5 py-0.5 leading-none">
                  {tokens.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* マッチ結果 */}
          <TabsContent value="matches" className="mt-3">
            {!regex && !error ? (
              <p className="text-sm text-muted-foreground">
                正規表現パターンを入力するとマッチ結果が表示されます。
              </p>
            ) : error ? (
              <p className="text-sm text-destructive">パターンエラーのため結果を表示できません。</p>
            ) : matches.length === 0 ? (
              <p className="text-sm text-muted-foreground">マッチする箇所が見つかりませんでした。</p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-muted/50 text-left">
                      <th className="px-3 py-2 border text-xs font-medium w-10">#</th>
                      <th className="px-3 py-2 border text-xs font-medium w-16">位置</th>
                      <th className="px-3 py-2 border text-xs font-medium">マッチ</th>
                      {hasGroups && (
                        <th className="px-3 py-2 border text-xs font-medium">キャプチャグループ</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {matches.map((m, i) => (
                      <tr key={i} className="border-b hover:bg-muted/20">
                        <td className="px-3 py-2 border text-muted-foreground text-xs tabular-nums">
                          {i + 1}
                        </td>
                        <td className="px-3 py-2 border font-mono text-xs tabular-nums">
                          {m.index}
                        </td>
                        <td className="px-3 py-2 border font-mono">
                          <span className="bg-yellow-200 dark:bg-yellow-700/50 rounded px-1">
                            {m.text || <span className="text-muted-foreground italic">（空文字）</span>}
                          </span>
                        </td>
                        {hasGroups && (
                          <td className="px-3 py-2 border font-mono text-xs">
                            {m.groups.length > 0
                              ? m.groups.map((g, gi) => (
                                  <span key={gi} className="mr-2">
                                    <span className="text-muted-foreground">${gi + 1}:</span>{" "}
                                    {g ?? <span className="text-muted-foreground italic">undefined</span>}
                                  </span>
                                ))
                              : "—"}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {matches.length >= 500 && (
                  <p className="text-xs text-muted-foreground mt-2">
                    ※ 最初の500件を表示しています。
                  </p>
                )}
              </div>
            )}
          </TabsContent>

          {/* 置換 */}
          <TabsContent value="replace" className="mt-3 space-y-3">
            <div>
              <label className="text-sm font-medium mb-1.5 block">
                置換パターン
              </label>
              <p className="text-xs text-muted-foreground mb-2">
                キャプチャグループは $1, $2 ... で参照できます。
                gフラグがオンの場合は全件置換、オフの場合は最初の1件のみ置換します。
              </p>
              <input
                type="text"
                value={replaceStr}
                onChange={(e) => setReplaceStr(e.target.value)}
                placeholder="例: $1-$2（グループ参照）"
                spellCheck={false}
                className="w-full h-9 px-3 text-sm font-mono border rounded-md bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>

            {replacedStr !== null && (
              <div>
                <div className="text-sm font-medium mb-1.5">置換結果プレビュー</div>
                <pre className="px-3 py-2 border rounded-lg bg-muted/20 text-sm font-mono whitespace-pre-wrap break-all min-h-[80px] max-h-64 overflow-y-auto">
                  {replacedStr}
                </pre>
              </div>
            )}

            {replacedStr === null && (
              <p className="text-sm text-muted-foreground">
                置換パターンを入力すると置換結果が表示されます。
              </p>
            )}
          </TabsContent>

          {/* 解説 */}
          <TabsContent value="explain" className="mt-3">
            {tokens.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                正規表現パターンを入力すると各トークンの日本語解説が表示されます。
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-muted-foreground mb-3">
                  パターン「{dPattern}」のトークン解析（{tokens.length}件）
                </p>

                {/* Legend */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {(
                    [
                      ["escape", "エスケープ"],
                      ["class", "文字クラス"],
                      ["quantifier", "量指定子"],
                      ["anchor", "アンカー"],
                      ["group", "グループ"],
                      ["special", "特殊"],
                      ["literal", "リテラル"],
                    ] as [RegexToken["category"], string][]
                  ).map(([cat, label]) => (
                    <span
                      key={cat}
                      className={cn("text-xs px-2 py-0.5 rounded border", CATEGORY_COLOR[cat])}
                    >
                      {label}
                    </span>
                  ))}
                </div>

                <div className="space-y-1">
                  {tokens.map((token, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-3 py-1.5 border-b last:border-0"
                    >
                      <code
                        className={cn(
                          "shrink-0 text-xs font-mono px-2 py-1 rounded border min-w-[40px] text-center",
                          CATEGORY_COLOR[token.category]
                        )}
                      >
                        {token.raw}
                      </code>
                      <span className="text-sm text-foreground/80 pt-0.5">
                        {token.description}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </section>
    </div>
  );
}
