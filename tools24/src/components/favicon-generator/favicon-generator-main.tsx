'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ImageUploadTab from './image-upload-tab';
import TextEmojiTab from './text-emoji-tab';
import DownloadSection from './download-section';
import type { ResizeImageOptions } from '@/lib/favicon-generator/image-resizer';

const DEFAULT_OPTIONS: ResizeImageOptions = {
  size: 512,
  bgColor: 'transparent',
  borderRadius: 0,
  padding: 0,
};

export default function FaviconGeneratorMain() {
  const [sourceCanvas, setSourceCanvas] = useState<HTMLCanvasElement | null>(null);
  const [resizeOptions, setResizeOptions] = useState<ResizeImageOptions>(DEFAULT_OPTIONS);

  return (
    <div className="space-y-6">
      <Tabs defaultValue="upload">
        <TabsList>
          <TabsTrigger value="upload">画像アップロード</TabsTrigger>
          <TabsTrigger value="text">テキスト / 絵文字</TabsTrigger>
        </TabsList>
        <TabsContent value="upload" className="mt-6">
          <ImageUploadTab
            onCanvas={setSourceCanvas}
            options={resizeOptions}
            onOptions={setResizeOptions}
          />
        </TabsContent>
        <TabsContent value="text" className="mt-6">
          <TextEmojiTab onCanvas={setSourceCanvas} />
        </TabsContent>
      </Tabs>

      <DownloadSection sourceCanvas={sourceCanvas} resizeOptions={resizeOptions} />
    </div>
  );
}
