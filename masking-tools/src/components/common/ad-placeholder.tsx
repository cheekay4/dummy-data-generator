interface AdPlaceholderProps {
  slot: string;
  width: number;
  height: number;
  isPro?: boolean;
}

export function AdPlaceholder({ slot, width, height, isPro }: AdPlaceholderProps) {
  if (isPro) return null;
  return (
    <div
      className="border-2 border-dashed border-muted-foreground/20 rounded flex items-center justify-center bg-muted/30 text-muted-foreground/50 text-xs mx-auto"
      style={{ width: Math.min(width, 728), height }}
      data-slot={slot}
    >
      {/* AdSense: ここにad unitコードを貼る */}
      広告
    </div>
  );
}
