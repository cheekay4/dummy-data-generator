function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateUserId(): string {
  const chars = "abcdefghijklmnopqrstuvwxyz0123456789";
  const length = randomInt(8, 12);
  let result = "";
  // Start with a letter
  result += chars.charAt(randomInt(0, 25));
  for (let i = 1; i < length; i++) {
    result += chars.charAt(randomInt(0, chars.length - 1));
  }
  return result;
}

export function generatePassword(): string {
  const upper = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const lower = "abcdefghijklmnopqrstuvwxyz";
  const digits = "0123456789";
  const symbols = "!@#$%^&*_+-=";
  const all = upper + lower + digits + symbols;

  // Ensure at least one of each type
  let password = "";
  password += upper.charAt(randomInt(0, upper.length - 1));
  password += lower.charAt(randomInt(0, lower.length - 1));
  password += digits.charAt(randomInt(0, digits.length - 1));
  password += symbols.charAt(randomInt(0, symbols.length - 1));

  for (let i = 4; i < 12; i++) {
    password += all.charAt(randomInt(0, all.length - 1));
  }

  // Shuffle
  return password
    .split("")
    .sort(() => Math.random() - 0.5)
    .join("");
}

export function generateIpAddress(): string {
  if (Math.random() < 0.5) {
    return `192.168.${randomInt(0, 255)}.${randomInt(1, 254)}`;
  }
  return `10.${randomInt(0, 255)}.${randomInt(0, 255)}.${randomInt(1, 254)}`;
}

export function generateMacAddress(): string {
  const hex = "0123456789ABCDEF";
  const parts: string[] = [];
  for (let i = 0; i < 6; i++) {
    parts.push(
      hex.charAt(randomInt(0, 15)) + hex.charAt(randomInt(0, 15))
    );
  }
  return parts.join(":");
}
