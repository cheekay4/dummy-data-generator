'use client';

const FREE_DAILY_LIMIT = 3;
const STORAGE_KEY = 'keigo_usage';
const SUBSCRIPTION_KEY = 'keigo_subscription_id';

export function getUsageToday(): number {
  if (typeof window === 'undefined') return 0;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return 0;
  try {
    const parsed = JSON.parse(data);
    const today = new Date().toISOString().split('T')[0];
    if (parsed.date !== today) return 0;
    return parsed.count ?? 0;
  } catch {
    return 0;
  }
}

export function incrementUsage(): void {
  if (typeof window === 'undefined') return;
  const today = new Date().toISOString().split('T')[0];
  const current = getUsageToday();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ date: today, count: current + 1 }));
}

export function isProUser(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(SUBSCRIPTION_KEY);
}

export function canUse(): boolean {
  if (isProUser()) return true;
  return getUsageToday() < FREE_DAILY_LIMIT;
}

export function getRemainingUses(): number {
  if (isProUser()) return Infinity;
  return Math.max(0, FREE_DAILY_LIMIT - getUsageToday());
}

export { FREE_DAILY_LIMIT, SUBSCRIPTION_KEY };
