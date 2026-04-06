'use client';

import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkWebPSupport } from '@/lib/webp-converter/converter';
import ToWebPTab from './to-webp-tab';
import FromWebPTab from './from-webp-tab';

export default function WebpConverterMain() {
  const [supported, setSupported] = useState<boolean | null>(null);

  useEffect(() => {
    setSupported(checkWebPSupport());
  }, []);

  if (supported === null) return null;

  if (!supported) {
    return (
      <Alert variant="destructive">
        <AlertDescription>
          お使いのブラウザはWebP変換をサポートしていません。最新のChrome・Firefox・Safari・Edgeをお使いください。
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Tabs defaultValue="to-webp">
      <TabsList>
        <TabsTrigger value="to-webp">画像 → WebP</TabsTrigger>
        <TabsTrigger value="from-webp">WebP → 画像</TabsTrigger>
      </TabsList>
      <TabsContent value="to-webp" className="mt-6">
        <ToWebPTab />
      </TabsContent>
      <TabsContent value="from-webp" className="mt-6">
        <FromWebPTab />
      </TabsContent>
    </Tabs>
  );
}
