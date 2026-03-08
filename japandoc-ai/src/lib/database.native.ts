import { Platform } from 'react-native';
import type { ScanResult } from './types';

const isWeb = Platform.OS === 'web';

interface DbScan {
  id: string;
  imageUri: string;
  imageThumbnailUri: string;
  category: string;
  documentType: string;
  title: string;
  summary: string;
  responseJson: string;
  userLanguage: string;
  urgency: string;
  isFavorite: number;
  createdAt: string;
}

interface DbDeadline {
  id: string;
  scanId: string;
  label: string;
  date: string;
  isNotified: number;
}

// --- Web Storage (localStorage) ---

const WEB_SCANS_KEY = 'scanlingo_scans';
const WEB_DEADLINES_KEY = 'scanlingo_deadlines';

function webGetScans(): DbScan[] {
  try {
    const raw = localStorage.getItem(WEB_SCANS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function webSaveScans(scans: DbScan[]) {
  localStorage.setItem(WEB_SCANS_KEY, JSON.stringify(scans));
}

function webGetDeadlines(): DbDeadline[] {
  try {
    const raw = localStorage.getItem(WEB_DEADLINES_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function webSaveDeadlines(deadlines: DbDeadline[]) {
  localStorage.setItem(WEB_DEADLINES_KEY, JSON.stringify(deadlines));
}

// --- Native SQLite (lazy loaded, never imported on web) ---

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let db: any = null;

async function getDb() {
  if (db) return db;
  // Use require() inside a Platform guard so bundler tree-shakes on web
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const SQLite = require('expo-sqlite');
  db = await SQLite.openDatabaseAsync('scanlingo.db');
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS scans (
      id TEXT PRIMARY KEY,
      imageUri TEXT NOT NULL,
      imageThumbnailUri TEXT NOT NULL,
      category TEXT NOT NULL,
      documentType TEXT NOT NULL,
      title TEXT NOT NULL,
      summary TEXT NOT NULL DEFAULT '',
      responseJson TEXT NOT NULL,
      userLanguage TEXT NOT NULL,
      urgency TEXT NOT NULL DEFAULT 'info',
      isFavorite INTEGER NOT NULL DEFAULT 0,
      createdAt TEXT NOT NULL
    );
    CREATE TABLE IF NOT EXISTS deadlines (
      id TEXT PRIMARY KEY,
      scanId TEXT NOT NULL,
      label TEXT NOT NULL,
      date TEXT NOT NULL,
      isNotified INTEGER NOT NULL DEFAULT 0,
      FOREIGN KEY (scanId) REFERENCES scans(id) ON DELETE CASCADE
    );
  `);
  return db;
}

// --- Helpers ---

function makeDlId(): string {
  return `dl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function toDbScan(result: ScanResult): DbScan {
  return {
    id: result.id,
    imageUri: result.imageUri,
    imageThumbnailUri: result.imageThumbnailUri,
    category: result.category,
    documentType: result.documentType,
    title: result.title,
    summary: result.summary,
    responseJson: result.responseJson,
    userLanguage: result.userLanguage,
    urgency: result.urgency,
    isFavorite: result.isFavorite ? 1 : 0,
    createdAt: result.createdAt,
  };
}

function rowToScanResult(row: DbScan): ScanResult {
  let parsed: Record<string, unknown> = {};
  try {
    parsed = JSON.parse(row.responseJson);
  } catch {
    // ignore
  }
  return {
    id: row.id,
    imageUri: row.imageUri,
    imageThumbnailUri: row.imageThumbnailUri,
    documentType: row.documentType,
    category: row.category,
    title: row.title,
    summary: row.summary || (parsed.summary as string) || '',
    urgency: row.urgency as ScanResult['urgency'],
    urgencyReason: parsed.urgency_reason as string | undefined,
    keyInformation: (
      (parsed.key_information ?? parsed.keyInformation ?? []) as Array<Record<string, string>>
    ).map((k) => ({
      label: k.label,
      value: k.value,
      originalJapanese: k.original_japanese ?? k.originalJapanese ?? '',
      note: k.note,
    })),
    dates: (
      (parsed.dates ?? []) as Array<Record<string, unknown>>
    ).map((d) => ({
      label: d.label as string,
      date: d.date as string,
      display: d.display as string,
      isDeadline: (d.is_deadline ?? d.isDeadline) as boolean,
      daysRemaining: (d.days_remaining ?? d.daysRemaining) as number | undefined,
    })),
    actionItems: (
      (parsed.action_items ?? parsed.actionItems ?? []) as Array<Record<string, unknown>>
    ).map((a) => ({
      priority: a.priority as number,
      action: a.action as string,
      how: a.how as string,
      where: a.where as string | undefined,
      deadline: a.deadline as string | undefined,
    })),
    culturalContext: (parsed.cultural_context ?? parsed.culturalContext) as string | undefined,
    warnings: parsed.warnings as string[] | undefined,
    vocabulary: (
      (parsed.related_vocabulary ?? parsed.vocabulary ?? []) as Array<Record<string, string>>
    ).map((v) => ({
      word: v.word,
      pronunciation: v.reading ?? v.pronunciation ?? '',
      meaning: v.meaning,
    })),
    professionalReferral: (parsed.professional_referral ?? parsed.professionalReferral) as
      | { needed: boolean; type?: string; reason?: string }
      | undefined,
    responseJson: row.responseJson,
    userLanguage: row.userLanguage,
    isFavorite: row.isFavorite === 1,
    createdAt: row.createdAt,
  };
}

// --- Public API ---

export async function initDatabase(): Promise<void> {
  if (isWeb) return;
  await getDb();
}

export async function saveScan(result: ScanResult): Promise<void> {
  if (isWeb) {
    const scans = webGetScans();
    scans.unshift(toDbScan(result));
    webSaveScans(scans);
    const deadlines = webGetDeadlines();
    for (const d of result.dates.filter((dd) => dd.isDeadline)) {
      deadlines.push({ id: makeDlId(), scanId: result.id, label: d.label, date: d.date, isNotified: 0 });
    }
    webSaveDeadlines(deadlines);
    return;
  }
  const database = await getDb();
  await database.runAsync(
    `INSERT OR REPLACE INTO scans (id, imageUri, imageThumbnailUri, category, documentType, title, summary, responseJson, userLanguage, urgency, isFavorite, createdAt)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    result.id, result.imageUri, result.imageThumbnailUri, result.category, result.documentType,
    result.title, result.summary, result.responseJson, result.userLanguage, result.urgency,
    result.isFavorite ? 1 : 0, result.createdAt
  );
  for (const d of result.dates.filter((dd) => dd.isDeadline)) {
    await database.runAsync(
      `INSERT INTO deadlines (id, scanId, label, date, isNotified) VALUES (?, ?, ?, ?, 0)`,
      makeDlId(), result.id, d.label, d.date
    );
  }
}

export async function getAllScans(): Promise<ScanResult[]> {
  if (isWeb) {
    return webGetScans().map(rowToScanResult);
  }
  const database = await getDb();
  const rows: DbScan[] = await database.getAllAsync('SELECT * FROM scans ORDER BY createdAt DESC');
  return rows.map(rowToScanResult);
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  if (isWeb) {
    const scans = webGetScans();
    const scan = scans.find((s) => s.id === id);
    if (scan) { scan.isFavorite = isFavorite ? 1 : 0; webSaveScans(scans); }
    return;
  }
  const database = await getDb();
  await database.runAsync('UPDATE scans SET isFavorite = ? WHERE id = ?', isFavorite ? 1 : 0, id);
}

export async function deleteScan(id: string): Promise<void> {
  if (isWeb) {
    webSaveScans(webGetScans().filter((s) => s.id !== id));
    webSaveDeadlines(webGetDeadlines().filter((d) => d.scanId !== id));
    return;
  }
  const database = await getDb();
  await database.runAsync('DELETE FROM deadlines WHERE scanId = ?', id);
  await database.runAsync('DELETE FROM scans WHERE id = ?', id);
}

export interface DeadlineWithScan {
  id: string;
  scanId: string;
  label: string;
  date: string;
  isNotified: boolean;
  scanTitle: string;
  scanUrgency: string;
}

export async function getAllDeadlines(): Promise<DeadlineWithScan[]> {
  if (isWeb) {
    const deadlines = webGetDeadlines();
    const scans = webGetScans();
    return deadlines.map((d) => {
      const scan = scans.find((s) => s.id === d.scanId);
      return {
        id: d.id, scanId: d.scanId, label: d.label, date: d.date,
        isNotified: d.isNotified === 1,
        scanTitle: scan?.title ?? '', scanUrgency: scan?.urgency ?? 'info',
      };
    });
  }
  const database = await getDb();
  const rows = await database.getAllAsync(
    `SELECT d.id, d.scanId, d.label, d.date, d.isNotified, s.title as scanTitle, s.urgency as scanUrgency
     FROM deadlines d LEFT JOIN scans s ON d.scanId = s.id ORDER BY d.date ASC`
  );
  return (rows as Array<Record<string, unknown>>).map((r) => ({
    id: r.id as string, scanId: r.scanId as string, label: r.label as string,
    date: r.date as string, isNotified: r.isNotified === 1,
    scanTitle: (r.scanTitle as string) ?? '', scanUrgency: (r.scanUrgency as string) ?? 'info',
  }));
}
