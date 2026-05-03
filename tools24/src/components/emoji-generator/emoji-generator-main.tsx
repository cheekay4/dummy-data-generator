"use client";

import { useEffect, useState } from "react";
import { Image as ImageIcon, Type } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { TextTab } from "./text-tab/text-tab";
import { ImageTab } from "./image-tab/image-tab";
import { TabMode, FONT_OPTIONS } from "@/lib/emoji-generator/types";

const FONT_LINK_HREF =
  "https://fonts.googleapis.com/css2?" +
  [
    "family=Noto+Sans+JP:wght@300;400;700;900",
    "family=Noto+Serif+JP:wght@400;700",
    "family=M+PLUS+Rounded+1c:wght@400;700",
    "family=Kosugi+Maru",
    "family=Zen+Kaku+Gothic+New:wght@400;700",
  ].join("&") +
  "&display=swap";

export function EmojiGeneratorMain(): React.ReactElement {
  const [tab, setTab] = useState<TabMode>("text");

  // Inject Google Fonts on mount.
  useEffect(() => {
    if (document.querySelector('link[data-emoji-fonts="1"]')) return;
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_LINK_HREF;
    link.dataset.emojiFonts = "1";
    document.head.appendChild(link);
  }, []);

  // Pre-warm font loads so the first preview is correct.
  useEffect(() => {
    if (typeof document === "undefined") return;
    FONT_OPTIONS.forEach((f) => {
      f.weights.forEach((w) => {
        void document.fonts.load(`${w} 64px "${f.value}"`, "あ");
      });
    });
  }, []);

  return (
    <Tabs
      value={tab}
      onValueChange={(v) => setTab(v as TabMode)}
      className="w-full"
    >
      <TabsList className="w-full grid grid-cols-2 max-w-md">
        <TabsTrigger value="text">
          <Type className="h-4 w-4" />
          テキスト → 絵文字
        </TabsTrigger>
        <TabsTrigger value="image">
          <ImageIcon className="h-4 w-4" />
          画像 → 絵文字
        </TabsTrigger>
      </TabsList>
      <TabsContent value="text" className="mt-6">
        <TextTab />
      </TabsContent>
      <TabsContent value="image" className="mt-6">
        <ImageTab />
      </TabsContent>
    </Tabs>
  );
}
