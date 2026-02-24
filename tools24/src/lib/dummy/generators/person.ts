import { lastNames, firstNamesMale, firstNamesFemale, type NameEntry } from "../dictionaries/names";

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export type Gender = "男" | "女" | "指定なし";

export function generateGender(): Gender {
  const r = Math.random();
  if (r < 0.45) return "男";
  if (r < 0.9) return "女";
  return "指定なし";
}

export function generateName(gender: Gender): {
  lastName: NameEntry;
  firstName: NameEntry;
} {
  const lastName = randomItem(lastNames);
  const firstNames = gender === "女" ? firstNamesFemale : firstNamesMale;
  const firstName = randomItem(firstNames);
  return { lastName, firstName };
}

export function generateAge(min: number, max: number): number {
  return randomInt(min, max);
}

export function generateBirthDate(age: number): string {
  const today = new Date();
  const birthYear = today.getFullYear() - age;
  const month = randomInt(1, 12);
  const maxDay = new Date(birthYear, month, 0).getDate();
  const day = randomInt(1, maxDay);
  return `${birthYear}/${String(month).padStart(2, "0")}/${String(day).padStart(2, "0")}`;
}

export function generateEmail(lastName: NameEntry, firstName: NameEntry): string {
  const patterns = [
    () => `${firstName.romaji.toLowerCase()}.${lastName.romaji.toLowerCase()}`,
    () => `${lastName.romaji.toLowerCase()}.${firstName.romaji.toLowerCase()}`,
    () => `${firstName.romaji.toLowerCase().charAt(0)}.${lastName.romaji.toLowerCase()}`,
    () => `${firstName.romaji.toLowerCase()}${randomInt(1, 999)}`,
    () => `${lastName.romaji.toLowerCase()}_${firstName.romaji.toLowerCase()}`,
    () => `${firstName.romaji.toLowerCase()}.${lastName.romaji.toLowerCase()}${randomInt(1, 99)}`,
  ];
  const domains = ["example.com", "example.jp"];
  const local = randomItem(patterns)();
  const domain = randomItem(domains);
  return `${local}@${domain}`;
}

export function generatePhone(): string {
  const prefixes = ["090", "080", "070"];
  const prefix = randomItem(prefixes);
  const middle = String(randomInt(1000, 9999));
  const last = String(randomInt(1000, 9999));
  return `${prefix}-${middle}-${last}`;
}
