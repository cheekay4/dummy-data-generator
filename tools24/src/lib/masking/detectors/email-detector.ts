import { DetectedItem } from "../types";

const EMAIL_PATTERN = /[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}/g;

export function detectEmails(text: string): DetectedItem[] {
  const items: DetectedItem[] = [];
  let match: RegExpExecArray | null;
  EMAIL_PATTERN.lastIndex = 0;
  while ((match = EMAIL_PATTERN.exec(text)) !== null) {
    items.push({
      type: "email",
      value: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return items;
}
