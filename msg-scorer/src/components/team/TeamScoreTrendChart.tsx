'use client';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ReferenceLine, ResponsiveContainer,
} from 'recharts';

interface DataPoint {
  date: string;
  [key: string]: string | number;
}

interface Props {
  data: DataPoint[];
  memberEmails: string[];
  minThreshold?: number;
}

const COLORS = ['#6366f1', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16'];

export default function TeamScoreTrendChart({ data, memberEmails, minThreshold }: Props) {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#e7e5e4" />
        <XAxis dataKey="date" tick={{ fontSize: 11, fill: '#78716c' }} />
        <YAxis domain={[0, 100]} tick={{ fontSize: 11, fill: '#78716c' }} />
        <Tooltip
          contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: 12 }}
          formatter={(value: number | undefined) => [value ?? 0, 'スコア']}
        />
        <Legend wrapperStyle={{ fontSize: 11 }} />
        {minThreshold && (
          <ReferenceLine
            y={minThreshold}
            stroke="#ef4444"
            strokeDasharray="4 2"
            label={{ value: `最低ライン ${minThreshold}`, position: 'right', fontSize: 10, fill: '#ef4444' }}
          />
        )}
        {memberEmails.map((email, i) => (
          <Line
            key={email}
            type="monotone"
            dataKey={email}
            name={email.split('@')[0]}
            stroke={COLORS[i % COLORS.length]}
            strokeWidth={1.5}
            dot={false}
            connectNulls={false}
          />
        ))}
        <Line
          type="monotone"
          dataKey="チーム平均"
          stroke="#1c1917"
          strokeWidth={2.5}
          dot={false}
          connectNulls={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
