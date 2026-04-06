export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes.toLocaleString()} bytes`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function calcReduction(
  original: string,
  compressed: string
): { bytes: number; percent: number } {
  const originalBytes = new TextEncoder().encode(original).length;
  const compressedBytes = new TextEncoder().encode(compressed).length;
  const bytes = originalBytes - compressedBytes;
  const percent = originalBytes > 0 ? Math.round((bytes / originalBytes) * 100) : 0;
  return { bytes, percent };
}
