'use client';
import { useState, useEffect } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import type { TeamFeedbackStats } from '@/lib/types';

const CHANNEL_LABEL: Record<string, string> = {
  'email-subject': 'メール件名',
  'email-body':    'メール本文',
  'line':          'LINE',
};

export default function FeedbackTrend() {
  const [stats, setStats] = useState<TeamFeedbackStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/team/feedback')
      .then(r => r.json())
      .then(d => setStats(d.stats ?? null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-8 text-center text-stone-400 text-sm">
        データを読み込み中...
      </div>
    );
  }

  if (!stats || stats.total === 0) {
    return (
      <div className="bg-white rounded-2xl border border-stone-200 p-10 text-center">
        <p className="text-stone-400 text-sm">フィードバックがまだありません。</p>
        <p className="text-stone-300 text-xs mt-1">
          メンバーがスコアリング後に「役立った / 改善が必要」を送ると、ここに集計されます。
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* サマリーカード */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs text-stone-400 mb-1">フィードバック総数</p>
          <p className="text-2xl font-bold text-stone-900">
            {stats.total}<span className="text-sm text-stone-400 ml-1">件</span>
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs text-stone-400 mb-1">👍 役立った率</p>
          <p className={`text-2xl font-bold ${stats.positiveRate >= 70 ? 'text-emerald-600' : stats.positiveRate >= 50 ? 'text-amber-600' : 'text-red-500'}`}>
            {stats.positiveRate}<span className="text-sm ml-1">%</span>
          </p>
          <p className="text-xs text-stone-400 mt-0.5">{stats.positive} / {stats.total} 件</p>
        </div>
        <div className="bg-white rounded-2xl border border-stone-200 p-5">
          <p className="text-xs text-stone-400 mb-1">👎 改善が必要</p>
          <p className="text-2xl font-bold text-stone-900">
            {stats.total - stats.positive}<span className="text-sm text-stone-400 ml-1">件</span>
          </p>
        </div>
      </div>

      {/* 週次トレンドチャート */}
      {stats.weeklyTrend.length > 1 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">週次「役立った」率の推移</h2>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={stats.weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f5f5f4" />
              <XAxis dataKey="week" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} unit="%" />
              <Tooltip
                formatter={(value: number | undefined) => [`${value ?? 0}%`, '役立った率']}
              />
              <Line
                type="monotone"
                dataKey="positiveRate"
                name="役立った率"
                stroke="#10b981"
                strokeWidth={2}
                dot={{ r: 4, fill: '#10b981' }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 最近のフィードバック */}
      {stats.recent.length > 0 && (
        <div className="bg-white rounded-2xl border border-stone-200 p-6">
          <h2 className="text-sm font-semibold text-stone-700 mb-4">最近のフィードバック</h2>
          <div className="space-y-0">
            {stats.recent.map(f => (
              <div
                key={f.id}
                className="flex items-start gap-3 py-3 border-b border-stone-100 last:border-0"
              >
                <span className="text-lg shrink-0 mt-0.5">{f.rating === 1 ? '👍' : '👎'}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-medium text-stone-600">
                      {f.member_email?.split('@')[0] ?? '匿名'}
                    </span>
                    {f.channel && (
                      <span className="text-xs bg-stone-100 text-stone-500 px-1.5 py-0.5 rounded">
                        {CHANNEL_LABEL[f.channel] ?? f.channel}
                      </span>
                    )}
                    {f.total_score !== undefined && (
                      <span className="text-xs text-stone-400">スコア {f.total_score}</span>
                    )}
                    <span className="text-xs text-stone-300">{f.created_at.slice(0, 10)}</span>
                  </div>
                  {f.comment && (
                    <p className="text-sm text-stone-600 mt-1">{f.comment}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
