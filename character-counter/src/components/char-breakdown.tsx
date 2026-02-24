interface CharBreakdownProps {
  breakdown: {
    hiragana: number;
    katakana: number;
    kanji: number;
    alphanumeric: number;
    symbols: number;
  };
}

const labels: { key: keyof CharBreakdownProps["breakdown"]; label: string; color: string }[] = [
  { key: "hiragana", label: "ひらがな", color: "bg-blue-500" },
  { key: "katakana", label: "カタカナ", color: "bg-green-500" },
  { key: "kanji", label: "漢字", color: "bg-purple-500" },
  { key: "alphanumeric", label: "英数字", color: "bg-orange-500" },
  { key: "symbols", label: "記号", color: "bg-pink-500" },
];

export function CharBreakdown({ breakdown }: CharBreakdownProps) {
  const total = Object.values(breakdown).reduce((a, b) => a + b, 0);

  return (
    <div className="rounded-lg border bg-card p-4 shadow-sm">
      <p className="mb-3 text-sm font-medium text-muted-foreground">
        文字種別内訳
      </p>

      {total > 0 && (
        <div className="mb-3 flex h-3 overflow-hidden rounded-full bg-muted">
          {labels.map(({ key, color }) => {
            const pct = (breakdown[key] / total) * 100;
            if (pct === 0) return null;
            return (
              <div
                key={key}
                className={`${color} transition-all duration-300`}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>
      )}

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {labels.map(({ key, label, color }) => (
          <div key={key} className="flex items-center gap-2 text-sm">
            <span className={`inline-block h-3 w-3 rounded-full ${color}`} />
            <span className="text-muted-foreground">{label}</span>
            <span className="ml-auto font-medium tabular-nums">
              {breakdown[key]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
