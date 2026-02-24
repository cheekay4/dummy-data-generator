'use client';
import Link from 'next/link';
import ProBadge from './ProBadge';

interface Props {
  children: React.ReactNode;
  isPro: boolean;
  label?: string;
}

export default function ProGate({ children, isPro, label }: Props) {
  if (isPro) return <>{children}</>;

  return (
    <div className="relative rounded-2xl overflow-hidden">
      <div className="select-none pointer-events-none blur-sm opacity-60">
        {children}
      </div>
      <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 backdrop-blur-[2px] rounded-2xl">
        <ProBadge />
        <p className="text-sm font-semibold text-stone-700 mt-2">
          {label ?? 'Pro機能です'}
        </p>
        <Link
          href="/pricing"
          className="mt-3 px-4 py-2 bg-indigo-600 text-white text-xs font-semibold rounded-lg hover:bg-indigo-700 transition-colors"
        >
          Proプランを見る
        </Link>
      </div>
    </div>
  );
}
