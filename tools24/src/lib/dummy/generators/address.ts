import { addresses } from "../dictionaries/addresses";
import { buildingNames } from "../dictionaries/buildings";

function randomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateAddress(): {
  zip: string;
  prefecture: string;
  city: string;
  town: string;
  banchi: string;
  building: string;
} {
  const addr = randomItem(addresses);
  const banchi = `${randomInt(1, 30)}-${randomInt(1, 20)}-${randomInt(1, 30)}`;

  let building = "";
  if (Math.random() < 0.3) {
    const name = randomItem(buildingNames);
    const room = randomInt(101, 1505);
    building = `${name} ${room}号室`;
  }

  return {
    zip: addr.zip,
    prefecture: addr.prefecture,
    city: addr.city,
    town: addr.town,
    banchi,
    building,
  };
}
