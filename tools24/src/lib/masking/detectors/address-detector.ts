import { DetectedItem } from "../types";

const PREFECTURES =
  "北海道|青森県|岩手県|宮城県|秋田県|山形県|福島県|茨城県|栃木県|群馬県|" +
  "埼玉県|千葉県|東京都|神奈川県|新潟県|富山県|石川県|福井県|山梨県|長野県|" +
  "岐阜県|静岡県|愛知県|三重県|滋賀県|京都府|大阪府|兵庫県|奈良県|和歌山県|" +
  "鳥取県|島根県|岡山県|広島県|山口県|徳島県|香川県|愛媛県|高知県|福岡県|" +
  "佐賀県|長崎県|熊本県|大分県|宮崎県|鹿児島県|沖縄県";

const ADDRESS_REGEX = new RegExp(
  `(${PREFECTURES})[\\u4E00-\\u9FFF\\u3040-\\u309F\\u30A0-\\u30FF\\d０-９ー−\\-]{4,30}`,
  "g"
);

export function detectAddresses(text: string): DetectedItem[] {
  const items: DetectedItem[] = [];
  let match: RegExpExecArray | null;
  ADDRESS_REGEX.lastIndex = 0;
  while ((match = ADDRESS_REGEX.exec(text)) !== null) {
    items.push({
      type: "address",
      value: match[0],
      start: match.index,
      end: match.index + match[0].length,
    });
  }
  return items;
}
