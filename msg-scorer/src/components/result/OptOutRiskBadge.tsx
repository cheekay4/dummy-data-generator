'use client';
import { useState } from 'react';
import { type OptOutRiskResult } from '@/lib/opt-out-risk';

const LEVEL_STYLE = {
  low:    { bg: 'bg-emerald-50 border-emerald-200', badge: 'bg-emerald-100 text-emerald-700', icon: '✅', label: '低' },
  medium: { bg: 'bg-amber-50 border-amber-200',     badge: 'bg-amber-100 text-amber-700',     icon: '⚠️', label: '中' },
  high:   { bg: 'bg-red-50 border-red-300',          badge: 'bg-red-100 text-red-700',          icon: '🚨', label: '高' },
} as const;

interface Props {
  risk: OptOutRiskResult;
}

export default function OptOutRiskBadge({ risk }: Props) {
  const [expanded, setExpanded] = useState(false);
  const s = LEVEL_STYLE[risk.level];

  if (risk.level === 'low' && risk.reasons.length === 0) return null;

  return (
    <div className={`border rounded-xl p-4 ${s.bg}`}>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-3"
      >
        <div className="flex items-center gap-2">
          <span>{s.icon}</span>
          <span className="text-sm font-semibold text-stone-800">配信停止リスク</span>
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${s.badge}`}>
            {s.label}
          </span>
          {risk.level !== 'low' && (
            <span className="text-xs text-stone-500">
              ({risk.reasons.length}件の懸念)
            </span>
          )}
        </div>
        {risk.reasons.length > 0 && (
          <span className="text-xs text-stone-400">{expanded ? '▲ 閉じる' : '▼ 詳細'}</span>
        )}
      </button>

      {expanded && risk.reasons.length > 0 && (
        <ul className="mt-3 space-y-1.5 pl-1">
          {risk.reasons.map((r, i) => (
            <li key={i} className="flex items-start gap-2 text-xs text-stone-700">
              <span className="shrink-0 text-stone-400 font-bold">{i + 1}.</span>
              {r}
            </li>
          ))}
        </ul>
      )}

      {risk.level === 'low' && risk.reasons.length > 0 && !expanded && (
        <p className="text-xs text-emerald-700 mt-1">
          軽微な懸念点があります。詳細を確認してください。
        </p>
      )}
    </div>
  );
}
