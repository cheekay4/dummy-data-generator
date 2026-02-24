'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function TeamSetupPage() {
  const router = useRouter();
  const [teamName, setTeamName] = useState('');
  const [emails, setEmails] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addEmail = () => setEmails(e => [...e, '']);
  const removeEmail = (i: number) => setEmails(e => e.filter((_, idx) => idx !== i));
  const updateEmail = (i: number, val: string) =>
    setEmails(e => e.map((v, idx) => idx === i ? val : v));

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const inviteEmails = emails.map(v => v.trim()).filter(Boolean);

    try {
      const res = await fetch('/api/team/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ teamName, inviteEmails }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? 'エラーが発生しました。');
        return;
      }
      router.push('/team');
    } catch {
      setError('ネットワークエラーが発生しました。');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-stone-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-sm border border-stone-200 p-8 max-w-lg w-full">
        <div className="text-center mb-8">
          <span className="text-indigo-600 text-2xl font-bold font-outfit">◆</span>
          <h1 className="text-xl font-bold text-stone-900 mt-3">チームセットアップ</h1>
          <p className="text-sm text-stone-500 mt-1">チーム名とメンバーを設定してください</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* チーム名 */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              チーム名 <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              placeholder="○○マーケティング部"
              maxLength={50}
              required
              className="w-full border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            />
            <p className="text-xs text-stone-400 mt-1">{teamName.length}/50文字</p>
          </div>

          {/* メンバー招待 */}
          <div>
            <label className="block text-sm font-medium text-stone-700 mb-2">
              メンバーを招待（任意）
            </label>
            <div className="space-y-2">
              {emails.map((email, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    type="email"
                    value={email}
                    onChange={e => updateEmail(i, e.target.value)}
                    placeholder="member@example.com"
                    className="flex-1 border border-stone-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  />
                  {emails.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeEmail(i)}
                      className="text-stone-400 hover:text-red-500 px-2 transition-colors"
                    >
                      ×
                    </button>
                  )}
                </div>
              ))}
            </div>
            {emails.length < 4 && (
              <button
                type="button"
                onClick={addEmail}
                className="mt-2 text-sm text-indigo-600 hover:text-indigo-700 transition-colors"
              >
                + メールアドレスを追加
              </button>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-600 bg-red-50 rounded-xl px-4 py-3">
              ⚠️ {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || teamName.trim().length < 2}
            className="w-full bg-indigo-600 text-white rounded-xl py-3 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {loading ? '作成中...' : 'チームを作成して招待メールを送信'}
          </button>

          <p className="text-center text-xs text-stone-400">
            <Link href="/team" className="hover:underline">スキップしてダッシュボードへ</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
