"use client";

import { useRef, useEffect, useState } from "react";
import { Wrench, UserX, ShieldCheck } from "lucide-react";

interface Stat {
  value: string;
  label: string;
  icon: React.ReactNode;
}

const STATS: Stat[] = [
  { value: "27+", label: "ツール提供中", icon: <Wrench className="h-5 w-5" /> },
  { value: "0", label: "アカウント登録", icon: <UserX className="h-5 w-5" /> },
  { value: "0", label: "外部データ送信", icon: <ShieldCheck className="h-5 w-5" /> },
];

function AnimatedNumber({ target, suffix }: { target: string; suffix?: string }): React.ReactElement {
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);
  const animated = useRef(false);

  useEffect(() => {
    if (animated.current) return;
    const num = parseInt(target, 10);
    if (isNaN(num)) {
      setDisplay(target);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting || animated.current) return;
        animated.current = true;
        const duration = 1200;
        const start = performance.now();
        function tick(now: number): void {
          const progress = Math.min((now - start) / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          setDisplay(String(Math.round(num * eased)));
          if (progress < 1) requestAnimationFrame(tick);
          else setDisplay(target);
        }
        requestAnimationFrame(tick);
      },
      { threshold: 0.3 }
    );

    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target]);

  return (
    <span ref={ref} className="text-2xl font-bold text-blue-600 dark:text-blue-400 tabular-nums">
      {display}{suffix}
    </span>
  );
}

export function StatsBar(): React.ReactElement {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-[800px] mx-auto mt-8">
      {STATS.map((stat) => (
        <div
          key={stat.label}
          className="flex items-center gap-3 rounded-2xl border border-[var(--surface-border)] bg-[var(--surface)] px-5 py-4"
        >
          <div className="text-muted-foreground">{stat.icon}</div>
          <div>
            <AnimatedNumber target={stat.value} suffix={stat.value.endsWith("+") ? "" : undefined} />
            <p className="text-xs text-muted-foreground mt-0.5">{stat.label}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
