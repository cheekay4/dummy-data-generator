'use client';

// メールクライアント別の件名表示上限（文字数・全角/半角問わず）
const IPHONE_SUBJECT_LIMIT = 33; // iPhone Mail: SE〜Pro Max 全機種で完全表示できる実測上限
const GMAIL_SUBJECT_LIMIT = 60;  // Gmail PC: 標準ウィンドウ幅での実用上限

interface Props {
  subject: string;
  sender?: string;
  tab?: 'mobile' | 'gmail';
}

export default function EmailSubjectPreview({ subject, sender = 'MsgScore', tab = 'mobile' }: Props) {
  const now = new Date();
  const timeStr = now.toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' });
  const charCount = [...subject].length;

  // 表示範囲と切れ部分を算出（Unicode文字単位）
  const chars = [...subject];
  const iphoneVisible = chars.slice(0, IPHONE_SUBJECT_LIMIT).join('');
  const iphoneCut    = chars.slice(IPHONE_SUBJECT_LIMIT).join('');
  const gmailVisible = chars.slice(0, GMAIL_SUBJECT_LIMIT).join('');
  const gmailCut     = chars.slice(GMAIL_SUBJECT_LIMIT).join('');
  const iphoneTrunc  = charCount > IPHONE_SUBJECT_LIMIT;
  const gmailTrunc   = charCount > GMAIL_SUBJECT_LIMIT;

  return (
    <div className="space-y-4">

      {/* ── iPhone メール ──────────────────────────── */}
      {tab === 'mobile' && (
        <div>
          <p className="text-xs text-stone-400 mb-2 font-medium">📱 iPhone メール</p>

          {/* iOS Mail 風フレーム */}
          <div className="bg-stone-100 rounded-[1.5rem] overflow-hidden border border-stone-300 shadow-md max-w-sm">
            {/* iOS ステータスバー */}
            <div className="bg-stone-100 flex items-center justify-between px-5 pt-2 pb-1">
              <p className="text-xs font-semibold text-stone-900">9:41</p>
              <div className="flex items-center gap-1">
                <svg className="w-3.5 h-2.5 text-stone-900" viewBox="0 0 17 12" fill="currentColor">
                  <rect x="0" y="4" width="3" height="8" rx="0.5" />
                  <rect x="4.5" y="2.5" width="3" height="9.5" rx="0.5" />
                  <rect x="9" y="1" width="3" height="11" rx="0.5" />
                  <rect x="13.5" y="0" width="3" height="12" rx="0.5" opacity="0.3" />
                </svg>
                <svg className="w-3 h-3 text-stone-900" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M1.5 8.5a13.5 13.5 0 0121 0M5 13a10 10 0 0114 0m-3.5 4.5a5 5 0 00-7 0M12 20.5h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
                </svg>
                <div className="flex items-center gap-0.5">
                  <div className="w-5 h-2.5 rounded-sm border border-stone-900 relative">
                    <div className="absolute left-0.5 top-0.5 bottom-0.5 right-1 bg-stone-900 rounded-sm" />
                  </div>
                  <div className="w-0.5 h-1.5 bg-stone-900 rounded-r-sm" />
                </div>
              </div>
            </div>

            {/* iOS Mail ヘッダー */}
            <div className="bg-stone-100 px-5 pb-2 flex items-end justify-between">
              <div>
                <p className="text-xs text-blue-500 font-medium">‹ メールボックス</p>
                <p className="text-2xl font-bold text-stone-900 leading-tight mt-0.5">受信</p>
              </div>
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-sm font-bold">
                {sender[0]}
              </div>
            </div>

            {/* 検索バー */}
            <div className="bg-stone-100 px-4 pb-2">
              <div className="bg-stone-200 rounded-xl px-3 py-1.5 flex items-center gap-2">
                <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <p className="text-xs text-stone-400">検索</p>
              </div>
            </div>

            {/* 未読メール行（プレビュー対象） */}
            <div className="bg-white px-4 py-3 flex items-start gap-3 border-t border-stone-200">
              <div className="w-2.5 h-2.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-semibold text-stone-900 truncate">{sender}</p>
                  <p className="text-xs text-stone-400 shrink-0 ml-2">{timeStr}</p>
                </div>
                <p className="text-sm font-semibold text-stone-900 mt-0.5 leading-snug">
                  {iphoneVisible || <span className="text-stone-300">(件名なし)</span>}
                  {iphoneCut && <span className="text-red-400 opacity-60">…</span>}
                </p>
                <p className="text-xs text-stone-400 truncate mt-0.5">
                  本文の最初の数行がここに表示されます...
                </p>
              </div>
              <svg className="w-3 h-3 text-stone-300 shrink-0 mt-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>

            {/* 既読メール行（コンテキスト用 / 半透明） */}
            <div className="bg-white px-4 py-2.5 flex items-start gap-3 border-t border-stone-100 opacity-30">
              <div className="w-2.5 h-2.5 mt-1.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm font-medium text-stone-600">別の差出人</p>
                  <p className="text-xs text-stone-400 shrink-0 ml-2">昨日</p>
                </div>
                <p className="text-sm text-stone-500 mt-0.5">別の件名がここに表示されます</p>
                <p className="text-xs text-stone-400 truncate mt-0.5">本文プレビュー...</p>
              </div>
              <svg className="w-3 h-3 text-stone-300 shrink-0 mt-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>

          {/* 文字数インジケーター */}
          {iphoneTrunc ? (
            <p className="text-xs text-red-500 mt-1.5">
              ⚠ {charCount}文字 — iPhone では <strong>{IPHONE_SUBJECT_LIMIT}文字以降</strong>（赤い「…」の部分）が受信トレイで表示されません
            </p>
          ) : (
            <p className="text-xs text-emerald-600 mt-1.5">
              ✓ {charCount}文字 — iPhone 全機種で完全表示できます（上限 {IPHONE_SUBJECT_LIMIT}文字）
            </p>
          )}
        </div>
      )}

      {/* ── Gmail（PC） ─────────────────────────────── */}
      {tab === 'gmail' && (
        <div>
          <p className="text-xs text-stone-400 mb-2 font-medium">🖥 Gmail（PC）</p>

          {/* Gmail 風フレーム */}
          <div className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-md">
            {/* ウィンドウ枠 */}
            <div className="bg-stone-50 border-b border-stone-200 px-4 py-2 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-3">
                <div className="bg-white border border-stone-200 rounded-full px-3 py-0.5 flex items-center gap-1.5">
                  <svg className="w-3 h-3 text-stone-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <p className="text-xs text-stone-400 truncate">メールを検索</p>
                </div>
              </div>
            </div>

            {/* 未読メール行（太字・白背景） */}
            <div className="px-4 py-2.5 flex items-center gap-3 bg-white border-b border-stone-100">
              <div className="w-4 h-4 border-2 border-stone-300 rounded shrink-0" />
              <svg className="w-4 h-4 text-stone-300 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <div className="w-8 h-8 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
                {sender[0]}
              </div>
              <p className="text-sm font-bold text-stone-900 w-24 shrink-0 truncate">{sender}</p>
              <div className="flex-1 flex items-baseline gap-1.5 min-w-0 overflow-hidden">
                <p className="text-sm font-bold text-stone-900 shrink-0 max-w-[60%] truncate">
                  {gmailVisible || <span className="font-normal text-stone-400">(件名なし)</span>}
                  {gmailCut && <span className="text-red-400 font-normal opacity-60">…</span>}
                </p>
                <p className="text-sm text-stone-400 font-normal truncate">
                  – メール本文の最初の数行がスニペットとして表示されます
                </p>
              </div>
              <p className="text-xs font-bold text-stone-900 shrink-0 ml-2">{timeStr}</p>
            </div>

            {/* 既読メール行（細字・薄背景） */}
            <div className="px-4 py-2.5 flex items-center gap-3 bg-stone-50 opacity-40">
              <div className="w-4 h-4 border border-stone-300 rounded shrink-0" />
              <svg className="w-4 h-4 text-yellow-400 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
              </svg>
              <div className="w-8 h-8 rounded-full bg-stone-400 flex items-center justify-center text-white text-xs font-bold shrink-0">A</div>
              <p className="text-sm text-stone-500 w-24 shrink-0 truncate">別の差出人</p>
              <div className="flex-1 flex items-baseline gap-1.5 min-w-0 overflow-hidden">
                <p className="text-sm text-stone-500 truncate shrink-0">別の件名</p>
                <p className="text-sm text-stone-400 truncate">– 本文プレビュー</p>
              </div>
              <p className="text-xs text-stone-400 shrink-0 ml-2">昨日</p>
            </div>
          </div>

          {/* 文字数インジケーター */}
          {gmailTrunc ? (
            <p className="text-xs text-red-500 mt-1.5">
              ⚠ {charCount}文字 — Gmail PC では <strong>{GMAIL_SUBJECT_LIMIT}文字以降</strong>（赤い「…」の部分）が受信トレイで表示されません
            </p>
          ) : (
            <p className="text-xs text-emerald-600 mt-1.5">
              ✓ {charCount}文字 — Gmail PC 標準ウィンドウで完全表示できます（上限 {GMAIL_SUBJECT_LIMIT}文字）
            </p>
          )}
        </div>
      )}
    </div>
  );
}
