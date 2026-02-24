'use client';
import { useState } from 'react';

export default function ShareButton({ shareToken }: { shareToken: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    const url = `${window.location.origin}/share/${shareToken}`;
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <button
      onClick={handleCopy}
      className="flex items-center gap-2 px-4 py-2 border border-stone-300 rounded-xl text-stone-600 text-sm hover:bg-stone-50 transition-colors"
    >
      {copied ? (
        <>✓ URLをコピーしました</>
      ) : (
        <>🔗 結果を共有する</>
      )}
    </button>
  );
}
