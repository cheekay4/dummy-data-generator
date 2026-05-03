// Minimal type for gif.js (no @types package available)
interface GifInstance {
  addFrame(
    image: CanvasImageSource,
    opts?: { delay?: number; copy?: boolean },
  ): void;
  on(event: "finished", cb: (blob: Blob) => void): void;
  on(event: "progress", cb: (pct: number) => void): void;
  on(event: "abort", cb: () => void): void;
  render(): void;
  abort(): void;
}

interface GifConstructor {
  new (opts: {
    workers?: number;
    quality?: number;
    width?: number;
    height?: number;
    workerScript?: string;
    transparent?: number | null;
    repeat?: number;
    background?: string;
    dither?: boolean | string;
  }): GifInstance;
}

export interface EncodeGifOptions {
  frames: HTMLCanvasElement[];
  fps: number;
  /** -1 infinite, 0 once, 1+ N additional repeats */
  repeat: number;
  quality?: number;
  onProgress?: (pct: number) => void;
}

let cachedCtor: Promise<GifConstructor> | null = null;

async function loadGifCtor(): Promise<GifConstructor> {
  if (!cachedCtor) {
    cachedCtor = (async (): Promise<GifConstructor> => {
      const mod = await import("gif.js");
      const ctor =
        (mod as unknown as { default?: GifConstructor }).default ??
        (mod as unknown as GifConstructor);
      return ctor;
    })();
  }
  return cachedCtor;
}

export async function encodeGif(opts: EncodeGifOptions): Promise<Blob> {
  if (opts.frames.length === 0) {
    throw new Error("フレームがありません");
  }
  const Ctor = await loadGifCtor();
  const first = opts.frames[0];
  const delay = Math.max(20, Math.round(1000 / opts.fps));

  const gif = new Ctor({
    workers: 2,
    quality: opts.quality ?? 10,
    width: first.width,
    height: first.height,
    workerScript: "/gif.worker.js",
    transparent: 0x00000000,
    repeat: opts.repeat,
    dither: false,
  });

  for (const frame of opts.frames) {
    gif.addFrame(frame, { delay, copy: true });
  }

  return await new Promise<Blob>((resolve, reject) => {
    gif.on("finished", (blob) => resolve(blob));
    gif.on("abort", () => reject(new Error("GIF生成がキャンセルされました")));
    if (opts.onProgress) {
      gif.on("progress", (pct) => opts.onProgress?.(pct));
    }
    try {
      gif.render();
    } catch (e) {
      reject(e instanceof Error ? e : new Error(String(e)));
    }
  });
}

export function loopOptionToRepeat(loop: "infinite" | 1 | 3): number {
  if (loop === "infinite") return 0;
  if (loop === 1) return -1;
  return loop - 1;
}
