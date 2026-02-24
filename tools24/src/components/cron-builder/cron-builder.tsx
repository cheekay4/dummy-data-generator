"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ===== Types =====

type FieldMode = "every" | "specific" | "range" | "step";
type FieldKey = "minute" | "hour" | "day" | "month" | "weekday";

interface FieldState {
  mode: FieldMode;
  specific: number[];
  rangeFrom: number;
  rangeTo: number;
  step: number;
}

interface FieldsState {
  minute: FieldState;
  hour: FieldState;
  day: FieldState;
  month: FieldState;
  weekday: FieldState;
}

// ===== Constants =====

const WEEKDAY_JA = ["日", "月", "火", "水", "木", "金", "土"] as const;
const MONTH_SUFFIX = ["", "1月", "2月", "3月", "4月", "5月", "6月", "7月", "8月", "9月", "10月", "11月", "12月"] as const;

const FIELD_CONFIG: Record<
  FieldKey,
  {
    label: string;
    desc: string;
    min: number;
    max: number;
    defaultRangeFrom: number;
    defaultRangeTo: number;
    defaultStep: number;
    optionLabel: (n: number) => string;
    stepUnit: string;
  }
> = {
  minute: {
    label: "分",
    desc: "0〜59",
    min: 0,
    max: 59,
    defaultRangeFrom: 0,
    defaultRangeTo: 59,
    defaultStep: 5,
    optionLabel: (n) => String(n).padStart(2, "0"),
    stepUnit: "分ごと",
  },
  hour: {
    label: "時",
    desc: "0〜23",
    min: 0,
    max: 23,
    defaultRangeFrom: 0,
    defaultRangeTo: 23,
    defaultStep: 1,
    optionLabel: (n) => String(n).padStart(2, "0"),
    stepUnit: "時間ごと",
  },
  day: {
    label: "日",
    desc: "1〜31",
    min: 1,
    max: 31,
    defaultRangeFrom: 1,
    defaultRangeTo: 31,
    defaultStep: 1,
    optionLabel: (n) => String(n),
    stepUnit: "日ごと",
  },
  month: {
    label: "月",
    desc: "1〜12",
    min: 1,
    max: 12,
    defaultRangeFrom: 1,
    defaultRangeTo: 12,
    defaultStep: 1,
    optionLabel: (n) => MONTH_SUFFIX[n] ?? String(n),
    stepUnit: "ヶ月ごと",
  },
  weekday: {
    label: "曜日",
    desc: "0=日〜6=土",
    min: 0,
    max: 6,
    defaultRangeFrom: 1,
    defaultRangeTo: 5,
    defaultStep: 1,
    optionLabel: (n) => (WEEKDAY_JA[n] ?? String(n)) + "曜日",
    stepUnit: "曜日ごと",
  },
};

const FIELD_KEYS: FieldKey[] = ["minute", "hour", "day", "month", "weekday"];

const MODE_LABELS: Record<FieldMode, string> = {
  every: "毎回 (*)",
  specific: "指定値",
  range: "範囲",
  step: "間隔",
};

const PRESETS: { label: string; expr: string; note?: string }[] = [
  { label: "毎分", expr: "* * * * *" },
  { label: "毎時0分", expr: "0 * * * *" },
  { label: "毎日午前9時（JST）", expr: "0 0 * * *", note: "UTCサーバーの場合、この式は午前0時実行になります" },
  { label: "毎週月曜9時（JST）", expr: "0 0 * * 1" },
  { label: "毎月1日0時", expr: "0 0 1 * *" },
  { label: "平日9時（JST）", expr: "0 0 * * 1-5" },
  { label: "月末（28日）", expr: "0 0 28 * *" },
  { label: "四半期初日", expr: "0 0 1 1,4,7,10 *" },
];

// ===== Logic =====

function defaultField(key: FieldKey): FieldState {
  const cfg = FIELD_CONFIG[key];
  return {
    mode: "every",
    specific: [],
    rangeFrom: cfg.defaultRangeFrom,
    rangeTo: cfg.defaultRangeTo,
    step: cfg.defaultStep,
  };
}

function defaultFields(): FieldsState {
  return {
    minute: defaultField("minute"),
    hour: defaultField("hour"),
    day: defaultField("day"),
    month: defaultField("month"),
    weekday: defaultField("weekday"),
  };
}

function fieldToExpr(field: FieldState): string {
  switch (field.mode) {
    case "every":
      return "*";
    case "specific":
      return field.specific.length === 0
        ? "*"
        : [...field.specific].sort((a, b) => a - b).join(",");
    case "range":
      return `${field.rangeFrom}-${field.rangeTo}`;
    case "step":
      return `*/${field.step}`;
  }
}

function fieldsToExpr(fields: FieldsState): string {
  return FIELD_KEYS.map((k) => fieldToExpr(fields[k])).join(" ");
}

function parseFieldValues(expr: string, min: number, max: number): number[] {
  const values = new Set<number>();
  for (const part of expr.split(",")) {
    const trimmed = part.trim();
    if (trimmed === "*") {
      for (let i = min; i <= max; i++) values.add(i);
    } else if (trimmed.includes("/")) {
      const [rangeStr, stepStr] = trimmed.split("/");
      const step = parseInt(stepStr, 10);
      if (isNaN(step) || step <= 0) continue;
      let start = min;
      let end = max;
      if (rangeStr !== "*") {
        if (rangeStr.includes("-")) {
          const [a, b] = rangeStr.split("-").map(Number);
          start = a;
          end = b;
        } else {
          start = parseInt(rangeStr, 10);
        }
      }
      for (let i = start; i <= end; i += step) values.add(i);
    } else if (trimmed.includes("-")) {
      const [a, b] = trimmed.split("-").map(Number);
      if (!isNaN(a) && !isNaN(b)) {
        for (let i = a; i <= b; i++) values.add(i);
      }
    } else {
      const n = parseInt(trimmed, 10);
      if (!isNaN(n)) values.add(n);
    }
  }
  return Array.from(values).sort((a, b) => a - b);
}

function getNextRuns(expr: string, count: number, tz: "JST" | "UTC"): Date[] {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return [];

  const [minE, hourE, dayE, monthE, wdE] = parts;

  try {
    const validMinutes = parseFieldValues(minE, 0, 59);
    const validHours = parseFieldValues(hourE, 0, 23);
    const validDays = parseFieldValues(dayE, 1, 31);
    const validMonths = parseFieldValues(monthE, 1, 12);
    const validWeekdays = parseFieldValues(wdE, 0, 6);
    // 7 = Sunday (same as 0)
    if (parseFieldValues(wdE, 0, 7).includes(7) && !validWeekdays.includes(0)) {
      validWeekdays.push(0);
    }

    if (!validMinutes.length || !validHours.length) return [];

    const tzOffsetMs = tz === "JST" ? 9 * 60 * 60_000 : 0;
    // Work in tz-local time by applying offset to UTC epoch
    const nowTz = Date.now() + tzOffsetMs;
    // Start from next minute, aligned to minute boundary
    let curTz = nowTz + 60_000;
    curTz -= curTz % 60_000;

    const maxTz = nowTz + 366 * 24 * 3_600_000;
    const results: Date[] = [];

    while (results.length < count && curTz <= maxTz) {
      const d = new Date(curTz);

      const mo = d.getUTCMonth() + 1;
      if (!validMonths.includes(mo)) {
        const next = new Date(curTz);
        next.setUTCMonth(next.getUTCMonth() + 1, 1);
        next.setUTCHours(0, 0, 0, 0);
        curTz = next.getTime();
        continue;
      }

      const day = d.getUTCDate();
      const wd = d.getUTCDay();
      const dayOk = validDays.includes(day) && validWeekdays.includes(wd);
      if (!dayOk) {
        const next = new Date(curTz);
        next.setUTCDate(next.getUTCDate() + 1);
        next.setUTCHours(0, 0, 0, 0);
        curTz = next.getTime();
        continue;
      }

      const h = d.getUTCHours();
      if (!validHours.includes(h)) {
        const next = new Date(curTz);
        next.setUTCHours(next.getUTCHours() + 1, 0, 0, 0);
        curTz = next.getTime();
        continue;
      }

      const mi = d.getUTCMinutes();
      if (validMinutes.includes(mi)) {
        // Convert back to real UTC
        results.push(new Date(curTz - tzOffsetMs));
      }

      curTz += 60_000;
    }

    return results;
  } catch {
    return [];
  }
}

function formatDate(utcDate: Date, tz: "JST" | "UTC"): string {
  const offsetMs = tz === "JST" ? 9 * 3_600_000 : 0;
  const d = new Date(utcDate.getTime() + offsetMs);
  const wd = WEEKDAY_JA[d.getUTCDay()] ?? "?";
  const y = d.getUTCFullYear();
  const mo = String(d.getUTCMonth() + 1).padStart(2, "0");
  const day = String(d.getUTCDate()).padStart(2, "0");
  const h = String(d.getUTCHours()).padStart(2, "0");
  const mi = String(d.getUTCMinutes()).padStart(2, "0");
  return `${y}/${mo}/${day}（${wd}）${h}:${mi} ${tz}`;
}

function fieldToJa(expr: string, key: FieldKey): string {
  if (expr === "*") {
    return { minute: "毎分", hour: "毎時", day: "毎日", month: "毎月", weekday: "毎曜日" }[key];
  }

  const stepM = expr.match(/^\*\/(\d+)$/);
  if (stepM) {
    const n = stepM[1];
    return {
      minute: `${n}分ごと`,
      hour: `${n}時間ごと`,
      day: `${n}日ごと`,
      month: `${n}ヶ月ごと`,
      weekday: `${n}曜日ごと`,
    }[key];
  }

  const rangeM = expr.match(/^(\d+)-(\d+)$/);
  if (rangeM) {
    const [, from, to] = rangeM;
    if (key === "weekday") {
      return `${WEEKDAY_JA[parseInt(from)] ?? from}〜${WEEKDAY_JA[parseInt(to)] ?? to}曜日`;
    }
    const suffix = { minute: "分", hour: "時", day: "日", month: "月", weekday: "" }[key];
    return `${from}〜${to}${suffix}`;
  }

  if (expr.includes(",")) {
    const vals = expr.split(",");
    if (key === "weekday") {
      return vals.map((v) => (WEEKDAY_JA[parseInt(v)] ?? v) + "曜日").join("・");
    }
    const suffix = { minute: "分", hour: "時", day: "日", month: "月", weekday: "" }[key];
    return vals.join("・") + suffix;
  }

  const n = parseInt(expr, 10);
  if (!isNaN(n)) {
    if (key === "weekday") return (WEEKDAY_JA[n] ?? expr) + "曜日";
    const suffix = { minute: "分", hour: "時", day: "日", month: "月", weekday: "" }[key];
    return `${n}${suffix}`;
  }

  return expr;
}

function cronToJapanese(expr: string): string {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return "無効なCron式（スペース区切りで5フィールド必要）";

  const [min, hour, day, month, wd] = parts;

  if (expr === "* * * * *") return "毎分実行";

  const segs: string[] = [];

  if (month !== "*") segs.push(fieldToJa(month, "month") + "の");

  if (day !== "*" && wd !== "*") {
    segs.push(fieldToJa(day, "day") + "かつ" + fieldToJa(wd, "weekday") + "の");
  } else if (day !== "*") {
    segs.push(fieldToJa(day, "day") + "の");
  } else if (wd !== "*") {
    segs.push(fieldToJa(wd, "weekday") + "の");
  }

  if (hour === "*" && min === "*") {
    segs.push("毎分");
  } else if (hour === "*") {
    segs.push("毎時" + fieldToJa(min, "minute") + "に");
  } else if (min === "*") {
    segs.push(fieldToJa(hour, "hour") + "の毎分に");
  } else {
    segs.push(fieldToJa(hour, "hour") + fieldToJa(min, "minute") + "に");
  }

  segs.push("実行");
  return segs.join("");
}

function exprToFields(expr: string): FieldsState | null {
  const parts = expr.trim().split(/\s+/);
  if (parts.length !== 5) return null;

  const result = defaultFields();
  const keys: FieldKey[] = ["minute", "hour", "day", "month", "weekday"];

  for (let i = 0; i < 5; i++) {
    const key = keys[i];
    const part = parts[i];
    const cfg = FIELD_CONFIG[key];

    if (part === "*") {
      result[key] = { ...defaultField(key), mode: "every" };
    } else if (/^\*\/\d+$/.test(part)) {
      result[key] = {
        ...defaultField(key),
        mode: "step",
        step: parseInt(part.split("/")[1], 10),
      };
    } else if (/^\d+-\d+$/.test(part)) {
      const [a, b] = part.split("-").map(Number);
      result[key] = { ...defaultField(key), mode: "range", rangeFrom: a, rangeTo: b };
    } else {
      const values = parseFieldValues(part, cfg.min, cfg.max);
      result[key] = { ...defaultField(key), mode: "specific", specific: values };
    }
  }

  return result;
}

// ===== Sub-components =====

function FieldEditor({
  fieldKey,
  value,
  onChange,
}: {
  fieldKey: FieldKey;
  value: FieldState;
  onChange: (v: FieldState) => void;
}) {
  const cfg = FIELD_CONFIG[fieldKey];
  const options = Array.from({ length: cfg.max - cfg.min + 1 }, (_, i) => cfg.min + i);
  const expr = fieldToExpr(value);

  return (
    <div className="border rounded-lg p-3 bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <span className="font-semibold text-sm">{cfg.label}</span>
        <span className="text-xs text-muted-foreground">{cfg.desc}</span>
        <code className="ml-auto text-xs bg-muted px-1.5 py-0.5 rounded font-mono">
          {expr}
        </code>
      </div>

      {/* Mode selector */}
      <div className="flex flex-wrap gap-1 mb-3">
        {(["every", "specific", "range", "step"] as FieldMode[]).map((mode) => (
          <button
            key={mode}
            type="button"
            onClick={() => onChange({ ...value, mode })}
            className={cn(
              "text-xs px-2 py-1 rounded border transition-colors",
              value.mode === mode
                ? "bg-primary text-primary-foreground border-primary"
                : "border-input hover:bg-accent"
            )}
          >
            {MODE_LABELS[mode]}
          </button>
        ))}
      </div>

      {/* Mode content */}
      {value.mode === "every" && (
        <p className="text-xs text-muted-foreground">すべての値 (*)</p>
      )}

      {value.mode === "specific" && (
        <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto p-1 -m-1">
          {options.map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => {
                const prev = value.specific;
                const next = prev.includes(n)
                  ? prev.filter((v) => v !== n)
                  : [...prev, n].sort((a, b) => a - b);
                onChange({ ...value, specific: next });
              }}
              className={cn(
                "h-6 min-w-[28px] px-1 text-xs rounded border transition-colors shrink-0",
                value.specific.includes(n)
                  ? "bg-primary text-primary-foreground border-primary"
                  : "border-input hover:bg-accent"
              )}
            >
              {cfg.optionLabel(n)}
            </button>
          ))}
        </div>
      )}

      {value.mode === "range" && (
        <div className="flex items-center gap-2 flex-wrap">
          <input
            type="number"
            min={cfg.min}
            max={cfg.max}
            value={value.rangeFrom}
            onChange={(e) =>
              onChange({
                ...value,
                rangeFrom: Math.max(cfg.min, Math.min(cfg.max, Number(e.target.value))),
              })
            }
            className="w-16 h-8 px-2 text-sm border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <span className="text-sm text-muted-foreground">〜</span>
          <input
            type="number"
            min={cfg.min}
            max={cfg.max}
            value={value.rangeTo}
            onChange={(e) =>
              onChange({
                ...value,
                rangeTo: Math.max(cfg.min, Math.min(cfg.max, Number(e.target.value))),
              })
            }
            className="w-16 h-8 px-2 text-sm border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
        </div>
      )}

      {value.mode === "step" && (
        <div className="flex items-center gap-2">
          <span className="text-sm font-mono text-muted-foreground">*/</span>
          <input
            type="number"
            min={1}
            max={cfg.max}
            value={value.step}
            onChange={(e) =>
              onChange({ ...value, step: Math.max(1, Number(e.target.value)) })
            }
            className="w-16 h-8 px-2 text-sm border rounded bg-background focus:outline-none focus:ring-1 focus:ring-ring"
          />
          <span className="text-sm text-muted-foreground">{cfg.stepUnit}</span>
        </div>
      )}
    </div>
  );
}

// ===== Main Component =====

export function CronBuilder() {
  const [fields, setFields] = useState<FieldsState>(defaultFields);
  const [parseInput, setParseInput] = useState("");
  const [timezone, setTimezone] = useState<"JST" | "UTC">("JST");
  const [copied, setCopied] = useState(false);
  // Next runs uses useEffect to avoid SSR/hydration mismatch with Date.now()
  const [nextRuns, setNextRuns] = useState<Date[]>([]);

  const cronExpr = useMemo(() => fieldsToExpr(fields), [fields]);
  const explanation = useMemo(() => cronToJapanese(cronExpr), [cronExpr]);
  const parseExplanation = useMemo(
    () => (parseInput.trim() ? cronToJapanese(parseInput.trim()) : ""),
    [parseInput]
  );

  useEffect(() => {
    setNextRuns(getNextRuns(cronExpr, 5, timezone));
  }, [cronExpr, timezone]);

  const handleFieldChange = useCallback((key: FieldKey, value: FieldState) => {
    setFields((prev) => ({ ...prev, [key]: value }));
  }, []);

  const handlePreset = useCallback((expr: string) => {
    const parsed = exprToFields(expr);
    if (parsed) setFields(parsed);
  }, []);

  const handleCopy = useCallback(() => {
    navigator.clipboard.writeText(cronExpr).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, [cronExpr]);

  return (
    <div className="space-y-8">
      {/* ── プリセット ── */}
      <section>
        <h2 className="text-base font-semibold mb-3">プリセット</h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.expr}
              type="button"
              onClick={() => handlePreset(p.expr)}
              title={p.note ?? p.expr}
              className="px-3 py-1.5 text-sm border rounded-md hover:bg-accent transition-colors"
            >
              {p.label}
            </button>
          ))}
        </div>
      </section>

      {/* ── ビジュアルビルダー ── */}
      <section>
        <h2 className="text-base font-semibold mb-3">ビジュアルビルダー</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 mb-5">
          {FIELD_KEYS.map((key) => (
            <FieldEditor
              key={key}
              fieldKey={key}
              value={fields[key]}
              onChange={(v) => handleFieldChange(key, v)}
            />
          ))}
        </div>

        {/* 生成された式・説明・次回実行 */}
        <div className="border rounded-xl p-5 bg-muted/20 space-y-4">
          {/* Expression + copy */}
          <div className="flex items-center gap-3 flex-wrap">
            <code className="text-2xl font-mono font-bold tracking-widest">
              {cronExpr}
            </code>
            <Button
              size="sm"
              variant="outline"
              onClick={handleCopy}
              className="shrink-0"
            >
              {copied ? "✓ コピー済み" : "コピー"}
            </Button>
          </div>

          {/* Japanese explanation */}
          <div className="flex items-start gap-2 text-sm">
            <span className="text-muted-foreground shrink-0">日本語説明:</span>
            <span className="font-medium">{explanation}</span>
          </div>

          {/* JST/UTC toggle */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-medium">次回実行予定（5件）:</span>
              <div className="flex border rounded-md overflow-hidden text-xs">
                {(["JST", "UTC"] as const).map((tz) => (
                  <button
                    key={tz}
                    type="button"
                    onClick={() => setTimezone(tz)}
                    className={cn(
                      "px-3 py-1.5 font-medium transition-colors",
                      timezone === tz
                        ? "bg-primary text-primary-foreground"
                        : "hover:bg-accent"
                    )}
                  >
                    {tz}
                  </button>
                ))}
              </div>
            </div>

            {timezone === "JST" && (
              <p className="text-xs text-muted-foreground">
                JST (UTC+9) 表示です。サーバーが UTC の場合、
                <strong>時フィールドの値はUTC基準で設定</strong>してください（例: JST午前9時 = UTC 0時）。
              </p>
            )}

            {nextRuns.length > 0 ? (
              <ol className="space-y-1.5">
                {nextRuns.map((d, i) => (
                  <li key={i} className="flex items-center gap-2 text-sm">
                    <span className="text-muted-foreground text-xs tabular-nums w-4">
                      {i + 1}.
                    </span>
                    <code className="font-mono">{formatDate(d, timezone)}</code>
                  </li>
                ))}
              </ol>
            ) : (
              <p className="text-sm text-muted-foreground">計算中...</p>
            )}
          </div>
        </div>
      </section>

      {/* ── Cron式 → 日本語 ── */}
      <section>
        <h2 className="text-base font-semibold mb-3">Cron式 → 日本語に変換</h2>
        <p className="text-sm text-muted-foreground mb-3">
          既存のCron式を貼り付けると日本語で説明します。
        </p>
        <textarea
          value={parseInput}
          onChange={(e) => setParseInput(e.target.value)}
          placeholder="例: 0 0 * * 1-5"
          className="w-full h-16 px-3 py-2 text-sm font-mono border rounded-lg bg-background resize-none focus:outline-none focus:ring-1 focus:ring-ring"
          spellCheck={false}
        />
        {parseExplanation && (
          <div
            className={cn(
              "mt-2 px-4 py-3 border rounded-lg text-sm",
              parseExplanation.startsWith("無効")
                ? "bg-destructive/10 border-destructive/30 text-destructive"
                : "bg-muted/30"
            )}
          >
            <span className="font-medium">説明: </span>
            {parseExplanation}
          </div>
        )}
      </section>
    </div>
  );
}
