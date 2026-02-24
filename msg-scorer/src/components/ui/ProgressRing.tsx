'use client';
import { useEffect, useState } from 'react';

interface Props {
  score: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export default function ProgressRing({ score, size = 120, strokeWidth = 10, className }: Props) {
  const [animated, setAnimated] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (animated / 100) * circumference;
  const color = score >= 71 ? '#10B981' : score >= 41 ? '#F59E0B' : '#EF4444';

  useEffect(() => {
    const t = setTimeout(() => setAnimated(score), 100);
    return () => clearTimeout(t);
  }, [score]);

  return (
    <svg
      width={size}
      height={size}
      className={`-rotate-90 ${className ?? ''}`}
      aria-label={`スコア ${score}`}
    >
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke="#E7E5E4"
        strokeWidth={strokeWidth}
        fill="transparent"
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={color}
        strokeWidth={strokeWidth}
        fill="transparent"
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1s ease-out' }}
      />
    </svg>
  );
}
