'use client';

const FREE_MONTHLY_LIMIT = 2;
const STORAGE_KEY = 'contract_usage';
const SUBSCRIPTION_KEY = 'contract_subscription_id';

export function getUsageThisMonth(): number {
  if (typeof window === 'undefined') return 0;
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return 0;
  try {
    const parsed = JSON.parse(data);
    const currentMonth = new Date().toISOString().slice(0, 7);
    if (parsed.month !== currentMonth) return 0;
    return parsed.count ?? 0;
  } catch {
    return 0;
  }
}

export function incrementUsage(): void {
  if (typeof window === 'undefined') return;
  const currentMonth = new Date().toISOString().slice(0, 7);
  const current = getUsageThisMonth();
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ month: currentMonth, count: current + 1 }));
}

export function isProUser(): boolean {
  if (typeof window === 'undefined') return false;
  return !!localStorage.getItem(SUBSCRIPTION_KEY);
}

export function canUse(): boolean {
  if (isProUser()) return true;
  return getUsageThisMonth() < FREE_MONTHLY_LIMIT;
}

export function getRemainingUses(): number {
  if (isProUser()) return Infinity;
  return Math.max(0, FREE_MONTHLY_LIMIT - getUsageThisMonth());
}

export { FREE_MONTHLY_LIMIT, SUBSCRIPTION_KEY };
