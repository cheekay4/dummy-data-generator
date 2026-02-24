'use client';
import { useState } from 'react';
import { useScoringStore } from '@/stores/scoring-store';
import { useUser } from '@/hooks/useUser';
import ProGate from '@/components/ui/ProGate';
import EmailSubjectPreview from './EmailSubjectPreview';
import EmailBodyPreview from './EmailBodyPreview';
import LinePreview from './LinePreview';

export default function PreviewPanel() {
  const { channel, text, subject } = useScoringStore();
  const { isPro } = useUser();
  const [tab, setTab] = useState<'mobile' | 'gmail'>('mobile');

  const showTabs = channel === 'email-subject' || channel === 'email-body';

  const content = (
    <div className="bg-stone-50 rounded-2xl p-5 border border-stone-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-stone-700">📱 プレビュー</h3>
        {showTabs && (
          <div className="flex gap-1">
            {(['mobile', 'gmail'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-3 py-1 text-xs rounded-lg transition-colors ${
                  tab === t
                    ? 'bg-indigo-600 text-white'
                    : 'bg-stone-200 text-stone-600 hover:bg-stone-300'
                }`}
              >
                {t === 'mobile' ? 'iPhone' : 'Gmail'}
              </button>
            ))}
          </div>
        )}
      </div>

      {channel === 'email-subject' && (
        <EmailSubjectPreview subject={subject || text} tab={tab} />
      )}
      {channel === 'email-body' && (
        <EmailBodyPreview subject={subject} text={text} tab={tab} />
      )}
      {channel === 'line' && (
        <LinePreview text={text} />
      )}
    </div>
  );

  return (
    <ProGate isPro={isPro} label="プレビューはProプランの機能です">
      {content}
    </ProGate>
  );
}
