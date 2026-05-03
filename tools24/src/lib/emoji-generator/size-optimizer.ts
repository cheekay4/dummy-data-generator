import { MAX_FILE_SIZE } from "./types";

export async function canvasToPng(
  canvas: HTMLCanvasElement,
): Promise<Blob> {
  return await new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("PNG生成に失敗しました"));
      },
      "image/png",
    );
  });
}

/**
 * Reduce PNG size by quantizing to a small palette via posterization,
 * then re-export. Falls back to JPEG if still too large.
 */
export async function compressToLimit(
  canvas: HTMLCanvasElement,
  maxBytes: number = MAX_FILE_SIZE,
): Promise<{ blob: Blob; type: "image/png" | "image/jpeg" }> {
  const original = await canvasToPng(canvas);
  if (original.size <= maxBytes) {
    return { blob: original, type: "image/png" };
  }

  // Try posterized PNG with decreasing color depth.
  const levels = [32, 16, 8, 4];
  for (const level of levels) {
    const out = posterizeCanvas(canvas, level);
    const blob = await canvasToPng(out);
    if (blob.size <= maxBytes) return { blob, type: "image/png" };
  }

  // Fallback: JPEG with decreasing quality.
  for (const q of [0.9, 0.75, 0.6, 0.45, 0.3]) {
    const blob = await canvasToJpeg(canvas, q);
    if (blob.size <= maxBytes) return { blob, type: "image/jpeg" };
  }

  // Give up — return smallest JPEG attempt.
  const fallback = await canvasToJpeg(canvas, 0.3);
  return { blob: fallback, type: "image/jpeg" };
}

function canvasToJpeg(
  canvas: HTMLCanvasElement,
  quality: number,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob);
        else reject(new Error("JPEG生成に失敗しました"));
      },
      "image/jpeg",
      quality,
    );
  });
}

function posterizeCanvas(
  canvas: HTMLCanvasElement,
  levels: number,
): HTMLCanvasElement {
  const out = document.createElement("canvas");
  out.width = canvas.width;
  out.height = canvas.height;
  const ctx = out.getContext("2d");
  if (!ctx) return canvas;
  ctx.drawImage(canvas, 0, 0);
  const img = ctx.getImageData(0, 0, out.width, out.height);
  const data = img.data;
  const step = 255 / (levels - 1);
  for (let i = 0; i < data.length; i += 4) {
    if (data[i + 3] < 16) {
      data[i + 3] = 0;
      continue;
    }
    data[i] = Math.round(data[i] / step) * step;
    data[i + 1] = Math.round(data[i + 1] / step) * step;
    data[i + 2] = Math.round(data[i + 2] / step) * step;
  }
  ctx.putImageData(img, 0, 0);
  return out;
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}

export function safeFilename(text: string, ext: string): string {
  const cleaned = (text || "emoji").replace(/[\\/:*?"<>|]/g, "_").slice(0, 20);
  return `emoji_${cleaned}_128.${ext}`;
}
