'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTeam } from '@/hooks/useTeam';
import { BrandVoice } from '@/lib/types';
import { DEFAULT_NG_WORDS } from '@/lib/ng-words';

const DEFAULT_CHECKS = ['配信停止リンク', '問い合わせ先', 'ブランド名'];

export default function BrandPage() {
  const { myMember, loading } = useTeam();
  const router = useRouter();
  const [brandVoice, setBrandVoice] = useState<BrandVoice | null>(null);
  const [tone, setTone] = useState('');
  const [ngWords, setNgWords] = useState<string[]>([]);
  const [newNgWord, setNewNgWord] = useState('');
  const [checks, setChecks] = useState<string[]>(DEFAULT_CHECKS);
  const [newCheck, setNewCheck] = useState('');
  const [subjectRules, setSubjectRules] = useState('');
  const [minScore, setMinScore] = useState<number | string>(65);
  const [minScoreAction, setMinScoreAction] = useState<'warn' | 'badge'>('warn');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!myMember) return;
    fetch('/api/team/brand-voice')
      .then(r => r.json())
      .then(data => {
        const bv: BrandVoice | null = data.brandVoice;
        if (bv) {
          setBrandVoice(bv);
          setTone(bv.tone ?? '');
          setNgWords(bv.ng_words ?? []);
          setChecks(bv.required_checks.length > 0 ? bv.required_checks : DEFAULT_CHECKS);
          setSubjectRules(bv.subject_rules ?? '');
          setMinScore(bv.min_score_threshold ?? 65);
          setMinScoreAction(bv.min_score_action);
        }
      });
  }, [myMember]);

  const isOwner = myMember?.role === 'owner';

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    const res = await fetch('/api/team/brand-voice', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tone: tone || undefined,
        ng_words: ngWords,
        required_checks: checks,
        subject_rules: subjectRules || undefined,
        min_score_threshold: minScore ? Number(minScore) : undefined,
        min_score_action: minScoreAction,
      }),
    });
    setSaving(false);
    if (res.ok) setSaved(true);
  }

  if (loading) return <div className="min-h-screen bg-stone-50 flex items-center justify-center"><p className="text-stone-400">読み込み中...</p></div>;
  if (!myMember) return null;

  return (
    <div className="min-h-screen bg-stone-50">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="flex items-center gap-3 mb-8">
          <button onClick={() => router.back()} className="text-stone-400 hover:text-stone-600 transition-colors">←</button>
          <h1 className="text-lg font-bold text-stone-900">🎨 ブランドボイス設定</h1>
          {!isOwner && <span className="text-xs text-stone-400">（閲覧のみ）</span>}
        </div>

        <div className="space-y-6">
          {/* トーン指針 */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <label className="block text-sm font-semibold text-stone-700 mb-3">トーン指針</label>
            <textarea
              value={tone}
              onChange={e => setTone(e.target.value)}
              disabled={!isOwner}
              maxLength={500}
              rows={4}
              placeholder="丁寧だが堅すぎない。です・ます調。親しみやすさと品格のバランス。"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none disabled:bg-stone-50 disabled:text-stone-400"
            />
            <p className="text-xs text-stone-400 mt-1">{tone.length}/500文字</p>
          </div>

          {/* NGワード */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <label className="block text-sm font-semibold text-stone-700 mb-3">NGワード</label>
            <p className="text-xs text-stone-400 mb-3">
              共通警告ワード（全プラン）: {DEFAULT_NG_WORDS.join('、')}
            </p>
            <div className="space-y-2 mb-3">
              {ngWords.map((word, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="flex-1 bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 text-sm">{word}</span>
                  {isOwner && (
                    <button onClick={() => setNgWords(w => w.filter((_, idx) => idx !== i))} className="text-stone-400 hover:text-red-500 transition-colors">×</button>
                  )}
                </div>
              ))}
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newNgWord}
                  onChange={e => setNewNgWord(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newNgWord.trim()) { setNgWords(w => [...w, newNgWord.trim()]); setNewNgWord(''); } }}
                  placeholder="追加するワード"
                  className="flex-1 border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button
                  onClick={() => { if (newNgWord.trim()) { setNgWords(w => [...w, newNgWord.trim()]); setNewNgWord(''); } }}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  追加
                </button>
              </div>
            )}
          </div>

          {/* 記載必須チェック */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <label className="block text-sm font-semibold text-stone-700 mb-3">記載必須チェック</label>
            <div className="space-y-2 mb-3">
              {checks.map((check, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-emerald-500">☑</span>
                  <span className="flex-1 text-sm text-stone-700">{check}</span>
                  {isOwner && (
                    <button onClick={() => setChecks(c => c.filter((_, idx) => idx !== i))} className="text-stone-400 hover:text-red-500 transition-colors text-xs">削除</button>
                  )}
                </div>
              ))}
            </div>
            {isOwner && (
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newCheck}
                  onChange={e => setNewCheck(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter' && newCheck.trim()) { setChecks(c => [...c, newCheck.trim()]); setNewCheck(''); } }}
                  placeholder="必須項目を追加"
                  className="flex-1 border border-stone-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <button
                  onClick={() => { if (newCheck.trim()) { setChecks(c => [...c, newCheck.trim()]); setNewCheck(''); } }}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-700 px-4 py-2 rounded-xl text-sm transition-colors"
                >
                  + 追加
                </button>
              </div>
            )}
          </div>

          {/* 件名ルール */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <label className="block text-sm font-semibold text-stone-700 mb-3">件名ルール</label>
            <textarea
              value={subjectRules}
              onChange={e => setSubjectRules(e.target.value)}
              disabled={!isOwner}
              maxLength={300}
              rows={3}
              placeholder="【】墨付きカッコ不使用、絵文字1つまで"
              className="w-full border border-stone-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 resize-none disabled:bg-stone-50 disabled:text-stone-400"
            />
          </div>

          {/* 最低スコアルール */}
          <div className="bg-white rounded-2xl border border-stone-200 p-6">
            <label className="block text-sm font-semibold text-stone-700 mb-4">最低スコアルール</label>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm text-stone-600">最低スコアライン:</span>
              <input
                type="number"
                value={minScore}
                onChange={e => setMinScore(e.target.value)}
                disabled={!isOwner}
                min={0}
                max={100}
                className="w-20 border border-stone-200 rounded-xl px-3 py-2 text-sm text-center focus:outline-none focus:ring-2 focus:ring-indigo-300 disabled:bg-stone-50"
              />
            </div>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="warn"
                  checked={minScoreAction === 'warn'}
                  onChange={() => setMinScoreAction('warn')}
                  disabled={!isOwner}
                />
                <span className="text-sm text-stone-700">警告表示のみ</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="radio"
                  name="action"
                  value="badge"
                  checked={minScoreAction === 'badge'}
                  onChange={() => setMinScoreAction('badge')}
                  disabled={!isOwner}
                />
                <span className="text-sm text-stone-700">警告 + 「要修正」バッジ</span>
              </label>
            </div>
          </div>

          {isOwner && (
            <button
              onClick={handleSave}
              disabled={saving}
              className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? '保存中...' : saved ? '✅ 保存しました' : '保存'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
