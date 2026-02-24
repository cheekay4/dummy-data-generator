import { DetectedItem } from "../types";

const PHONE_PATTERNS = [
  /0[789]0[-\s]?\d{4}[-\s]?\d{4}/g,
  /0\d{1,4}[-\s]?\d{2,4}[-\s]?\d{4}/g,
];

export function detectPhones(text: string): DetectedItem[] {
  const items: DetectedItem[] = [];
  for (const pattern of PHONE_PATTERNS) {
    pattern.lastIndex = 0;
    let match: RegExpExecArray | null;
    while ((match = pattern.exec(text)) !== null) {
      const already = items.some(
        (i) => i.start <= match!.index && match!.index < i.end
      );
      if (!already) {
        items.push({
          type: "phone",
          value: match[0],
          start: match.index,
          end: match.index + match[0].length,
        });
      }
    }
  }
  return items;
}
