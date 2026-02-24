'use client';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';

interface AxisData {
  name: string;
  personal: number;
  team: number;
}

interface Props {
  data: AxisData[];
}

export default function PersonalVsTeamRadarChart({ data }: Props) {
  const worst = data.reduce((min, d) => (d.personal - d.team < min.diff ? { name: d.name, diff: d.personal - d.team } : min), { name: '', diff: 0 });

  return (
    <div className="space-y-4">
      <ResponsiveContainer width="100%" height={260}>
        <RadarChart data={data}>
          <PolarGrid stroke="#e7e5e4" />
          <PolarAngleAxis dataKey="name" tick={{ fontSize: 11, fill: '#78716c' }} />
          <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
          <Radar
            name="チーム平均"
            dataKey="team"
            stroke="#a8a29e"
            fill="#a8a29e"
            fillOpacity={0.15}
            strokeDasharray="4 2"
          />
          <Radar
            name="自分"
            dataKey="personal"
            stroke="#6366f1"
            fill="#6366f1"
            fillOpacity={0.25}
          />
          <Legend wrapperStyle={{ fontSize: 11 }} />
          <Tooltip
            contentStyle={{ borderRadius: '12px', border: '1px solid #e7e5e4', fontSize: 12 }}
          />
        </RadarChart>
      </ResponsiveContainer>

      {/* 差分テーブル */}
      <div className="border border-stone-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-stone-50 text-stone-500 text-xs">
              <th className="text-left px-4 py-2 font-medium">評価軸</th>
              <th className="text-center px-3 py-2 font-medium">自分</th>
              <th className="text-center px-3 py-2 font-medium">チーム</th>
              <th className="text-center px-3 py-2 font-medium">差</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => {
              const diff = row.personal - row.team;
              return (
                <tr key={row.name} className="border-t border-stone-100">
                  <td className="px-4 py-2 text-stone-700">{row.name}</td>
                  <td className="text-center px-3 py-2 font-medium text-indigo-600">{row.personal}</td>
                  <td className="text-center px-3 py-2 text-stone-500">{row.team}</td>
                  <td className={`text-center px-3 py-2 font-medium ${diff < -5 ? 'text-red-500' : diff > 0 ? 'text-emerald-600' : 'text-stone-500'}`}>
                    {diff > 0 ? `+${diff}` : diff}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {worst.diff < -5 && (
        <div className="bg-indigo-50 rounded-xl px-4 py-3 text-sm text-indigo-700">
          💡 <span className="font-medium">{worst.name}</span>がチーム平均より{Math.abs(worst.diff)}pt低め。改善案を参考にしてみましょう
        </div>
      )}
    </div>
  );
}
