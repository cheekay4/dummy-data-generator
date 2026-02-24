'use client';
import { create } from 'zustand';
import { Channel, ConversionGoal, AudienceSegment, ScoreResponse } from '@/lib/types';
import { AUDIENCE_PRESETS } from '@/lib/presets';
import { trackEvent } from '@/lib/analytics';

interface ScoringState {
  phase: 'input' | 'loading' | 'result';
  channel: Channel;
  text: string;
  subject: string;
  audience: AudienceSegment;
  result: ScoreResponse | null;
  error: string | null;
  remainingToday: number;
  isPro: boolean;
  historyId: string | null;
  shareToken: string | null;
  apiDone: boolean;

  setChannel: (channel: Channel) => void;
  setText: (text: string) => void;
  setSubject: (subject: string) => void;
  setAudience: (audience: AudienceSegment) => void;
  setConversionGoal: (goal: ConversionGoal) => void;
  applyPreset: (presetKey: string) => void;
  submitScoring: () => Promise<void>;
  commitResult: () => void;
  resetToInput: () => void;
}

const DEFAULT_AUDIENCE: AudienceSegment = AUDIENCE_PRESETS['ec-general'];

export const useScoringStore = create<ScoringState>()((set, get) => ({
  phase: 'input',
  channel: 'email-subject',
  text: '',
  subject: '',
  audience: DEFAULT_AUDIENCE,
  result: null,
  error: null,
  remainingToday: 5,
  isPro: false,
  historyId: null,
  shareToken: null,
  apiDone: false,

  setChannel: (channel) => set({ channel }),
  setText: (text) => set({ text }),
  setSubject: (subject) => set({ subject }),
  setAudience: (audience) => set({ audience }),
  setConversionGoal: (goal) =>
    set((state) => ({ audience: { ...state.audience, conversionGoal: goal } })),
  applyPreset: (presetKey) => {
    const preset = AUDIENCE_PRESETS[presetKey];
    if (preset) set({ audience: { ...preset } });
  },

  submitScoring: async () => {
    const { channel, text, subject, audience, remainingToday } = get();
    if (!text.trim()) return;
    if (remainingToday <= 0) {
      set({ error: '本日の無料枠を使い切りました。明日またお試しください。' });
      return;
    }

    set({ phase: 'loading', error: null });

    // GA: スコアリング実行
    trackEvent('score_submitted', {
      channel,
      preset_name: audience.presetName ?? 'custom',
      conversion_goal: audience.conversionGoal,
    });

    try {
      const body = { channel, text, subject: subject || undefined, audience };
      const res = await fetch('/api/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const remaining = res.headers.get('X-RateLimit-Remaining');
      const data = await res.json();

      if (!res.ok) {
        set({
          phase: 'input',
          error: data.error ?? 'スコアリングに失敗しました。もう一度お試しください。',
          remainingToday: remaining ? parseInt(remaining, 10) : remainingToday,
        });
        return;
      }

      const { historyId, shareToken, ...scored } = data as ScoreResponse & { historyId?: string; shareToken?: string };

      // GA: 結果表示
      trackEvent('score_result_viewed', { total_score: scored.totalScore });

      const planHeader = res.headers.get('X-Plan');
      // phase は 'loading' のまま。LoadingView が apiDone を検知してアニメ完了後に commitResult() を呼ぶ
      set({
        result: scored,
        historyId: historyId ?? null,
        shareToken: shareToken ?? null,
        isPro: planHeader === 'pro',
        remainingToday: remaining ? parseInt(remaining, 10) : Math.max(0, remainingToday - 1),
        apiDone: true,
      });
    } catch {
      set({ phase: 'input', error: 'ネットワークエラーが発生しました。もう一度お試しください。' });
    }
  },

  commitResult: () => set({ phase: 'result', apiDone: false }),

  resetToInput: () => set({ phase: 'input', result: null, error: null, historyId: null, shareToken: null, apiDone: false }),
}));
