import type { StorageData, Scene, Recipient, Tone } from './types';

const FREE_DAILY_LIMIT = 10;

const DEFAULT_STORAGE: StorageData = {
  usageCount: 0,
  usageDate: '',
  licenseKey: '',
  licenseValid: false,
  lastScene: 'reply',
  lastRecipient: 'client',
  lastTone: 'polite',
  pendingText: '',
};

function getTodayString(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export async function getStorage(): Promise<StorageData> {
  return new Promise((resolve) => {
    chrome.storage.local.get(DEFAULT_STORAGE, (result) => {
      resolve(result as StorageData);
    });
  });
}

export async function setStorage(data: Partial<StorageData>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set(data, resolve);
  });
}

export async function incrementUsage(): Promise<void> {
  const storage = await getStorage();
  const today = getTodayString();

  if (storage.usageDate !== today) {
    // 日付が変わっていたらリセット
    await setStorage({ usageCount: 1, usageDate: today });
  } else {
    await setStorage({ usageCount: storage.usageCount + 1 });
  }
}

export async function getRemainingCount(): Promise<number> {
  const storage = await getStorage();

  if (storage.licenseValid) {
    return 999; // Pro = 実質無制限
  }

  const today = getTodayString();
  if (storage.usageDate !== today) {
    return FREE_DAILY_LIMIT;
  }

  return Math.max(0, FREE_DAILY_LIMIT - storage.usageCount);
}
