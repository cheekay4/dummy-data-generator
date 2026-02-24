import { DetectedItem } from "../types";

async function sha256Short(input: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(input);
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("").slice(0, 8);
}

export async function applyHashReplacement(text: string, items: DetectedItem[]): Promise<string> {
  if (items.length === 0) return text;
  const hashes = await Promise.all(items.map((item) => sha256Short(item.value)));
  let result = "";
  let lastEnd = 0;
  for (let i = 0; i < items.length; i++) {
    result += text.slice(lastEnd, items[i].start);
    result += `[${hashes[i]}]`;
    lastEnd = items[i].end;
  }
  result += text.slice(lastEnd);
  return result;
}
