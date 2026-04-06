'use client';

import { useRef, useState, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FileDropzoneProps {
  accept: string[];
  multiple?: boolean;
  onFiles: (files: File[]) => void;
  label?: string;
}

export default function FileDropzone({ accept, multiple = false, onFiles, label }: FileDropzoneProps) {
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const files = Array.from(e.dataTransfer.files).filter((f) =>
        accept.some((a) => f.type === a || f.name.endsWith(a.replace('image/', '.')))
      );
      if (files.length > 0) onFiles(files);
    },
    [accept, onFiles]
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files ?? []);
      if (files.length > 0) onFiles(files);
      e.target.value = '';
    },
    [onFiles]
  );

  return (
    <div
      className={cn(
        'border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors',
        dragging
          ? 'border-primary bg-primary/5'
          : 'border-border hover:border-primary/50 hover:bg-muted/50'
      )}
      onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
      onDragLeave={() => setDragging(false)}
      onDrop={handleDrop}
      onClick={() => inputRef.current?.click()}
    >
      <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
      <p className="text-sm font-medium">
        {label ?? 'ファイルをドラッグ＆ドロップ、またはクリックして選択'}
      </p>
      <p className="text-xs text-muted-foreground mt-1">
        対応形式: {accept.map((a) => a.replace('image/', '').toUpperCase()).join(' / ')}
      </p>
      <input
        ref={inputRef}
        type="file"
        accept={accept.join(',')}
        multiple={multiple}
        className="hidden"
        onChange={handleChange}
      />
    </div>
  );
}
