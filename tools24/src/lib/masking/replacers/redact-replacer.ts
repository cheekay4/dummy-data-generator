import { DetectedItem } from "../types";

export function applyRedactReplacement(text: string, items: DetectedItem[]): string {
  if (items.length === 0) return text;
  let result = "";
  let lastEnd = 0;
  for (const item of items) {
    result += text.slice(lastEnd, item.start);
    result += "●".repeat(item.value.replace(/\s/g, "").length);
    lastEnd = item.end;
  }
  result += text.slice(lastEnd);
  return result;
}
