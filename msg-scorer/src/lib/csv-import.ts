import Papa from 'papaparse';
import type { CampaignRecord, CsvError, CsvParseResult } from './types';

// channel 正規化マップ（日本語・英字・大文字小文字を許容）
const CHANNEL_MAP: Record<string, 'email' | 'line'> = {
  email: 'email', mail: 'email', メール: 'email', 'e-mail': 'email',
  line: 'line', ライン: 'line', 'line配信': 'line',
};

function normalizeChannel(raw: string): 'email' | 'line' | null {
  const key = raw.trim().toLowerCase();
  return CHANNEL_MAP[key] ?? null;
}

function parseDateStr(raw: string | undefined): string | undefined {
  if (!raw) return undefined;
  const s = raw.trim().replace(/\//g, '-');
  return /^\d{4}-\d{2}-\d{2}$/.test(s) ? s : undefined;
}

function parseRate(raw: string | undefined, fieldName: string, row: number, errors: CsvError[]): number | undefined {
  if (!raw || raw.trim() === '') return undefined;
  const n = parseFloat(raw);
  if (isNaN(n)) return undefined;
  if (n < 0 || n > 100) {
    errors.push({ row, field: fieldName, message: `${fieldName} が ${raw}% で範囲外（0〜100）` });
    return undefined;
  }
  return n;
}

function parseInt10(raw: string | undefined): number | undefined {
  if (!raw || raw.trim() === '') return undefined;
  const n = parseInt(raw, 10);
  return isNaN(n) || n < 0 ? undefined : n;
}

export function parseCsvText(csvText: string): CsvParseResult {
  const result = Papa.parse<Record<string, string>>(csvText, {
    header: true,
    skipEmptyLines: true,
    transformHeader: (h: string) => h.trim(),
  });

  const records: CampaignRecord[] = [];
  const errors: CsvError[] = [];

  (result.data as Record<string, string>[]).forEach((row, idx) => {
    const rowNum = idx + 2; // 1-indexed, header=1

    // channel 正規化
    const rawChannel = row['channel'] ?? '';
    const channel = normalizeChannel(rawChannel);
    if (!channel) {
      errors.push({ row: rowNum, field: 'channel', message: `channel が不正（"${rawChannel}"）` });
      return; // skip row
    }

    // subject / body いずれかが必須
    const subject = row['subject']?.trim() || undefined;
    const body    = row['body']?.trim() || undefined;
    if (!subject && !body) {
      errors.push({ row: rowNum, message: 'subject と body の両方が空' });
      return;
    }

    // open_rate / ctr バリデーション
    const open_rate = parseRate(row['open_rate'], 'open_rate', rowNum, errors);
    const ctr       = parseRate(row['ctr'], 'ctr', rowNum, errors);

    records.push({
      date:       parseDateStr(row['date']),
      channel,
      subject,
      body,
      recipients: parseInt10(row['recipients']),
      open_rate,
      ctr,
      cv_count:   parseInt10(row['cv_count']),
      cv_type:    row['cv_type']?.trim() || undefined,
    });
  });

  // サマリー計算
  const emailRecs = records.filter(r => r.channel === 'email');
  const lineRecs  = records.filter(r => r.channel === 'line');

  const avgOf = (arr: number[]) => arr.length === 0 ? null : parseFloat((arr.reduce((a, b) => a + b, 0) / arr.length).toFixed(1));

  const dates = records.map(r => r.date).filter(Boolean) as string[];
  const dateRange = dates.length > 0
    ? { from: dates.slice().sort()[0], to: dates.slice().sort().reverse()[0] }
    : null;

  return {
    records,
    errors,
    summary: {
      totalRows:   result.data.length,
      validRows:   records.length,
      invalidRows: errors.length,
      channels:    { email: emailRecs.length, line: lineRecs.length },
      dateRange,
      avgOpenRate: {
        email: avgOf(emailRecs.map(r => r.open_rate).filter((v): v is number => v != null)),
        line:  avgOf(lineRecs.map(r => r.open_rate).filter((v): v is number => v != null)),
      },
      avgCtr: {
        email: avgOf(emailRecs.map(r => r.ctr).filter((v): v is number => v != null)),
        line:  avgOf(lineRecs.map(r => r.ctr).filter((v): v is number => v != null)),
      },
    },
  };
}

/** テンプレートCSV（BOM付きUTF-8）を生成する */
export function generateTemplateCsv(): string {
  const BOM = '\uFEFF';
  const header = 'date,channel,subject,body,recipients,open_rate,ctr,cv_count,cv_type';
  const rows = [
    '2026-01-15,email,【限定】春コスメ50%OFF,,10000,23.4,4.7,47,purchase',
    '2026-01-25,line,,🌸春コスメ特集！今だけ全品送料無料✨,8000,62.1,8.3,94,purchase',
  ];
  return BOM + [header, ...rows].join('\r\n') + '\r\n';
}
