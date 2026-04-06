'use client';

// EmailSubjectPreview と同じ仕様値
const IPHONE_SUBJECT_LIMIT = 33;
const GMAIL_SUBJECT_LIMIT = 60;

function previewSubject(subject: string, limit: number): { display: string; truncated: boolean } {
  const chars = [...subject];
  if (chars.length <= limit) return { display: subject, truncated: false };
  return { display: chars.slice(0, limit).join('') + '...', truncated: true };
}

interface Props {
  subject?: string;
  text: string;
  sender?: string;
  tab?: 'mobile' | 'gmail';
  imageUrl?: string;
}

export default function EmailBodyPreview({ subject, text, sender = 'MsgScore', tab = 'mobile', imageUrl }: Props) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  const dateStr = now.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric', weekday: 'short' });

  // 本文プレビューは先頭 300 文字まで
  const bodyPreview = text.slice(0, 300) + (text.length > 300 ? '…' : '');
  const charCount = subject ? [...subject].length : 0;

  return (
    <div className="space-y-4">

      {/* ── iPhone メール（開封後リーディングビュー） ─────── */}
      {tab === 'mobile' && (() => {
        const { display: subjectDisplay, truncated } = subject
          ? previewSubject(subject, IPHONE_SUBJECT_LIMIT)
          : { display: '', truncated: false };
        return (
          <div>
            <p className="text-xs text-stone-400 mb-2 font-medium">📱 iPhone メール（開封後）</p>
            <div className="bg-white rounded-[1.5rem] overflow-hidden border border-stone-300 shadow-md max-w-sm">

              {/* iOS ステータスバー */}
              <div className="bg-white flex items-center justify-between px-5 pt-2 pb-1">
                <p className="text-xs font-semibold text-stone-900">9:41</p>
                <div className="flex items-center gap-1">
                  <svg className="w-3.5 h-2.5 text-stone-900" viewBox="0 0 17 12" fill="currentColor">
                    <rect x="0" y="4" width="3" height="8" rx="0.5" />
                    <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5" />
                    <rect x="9" y="1" width="3" height="11" rx="0.5" />
                    <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
                  </svg>
                  <div className="w-5 h-2.5 rounded-sm border border-stone-900 relative ml-1">
                    <div className="absolute left-0.5 top-0.5 bottom-0.5 right-1 bg-stone-900 rounded-sm" />
                  </div>
                </div>
              </div>

              {/* iOS ナビゲーションバー */}
              <div className="bg-white px-4 pb-2 pt-1 flex items-center justify-between border-b border-stone-100">
                <p className="text-sm text-blue-500 font-medium">‹ 受信</p>
                <div className="flex items-center gap-3">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              </div>

              {/* メールヘッダー（送信者情報） */}
              <div className="bg-white px-4 pt-3 pb-3 border-b border-stone-100">
                {subject && (
                  <p className="text-base font-bold text-stone-900 leading-snug mb-2">
                    {subject}
                  </p>
                )}
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {sender[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <p className="text-sm font-semibold text-stone-900">{sender}</p>
                      <p className="text-xs text-stone-400 shrink-0 ml-2">{timeStr}</p>
                    </div>
                    <p className="text-xs text-stone-400">宛先: 自分 ›</p>
                  </div>
                </div>
              </div>

              {/* 本文 */}
              <div className="bg-white px-4 py-3">
                {imageUrl && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={imageUrl} alt="" className="w-full rounded mb-3" />
                )}
                <p className="text-sm text-stone-800 whitespace-pre-wrap break-words leading-relaxed">
                  {bodyPreview || <span className="text-stone-400">(本文なし)</span>}
                </p>
              </div>

              {/* iOS ツールバー */}
              <div className="bg-stone-50 border-t border-stone-100 px-6 py-3 flex items-center justify-around">
                {['archive', 'trash', 'folder', 'mail', 'reply'].map((icon) => (
                  <svg key={icon} className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                      d={icon === 'reply'
                        ? 'M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6'
                        : 'M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4'}
                    />
                  </svg>
                ))}
              </div>
            </div>

            {/* 受信トレイでの件名表示チェック */}
            {subject && (
              <div className="mt-1.5 space-y-0.5">
                <p className="text-xs text-stone-400">受信トレイ一覧での件名表示:</p>
                <p className="text-xs font-medium text-stone-700 bg-stone-100 rounded px-2 py-1 truncate">
                  {subjectDisplay}
                </p>
                {truncated ? (
                  <p className="text-xs text-red-500">
                    ⚠ {charCount}文字 — iPhone では {IPHONE_SUBJECT_LIMIT}文字以降が受信トレイで切れます
                  </p>
                ) : (
                  <p className="text-xs text-emerald-600">
                    ✓ iPhone 全機種で件名が完全表示されます（上限 {IPHONE_SUBJECT_LIMIT}文字）
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })()}

      {/* ── Gmail PC（スレッドリーディングビュー） ─────── */}
      {tab === 'gmail' && (() => {
        const { display: subjectDisplay, truncated } = subject
          ? previewSubject(subject, GMAIL_SUBJECT_LIMIT)
          : { display: '', truncated: false };
        return (
          <div>
            <p className="text-xs text-stone-400 mb-2 font-medium">🖥 Gmail（PC・開封後）</p>
            <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-md">

              {/* ウィンドウ枠 */}
              <div className="bg-stone-50 border-b border-stone-200 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <p className="text-xs text-stone-500 ml-2">Gmail — 受信トレイ</p>
              </div>

              {/* スレッド件名バー */}
              <div className="px-5 py-3 border-b border-stone-100 flex items-center justify-between">
                <p className="text-lg font-medium text-stone-900 truncate">{subject || '(件名なし)'}</p>
                <span className="ml-3 px-2 py-0.5 bg-stone-100 text-stone-500 text-xs rounded-full shrink-0">受信トレイ</span>
              </div>

              {/* メッセージ */}
              <div className="px-5 py-4">
                {/* 送信者バー */}
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold shrink-0">
                    {sender[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between">
                      <div className="flex items-baseline gap-2">
                        <p className="text-sm font-semibold text-stone-900">{sender}</p>
                        <p className="text-xs text-stone-400">&lt;{sender.toLowerCase()}@example.com&gt;</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 ml-2">
                        <p className="text-xs text-stone-400">{dateStr} {timeStr}</p>
                        <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                        </svg>
                        <svg className="w-4 h-4 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                        </svg>
                      </div>
                    </div>
                    <p className="text-xs text-stone-400 mt-0.5">宛先: 自分</p>
                  </div>
                </div>

                {/* 本文 */}
                <div className="pl-13">
                  {imageUrl && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={imageUrl} alt="" className="w-full rounded mb-3" />
                  )}
                  <p className="text-sm text-stone-800 whitespace-pre-wrap break-words leading-relaxed">
                    {bodyPreview || <span className="text-stone-400">(本文なし)</span>}
                  </p>
                </div>
              </div>

              {/* Gmail 返信ボタン */}
              <div className="px-5 pb-4 flex items-center gap-3">
                <button className="flex items-center gap-1.5 border border-stone-300 rounded-full px-4 py-1.5 text-sm text-stone-700 hover:bg-stone-50">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6" />
                  </svg>
                  返信
                </button>
                <button className="flex items-center gap-1.5 border border-stone-300 rounded-full px-4 py-1.5 text-sm text-stone-700 hover:bg-stone-50">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h10a8 8 0 018 8v2M3 10l6 6m-6-6l6-6 M14 10h7" />
                  </svg>
                  全員に返信
                </button>
                <button className="flex items-center gap-1.5 border border-stone-300 rounded-full px-4 py-1.5 text-sm text-stone-700 hover:bg-stone-50">
                  転送
                </button>
              </div>
            </div>

            {/* 受信トレイでの件名表示チェック */}
            {subject && (
              <div className="mt-1.5 space-y-0.5">
                <p className="text-xs text-stone-400">受信トレイ一覧での件名表示:</p>
                <p className="text-xs font-medium text-stone-700 bg-stone-100 rounded px-2 py-1 truncate">
                  {subjectDisplay}
                </p>
                {truncated ? (
                  <p className="text-xs text-red-500">
                    ⚠ {charCount}文字 — Gmail PC では {GMAIL_SUBJECT_LIMIT}文字以降が受信トレイで切れます
                  </p>
                ) : (
                  <p className="text-xs text-emerald-600">
                    ✓ Gmail PC 標準ウィンドウで件名が完全表示されます（上限 {GMAIL_SUBJECT_LIMIT}文字）
                  </p>
                )}
              </div>
            )}
          </div>
        );
      })()}
    </div>
  );
}
