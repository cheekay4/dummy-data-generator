// Base64 encode / decode utilities

/**
 * Encode a UTF-8 string to Base64.
 * Uses TextEncoder → btoa to handle multi-byte characters correctly.
 */
export function encodeBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join('');
  return btoa(binary);
}

/**
 * Decode a Base64 string to text using the specified encoding.
 * @param b64 - Base64 string (standard or URL-safe)
 * @param encoding - TextDecoder encoding label (default: 'utf-8')
 */
export function decodeBase64(b64: string, encoding = 'utf-8'): string {
  // Normalize URL-safe base64
  const normalized = b64.trim().replace(/-/g, '+').replace(/_/g, '/');
  // Add padding if needed
  const padded = normalized.padEnd(normalized.length + (4 - (normalized.length % 4)) % 4, '=');
  let binary: string;
  try {
    binary = atob(padded);
  } catch {
    throw new Error('無効なBase64文字列です（不正な文字が含まれています）');
  }
  const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
  try {
    return new TextDecoder(encoding, { fatal: true }).decode(bytes);
  } catch {
    throw new Error(
      `${encoding}でのデコードに失敗しました。文字エンコーディングを確認してください。`,
    );
  }
}

/** Encode a File / Blob to Base64 string + Data URI */
export function fileToBase64(file: File): Promise<{ base64: string; dataUri: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const dataUri = reader.result as string;
      const base64 = dataUri.split(',')[1] ?? '';
      resolve({ base64, dataUri });
    };
    reader.onerror = () => reject(new Error('ファイルの読み込みに失敗しました'));
    reader.readAsDataURL(file);
  });
}

/** Count bytes of a UTF-8 string */
export function byteCount(text: string): number {
  return new TextEncoder().encode(text).length;
}
