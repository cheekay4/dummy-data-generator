'use client';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useScoringStore } from '@/stores/scoring-store';

const STEPS = [
  'セグメント特性を確認しています...',
  '開封誘引力を評価しています...',
  'CTA強度を分析しています...',
  'ターゲット適合度を判定しています...',
  '改善案とA/Bテスト案を生成しています...',
] as const;

// 各ステップの「開始タイミング」(ms) — ここを超えたら前のステップを完了させる
const STEP_TRIGGERS = [0, 1200, 2500, 4000, 5500] as const;

const TIPS = [
  'メール件名は15-25文字が最も開封率が高い傾向があります',
  'LINE配信は火曜・木曜の12:00-13:00が高反応の時間帯です',
  'CTAボタンの文言は動詞から始めると行動喚起に効果的です',
  '既存顧客への配信は新規の3倍のCTRが出る傾向があります',
  '絵文字を1つ使った件名は開封率が約5%向上することがあります',
  '配信目的を明確にするだけでCTA強度スコアが平均+12pt向上します',
  '件名の冒頭に読者の関心事を置くと開封率が改善します',
  'モバイル閲覧率70%以上なら、件名15文字以内が推奨です',
] as const;

function Spinner() {
  return (
    <svg className="w-4 h-4 animate-spin text-indigo-600" viewBox="0 0 24 24" fill="none">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
    </svg>
  );
}

export default function LoadingView() {
  const { apiDone, commitResult } = useScoringStore();

  // 完了済みステップのインデックス集合
  const [doneSteps, setDoneSteps] = useState<number[]>([]);
  // 現在進行中のステップ (0-4)、5 = 全完了
  const [currentStep, setCurrentStep] = useState(0);
  // 豆知識
  const [tipIndex, setTipIndex] = useState(() => Math.floor(Math.random() * TIPS.length));
  const [tipVisible, setTipVisible] = useState(true);
  // 長待機フラグ（10秒超え）
  const [longWait, setLongWait] = useState(false);

  const startTimeRef = useRef(Date.now());
  const finalizingRef = useRef(false);

  // ────────────────────────────────────────
  // 自動ステップ進行（タイマーベース）
  // ────────────────────────────────────────
  useEffect(() => {
    const mark = (doneIdx: number, nextIdx: number) => () => {
      setDoneSteps((p) => (p.includes(doneIdx) ? p : [...p, doneIdx]));
      setCurrentStep(nextIdx);
    };

    const t1 = setTimeout(mark(0, 1), STEP_TRIGGERS[1]);
    const t2 = setTimeout(mark(1, 2), STEP_TRIGGERS[2]);
    const t3 = setTimeout(mark(2, 3), STEP_TRIGGERS[3]);
    const t4 = setTimeout(mark(3, 4), STEP_TRIGGERS[4]);
    const t5 = setTimeout(() => setLongWait(true), 10_000);

    return () => [t1, t2, t3, t4, t5].forEach(clearTimeout);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ────────────────────────────────────────
  // 豆知識ローテーション（5秒ごとにフェード切替）
  // ────────────────────────────────────────
  useEffect(() => {
    const iv = setInterval(() => {
      setTipVisible(false);
      setTimeout(() => {
        setTipIndex((i) => (i + 1) % TIPS.length);
        setTipVisible(true);
      }, 400);
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  // ────────────────────────────────────────
  // API 完了検知 → 残りステップを高速完了 → commitResult
  // ────────────────────────────────────────
  useEffect(() => {
    if (!apiDone || finalizingRef.current) return;
    finalizingRef.current = true;

    const elapsed = Date.now() - startTimeRef.current;
    const minWait = Math.max(0, 2000 - elapsed);

    const outerTimer = setTimeout(() => {
      let delay = 0;

      for (let i = 0; i <= 4; i++) {
        const idx = i;
        setTimeout(() => {
          setDoneSteps((p) => (p.includes(idx) ? p : [...p, idx]));
          if (idx < 4) setCurrentStep(idx + 1);
        }, delay);
        delay += 200;
      }

      // 全ステップ完了 → 500ms 後に結果へ
      setTimeout(() => {
        setCurrentStep(5); // 全完了（どのステップも current でない）
        commitResult();
      }, delay + 500);
    }, minWait);

    return () => clearTimeout(outerTimer);
  }, [apiDone, commitResult]);

  // ────────────────────────────────────────
  // 描画
  // ────────────────────────────────────────
  const progress = Math.round((doneSteps.length / 5) * 100);
  const lastStepLabel = longWait ? 'もう少しお待ちください...' : STEPS[4];

  return (
    <div className="p-8 max-w-2xl mx-auto">
      {/* ヘッダー */}
      <div className="text-center mb-8">
        <span className="text-indigo-600 text-2xl font-bold font-outfit select-none">◆</span>
        <p className="text-lg font-semibold text-stone-800 mt-3">
          📊 AIアナリストがメッセージを分析しています
        </p>
      </div>

      {/* ステップリスト */}
      <div className="space-y-3.5 mb-8">
        {STEPS.map((label, i) => {
          const text   = i === 4 ? lastStepLabel : label;
          const isDone = doneSteps.includes(i);
          const isCur  = currentStep === i && !isDone;
          const isPend = !isDone && !isCur;

          return (
            <div key={i} className="flex items-center gap-3">
              {/* アイコン */}
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <AnimatePresence mode="wait" initial={false}>
                  {isDone ? (
                    <motion.span
                      key="done"
                      initial={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="text-base leading-none"
                    >
                      ✅
                    </motion.span>
                  ) : isCur ? (
                    <motion.div
                      key="current"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Spinner />
                    </motion.div>
                  ) : (
                    <motion.span
                      key="pending"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.2 }}
                      className="w-3 h-3 rounded-full border-2 border-stone-300 block"
                    />
                  )}
                </AnimatePresence>
              </div>

              {/* テキスト */}
              <span
                className={`text-sm transition-colors duration-300 ${
                  isDone  ? 'text-emerald-600'
                : isCur   ? 'text-indigo-600 font-medium'
                : 'text-stone-400'
                }`}
              >
                {text}
              </span>
            </div>
          );
        })}
      </div>

      {/* プログレスバー */}
      <div className="mb-6">
        <div className="h-2 bg-stone-200 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-indigo-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
        </div>
        <div className="flex justify-end mt-1.5">
          <span className="text-xs text-stone-400 tabular-nums">{progress}%</span>
        </div>
      </div>

      {/* 豆知識 */}
      <AnimatePresence mode="wait">
        {tipVisible && (
          <motion.div
            key={tipIndex}
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.4 }}
            className="bg-indigo-50 rounded-xl p-4"
          >
            <p className="text-sm text-indigo-700 leading-relaxed">
              <span className="mr-2">💡</span>
              {TIPS[tipIndex]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
