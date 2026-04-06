'use client';

import {
  useState,
  useCallback,
  useEffect,
  useRef,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CropPanelProps {
  sourceImg: HTMLImageElement | null;
  sourceUrl: string;
  onResult: (
    blob: Blob,
    dimensions: { w: number; h: number },
    label: string,
    type: 'resize' | 'compress' | 'crop'
  ) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

interface CropSelection {
  x: number;
  y: number;
  w: number;
  h: number;
}

type DragMode =
  | 'none'
  | 'create'
  | 'move'
  | 'nw'
  | 'n'
  | 'ne'
  | 'e'
  | 'se'
  | 's'
  | 'sw'
  | 'w';

interface Point {
  x: number;
  y: number;
}

const HANDLE_SIZE = 8;
const ASPECT_PRESETS: { label: string; value: string; ratio?: number }[] = [
  { label: '自由', value: 'free' },
  { label: '1:1 (正方形)', value: '1:1', ratio: 1 },
  { label: '4:3', value: '4:3', ratio: 4 / 3 },
  { label: '3:2', value: '3:2', ratio: 3 / 2 },
  { label: '16:9', value: '16:9', ratio: 16 / 9 },
  { label: '9:16 (縦長)', value: '9:16', ratio: 9 / 16 },
  { label: 'カスタム', value: 'custom' },
];

function getAspectRatio(
  constraint: string,
  customW: number,
  customH: number
): number | null {
  if (constraint === 'free') return null;
  if (constraint === 'custom') {
    return customW > 0 && customH > 0 ? customW / customH : null;
  }
  const preset = ASPECT_PRESETS.find((p) => p.value === constraint);
  return preset?.ratio ?? null;
}

function clampSelection(
  sel: CropSelection,
  imgW: number,
  imgH: number
): CropSelection {
  let { x, y, w, h } = sel;
  w = Math.max(1, Math.min(w, imgW));
  h = Math.max(1, Math.min(h, imgH));
  x = Math.max(0, Math.min(x, imgW - w));
  y = Math.max(0, Math.min(y, imgH - h));
  return { x, y, w, h };
}

export default function CropPanel({
  sourceImg,
  sourceUrl,
  onResult,
  isProcessing,
  setIsProcessing,
}: CropPanelProps): React.ReactElement {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [selection, setSelection] = useState<CropSelection | null>(null);
  const [aspectConstraint, setAspectConstraint] = useState('free');
  const [customAspectW, setCustomAspectW] = useState(4);
  const [customAspectH, setCustomAspectH] = useState(3);
  const [dragMode, setDragMode] = useState<DragMode>('none');
  const dragStartRef = useRef<Point | null>(null);
  const selStartRef = useRef<CropSelection | null>(null);
  const scaleRef = useRef(1);

  // Draw canvas
  const draw = useCallback((): void => {
    const canvas = canvasRef.current;
    const img = sourceImg;
    if (!canvas || !img) return;

    const container = containerRef.current;
    if (!container) return;

    const maxW = container.clientWidth;
    const maxH = 500;
    const scale = Math.min(1, maxW / img.naturalWidth, maxH / img.naturalHeight);
    scaleRef.current = scale;

    const cw = Math.round(img.naturalWidth * scale);
    const ch = Math.round(img.naturalHeight * scale);
    canvas.width = cw;
    canvas.height = ch;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Draw image
    ctx.drawImage(img, 0, 0, cw, ch);

    // Draw overlay + selection
    if (selection) {
      const sx = selection.x * scale;
      const sy = selection.y * scale;
      const sw = selection.w * scale;
      const sh = selection.h * scale;

      // Semi-transparent overlay
      ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
      ctx.fillRect(0, 0, cw, sy);
      ctx.fillRect(0, sy, sx, sh);
      ctx.fillRect(sx + sw, sy, cw - sx - sw, sh);
      ctx.fillRect(0, sy + sh, cw, ch - sy - sh);

      // Selection border
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.strokeRect(sx, sy, sw, sh);
      ctx.setLineDash([]);

      // Handles
      const handles = getHandlePositions(sx, sy, sw, sh);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#333333';
      ctx.lineWidth = 1;
      for (const pos of handles) {
        ctx.fillRect(
          pos.x - HANDLE_SIZE / 2,
          pos.y - HANDLE_SIZE / 2,
          HANDLE_SIZE,
          HANDLE_SIZE
        );
        ctx.strokeRect(
          pos.x - HANDLE_SIZE / 2,
          pos.y - HANDLE_SIZE / 2,
          HANDLE_SIZE,
          HANDLE_SIZE
        );
      }
    }
  }, [sourceImg, selection]);

  useEffect(() => {
    draw();
  }, [draw]);

  useEffect(() => {
    const handleResize = (): void => draw();
    window.addEventListener('resize', handleResize);
    return (): void => window.removeEventListener('resize', handleResize);
  }, [draw]);

  // Reset selection when source changes
  useEffect(() => {
    setSelection(null);
  }, [sourceUrl]);

  function getHandlePositions(
    sx: number,
    sy: number,
    sw: number,
    sh: number
  ): Point[] {
    return [
      { x: sx, y: sy }, // nw
      { x: sx + sw / 2, y: sy }, // n
      { x: sx + sw, y: sy }, // ne
      { x: sx + sw, y: sy + sh / 2 }, // e
      { x: sx + sw, y: sy + sh }, // se
      { x: sx + sw / 2, y: sy + sh }, // s
      { x: sx, y: sy + sh }, // sw
      { x: sx, y: sy + sh / 2 }, // w
    ];
  }

  const HANDLE_MODES: DragMode[] = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];

  function hitTestHandles(
    cx: number,
    cy: number,
    sel: CropSelection,
    scale: number
  ): DragMode {
    const sx = sel.x * scale;
    const sy = sel.y * scale;
    const sw = sel.w * scale;
    const sh = sel.h * scale;
    const handles = getHandlePositions(sx, sy, sw, sh);
    const hitRadius = HANDLE_SIZE + 4;

    for (let i = 0; i < handles.length; i++) {
      const h = handles[i];
      if (
        Math.abs(cx - h.x) <= hitRadius &&
        Math.abs(cy - h.y) <= hitRadius
      ) {
        return HANDLE_MODES[i];
      }
    }

    if (
      cx >= sx &&
      cx <= sx + sw &&
      cy >= sy &&
      cy <= sy + sh
    ) {
      return 'move';
    }

    return 'create';
  }

  const getCanvasPoint = (e: ReactPointerEvent<HTMLCanvasElement>): Point => {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: ReactPointerEvent<HTMLCanvasElement>): void => {
    if (!sourceImg) return;
    const pt = getCanvasPoint(e);
    const scale = scaleRef.current;

    let mode: DragMode = 'create';
    if (selection) {
      mode = hitTestHandles(pt.x, pt.y, selection, scale);
    }

    setDragMode(mode);
    dragStartRef.current = pt;
    selStartRef.current = selection ? { ...selection } : null;

    if (mode === 'create') {
      const imgX = Math.round(pt.x / scale);
      const imgY = Math.round(pt.y / scale);
      setSelection({
        x: Math.max(0, Math.min(imgX, sourceImg.naturalWidth - 1)),
        y: Math.max(0, Math.min(imgY, sourceImg.naturalHeight - 1)),
        w: 1,
        h: 1,
      });
    }

    (e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: ReactPointerEvent<HTMLCanvasElement>): void => {
    if (dragMode === 'none' || !dragStartRef.current || !sourceImg) return;

    const pt = getCanvasPoint(e);
    const scale = scaleRef.current;
    const dx = (pt.x - dragStartRef.current.x) / scale;
    const dy = (pt.y - dragStartRef.current.y) / scale;
    const imgW = sourceImg.naturalWidth;
    const imgH = sourceImg.naturalHeight;
    const ratio = getAspectRatio(aspectConstraint, customAspectW, customAspectH);

    if (dragMode === 'create') {
      const startX = Math.round(dragStartRef.current.x / scale);
      const startY = Math.round(dragStartRef.current.y / scale);
      const curX = Math.max(0, Math.min(Math.round(pt.x / scale), imgW));
      const curY = Math.max(0, Math.min(Math.round(pt.y / scale), imgH));

      let newW = curX - startX;
      let newH = curY - startY;

      if (ratio) {
        const absW = Math.abs(newW);
        const absH = Math.abs(newH);
        if (absW / ratio > absH) {
          newH = Math.sign(newH || 1) * Math.round(absW / ratio);
        } else {
          newW = Math.sign(newW || 1) * Math.round(absH * ratio);
        }
      }

      const x = newW >= 0 ? startX : startX + newW;
      const y = newH >= 0 ? startY : startY + newH;
      setSelection(
        clampSelection(
          { x, y, w: Math.abs(newW), h: Math.abs(newH) },
          imgW,
          imgH
        )
      );
    } else if (dragMode === 'move' && selStartRef.current) {
      const s = selStartRef.current;
      setSelection(
        clampSelection(
          { x: s.x + dx, y: s.y + dy, w: s.w, h: s.h },
          imgW,
          imgH
        )
      );
    } else if (selStartRef.current) {
      // Handle resize
      const s = selStartRef.current;
      const newSel = { ...s };

      const applyDx = (mode: DragMode): void => {
        if (['nw', 'w', 'sw'].includes(mode)) {
          newSel.x = s.x + dx;
          newSel.w = s.w - dx;
        }
        if (['ne', 'e', 'se'].includes(mode)) {
          newSel.w = s.w + dx;
        }
      };
      const applyDy = (mode: DragMode): void => {
        if (['nw', 'n', 'ne'].includes(mode)) {
          newSel.y = s.y + dy;
          newSel.h = s.h - dy;
        }
        if (['sw', 's', 'se'].includes(mode)) {
          newSel.h = s.h + dy;
        }
      };

      applyDx(dragMode);
      applyDy(dragMode);

      // Ensure positive dimensions
      if (newSel.w < 0) {
        newSel.x = newSel.x + newSel.w;
        newSel.w = -newSel.w;
      }
      if (newSel.h < 0) {
        newSel.y = newSel.y + newSel.h;
        newSel.h = -newSel.h;
      }

      // Apply aspect ratio
      if (ratio) {
        const isVertical = ['n', 's'].includes(dragMode);
        if (isVertical) {
          newSel.w = Math.round(newSel.h * ratio);
        } else {
          newSel.h = Math.round(newSel.w / ratio);
        }
      }

      setSelection(
        clampSelection(
          { x: Math.round(newSel.x), y: Math.round(newSel.y), w: Math.round(newSel.w), h: Math.round(newSel.h) },
          imgW,
          imgH
        )
      );
    }
  };

  const handlePointerUp = (): void => {
    setDragMode('none');
    dragStartRef.current = null;
    selStartRef.current = null;
  };

  const handleCrop = useCallback(async (): Promise<void> => {
    if (!sourceImg || !selection || selection.w < 1 || selection.h < 1) return;
    setIsProcessing(true);
    try {
      const canvas = document.createElement('canvas');
      canvas.width = selection.w;
      canvas.height = selection.h;
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Canvas context の取得に失敗しました');
      ctx.drawImage(
        sourceImg,
        selection.x,
        selection.y,
        selection.w,
        selection.h,
        0,
        0,
        selection.w,
        selection.h
      );
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Blob生成に失敗しました'));
          },
          'image/png',
          1
        );
      });
      onResult(
        blob,
        { w: selection.w, h: selection.h },
        `トリミング: ${selection.w}×${selection.h}`,
        'crop'
      );
    } catch {
      // silent
    } finally {
      setIsProcessing(false);
    }
  }, [sourceImg, selection, onResult, setIsProcessing]);

  const getCursor = (): string => {
    if (!selection) return 'crosshair';
    switch (dragMode) {
      case 'nw':
      case 'se':
        return 'nwse-resize';
      case 'ne':
      case 'sw':
        return 'nesw-resize';
      case 'n':
      case 's':
        return 'ns-resize';
      case 'e':
      case 'w':
        return 'ew-resize';
      case 'move':
        return 'move';
      default:
        return 'crosshair';
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label className="text-xs mb-1.5 block">アスペクト比</Label>
          <Select
            value={aspectConstraint}
            onValueChange={(v) => {
              setAspectConstraint(v);
              setSelection(null);
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ASPECT_PRESETS.map((p) => (
                <SelectItem key={p.value} value={p.value}>
                  {p.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {aspectConstraint === 'custom' && (
          <div className="flex items-end gap-2">
            <div>
              <Label className="text-xs mb-1.5 block">幅比</Label>
              <Input
                type="number"
                min={1}
                value={customAspectW || ''}
                onChange={(e) =>
                  setCustomAspectW(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className="w-20"
              />
            </div>
            <span className="pb-2 text-muted-foreground">:</span>
            <div>
              <Label className="text-xs mb-1.5 block">高さ比</Label>
              <Input
                type="number"
                min={1}
                value={customAspectH || ''}
                onChange={(e) =>
                  setCustomAspectH(Math.max(1, parseInt(e.target.value, 10) || 1))
                }
                className="w-20"
              />
            </div>
          </div>
        )}
      </div>

      <div ref={containerRef} className="border border-border rounded-lg overflow-hidden bg-muted/30">
        <canvas
          ref={canvasRef}
          className="block mx-auto"
          style={{ touchAction: 'none', cursor: getCursor() }}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
        />
      </div>

      {selection && selection.w > 0 && selection.h > 0 && (
        <p className="text-xs text-muted-foreground">
          選択範囲: {Math.round(selection.w)} × {Math.round(selection.h)} px
          （位置: {Math.round(selection.x)}, {Math.round(selection.y)}）
        </p>
      )}

      <div className="flex gap-2">
        <Button
          onClick={handleCrop}
          disabled={isProcessing || !selection || selection.w < 1}
        >
          {isProcessing ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              処理中...
            </>
          ) : (
            'トリミング実行'
          )}
        </Button>
        <Button
          variant="outline"
          onClick={() => setSelection(null)}
          disabled={!selection}
        >
          選択をリセット
        </Button>
      </div>
    </div>
  );
}
