import { type HistoryRecord } from './db/score-history';

const CHANNEL_LABELS: Record<string, string> = {
  'email-subject': 'メール件名',
  'email-body':    'メール本文',
  'line':          'LINE配信文',
};

export function generateHistoryCSV(records: HistoryRecord[]): string {
  const headers = [
    '日時',
    'チャネル',
    '件名/テキスト（先頭50文字）',
    'セグメント',
    '総合スコア',
    '予測開封率(%)',
    '予測CTR(%)',
    '予測CV率(%)',
    '予測CV数',
    '実績開封率(%)',
    '実績CTR(%)',
    '実績CV率(%)',
    '実績CV数',
    'メモ',
  ];

  const rows = records.map((r) => {
    const preview = (r.subject || r.input_text).slice(0, 50).replace(/\n/g, ' ');
    const date = new Date(r.created_at).toLocaleString('ja-JP');

    return [
      date,
      CHANNEL_LABELS[r.channel] ?? r.channel,
      preview,
      r.audience.presetName ?? 'カスタム',
      r.result.totalScore,
      r.result.currentImpact.openRate,
      r.result.currentImpact.ctr,
      r.result.currentImpact.conversionRate,
      r.result.currentImpact.conversionCount,
      r.actual_open_rate ?? '',
      r.actual_ctr ?? '',
      r.actual_conversion_rate ?? '',
      r.actual_conversion_count ?? '',
      r.actual_note ?? '',
    ].map((v) => `"${String(v).replace(/"/g, '""')}"`);
  });

  const csvContent = [headers.map((h) => `"${h}"`), ...rows]
    .map((row) => row.join(','))
    .join('\r\n');

  // BOM付き UTF-8
  return '\uFEFF' + csvContent;
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
