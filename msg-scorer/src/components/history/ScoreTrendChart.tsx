'use client';
import { LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { type HistoryRecord } from '@/lib/db/score-history';

export default function ScoreTrendChart({ records }: { records: HistoryRecord[] }) {
  if (records.length < 2) {
    return (
      <p className="text-sm text-stone-400 text-center py-6">
        2件以上の履歴があるとスコア推移が表示されます
      </p>
    );
  }

  const data = [...records]
    .reverse()
    .slice(-20)
    .map((r) => ({
      date:  new Date(r.created_at).toLocaleDateString('ja-JP', { month: 'numeric', day: 'numeric' }),
      score: r.result.totalScore,
    }));

  return (
    <ResponsiveContainer width="100%" height={180}>
      <LineChart data={data} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#a8a29e' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#a8a29e' }} />
        <Tooltip
          contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #e7e5e4' }}
          formatter={(value: number | undefined) => [value ?? 0, 'スコア']}
        />
        <Line
          type="monotone"
          dataKey="score"
          stroke="#4f46e5"
          strokeWidth={2}
          dot={{ fill: '#4f46e5', r: 3 }}
          activeDot={{ r: 5 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
