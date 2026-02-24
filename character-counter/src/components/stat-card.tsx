import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: number | string;
  className?: string;
}

export function StatCard({ label, value, className }: StatCardProps) {
  return (
    <div
      className={cn(
        "rounded-lg border bg-card p-4 text-center shadow-sm",
        className
      )}
    >
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-bold tabular-nums">{value}</p>
    </div>
  );
}
