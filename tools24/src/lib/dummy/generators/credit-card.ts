function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function luhnCheckDigit(partial: string): string {
  const digits = partial.split("").map(Number).reverse();
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let d = digits[i];
    if (i % 2 === 0) {
      d *= 2;
      if (d > 9) d -= 9;
    }
    sum += d;
  }
  const check = (10 - (sum % 10)) % 10;
  return check.toString();
}

export function generateCreditCard(): string {
  // Use test prefixes that don't belong to real card issuers
  // 9999 prefix is not assigned to any real card network
  const prefixes = ["9999", "9998", "9997", "9996"];
  const prefix = prefixes[randomInt(0, prefixes.length - 1)];

  let partial = prefix;
  for (let i = partial.length; i < 15; i++) {
    partial += randomInt(0, 9).toString();
  }

  const check = luhnCheckDigit(partial);
  const full = partial + check;

  return `${full.slice(0, 4)}-${full.slice(4, 8)}-${full.slice(8, 12)}-${full.slice(12, 16)}`;
}
