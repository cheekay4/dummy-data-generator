'use client';

interface Props {
  text: string;
  sender?: string;
}

export default function LinePreview({ text, sender = 'MsgScore' }: Props) {
  const lines = text.split('\n');

  return (
    <div className="space-y-4">
      {/* LINE トーク */}
      <div>
        <p className="text-xs text-stone-400 mb-2 font-medium">LINEトーク</p>
        <div className="bg-[#87CEEB] rounded-2xl p-3 max-w-xs overflow-hidden shadow-sm">
          <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/30">
            <div className="w-8 h-8 rounded-full bg-[#00B900] flex items-center justify-center text-white text-xs font-bold shrink-0">
              {sender[0]}
            </div>
            <p className="text-sm font-semibold text-white">{sender}</p>
          </div>
          <div className="flex items-start gap-2">
            <div className="w-8 h-8 rounded-full bg-[#00B900] flex items-center justify-center text-white text-xs font-bold shrink-0 mt-0.5">
              {sender[0]}
            </div>
            <div className="flex-1">
              <div className="bg-white rounded-2xl rounded-tl-sm p-3 shadow-sm">
                <p className="text-sm text-stone-800 whitespace-pre-wrap break-words leading-relaxed">
                  {text.slice(0, 200)}{text.length > 200 ? '…' : ''}
                </p>
              </div>
              <p className="text-[10px] text-stone-600 mt-1 ml-1">既読 {new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</p>
            </div>
          </div>
        </div>
      </div>

      {/* LINE 一覧 */}
      <div>
        <p className="text-xs text-stone-400 mb-2 font-medium">LINE トーク一覧</p>
        <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm max-w-sm">
          <div className="px-4 py-3 flex items-center gap-3 border-b border-stone-100">
            <div className="w-10 h-10 rounded-full bg-[#00B900] flex items-center justify-center text-white text-sm font-bold shrink-0">
              {sender[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-baseline">
                <p className="text-sm font-semibold text-stone-900 truncate">{sender}</p>
                <p className="text-xs text-stone-400 shrink-0 ml-2">{new Date().toLocaleTimeString('ja-JP', { hour: '2-digit', minute: '2-digit' })}</p>
              </div>
              <p className="text-xs text-stone-500 truncate mt-0.5">
                {lines[0] || text.slice(0, 40)}
              </p>
            </div>
          </div>
        </div>
        {text.length > 500 && (
          <p className="text-xs text-amber-600 mt-1">
            ⚠ {text.length}文字。LINE配信では500文字を超えると読了率が下がる傾向があります
          </p>
        )}
      </div>
    </div>
  );
}
