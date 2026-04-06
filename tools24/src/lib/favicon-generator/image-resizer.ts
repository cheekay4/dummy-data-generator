export interface ResizeImageOptions {
  size: number;
  bgColor?: string; // 'transparent' or '#rrggbb'
  borderRadius?: number; // 0-50 (%)
  padding?: number; // 0-15 (%)
}

export function resizeImage(
  source: HTMLImageElement | HTMLCanvasElement,
  options: ResizeImageOptions
): HTMLCanvasElement {
  const { size, bgColor = 'transparent', borderRadius = 0, padding = 0 } = options;
  const canvas = document.createElement('canvas');
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas context の取得に失敗');

  const pad = Math.round(size * (padding / 100));
  const drawSize = size - pad * 2;
  const radius = Math.round(size * (borderRadius / 100));

  // 背景
  if (bgColor !== 'transparent') {
    ctx.fillStyle = bgColor;
    if (radius > 0) {
      ctx.beginPath();
      ctx.roundRect(0, 0, size, size, radius);
      ctx.fill();
    } else {
      ctx.fillRect(0, 0, size, size);
    }
  }

  // クリッピング（角丸）
  if (radius > 0) {
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(0, 0, size, size, radius);
    ctx.clip();
  }

  // 画像描画
  const srcW = source instanceof HTMLImageElement ? source.naturalWidth : source.width;
  const srcH = source instanceof HTMLImageElement ? source.naturalHeight : source.height;
  const aspect = srcW / srcH;
  let dw = drawSize;
  let dh = drawSize;
  if (aspect > 1) dh = Math.round(drawSize / aspect);
  else if (aspect < 1) dw = Math.round(drawSize * aspect);
  const dx = pad + Math.round((drawSize - dw) / 2);
  const dy = pad + Math.round((drawSize - dh) / 2);

  ctx.drawImage(source, dx, dy, dw, dh);

  if (radius > 0) ctx.restore();

  return canvas;
}

export function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error('Blob 変換失敗'));
      },
      type
    );
  });
}

export function canvasToPngBuffer(canvas: HTMLCanvasElement): Promise<ArrayBuffer> {
  return canvasToBlob(canvas, 'image/png').then((blob) => blob.arrayBuffer());
}
