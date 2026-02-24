function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateMyNumber(): string {
  // Generate 11 random digits
  const digits: number[] = [];
  for (let i = 0; i < 11; i++) {
    digits.push(randomInt(0, 9));
  }

  // Calculate check digit using the official algorithm
  const weights = [6, 5, 4, 3, 2, 7, 6, 5, 4, 3, 2];
  let sum = 0;
  for (let i = 0; i < 11; i++) {
    sum += digits[i] * weights[i];
  }
  const remainder = sum % 11;
  let checkDigit: number;
  if (remainder <= 1) {
    checkDigit = 0;
  } else {
    checkDigit = 11 - remainder;
  }

  return digits.join("") + checkDigit.toString();
}
