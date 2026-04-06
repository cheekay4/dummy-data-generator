export interface ResizeOptions {
  mode: 'none' | 'maxWidth' | 'maxHeight' | 'ratio';
  value: number;
}

export function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('画像の読み込みに失敗しました'));
    };
    img.src = url;
  });
}

export function calcResizeDimensions(
  w: number,
  h: number,
  opts: ResizeOptions
): { w: number; h: number } {
  if (opts.mode === 'none' || opts.value <= 0) return { w, h };
  if (opts.mode === 'maxWidth' && w > opts.value) {
    return { w: opts.value, h: Math.round((h * opts.value) / w) };
  }
  if (opts.mode === 'maxHeight' && h > opts.value) {
    return { w: Math.round((w * opts.value) / h), h: opts.value };
  }
  if (opts.mode === 'ratio' && opts.value > 0 && opts.value <= 200) {
    const ratio = opts.value / 100;
    return { w: Math.round(w * ratio), h: Math.round(h * ratio) };
  }
  return { w, h };
}

export async function convertToWebP(
  file: File,
  quality: number,
  lossless: boolean,
  resize: ResizeOptions
): Promise<Blob> {
  const img = await loadImage(file);
  const dims = calcResizeDimensions(img.naturalWidth, img.naturalHeight, resize);
  const canvas = document.createElement('canvas');
  canvas.width = dims.w;
  canvas.height = dims.h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context の取得に失敗しました');
  ctx.drawImage(img, 0, 0, dims.w, dims.h);

  return new Promise((resolve, reject) => {
    if (lossless) {
      // ロスレス: quality=1.0 でWebP
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('変換失敗'));
        },
        'image/webp',
        1.0
      );
    } else {
      canvas.toBlob(
        (blob) => {
          if (blob) resolve(blob);
          else reject(new Error('変換失敗'));
        },
        'image/webp',
        quality / 100
      );
    }
  });
}

export async function convertFromWebP(
  file: File,
  format: 'png' | 'jpeg',
  quality: number
): Promise<Blob> {
  const img = await loadImage(file);
  const canvas = document.createElement('canvas');
  canvas.width = img.naturalWidth;
  canvas.height = img.naturalHeight;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas 2D context の取得に失敗しました');
  if (format === 'jpeg') {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  ctx.drawImage(img, 0, 0);

  const mimeType = format === 'png' ? 'image/png' : 'image/jpeg';

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('変換失敗'));
      },
      mimeType,
      quality / 100
    );
  });
}

export function checkWebPSupport(): boolean {
  try {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    return canvas.toDataURL('image/webp').startsWith('data:image/webp');
  } catch {
    return false;
  }
}
