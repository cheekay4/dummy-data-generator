import { DetectedItem } from "../types";

function luhnCheck(num: string): boolean {
  const digits = num.replace(/\D/g, "").split("").map(Number);
  let sum = 0;
  let isEven = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits[i];
    if (isEven) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
    isEven = !isEven;
  }
  return sum % 10 === 0;
}

const CC_PATTERN = /\b(?:\d{4}[-\s]?){3}\d{4}\b/g;

export function detectCreditCards(text: string): DetectedItem[] {
  const items: DetectedItem[] = [];
  let match: RegExpExecArray | null;
  CC_PATTERN.lastIndex = 0;
  while ((match = CC_PATTERN.exec(text)) !== null) {
    if (luhnCheck(match[0])) {
      items.push({
        type: "creditcard",
        value: match[0],
        start: match.index,
        end: match.index + match[0].length,
      });
    }
  }
  return items;
}
