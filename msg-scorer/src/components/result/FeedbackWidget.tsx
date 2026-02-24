'use client';
import { useState, useEffect } from 'react';

interface Props {
  historyId: string | null;
}

type FeedbackState = 'idle' | 'rated' | 'submitted';

export default function FeedbackWidget({ historyId }: Props) {
  const [state, setState] = useState<FeedbackState>('idle');
  const [rating, setRating] = useState<1 | -1 | null>(null);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // ページロード時に既存フィードバックを確認
  useEffect(() => {
    if (!historyId) return;
    fetch(`/api/feedback?score_history_id=${historyId}`)
      .then(r => r.json())
      .then(d => {
        if (d.feedback) {
          setRating(d.feedback.rating as 1 | -1);
          setState('submitted');
        }
      })
      .catch(() => {});
  }, [historyId]);

  if (!historyId) return null;

  function handleRate(r: 1 | -1) {
    setRating(r);
    setState('rated');
  }

  async function handleSubmit() {
    if (rating === null || !historyId) return;
    setSubmitting(true);
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          score_history_id: historyId,
          rating,
          comment: comment.trim() || undefined,
        }),
      });
      setState('submitted');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="border border-stone-200 rounded-2xl p-5 bg-stone-50">
      <p className="text-sm font-medium text-stone-700 mb-3">このスコアリングは役立ちましたか？</p>

      {state === 'idle' && (
        <div className="flex gap-3">
          <button
            onClick={() => handleRate(1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 bg-white hover:border-emerald-400 hover:text-emerald-700 text-stone-600 text-sm transition-colors"
          >
            👍 役立った
          </button>
          <button
            onClick={() => handleRate(-1)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl border border-stone-200 bg-white hover:border-red-400 hover:text-red-600 text-stone-600 text-sm transition-colors"
          >
            👎 改善が必要
          </button>
        </div>
      )}

      {state === 'rated' && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              onClick={() => handleRate(1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-colors ${
                rating === 1
                  ? 'border-emerald-400 bg-emerald-50 text-emerald-700'
                  : 'border-stone-200 bg-white text-stone-400 hover:text-stone-600'
              }`}
            >
              👍 役立った
            </button>
            <button
              onClick={() => handleRate(-1)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-colors ${
                rating === -1
                  ? 'border-red-400 bg-red-50 text-red-600'
                  : 'border-stone-200 bg-white text-stone-400 hover:text-stone-600'
              }`}
            >
              👎 改善が必要
            </button>
          </div>

          <div>
            <textarea
              value={comment}
              onChange={e => setComment(e.target.value.slice(0, 200))}
              placeholder="コメントがあれば（任意・200文字以内）"
              rows={2}
              className="w-full text-sm border border-stone-200 rounded-xl p-3 resize-none bg-white placeholder:text-stone-300 focus:outline-none focus:ring-1 focus:ring-indigo-300"
            />
            <p className="text-xs text-stone-400 text-right mt-1">{comment.length}/200</p>
          </div>

          <button
            onClick={handleSubmit}
            disabled={submitting}
            className="px-4 py-2 bg-indigo-600 text-white rounded-xl text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {submitting ? '送信中...' : '送信する'}
          </button>
        </div>
      )}

      {state === 'submitted' && (
        <p className="text-sm text-stone-500 flex items-center gap-2">
          {rating === 1 ? '👍' : '👎'}
          <span>フィードバックをありがとうございます！</span>
        </p>
      )}
    </div>
  );
}
