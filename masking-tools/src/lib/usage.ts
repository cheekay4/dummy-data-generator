const STORAGE_KEY = "masking_usage";
export const FREE_DAILY_LIMIT = 10;

interface UsageData {
  date: string;
  count: number;
}

function getTodayKey(): string {
  return new Date().toISOString().split("T")[0];
}

export function getUsageCount(): number {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return 0;
    const { date, count }: UsageData = JSON.parse(stored);
    return date === getTodayKey() ? count : 0;
  } catch {
    return 0;
  }
}

export function incrementUsage(): void {
  try {
    const today = getTodayKey();
    const current = getUsageCount();
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: current + 1 }));
  } catch {
    // ignore
  }
}

export function canUse(): boolean {
  return getUsageCount() < FREE_DAILY_LIMIT;
}
