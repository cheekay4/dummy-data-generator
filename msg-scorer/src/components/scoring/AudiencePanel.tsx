'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AudiencePresets from './AudiencePresets';
import ConversionGoalSelector from './ConversionGoalSelector';
import GenderSliders from './GenderSliders';
import AgeSliders from './AgeSliders';
import RecipientInput from './RecipientInput';
import AdvancedSettings from './AdvancedSettings';
import SaveSegmentButton from './SaveSegmentButton';
import CustomSegmentList from './CustomSegmentList';
import { useScoringStore } from '@/stores/scoring-store';
import { useTeam } from '@/hooks/useTeam';
import { TeamPreset } from '@/lib/types';
import { AUDIENCE_PRESETS } from '@/lib/presets';

const DEFAULT_AUDIENCE = AUDIENCE_PRESETS['ec-general'];

function TeamPresetList() {
  const { team } = useTeam();
  const { audience, setAudience } = useScoringStore();
  const [presets, setPresets] = useState<TeamPreset[]>([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [presetName, setPresetName] = useState('');
  const [showSaveInput, setShowSaveInput] = useState(false);

  useEffect(() => {
    if (!team) return;
    setLoading(true);
    fetch('/api/team/presets')
      .then(r => r.ok ? r.json() : { presets: [] })
      .then(d => setPresets(d.presets ?? []))
      .finally(() => setLoading(false));
  }, [team]);

  async function handleSave() {
    if (!presetName.trim()) return;
    setSaving(true);
    const res = await fetch('/api/team/presets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: presetName.trim(), segment: audience }),
    });
    if (res.ok) {
      const data = await res.json();
      setPresets(p => [data.preset, ...p]);
      setPresetName('');
      setShowSaveInput(false);
    }
    setSaving(false);
  }

  async function handleDelete(id: string) {
    await fetch(`/api/team/presets?id=${id}`, { method: 'DELETE' });
    setPresets(p => p.filter(pr => pr.id !== id));
  }

  if (!team) return null;

  return (
    <div>
      <p className="text-xs font-medium text-stone-400 uppercase tracking-wider mb-2">チームプリセット</p>
      {loading ? (
        <p className="text-xs text-stone-400">読み込み中...</p>
      ) : presets.length === 0 ? (
        <p className="text-xs text-stone-400">チームプリセットはありません</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-2">
          {presets.map(p => (
            <div key={p.id} className="flex items-center gap-1">
              <button
                onClick={() => setAudience(p.segment)}
                className="text-xs bg-emerald-50 border border-emerald-200 text-emerald-700 px-3 py-1.5 rounded-full hover:bg-emerald-100 transition-colors"
              >
                {p.name}
              </button>
              <button
                onClick={() => handleDelete(p.id)}
                className="text-stone-300 hover:text-red-400 transition-colors text-xs"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
      {showSaveInput ? (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={presetName}
            onChange={e => setPresetName(e.target.value)}
            placeholder="プリセット名"
            className="flex-1 border border-stone-200 rounded-lg px-3 py-1.5 text-xs focus:outline-none focus:ring-2 focus:ring-emerald-300"
          />
          <button
            onClick={handleSave}
            disabled={saving || !presetName.trim()}
            className="text-xs bg-emerald-600 text-white px-3 py-1.5 rounded-lg hover:bg-emerald-700 disabled:opacity-50 transition-colors"
          >
            {saving ? '保存中...' : '保存'}
          </button>
          <button onClick={() => { setShowSaveInput(false); setPresetName(''); }} className="text-xs text-stone-400 hover:text-stone-600">
            取消
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowSaveInput(true)}
          className="mt-1 text-xs text-emerald-600 hover:text-emerald-700 transition-colors"
        >
          💾 チームに保存
        </button>
      )}
    </div>
  );
}

export default function AudiencePanel() {
  const [open, setOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const { setAudience } = useScoringStore();

  const resetAll = () => {
    setAudience({ ...DEFAULT_AUDIENCE });
    setRefreshKey((k) => k + 1);
  };

  return (
    <div className="bg-stone-50 rounded-2xl p-6 border border-stone-200">
      {/* ヘッダー行 */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-sm font-semibold text-stone-700 flex items-center gap-2">
          <span>📊</span> 配信先セグメント
        </h3>
        <div className="flex items-center gap-3">
          <button
            onClick={resetAll}
            className="text-xs text-stone-400 hover:text-stone-600 transition-colors"
            title="セグメント全体をデフォルトに戻す"
          >
            全体リセット
          </button>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
          >
            詳細設定
            <motion.span
              animate={{ rotate: open ? 180 : 0 }}
              transition={{ duration: 0.2 }}
              className="inline-block"
            >
              ▾
            </motion.span>
          </button>
        </div>
      </div>

      {/* プリセット選択（常時表示） */}
      <div className="space-y-5">
        <AudiencePresets />
        <CustomSegmentList refreshKey={refreshKey} />
        <TeamPresetList />
        <ConversionGoalSelector />
        <RecipientInput />
      </div>

      {/* 詳細設定（折りたたみ） */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="details"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="mt-6 pt-5 border-t border-stone-200 space-y-6">
              <GenderSliders />
              <AgeSliders />
              <div>
                <p className="text-xs font-medium text-stone-500 uppercase tracking-wider mb-3">
                  追加情報（任意）
                </p>
                <AdvancedSettings />
              </div>
              <SaveSegmentButton onSaved={() => setRefreshKey((k) => k + 1)} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
