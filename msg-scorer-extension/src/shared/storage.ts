import type { StorageData, Channel } from './types';

export const FREE_DAILY_LIMIT = 5;

const DEFAULT_STORAGE: StorageData = {
  extensionToken: '',
  tokenValid: false,
  tokenPlan: null,
  usageCount: 0,
  usageDate: '',
  lastChannel: 'email-subject',
  lastPreset: 'ec-general',
};

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function getStorage(): Promise<StorageData> {
  try {
    const result = await chrome.storage.local.get(DEFAULT_STORAGE);
    return result as StorageData;
  } catch {
    return { ...DEFAULT_STORAGE };
  }
}

export async function setStorage(data: Partial<StorageData>): Promise<void> {
  try {
    await chrome.storage.local.set(data);
  } catch {
    // サイレントに無視
  }
}

export async function incrementUsage(): Promise<void> {
  const storage = await getStorage();
  const today = getTodayString();
  if (storage.usageDate !== today) {
    await setStorage({ usageCount: 1, usageDate: today });
  } else {
    await setStorage({ usageCount: storage.usageCount + 1 });
  }
}

export async function getRemainingCount(): Promise<number> {
  const storage = await getStorage();
  if (storage.tokenValid) return 999;

  const today = getTodayString();
  if (storage.usageDate !== today) return FREE_DAILY_LIMIT;
  return Math.max(0, FREE_DAILY_LIMIT - storage.usageCount);
}
