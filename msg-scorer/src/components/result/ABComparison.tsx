'use client';
import { useState } from 'react';
import { ABVariant, ConversionGoal, CONVERSION_LABELS } from '@/lib/types';
import { trackEvent } from '@/lib/analytics';

interface VariantCardProps {
  variant: ABVariant;
  conversionGoal: ConversionGoal;
}

function VariantCard({ variant, conversionGoal }: VariantCardProps) {
  const [copied, setCopied] = useState(false);
  const isClick = conversionGoal === 'click';
  const convLabel = CONVERSION_LABELS[conversionGoal].finalMetricLabel;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(variant.text);
    setCopied(true);
    trackEvent('ab_variant_copied', { label: variant.label });
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div className="bg-white border border-stone-200 rounded-xl p-5 flex flex-col gap-4">
      <div className="flex items-start justify-between gap-2">
        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100">
          {variant.label}
        </span>
      </div>

      <p className="text-sm text-stone-800 leading-relaxed bg-stone-50 rounded-lg p-3 border border-stone-100 whitespace-pre-wrap">
        {variant.text}
      </p>

      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="bg-stone-50 rounded-lg px-3 py-2">
          <p className="text-stone-400">開封率</p>
          <p className="font-mono-score font-semibold text-stone-700 text-sm">
            {variant.predictedOpenRate.toFixed(1)}%
          </p>
        </div>
        <div className="bg-stone-50 rounded-lg px-3 py-2">
          <p className="text-stone-400">CTR</p>
          <p className="font-mono-score font-semibold text-stone-700 text-sm">
            {variant.predictedCtr.toFixed(1)}%
          </p>
        </div>
        {!isClick && (
          <div className="col-span-2 bg-emerald-50 rounded-lg px-3 py-2 border border-emerald-100">
            <p className="text-emerald-500">{convLabel}</p>
            <p className="font-mono-score font-semibold text-emerald-700 text-base">
              {variant.predictedConversionCount}件
            </p>
          </div>
        )}
      </div>

      <button
        onClick={() => void handleCopy()}
        className={`w-full text-center text-sm py-2.5 rounded-xl border transition-all duration-200 ${
          copied
            ? 'bg-emerald-50 border-emerald-200 text-emerald-600'
            : 'bg-white border-stone-200 text-stone-600 hover:bg-stone-50'
        }`}
      >
        {copied ? 'コピーしました ✓' : 'コピー'}
      </button>
    </div>
  );
}

interface Props {
  variants: ABVariant[];
  conversionGoal: ConversionGoal;
}

export default function ABComparison({ variants, conversionGoal }: Props) {
  return (
    <div>
      <h3 className="font-outfit font-semibold text-stone-900 mb-4">🔀 A/Bテスト案</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {variants.map((v, i) => (
          <VariantCard key={i} variant={v} conversionGoal={conversionGoal} />
        ))}
      </div>
    </div>
  );
}
