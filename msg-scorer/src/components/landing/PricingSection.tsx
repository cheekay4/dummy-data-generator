'use client';
import Link from 'next/link';
import { useState } from 'react';
import { motion, useInView } from 'framer-motion';
import { useRef } from 'react';
import Badge from '@/components/ui/Badge';
import { useUser } from '@/hooks/useUser';

// ─── 機能比較テーブル定義 ──────────────────────────────────────────
// section: テーブル内の区切りセクション名（行グループ化用）
type FeatureRow =
  | { type: 'section'; label: string }
  | { type: 'row'; label: string; free: boolean | string; pro: boolean | string; team: boolean | string; teamPro: boolean | string };

const featureRows: FeatureRow[] = [
  // ── 基本AI機能（Freeでも全部使える）
  { type: 'section', label: '基本AI機能' },
  { type: 'row', label: 'AI 5軸スコアリング',                 free: true,    pro: true,     team: true,     teamPro: true },
  { type: 'row', label: 'A/Bバリアント + 改善案 3点',          free: true,    pro: true,     team: true,     teamPro: true },
  { type: 'row', label: '予測インパクト（開封率・CTR・CV数）',  free: true,    pro: true,     team: true,     teamPro: true },
  { type: 'row', label: 'メール件名 / メール本文 / LINE対応',   free: true,    pro: true,     team: true,     teamPro: true },

  // ── 利用制限・保存
  { type: 'section', label: '利用制限・保存' },
  { type: 'row', label: '1日のスコアリング回数',               free: '5回',   pro: '無制限', team: '無制限', teamPro: '無制限' },
  { type: 'row', label: 'スコアリング履歴の保存',               free: '7日間', pro: '無制限', team: '無制限', teamPro: '無制限' },
  { type: 'row', label: 'CSV出力',                             free: false,   pro: true,     team: true,     teamPro: true },
  { type: 'row', label: 'セグメント保存',                      free: false,   pro: '10個',   team: '10個',   teamPro: '20個' },

  // ── Pro個人機能
  { type: 'section', label: 'Pro 機能' },
  { type: 'row', label: 'プレビュー（iPhone / Gmail / LINE）', free: false,   pro: true,     team: true,     teamPro: true },
  { type: 'row', label: 'スコア推移グラフ',                    free: false,   pro: true,     team: true,     teamPro: true },

  // ── チーム機能
  { type: 'section', label: 'チーム機能' },
  { type: 'row', label: 'チームワークスペース',                 free: false,   pro: false,    team: '5〜30名', teamPro: '30名' },
  { type: 'row', label: 'ブランドガイドライン',                 free: false,   pro: false,    team: true,     teamPro: true },
  { type: 'row', label: 'スコア品質管理',                      free: false,   pro: false,    team: true,     teamPro: true },

  // ── Team Pro自動化
  { type: 'section', label: 'Team Pro 自動化・連携' },
  { type: 'row', label: '配信実績の学習（CSVインポート）',       free: false,   pro: false,    team: false,    teamPro: true },
  { type: 'row', label: 'Slack通知',                           free: false,   pro: false,    team: false,    teamPro: true },
  { type: 'row', label: '外部API連携',                         free: false,   pro: false,    team: false,    teamPro: '1,000回/日' },
];

function Cell({ value }: { value: boolean | string }) {
  if (value === false) return <span className="text-stone-300">—</span>;
  if (value === true)  return <span className="text-emerald-500 font-bold">✓</span>;
  return <span className="text-stone-700 text-xs font-medium">{value}</span>;
}

// ─── プランカード定義 ──────────────────────────────────────────────
const TEAM_TIERS = [
  { key: 'team_s', label: 'S', price: '¥4,980', seats: '5名まで' },
  { key: 'team_m', label: 'M', price: '¥8,980', seats: '10名まで' },
  { key: 'team_l', label: 'L', price: '¥19,800', seats: '30名まで' },
] as const;

type CheckoutPlan = 'pro' | 'team_s' | 'team_m' | 'team_l' | 'team_pro';

// プランサマリ（こんな方に）
const PLAN_BULLETS: Record<string, string[]> = {
  free: [
    '登録不要、今すぐ使える',
    '件名・本文・LINEの3チャネルに対応',
    'A/B改善案・予測CV数まで無料で確認',
  ],
  pro: [
    '回数制限なしで毎日使い倒したい方',
    '過去の結果をCSVで蓄積・振り返りたい方',
    'デバイスプレビューで完成度を上げたい方',
  ],
  team: [
    'チームで配信品質を統一したい',
    'ブランドルールをメンバー全員に自動適用',
    '管理者がスコアを一元管理・修正依頼',
  ],
  team_pro: [
    '過去の配信実績からAIに学習させたい',
    'Slackで承認フローをリアルタイム化',
    'MAツール・CMSと外部API連携したい',
  ],
};

export default function PricingSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const { user, isPro } = useUser();
  const [loading, setLoading] = useState<string | null>(null);
  const [selectedTeamTier, setSelectedTeamTier] = useState<'team_s' | 'team_m' | 'team_l'>('team_m');

  async function handleCheckout(plan: CheckoutPlan) {
    if (!user) {
      window.location.href = '/login';
      return;
    }
    setLoading(plan);
    try {
      const body = plan === 'pro'
        ? { interval: 'month' }
        : { teamPlan: plan };
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const { url } = await res.json() as { url: string };
      if (url) window.location.href = url;
    } finally {
      setLoading(null);
    }
  }

  return (
    <section className="py-20 px-4 sm:px-6 bg-stone-50/60" ref={ref} id="pricing">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-stone-400 text-xs uppercase tracking-widest mb-4">料金</p>
        <h2 className="font-outfit font-bold text-3xl text-stone-900 text-center mb-12">
          シンプルな料金プラン
        </h2>

        {/* ─── プランカード: 4列 ─────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">

          {/* Free */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4 }}
            className="bg-white border border-stone-200 rounded-2xl p-5 flex flex-col"
          >
            <h3 className="font-outfit font-semibold text-base text-stone-900 mb-1">Free</h3>
            <p className="font-outfit font-bold text-2xl text-stone-900 mb-0.5">¥0</p>
            <p className="text-stone-400 text-xs mb-4">登録不要 / 個人</p>
            <ul className="space-y-1.5 mb-5 flex-1">
              {PLAN_BULLETS.free.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-stone-600">
                  <span className="text-stone-400 shrink-0 mt-0.5">·</span>{b}
                </li>
              ))}
            </ul>
            <Link
              href="/score"
              className="block w-full text-center px-4 py-2 border border-stone-300 rounded-xl text-stone-700 text-xs font-medium hover:bg-stone-50 transition-colors"
            >
              無料で始める
            </Link>
          </motion.div>

          {/* Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="bg-indigo-600 text-white rounded-2xl p-5 shadow-xl shadow-indigo-200 relative flex flex-col"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <Badge variant="amber">おすすめ</Badge>
            </div>
            <h3 className="font-outfit font-semibold text-base text-indigo-100 mb-1">Pro</h3>
            <p className="font-outfit font-bold text-2xl text-white mb-0.5">
              ¥980<span className="text-sm font-normal text-indigo-200">/月</span>
            </p>
            <p className="text-indigo-200 text-xs mb-4">7日無料 / 個人</p>
            <ul className="space-y-1.5 mb-5 flex-1">
              {PLAN_BULLETS.pro.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-indigo-100">
                  <span className="text-indigo-300 shrink-0 mt-0.5">·</span>{b}
                </li>
              ))}
            </ul>
            {isPro ? (
              <div className="block w-full text-center px-4 py-2 bg-white/20 text-white rounded-xl text-xs font-semibold">
                現在のプラン
              </div>
            ) : (
              <button
                onClick={() => handleCheckout('pro')}
                disabled={loading !== null}
                className="block w-full text-center px-4 py-2 bg-white text-indigo-600 rounded-xl text-xs font-semibold hover:bg-indigo-50 transition-colors disabled:opacity-70"
              >
                {loading === 'pro' ? '処理中...' : '申し込む'}
              </button>
            )}
          </motion.div>

          {/* Team (S/M/L切替) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="bg-white border border-emerald-200 rounded-2xl p-5 flex flex-col"
          >
            <h3 className="font-outfit font-semibold text-base text-stone-900 mb-1">Team</h3>
            {/* S/M/L tier toggle */}
            <div className="flex gap-1 mb-2">
              {TEAM_TIERS.map(t => (
                <button
                  key={t.key}
                  onClick={() => setSelectedTeamTier(t.key)}
                  className={`flex-1 py-1 text-xs font-semibold rounded-lg transition-colors ${
                    selectedTeamTier === t.key
                      ? 'bg-emerald-600 text-white'
                      : 'bg-stone-100 text-stone-500 hover:bg-stone-200'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            {TEAM_TIERS.filter(t => t.key === selectedTeamTier).map(t => (
              <div key={t.key}>
                <p className="font-outfit font-bold text-2xl text-stone-900 mb-0.5">
                  {t.price}<span className="text-sm font-normal text-stone-400">/月</span>
                </p>
                <p className="text-stone-400 text-xs mb-4">{t.seats}</p>
              </div>
            ))}
            <ul className="space-y-1.5 mb-5 flex-1">
              {PLAN_BULLETS.team.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-stone-600">
                  <span className="text-emerald-400 shrink-0 mt-0.5">·</span>{b}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout(selectedTeamTier)}
              disabled={loading !== null}
              className="block w-full text-center px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-70"
            >
              {loading === selectedTeamTier ? '処理中...' : '申し込む'}
            </button>
          </motion.div>

          {/* Team Pro */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="bg-gradient-to-b from-indigo-50 to-white border-2 border-indigo-300 rounded-2xl p-5 flex flex-col relative"
          >
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 whitespace-nowrap">
              <Badge variant="indigo">自動化 + API</Badge>
            </div>
            <h3 className="font-outfit font-semibold text-base text-stone-900 mb-1">Team Pro</h3>
            <p className="font-outfit font-bold text-2xl text-stone-900 mb-0.5">
              ¥39,800<span className="text-sm font-normal text-stone-400">/月</span>
            </p>
            <p className="text-stone-400 text-xs mb-4">30名 + Slack・API連携</p>
            <ul className="space-y-1.5 mb-5 flex-1">
              {PLAN_BULLETS.team_pro.map((b, i) => (
                <li key={i} className="flex items-start gap-1.5 text-xs text-stone-600">
                  <span className="text-indigo-400 shrink-0 mt-0.5">·</span>{b}
                </li>
              ))}
            </ul>
            <button
              onClick={() => handleCheckout('team_pro')}
              disabled={loading !== null}
              className="block w-full text-center px-4 py-2 bg-indigo-600 text-white rounded-xl text-xs font-semibold hover:bg-indigo-700 transition-colors disabled:opacity-70"
            >
              {loading === 'team_pro' ? '処理中...' : '申し込む'}
            </button>
          </motion.div>
        </div>

        {/* ─── 機能比較テーブル ─────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-stone-50 border-b border-stone-200">
                  <th className="text-left px-4 py-3 text-xs font-medium text-stone-500 w-52">機能</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-stone-500 w-20">Free</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-indigo-600 w-20">Pro</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-emerald-600 w-20">Team</th>
                  <th className="text-center px-4 py-3 text-xs font-medium text-indigo-600 w-24">Team Pro</th>
                </tr>
              </thead>
              <tbody>
                {featureRows.map((row, i) => {
                  if (row.type === 'section') {
                    return (
                      <tr key={i} className="bg-stone-50 border-y border-stone-100">
                        <td colSpan={5} className="px-4 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">
                          {row.label}
                        </td>
                      </tr>
                    );
                  }
                  return (
                    <tr key={i} className={`border-b border-stone-100 last:border-0 ${
                      (row.label.includes('配信実績') || row.label.includes('Slack') || row.label.includes('外部API'))
                        ? 'bg-indigo-50/30' : ''
                    }`}>
                      <td className="px-4 py-2.5 text-stone-700 text-xs">{row.label}</td>
                      <td className="text-center px-4 py-2.5"><Cell value={row.free} /></td>
                      <td className="text-center px-4 py-2.5"><Cell value={row.pro} /></td>
                      <td className="text-center px-4 py-2.5"><Cell value={row.team} /></td>
                      <td className="text-center px-4 py-2.5"><Cell value={row.teamPro} /></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* 機能詳細ページへのリンク */}
        <div className="flex justify-center mb-8">
          <Link
            href="/features"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-stone-300 text-sm text-stone-600 hover:border-indigo-400 hover:text-indigo-600 transition-colors bg-white shadow-sm"
          >
            各機能の詳細を見る →
          </Link>
        </div>

        <p className="text-center text-xs text-stone-400">
          いつでも解約可能。月次サブスク。Team = ブランドガバナンス機能付き無制限利用
        </p>
      </div>
    </section>
  );
}
