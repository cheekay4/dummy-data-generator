'use client';

import { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { renderStamp } from '@/lib/digital-stamp/canvas-renderer';
import type { StampOptions } from '@/lib/digital-stamp/stamp-types';

interface StampPreviewProps {
  options: StampOptions;
}

type BgMode = 'white' | 'checker' | 'document';

const BG_LABELS: Record<BgMode, string> = {
  white: '白背景',
  checker: '市松模様',
  document: '書類風',
};

const BG_STYLES: Record<BgMode, React.CSSProperties> = {
  white: { backgroundColor: '#ffffff' },
  checker: {
    backgroundImage: 'repeating-conic-gradient(#e5e5e5 0% 25%, #ffffff 0% 50%)',
    backgroundSize: '16px 16px',
  },
  document: { backgroundColor: '#f5f0e8', border: '1px solid #d4c5a0' },
};

export default function StampPreview({ options }: StampPreviewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [bgMode, setBgMode] = useState<BgMode>('checker');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    // フォントロード後に描画
    const font = new FontFace('Noto Serif JP', 'url(https://fonts.gstatic.com/s/notoserifjp/v30/xn7mYHs72GKoTvER4Gn3b5eMZBaPRkgfU8fEwb0.woff2)');
    font.load().then(() => {
      document.fonts.add(font);
      renderStamp(canvas, options);
    }).catch(() => {
      renderStamp(canvas, options);
    });
  }, [options]);

  const displaySize = Math.min(options.size, 300);

  return (
    <div className="space-y-3">
      <div className="flex gap-2 flex-wrap">
        {(Object.keys(BG_LABELS) as BgMode[]).map((mode) => (
          <Button
            key={mode}
            variant={bgMode === mode ? 'default' : 'outline'}
            size="sm"
            onClick={() => setBgMode(mode)}
          >
            {BG_LABELS[mode]}
          </Button>
        ))}
      </div>
      <div
        className="flex items-center justify-center rounded-lg p-8 min-h-[320px]"
        style={BG_STYLES[bgMode]}
      >
        <canvas
          ref={canvasRef}
          style={{ width: displaySize, height: displaySize, maxWidth: '100%' }}
        />
      </div>
    </div>
  );
}
