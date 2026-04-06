export interface FaviconFiles {
  'favicon.ico'?: ArrayBuffer;
  'favicon-16x16.png'?: Blob;
  'favicon-32x32.png'?: Blob;
  'apple-touch-icon.png'?: Blob;
  'android-chrome-192x192.png'?: Blob;
  'android-chrome-512x512.png'?: Blob;
  'mstile-150x150.png'?: Blob;
  'site.webmanifest'?: string;
  'browserconfig.xml'?: string;
}

export async function buildZip(files: FaviconFiles): Promise<Blob> {
  const JSZip = (await import('jszip')).default;
  const zip = new JSZip();

  for (const [name, content] of Object.entries(files)) {
    if (content === undefined) continue;
    if (typeof content === 'string') {
      zip.file(name, content);
    } else if (content instanceof ArrayBuffer) {
      zip.file(name, content);
    } else if (content instanceof Blob) {
      zip.file(name, content);
    }
  }

  return zip.generateAsync({ type: 'blob' });
}
