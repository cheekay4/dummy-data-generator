import { companyPrefixes, companyWords, companyNameParts, departments, positions } from "../dictionaries/companies";

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export function generateCompanyName(): string {
  const prefix = randomItem(companyPrefixes);
  const useJapanesePart = Math.random() < 0.4;

  if (useJapanesePart) {
    const part = randomItem(companyNameParts);
    const word = randomItem(companyWords);
    return Math.random() < 0.5
      ? `${prefix}${part}${word}`
      : `${part}${word}${prefix === "株式会社" ? "" : " " + prefix}`;
  }

  const word1 = randomItem(companyWords);
  let word2 = randomItem(companyWords);
  while (word2 === word1) {
    word2 = randomItem(companyWords);
  }

  if (Math.random() < 0.5) {
    return `${prefix}${word1}`;
  }
  return `${prefix}${word1}${word2}`;
}

export function generateDepartment(): string {
  return randomItem(departments);
}

export function generatePosition(): string {
  const totalWeight = positions.reduce((sum, p) => sum + p.weight, 0);
  let r = Math.random() * totalWeight;
  for (const pos of positions) {
    r -= pos.weight;
    if (r <= 0) return pos.name;
  }
  return positions[positions.length - 1].name;
}
