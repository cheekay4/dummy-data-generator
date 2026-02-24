'use client';
import { useRouter } from 'next/navigation';
import { useTeam } from '@/hooks/useTeam';
import { TEAM_PLAN_LABELS } from '@/lib/plan';

export default function TeamSettingsPage() {
  const { team, myMember, isOwner, loading } = useTeam();
  const router = useRouter();

  async function handlePortal() {
    const res = await fetch('/api/stripe/portal', { method: 'POST' });
    const data = await res.json();
    if (data.url) window.location.href = data.url;
  }

  if (loading) return null;
  if (!team || !myMember || !isOwner) {
    router.replace('/team');
    return null;
  }

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 transition-colors">←</button>
          <h1 className="text-lg font-bold text-stone-900">⚙️ チーム設定</h1>
        </div>

        <div className="space-y-4">
          {/* プラン情報 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="text-sm font-semibold text-stone-700 mb-4">現在のプラン</h2>
            <div className="flex items-center gap-3 mb-4">
              <span className="bg-emerald-100 text-emerald-700 text-sm px-3 py-1 rounded-full font-medium">
                {TEAM_PLAN_LABELS[team.plan] ?? team.plan} ({team.max_seats}席)
              </span>
            </div>
            <p className="text-sm text-stone-500">
              プランのアップグレード・ダウングレード・解約は、請求ポータルから行えます。
            </p>
          </div>

          {/* 請求履歴 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <h2 className="text-sm font-semibold text-stone-700 mb-4">請求・請求書</h2>
            <p className="text-sm text-stone-500 mb-4">
              請求履歴の確認、請求書PDFのダウンロードは Stripe カスタマーポータルで行えます。
            </p>
            <button
              onClick={handlePortal}
              className="bg-stone-900 text-white text-sm px-5 py-2.5 rounded-xl hover:bg-stone-800 transition-colors"
            >
              請求履歴を見る →
            </button>
          </div>

          {/* 危険ゾーン */}
          <div className="bg-white rounded-2xl border border-red-100 p-6">
            <h2 className="text-sm font-semibold text-red-600 mb-4">プランのキャンセル</h2>
            <p className="text-sm text-stone-500 mb-4">
              Teamプランをキャンセルすると、次回請求日以降にチーム機能が利用できなくなります。
            </p>
            <button
              onClick={handlePortal}
              className="border border-red-200 text-red-600 text-sm px-5 py-2.5 rounded-xl hover:bg-red-50 transition-colors"
            >
              プランを管理・キャンセルする
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
