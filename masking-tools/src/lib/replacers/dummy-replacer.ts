import { DetectedItem } from "../types";
import { lastNames, firstNamesMale, firstNamesFemale } from "../dictionaries/names";
import { dummyAddresses } from "../dictionaries/addresses";

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomPhone(): string {
  const prefix = ["090", "080", "070"][Math.floor(Math.random() * 3)];
  const mid = String(Math.floor(Math.random() * 9000) + 1000);
  const last = String(Math.floor(Math.random() * 9000) + 1000);
  return `${prefix}-${mid}-${last}`;
}

function randomEmail(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  const name = Array.from({ length: 6 }, () => chars[Math.floor(Math.random() * chars.length)]).join("");
  const domains = ["example.com", "example.jp", "example.net"];
  return `${name}@${randomFrom(domains)}`;
}

function randomZip(): string {
  const n1 = String(Math.floor(Math.random() * 900) + 100);
  const n2 = String(Math.floor(Math.random() * 9000) + 1000);
  return `〒${n1}-${n2}`;
}

export function applyDummyReplacement(text: string, items: DetectedItem[]): string {
  if (items.length === 0) return text;
  let result = "";
  let lastEnd = 0;
  for (const item of items) {
    result += text.slice(lastEnd, item.start);
    switch (item.type) {
      case "name": {
        const last = randomFrom(lastNames);
        const first = Math.random() > 0.5 ? randomFrom(firstNamesMale) : randomFrom(firstNamesFemale);
        result += `${last}${first}`;
        break;
      }
      case "phone":
        result += randomPhone();
        break;
      case "email":
        result += randomEmail();
        break;
      case "address": {
        const addr = randomFrom(dummyAddresses);
        result += `${addr.prefecture}${addr.city}${addr.town}`;
        break;
      }
      case "zipcode":
        result += randomZip();
        break;
      case "mynumber":
        result += "000000000000";
        break;
      case "creditcard":
        result += "0000-0000-0000-0000";
        break;
      case "ip":
        result += "192.0.2.1";
        break;
      default:
        result += item.value;
    }
    lastEnd = item.end;
  }
  result += text.slice(lastEnd);
  return result;
}
