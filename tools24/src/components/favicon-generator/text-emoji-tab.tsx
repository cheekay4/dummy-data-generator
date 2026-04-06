'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const FONTS = [
  { label: 'Noto Sans JP', value: '"Noto Sans JP", sans-serif' },
  { label: 'Noto Serif JP', value: '"Noto Serif JP", serif' },
  { label: 'システム（ゴシック）', value: 'system-ui, sans-serif' },
];

interface TextEmojiTabProps {
  onCanvas: (canvas: HTMLCanvasElement | null) => void;
}

export default function TextEmojiTab({ onCanvas }: TextEmojiTabProps) {
  const [text, setText] = useState('🔥');
  const [font, setFont] = useState(FONTS[0].value);
  const [fontColor, setFontColor] = useState('#000000');
  const [bgColor, setBgColor] = useState('#ffffff');
  const [useTransparentBg, setUseTransparentBg] = useState(false);
  const [borderRadius, setBorderRadius] = useState(0);
  const canvas512Ref = useRef<HTMLCanvasElement>(null);
  const canvas16Ref = useRef<HTMLCanvasElement>(null);
  const canvas32Ref = useRef<HTMLCanvasElement>(null);

  const draw = useCallback(() => {
    if (!canvas512Ref.current) return;
    const sizes = [
      { ref: canvas512Ref, size: 512 },
      { ref: canvas16Ref, size: 16 },
      { ref: canvas32Ref, size: 32 },
    ];

    for (const { ref, size } of sizes) {
      if (!ref.current) continue;
      const canvas = ref.current;
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      ctx.clearRect(0, 0, size, size);

      // 背景
      if (!useTransparentBg) {
        const radius = (borderRadius / 100) * size;
        ctx.fillStyle = bgColor;
        if (radius > 0) {
          ctx.beginPath();
          ctx.roundRect(0, 0, size, size, radius);
          ctx.fill();
        } else {
          ctx.fillRect(0, 0, size, size);
        }
      }

      // テキスト
      if (text) {
        const fontSize = Math.round(size * 0.7);
        ctx.font = `${fontSize}px ${font}`;
        ctx.fillStyle = fontColor;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text.slice(0, 4), size / 2, size / 2);
      }
    }

    // 512px canvasを親に渡す
    onCanvas(canvas512Ref.current);
  }, [text, font, fontColor, bgColor, useTransparentBg, borderRadius, onCanvas]);

  useEffect(() => {
    draw();
  }, [draw]);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label>テキスト（最大4文字）</Label>
          <Input
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 4))}
            placeholder="文字や絵文字を入力"
          />
        </div>
        <div className="space-y-2">
          <Label>フォント</Label>
          <Select value={font} onValueChange={setFont}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {FONTS.map((f) => (
                <SelectItem key={f.value} value={f.value}>
                  {f.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center gap-3">
          <Label>文字色</Label>
          <input
            type="color"
            value={fontColor}
            onChange={(e) => setFontColor(e.target.value)}
            className="h-8 w-16 rounded border cursor-pointer"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center gap-3">
            <Switch
              id="transparentBg"
              checked={useTransparentBg}
              onCheckedChange={setUseTransparentBg}
            />
            <Label htmlFor="transparentBg">透過背景</Label>
          </div>
          {!useTransparentBg && (
            <div className="flex items-center gap-3">
              <Label>背景色</Label>
              <input
                type="color"
                value={bgColor}
                onChange={(e) => setBgColor(e.target.value)}
                className="h-8 w-16 rounded border cursor-pointer"
              />
            </div>
          )}
        </div>
        <div className="space-y-2">
          <Label>角丸</Label>
          <Select
            value={String(borderRadius)}
            onValueChange={(v) => setBorderRadius(Number(v))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0">なし（0%）</SelectItem>
              <SelectItem value="10">軽い（10%）</SelectItem>
              <SelectItem value="20">中（20%）</SelectItem>
              <SelectItem value="50">丸（50%）</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* プレビュー */}
      <div className="border rounded-lg p-4 space-y-3">
        <p className="text-sm font-medium">プレビュー</p>
        <div className="flex items-end gap-4">
          <div className="text-center">
            <div className="border inline-block rounded" style={{ backgroundImage: 'repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%) 0 0 / 8px 8px' }}>
              <canvas ref={canvas512Ref} style={{ width: 128, height: 128 }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">512px</p>
          </div>
          <div className="text-center">
            <div className="border inline-block rounded" style={{ backgroundImage: 'repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%) 0 0 / 8px 8px' }}>
              <canvas ref={canvas32Ref} style={{ width: 32, height: 32 }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">32px</p>
          </div>
          <div className="text-center">
            <div className="border inline-block rounded" style={{ backgroundImage: 'repeating-conic-gradient(#aaa 0% 25%, #fff 0% 50%) 0 0 / 8px 8px' }}>
              <canvas ref={canvas16Ref} style={{ width: 16, height: 16 }} />
            </div>
            <p className="text-xs text-muted-foreground mt-1">16px（タブ）</p>
          </div>
        </div>
      </div>
    </div>
  );
}
