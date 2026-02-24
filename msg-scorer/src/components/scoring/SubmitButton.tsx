'use client';
import { useScoringStore } from '@/stores/scoring-store';
import { useUser } from '@/hooks/useUser';

export default function SubmitButton() {
  const { text, phase, remainingToday, submitScoring, audience } = useScoringStore();
  const { user, isPro } = useUser();
  const isLoading = phase === 'loading';
  const ageTotal = parseFloat(
    Object.values(audience.ageDistribution).reduce((a, b) => a + b, 0).toFixed(1)
  );
  const hasAgeError = ageTotal > 100;
  const isRateLimited = !isPro && remainingToday <= 0;
  const disabled = isLoading || !text.trim() || isRateLimited || hasAgeError;

  return (
    <div className="space-y-2">
      <button
        onClick={() => void submitScoring()}
        disabled={disabled}
        className={`w-full py-4 rounded-xl text-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
          disabled
            ? 'bg-stone-300 text-stone-400 cursor-not-allowed'
            : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-200/50 hover:scale-[1.01] active:scale-[0.99]'
        }`}
      >
        {isLoading ? (
          <>
            <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            スコアリング中...
          </>
        ) : (
          <>✨ スコアリングを開始する</>
        )}
      </button>

      {/* 課題修正1: 5回切れ後のアップグレードCTA */}
      {isPro ? (
        <p className="text-center text-xs text-stone-400">
          無制限利用（Proプラン）
        </p>
      ) : isRateLimited ? (
        <div className="text-center space-y-1.5">
          <p className="text-xs text-stone-500">本日の無料枠（5回）を使い切りました</p>
          <a
            href="/pricing"
            className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            → Proプランで今日も続ける ✨
          </a>
        </div>
      ) : user ? (
        <p className="text-center text-xs text-stone-400">
          残り <span className="font-mono-score font-medium text-stone-500">{remainingToday}</span> / 5 回（本日の無料枠）
        </p>
      ) : (
        <p className="text-center text-xs text-stone-400">
          残り <span className="font-mono-score font-medium text-stone-500">{remainingToday}</span> / 5 回
          <a href="/login" className="ml-1 text-indigo-500 hover:underline">ログインで履歴保存</a>
        </p>
      )}

      {/* 課題修正2: AgeError時のdisabled理由を明示 */}
      {hasAgeError && (
        <p className="text-center text-xs text-amber-600">
          ⚠️ 年代構成の合計が100%を超えています。「詳細設定」から調整してください。
        </p>
      )}
    </div>
  );
}
