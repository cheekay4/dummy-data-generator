"use client";

import { Share2 } from "lucide-react";

interface ShareButtonProps {
  toolName: string;
  toolUrl: string;
  show: boolean;
}

export function ShareButton({ toolName, toolUrl, show }: ShareButtonProps): React.ReactElement | null {
  if (!show) return null;

  const text = encodeURIComponent(`tools24.jpの${toolName}、便利でした 登録不要で無料。`);
  const url = encodeURIComponent(toolUrl);

  return (
    <div className="rounded-xl border border-[var(--surface-border)] bg-[var(--surface)] p-4 mt-6">
      <p className="text-xs text-muted-foreground mb-3 flex items-center gap-1.5">
        <Share2 className="h-3.5 w-3.5" />
        このツール、役に立ったらシェアしてください
      </p>
      <div className="flex gap-2">
        <a
          href={`https://twitter.com/intent/tweet?text=${text}&url=${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[var(--surface-border)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          X (Twitter)
        </a>
        <a
          href={`https://line.me/R/msg/text/?${text}%20${url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-lg border border-[var(--surface-border)] px-3 py-1.5 text-xs font-medium transition-colors hover:bg-muted"
        >
          LINE
        </a>
      </div>
    </div>
  );
}
