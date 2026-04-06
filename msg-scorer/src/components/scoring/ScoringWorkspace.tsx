'use client';
import { useState } from 'react';
import dynamic from 'next/dynamic';
import { AnimatePresence, motion } from 'framer-motion';
import { useScoringStore } from '@/stores/scoring-store';
import ChannelTabs from './ChannelTabs';
import TextInput from './TextInput';
import ImageInput from './ImageInput';
import AudiencePanel from './AudiencePanel';
import SubmitButton from './SubmitButton';
import ResultView from '@/components/result/ResultView';
import LoadingView from './LoadingView';

const PreviewPanel = dynamic(() => import('@/components/preview/PreviewPanel'), { ssr: false });

function ErrorBanner() {
  const { error } = useScoringStore();
  if (!error) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      className="mx-6 mb-0 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600"
    >
      ⚠️ {error}
    </motion.div>
  );
}

export default function ScoringWorkspace() {
  const { phase, channel } = useScoringStore();
  const [previewOpen, setPreviewOpen] = useState(false);

  // プレビュー対応チャネル
  const canPreview = channel === 'email-subject' || channel === 'email-body' || channel === 'line';

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-stone-200 mx-auto max-w-3xl overflow-hidden">
      <AnimatePresence mode="wait">
        {phase === 'input' && (
          <motion.div
            key="input"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <ErrorBanner />
            <div className="p-6 space-y-6">
              {/* チャネルタブ */}
              <ChannelTabs />

              {/* テキスト入力 */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-stone-700">
                    評価するテキスト
                  </label>
                  {canPreview && (
                    <button
                      onClick={() => setPreviewOpen((v) => !v)}
                      className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 transition-colors"
                    >
                      📱 {previewOpen ? 'プレビューを閉じる' : 'プレビューを確認'}
                    </button>
                  )}
                </div>
                <TextInput />
              </div>

              {/* スコアリング前プレビュー */}
              <AnimatePresence>
                {previewOpen && canPreview && (
                  <motion.div
                    key="pre-preview"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <PreviewPanel />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 画像（email-subject以外） */}
              {channel !== 'email-subject' && <ImageInput />}

              {/* セグメント設定 */}
              <AudiencePanel />

              {/* 送信ボタン */}
              <SubmitButton />
            </div>
          </motion.div>
        )}

        {phase === 'loading' && (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <LoadingView />
          </motion.div>
        )}

        {phase === 'result' && (
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
          >
            <ResultView />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
