"use client";

import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  AnimationSettings as AnimationSettingsType,
  AnimationType,
  FpsOption,
  LoopOption,
} from "@/lib/emoji-generator/types";

interface Props {
  value: AnimationSettingsType;
  onChange: (value: AnimationSettingsType) => void;
}

export function AnimationSettings({
  value,
  onChange,
}: Props): React.ReactElement {
  const [open, setOpen] = useState(false);

  return (
    <Card className="p-4 space-y-3">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between text-sm font-semibold"
      >
        <span>アニメーション（GIF）</span>
        {open ? (
          <ChevronDown className="h-4 w-4" />
        ) : (
          <ChevronRight className="h-4 w-4" />
        )}
      </button>

      {open && (
        <div className="space-y-3 border-t border-border pt-3">
          <div className="space-y-1.5">
            <label className="text-xs text-muted-foreground">種類</label>
            <Select
              value={value.type}
              onValueChange={(v) =>
                onChange({ ...value, type: v as AnimationType })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">なし（PNG）</SelectItem>
                <SelectItem value="bounce">バウンス</SelectItem>
                <SelectItem value="rotate">回転</SelectItem>
                <SelectItem value="blink">点滅</SelectItem>
                <SelectItem value="shake">シェイク</SelectItem>
                <SelectItem value="pulse">拡大縮小</SelectItem>
                <SelectItem value="typing">タイピング</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {value.type !== "none" && (
            <>
              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  フレームレート
                </label>
                <Select
                  value={String(value.fps)}
                  onValueChange={(v) =>
                    onChange({ ...value, fps: Number(v) as FpsOption })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="10">10 fps</SelectItem>
                    <SelectItem value="15">15 fps</SelectItem>
                    <SelectItem value="20">20 fps</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs text-muted-foreground">
                  ループ回数
                </label>
                <Select
                  value={String(value.loop)}
                  onValueChange={(v) => {
                    const loop: LoopOption =
                      v === "infinite" ? "infinite" : (Number(v) as 1 | 3);
                    onChange({ ...value, loop });
                  }}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="infinite">無限</SelectItem>
                    <SelectItem value="1">1回</SelectItem>
                    <SelectItem value="3">3回</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}
        </div>
      )}
    </Card>
  );
}
