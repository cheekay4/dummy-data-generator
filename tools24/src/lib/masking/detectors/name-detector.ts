import { DetectedItem } from "../types";
import { lastNames } from "../dictionaries/names";

const SURNAME_PATTERN = lastNames.join("|");
const NAME_SUFFIX = "(?:様|氏|さん|くん|ちゃん|殿)?";
const NAME_REGEX = new RegExp(
  `(${SURNAME_PATTERN})([\\u3040-\\u309F\\u30A0-\\u30FF\\u4E00-\\u9FFF]{1,4})${NAME_SUFFIX}`,
  "g"
);

export function detectNames(text: string): DetectedItem[] {
  const items: DetectedItem[] = [];
  let match: RegExpExecArray | null;
  NAME_REGEX.lastIndex = 0;
  while ((match = NAME_REGEX.exec(text)) !== null) {
    items.push({
      type: "name",
      value: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return items;
}
