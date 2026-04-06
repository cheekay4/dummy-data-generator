import { DetectedItem } from "../types";

const ZIP_PATTERN = /〒?\d{3}[-−]\d{4}/g;

export function detectZipcodes(text: string): DetectedItem[] {
  const items: DetectedItem[] = [];
  let match: RegExpExecArray | null;
  ZIP_PATTERN.lastIndex = 0;
  while ((match = ZIP_PATTERN.exec(text)) !== null) {
    items.push({
      type: "zipcode",
      value: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return items;
}
