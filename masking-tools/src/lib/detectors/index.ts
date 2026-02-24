import { DetectedItem, DetectionResult, MaskSettings } from "../types";
import { detectNames } from "./name-detector";
import { detectPhones } from "./phone-detector";
import { detectEmails } from "./email-detector";
import { detectAddresses } from "./address-detector";
import { detectZipcodes } from "./zipcode-detector";
import { detectMyNumbers } from "./mynumber-detector";
import { detectCreditCards } from "./creditcard-detector";
import { detectIPs } from "./ip-detector";

export function detectAll(text: string, settings: MaskSettings): DetectionResult {
  let items: DetectedItem[] = [];

  if (settings.targets.name) items.push(...detectNames(text));
  if (settings.targets.phone) items.push(...detectPhones(text));
  if (settings.targets.email) items.push(...detectEmails(text));
  if (settings.targets.address) items.push(...detectAddresses(text));
  if (settings.targets.zipcode) items.push(...detectZipcodes(text));
  if (settings.targets.mynumber) items.push(...detectMyNumbers(text));
  if (settings.targets.creditcard) items.push(...detectCreditCards(text));
  if (settings.targets.ip) items.push(...detectIPs(text));

  // Remove overlapping detections (keep longest match)
  items = items.sort((a, b) => a.start - b.start);
  const filtered: DetectedItem[] = [];
  for (const item of items) {
    const last = filtered[filtered.length - 1];
    if (!last || item.start >= last.end) {
      filtered.push(item);
    } else if (item.end > last.end) {
      filtered[filtered.length - 1] = item;
    }
  }

  const counts = {
    name: 0, phone: 0, email: 0, address: 0,
    zipcode: 0, mynumber: 0, creditcard: 0, ip: 0,
  };
  for (const item of filtered) {
    counts[item.type]++;
  }

  return { items: filtered, counts };
}
