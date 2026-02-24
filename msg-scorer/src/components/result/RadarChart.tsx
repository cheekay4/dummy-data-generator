'use client';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import { ScoreAxis } from '@/lib/types';

interface Props {
  axes: ScoreAxis[];
}

export default function RadarChart({ axes }: Props) {
  const data = axes.map((a) => ({ subject: a.name, score: a.score }));

  return (
    <div className="w-full max-w-sm mx-auto">
      <ResponsiveContainer width="100%" height={280}>
        <RechartsRadarChart data={data}>
          <PolarGrid stroke="#E7E5E4" />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 11, fill: '#78716C', fontFamily: 'var(--font-noto, sans-serif)' }}
          />
          <PolarRadiusAxis
            angle={18}
            domain={[0, 100]}
            tick={{ fontSize: 9, fill: '#A8A29E' }}
            tickCount={4}
          />
          <Radar
            dataKey="score"
            stroke="#4F46E5"
            fill="#4F46E5"
            fillOpacity={0.2}
            strokeWidth={2}
            dot={{ r: 4, fill: '#4338CA', strokeWidth: 0 }}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
    </div>
  );
}
