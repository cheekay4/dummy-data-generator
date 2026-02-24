'use client';

import { useState, useRef } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { SAMPLE_CONTRACT } from '@/lib/contract/sample-contract';
import { Upload } from 'lucide-react';

interface ContractInputProps {
  text: string;
  isPro: boolean;
  onTextChange: (v: string) => void;
}

export function ContractInput({ text, isPro, onTextChange }: ContractInputProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    setFileError(null);
    const ext = file.name.split('.').pop()?.toLowerCase();

    if (file.size > 500 * 1024) {
      setFileError('ファイルサイズは500KB以下にしてください');
      return;
    }

    if (ext === 'txt') {
      const text = await file.text();
      onTextChange(text);
      setFileName(file.name);
      return;
    }

    if (ext === 'pdf') {
      if (!isPro) {
        setFileError('PDF読み込みはProプラン限定機能です。テキストを直接貼り付けてください。');
        return;
      }
      try {
        const { extractTextFromPDF } = await import('@/lib/contract/pdf-reader');
        const extracted = await extractTextFromPDF(file);
        if (!extracted.trim()) {
          setFileError('テキストを抽出できませんでした。スキャンPDFや画像PDFは非対応です。');
          return;
        }
        onTextChange(extracted);
        setFileName(file.name);
      } catch {
        setFileError('PDFの読み込みに失敗しました。テキストを直接貼り付けてください。');
      }
      return;
    }

    setFileError('.txt または .pdf ファイルのみ対応しています');
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  };

  return (
    <div className="space-y-3">
      <h2 className="text-sm font-semibold">Step 2: 契約書テキスト入力</h2>

      <Tabs defaultValue="text">
        <TabsList className="mb-3">
          <TabsTrigger value="text">テキスト貼り付け</TabsTrigger>
          <TabsTrigger value="file">ファイルアップロード</TabsTrigger>
        </TabsList>

        <TabsContent value="text">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">
                {text.length.toLocaleString()}文字
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-7 text-xs"
                onClick={() => onTextChange(SAMPLE_CONTRACT)}
              >
                サンプル契約書を読み込む
              </Button>
            </div>
            <Textarea
              value={text}
              onChange={(e) => onTextChange(e.target.value)}
              rows={20}
              placeholder="契約書の全文または確認したい条項をここに貼り付けてください"
              className="font-mono text-sm resize-y"
            />
          </div>
        </TabsContent>

        <TabsContent value="file">
          <div className="space-y-3">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragging
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted/30'
              }`}
              onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={onDrop}
              onClick={() => fileInputRef.current?.click()}
            >
              <Upload className="h-8 w-8 mx-auto mb-3 text-muted-foreground" />
              <p className="text-sm font-medium mb-1">
                ファイルをドラッグ&ドロップ、またはクリックして選択
              </p>
              <p className="text-xs text-muted-foreground">
                .txt（無料・Pro）/ .pdf（Pro限定）・最大500KB
              </p>
              {fileName && (
                <p className="text-xs text-green-600 dark:text-green-400 mt-2">
                  ✓ {fileName} を読み込みました
                </p>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".txt,.pdf"
                className="hidden"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) handleFile(file);
                }}
              />
            </div>

            {fileError && (
              <div className="px-3 py-2 bg-destructive/10 border border-destructive/30 rounded-md text-xs text-destructive">
                {fileError}
              </div>
            )}

            <p className="text-xs text-muted-foreground">
              ※ 画像PDFやスキャンPDFはテキスト抽出できません。テキスト貼り付けタブをご利用ください。
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
