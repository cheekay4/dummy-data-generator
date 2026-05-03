"use client";

interface Props {
  value: number;
}

export function Progress({ value }: Props): React.ReactElement {
  const clamped = Math.max(0, Math.min(100, value));
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
      <div
        className="h-full bg-primary transition-[width] duration-150"
        style={{ width: `${clamped}%` }}
      />
    </div>
  );
}
