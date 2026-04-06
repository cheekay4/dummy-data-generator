import { DetectedItem } from "../types";

const IP_PATTERN =
  /\b(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\.(25[0-5]|2[0-4]\d|[01]?\d\d?)\b/g;

export function detectIPs(text: string): DetectedItem[] {
  const items: DetectedItem[] = [];
  let match: RegExpExecArray | null;
  IP_PATTERN.lastIndex = 0;
  while ((match = IP_PATTERN.exec(text)) !== null) {
    items.push({
      type: "ip",
      value: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return items;
}
