import { DetectedItem } from "../types";

// Match all 12-digit sequences as potential My Number values.
// The original check digit gate was removed because it caused false negatives:
// real My Number data entered by users rarely passes strict check digit validation
// unless the number was carefully computed. Masking all 12-digit sequences is
// the safer default — the cost of a false positive is lower than a missed mask.
const MYNUMBER_PATTERN = /\b\d{12}\b/g;

export function detectMyNumbers(text: string): DetectedItem[] {
  const items: DetectedItem[] = [];
  let match: RegExpExecArray | null;
  MYNUMBER_PATTERN.lastIndex = 0;
  while ((match = MYNUMBER_PATTERN.exec(text)) !== null) {
    items.push({
      type: "mynumber",
      value: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return items;
}
