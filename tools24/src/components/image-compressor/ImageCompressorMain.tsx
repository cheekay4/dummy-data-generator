'use client';

import { useState, useCallback, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { loadImage } from '@/lib/webp-converter/converter';
import ImageUploader from './ImageUploader';
import ResizePanel from './ResizePanel';
import CompressPanel from './CompressPanel';
import CropPanel from './CropPanel';
import ResultPreview from './ResultPreview';

export interface OperationRecord {
  type: 'resize' | 'compress' | 'crop';
  label: string;
  beforeSize: number;
  afterSize: number;
}

export default function ImageCompressorMain(): React.ReactElement {
  const [sourceFile, setSourceFile] = useState<File | null>(null);
  const [sourceImg, setSourceImg] = useState<HTMLImageElement | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string>('');
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultDimensions, setResultDimensions] = useState<{
    w: number;
    h: number;
  } | null>(null);
  const [activeTab, setActiveTab] = useState<string>('resize');
  const [isProcessing, setIsProcessing] = useState(false);
  const [history, setHistory] = useState<OperationRecord[]>([]);
  const sourceUrlRef = useRef<string>('');

  useEffect(() => {
    if (!sourceFile) {
      // cleanup handled by handleClear
      return;
    }
    let cancelled = false;
    const url = URL.createObjectURL(sourceFile);
    sourceUrlRef.current = url;

    loadImage(sourceFile)
      .then((img) => {
        if (!cancelled) {
          setSourceImg(img);
          setSourceUrl(url);
        }
      })
      .catch(() => {
        if (!cancelled) setSourceImg(null);
      });

    return (): void => {
      cancelled = true;
      URL.revokeObjectURL(url);
    };
  }, [sourceFile]);

  const handleResult = useCallback(
    (
      blob: Blob,
      dimensions: { w: number; h: number },
      label: string,
      type: 'resize' | 'compress' | 'crop'
    ): void => {
      setResultBlob(blob);
      setResultDimensions(dimensions);
      setHistory((prev) => [
        ...prev,
        {
          type,
          label,
          beforeSize: sourceFile?.size ?? 0,
          afterSize: blob.size,
        },
      ]);
    },
    [sourceFile]
  );

  const handleContinue = useCallback((): void => {
    if (!resultBlob || !sourceFile) return;
    const ext =
      resultBlob.type === 'image/png'
        ? '.png'
        : resultBlob.type === 'image/webp'
          ? '.webp'
          : '.jpg';
    const baseName = sourceFile.name.replace(/\.[^.]+$/, '');
    const newFile = new File([resultBlob], `${baseName}${ext}`, {
      type: resultBlob.type,
    });
    setResultBlob(null);
    setResultDimensions(null);
    setSourceFile(newFile);
  }, [resultBlob, sourceFile]);

  const handleClear = useCallback((): void => {
    setSourceFile(null);
    setSourceImg(null);
    setResultBlob(null);
    setResultDimensions(null);
    setHistory([]);
  }, []);

  if (!sourceFile) {
    return (
      <ImageUploader
        sourceFile={null}
        sourceImg={null}
        onFile={setSourceFile}
        onClear={handleClear}
      />
    );
  }

  return (
    <div className="space-y-6">
      <ImageUploader
        sourceFile={sourceFile}
        sourceImg={sourceImg}
        onFile={setSourceFile}
        onClear={handleClear}
      />

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="resize">リサイズ</TabsTrigger>
          <TabsTrigger value="compress">圧縮</TabsTrigger>
          <TabsTrigger value="crop">トリミング</TabsTrigger>
        </TabsList>
        <TabsContent value="resize" className="mt-6">
          <ResizePanel
            sourceImg={sourceImg}
            sourceFile={sourceFile}
            onResult={handleResult}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </TabsContent>
        <TabsContent value="compress" className="mt-6">
          <CompressPanel
            sourceImg={sourceImg}
            sourceFile={sourceFile}
            onResult={handleResult}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </TabsContent>
        <TabsContent value="crop" className="mt-6">
          <CropPanel
            sourceImg={sourceImg}
            sourceUrl={sourceUrl}
            onResult={handleResult}
            isProcessing={isProcessing}
            setIsProcessing={setIsProcessing}
          />
        </TabsContent>
      </Tabs>

      {resultBlob && (
        <ResultPreview
          sourceFile={sourceFile}
          sourceImg={sourceImg}
          resultBlob={resultBlob}
          resultDimensions={resultDimensions}
          onContinue={handleContinue}
          onClear={handleClear}
          history={history}
        />
      )}
    </div>
  );
}
