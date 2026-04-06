import { cn } from "@/lib/utils";

type AdPosition = "header" | "content" | "sidebar";

interface AdPlaceholderProps {
  position: AdPosition;
  className?: string;
}

export function AdPlaceholder({ position, className }: AdPlaceholderProps) {
  return (
    <div
      className={cn(className)}
      style={{ height: 0, overflow: "hidden" }}
      data-ad-position={position}
    >
      {/* AdSense: ここにad unitコードを貼る */}
    </div>
  );
}
