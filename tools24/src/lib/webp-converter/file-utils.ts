export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function calcReductionRate(original: number, converted: number): number {
  if (original === 0) return 0;
  return Math.round(((original - converted) / original) * 100);
}

export function validateImageFile(file: File, maxMB = 20): string | null {
  const allowed = ['image/png', 'image/jpeg', 'image/gif', 'image/bmp', 'image/webp'];
  if (!allowed.includes(file.type)) {
    return `非対応の形式です。PNG/JPG/GIF/BMP/WebPをお使いください。`;
  }
  if (file.size > maxMB * 1024 * 1024) {
    return `ファイルサイズが${maxMB}MBを超えています。`;
  }
  return null;
}
