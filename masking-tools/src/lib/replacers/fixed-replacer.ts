import { DetectedItem, DETECTION_LABELS } from "../types";

export function applyFixedReplacement(text: string, items: DetectedItem[]): string {
  if (items.length === 0) return text;
  let result = "";
  let lastEnd = 0;
  for (const item of items) {
    result += text.slice(lastEnd, item.start);
    result += `[${DETECTION_LABELS[item.type]}]`;
    lastEnd = item.end;
  }
  result += text.slice(lastEnd);
  return result;
}
