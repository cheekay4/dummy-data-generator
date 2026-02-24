'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useTeam } from '@/hooks/useTeam';
import type { SlackNotifications } from '@/lib/types';

const NOTIFICATION_LABELS: { key: keyof SlackNotifications; label: string; desc: string }[] = [
  { key: 'min_score',        label: '最低スコアライン未達時', desc: 'スコアが設定値を下回ったときに通知' },
  { key: 'approval_request', label: '承認リクエスト発生時',   desc: '承認が必要な結果が生成されたとき' },
  { key: 'approval_complete',label: '承認完了 / 修正依頼時',  desc: '管理者が承認または修正依頼を行ったとき' },
  { key: 'all_scoring',      label: '全スコアリング実行時',   desc: 'チームメンバーが実行するたびに通知（高頻度になる可能性があります）' },
  { key: 'feedback',         label: 'フィードバック投稿時',   desc: 'メンバーがフィードバックを投稿したとき' },
];

export default function SlackSettingsPage() {
  const { team, myMember, isOwner, loading } = useTeam();

  const [webhookUrl, setWebhookUrl] = useState('');
  const [notifications, setNotifications] = useState<SlackNotifications>({
    min_score: true,
    approval_request: true,
    approval_complete: true,
    all_scoring: false,
    feedback: false,
  });
  const [fetching, setFetching] = useState(true);
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [saveMsg, setSaveMsg] = useState('');
  const [testMsg, setTestMsg] = useState('');

  useEffect(() => {
    if (!team) return;
    fetch('/api/team/settings/slack')
      .then(r => r.json())
      .then((d: { slack_webhook_url?: string; slack_notifications?: SlackNotifications }) => {
        setWebhookUrl(d.slack_webhook_url ?? '');
        if (d.slack_notifications) setNotifications(d.slack_notifications);
      })
      .finally(() => setFetching(false));
  }, [team]);

  async function handleSave() {
    setSaving(true);
    setSaveMsg('');
    const res = await fetch('/api/team/settings/slack', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ slack_webhook_url: webhookUrl || null, slack_notifications: notifications }),
    });
    setSaving(false);
    setSaveMsg(res.ok ? '保存しました ✅' : '保存に失敗しました ❌');
    setTimeout(() => setSaveMsg(''), 3000);
  }

  async function handleTest() {
    setTesting(true);
    setTestMsg('');
    const res = await fetch('/api/team/settings/slack', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ webhook_url: webhookUrl }),
    });
    const d = await res.json() as { success?: boolean; error?: string };
    setTesting(false);
    setTestMsg(d.success ? 'テスト送信成功 ✅ Slackを確認してください' : `失敗: ${d.error ?? '不明なエラー'}`);
    setTimeout(() => setTestMsg(''), 5000);
  }

  if (loading || fetching) return <div className="p-8 text-stone-500">読み込み中...</div>;
  if (!team) return <div className="p-8 text-stone-500">チームに所属していません。</div>;

  // Team Pro ゲーティング
  if (team.plan !== 'team_pro') {
    return (
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="relative rounded-2xl overflow-hidden border border-stone-200">
          <div className="blur-sm pointer-events-none p-8 space-y-3">
            <h1 className="text-2xl font-bold text-stone-900">🔔 Slack連携設定</h1>
            <p className="text-stone-500">Slackに通知を送信してチームの状況をリアルタイムで把握できます。</p>
          </div>
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 backdrop-blur-sm">
            <div className="text-center space-y-3 p-8">
              <p className="text-lg font-semibold text-stone-800">Team Proプランが必要です</p>
              <Link href="/pricing" className="inline-block mt-2 px-6 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Team Proにアップグレード
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/team" className="text-stone-400 hover:text-stone-600 text-sm">← チーム</Link>
        <span className="text-stone-300">/</span>
        <h1 className="text-xl font-bold text-stone-900">🔔 Slack連携設定</h1>
      </div>

      <p className="text-sm text-stone-500">
        Slackに通知を送信して、チームのスコアリング状況をリアルタイムに把握できます。
      </p>

      <div className="bg-white border border-stone-200 rounded-2xl p-5 space-y-4">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Webhook URL</label>
          <input
            type="url"
            value={webhookUrl}
            onChange={e => setWebhookUrl(e.target.value)}
            placeholder="https://hooks.slack.com/services/T.../B.../xxx"
            disabled={!isOwner}
            className="w-full border border-stone-200 rounded-lg px-3 py-2 text-sm font-mono outline-none focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100 disabled:bg-stone-50"
          />
          <details className="mt-2">
            <summary className="text-xs text-indigo-500 cursor-pointer hover:underline">Slackアプリの設定方法</summary>
            <ol className="mt-2 space-y-1 text-xs text-stone-500 list-decimal list-inside">
              <li>Slack で「Incoming Webhooks」アプリを追加</li>
              <li>通知を受け取るチャンネルを選択</li>
              <li>Webhook URLをコピーしてここに貼り付け</li>
            </ol>
          </details>
        </div>

        <div>
          <p className="text-sm font-medium text-stone-700 mb-2">通知する条件</p>
          <div className="space-y-2">
            {NOTIFICATION_LABELS.map(({ key, label, desc }) => (
              <label key={key} className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={notifications[key]}
                  onChange={e => setNotifications(prev => ({ ...prev, [key]: e.target.checked }))}
                  disabled={!isOwner}
                  className="mt-0.5"
                />
                <div>
                  <p className="text-sm text-stone-800">{label}</p>
                  <p className="text-xs text-stone-400">{desc}</p>
                </div>
              </label>
            ))}
          </div>
        </div>

        {isOwner && (
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleTest}
              disabled={testing || !webhookUrl}
              className="px-4 py-2 border border-stone-300 rounded-xl text-sm text-stone-700 hover:bg-stone-50 disabled:opacity-50 transition-colors"
            >
              {testing ? '送信中...' : 'テスト送信'}
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="flex-1 py-2 bg-indigo-600 text-white rounded-xl text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition-colors"
            >
              {saving ? '保存中...' : '保存'}
            </button>
          </div>
        )}

        {(saveMsg || testMsg) && (
          <p className={`text-sm ${(saveMsg || testMsg).includes('✅') ? 'text-emerald-600' : 'text-red-500'}`}>
            {saveMsg || testMsg}
          </p>
        )}
      </div>
    </div>
  );
}
