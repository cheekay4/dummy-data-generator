import { ShieldCheck } from "lucide-react";

export function ToolMeta(): React.ReactElement {
  return (
    <p className="flex items-center gap-1.5 text-xs text-muted-foreground mb-4">
      <ShieldCheck className="h-3.5 w-3.5" />
      登録不要・無料 — データはお使いの端末内で処理されます
    </p>
  );
}
