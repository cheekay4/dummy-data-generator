import type { ScanResult } from './types';

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

const WEB_SCANS_KEY = 'scanlingo_scans';
const WEB_DEADLINES_KEY = 'scanlingo_deadlines';

function webGetScans(): DbScan[] {
  try { return JSON.parse(localStorage.getItem(WEB_SCANS_KEY) ?? '[]'); } catch { return []; }
}
function webSaveScans(scans: DbScan[]) { localStorage.setItem(WEB_SCANS_KEY, JSON.stringify(scans)); }
function webGetDeadlines(): DbDeadline[] {
  try { return JSON.parse(localStorage.getItem(WEB_DEADLINES_KEY) ?? '[]'); } catch { return []; }
}
function webSaveDeadlines(dls: DbDeadline[]) { localStorage.setItem(WEB_DEADLINES_KEY, JSON.stringify(dls)); }

function makeDlId(): string { return `dl-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`; }

function rowToScanResult(row: DbScan): ScanResult {
  let parsed: Record<string, unknown> = {};
  try { parsed = JSON.parse(row.responseJson); } catch { /* ignore */ }
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
    keyInformation: ((parsed.key_information ?? parsed.keyInformation ?? []) as Array<Record<string, string>>).map((k) => ({
      label: k.label, value: k.value, originalJapanese: k.original_japanese ?? k.originalJapanese ?? '', note: k.note,
    })),
    dates: ((parsed.dates ?? []) as Array<Record<string, unknown>>).map((d) => ({
      label: d.label as string, date: d.date as string, display: d.display as string,
      isDeadline: (d.is_deadline ?? d.isDeadline) as boolean, daysRemaining: (d.days_remaining ?? d.daysRemaining) as number | undefined,
    })),
    actionItems: ((parsed.action_items ?? parsed.actionItems ?? []) as Array<Record<string, unknown>>).map((a) => ({
      priority: a.priority as number, action: a.action as string, how: a.how as string,
      where: a.where as string | undefined, deadline: a.deadline as string | undefined,
    })),
    culturalContext: (parsed.cultural_context ?? parsed.culturalContext) as string | undefined,
    warnings: parsed.warnings as string[] | undefined,
    vocabulary: ((parsed.related_vocabulary ?? parsed.vocabulary ?? []) as Array<Record<string, string>>).map((v) => ({
      word: v.word, pronunciation: v.reading ?? v.pronunciation ?? '', meaning: v.meaning,
    })),
    professionalReferral: (parsed.professional_referral ?? parsed.professionalReferral) as { needed: boolean; type?: string; reason?: string } | undefined,
    responseJson: row.responseJson,
    userLanguage: row.userLanguage,
    isFavorite: row.isFavorite === 1,
    createdAt: row.createdAt,
  };
}

export async function initDatabase(): Promise<void> { /* no-op on web */ }

export async function saveScan(result: ScanResult): Promise<void> {
  const scans = webGetScans();
  scans.unshift({
    id: result.id, imageUri: result.imageUri, imageThumbnailUri: result.imageThumbnailUri,
    category: result.category, documentType: result.documentType, title: result.title,
    summary: result.summary, responseJson: result.responseJson, userLanguage: result.userLanguage,
    urgency: result.urgency, isFavorite: result.isFavorite ? 1 : 0, createdAt: result.createdAt,
  });
  webSaveScans(scans);
  const deadlines = webGetDeadlines();
  for (const d of result.dates.filter((dd) => dd.isDeadline)) {
    deadlines.push({ id: makeDlId(), scanId: result.id, label: d.label, date: d.date, isNotified: 0 });
  }
  webSaveDeadlines(deadlines);
}

export async function getAllScans(): Promise<ScanResult[]> {
  return webGetScans().map(rowToScanResult);
}

export async function toggleFavorite(id: string, isFavorite: boolean): Promise<void> {
  const scans = webGetScans();
  const scan = scans.find((s) => s.id === id);
  if (scan) { scan.isFavorite = isFavorite ? 1 : 0; webSaveScans(scans); }
}

export async function deleteScan(id: string): Promise<void> {
  webSaveScans(webGetScans().filter((s) => s.id !== id));
  webSaveDeadlines(webGetDeadlines().filter((d) => d.scanId !== id));
}

export interface DeadlineWithScan {
  id: string; scanId: string; label: string; date: string;
  isNotified: boolean; scanTitle: string; scanUrgency: string;
}

export async function getAllDeadlines(): Promise<DeadlineWithScan[]> {
  const deadlines = webGetDeadlines();
  const scans = webGetScans();
  return deadlines.map((d) => {
    const scan = scans.find((s) => s.id === d.scanId);
    return {
      id: d.id, scanId: d.scanId, label: d.label, date: d.date,
      isNotified: d.isNotified === 1, scanTitle: scan?.title ?? '', scanUrgency: scan?.urgency ?? 'info',
    };
  });
}
