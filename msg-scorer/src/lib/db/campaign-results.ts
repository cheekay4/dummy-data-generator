import { createAdminClient } from '../supabase/admin';
import type { CampaignRecord, CampaignResult, ImportBatch } from '../types';

export async function insertCampaignResults(
  records: CampaignRecord[],
  teamId: string,
  userId: string,
  batchId: string,
): Promise<void> {
  const admin = createAdminClient();
  const rows = records.map(r => ({
    ...r,
    team_id: teamId,
    imported_by: userId,
    import_batch_id: batchId,
  }));

  const { error } = await admin.from('campaign_results').insert(rows);
  if (error) throw new Error(`campaign_results insert failed: ${error.message}`);
}

export async function getCampaignResults(
  teamId: string,
  channel?: string,
  limit = 100,
): Promise<CampaignResult[]> {
  const admin = createAdminClient();
  let query = admin
    .from('campaign_results')
    .select('*')
    .eq('team_id', teamId)
    .order('date', { ascending: false })
    .limit(limit);

  if (channel) query = query.eq('channel', channel);

  const { data, error } = await query;
  if (error) throw new Error(`getCampaignResults failed: ${error.message}`);
  return (data ?? []) as CampaignResult[];
}

export async function getImportBatches(teamId: string): Promise<ImportBatch[]> {
  const admin = createAdminClient();

  // バッチごとに集約（件数・インポート日時）
  const { data: results, error } = await admin
    .from('campaign_results')
    .select('import_batch_id, imported_at')
    .eq('team_id', teamId)
    .order('imported_at', { ascending: false });

  if (error) throw new Error(`getImportBatches failed: ${error.message}`);

  // organization_knowledge でどのバッチが分析済みか確認
  const { data: knowledge } = await admin
    .from('organization_knowledge')
    .select('import_batch_id')
    .eq('team_id', teamId)
    .not('import_batch_id', 'is', null);

  const analyzedBatches = new Set((knowledge ?? []).map((k: { import_batch_id: string }) => k.import_batch_id));

  // バッチIDでグルーピング
  const batchMap = new Map<string, { count: number; imported_at: string }>();
  for (const r of (results ?? []) as { import_batch_id: string; imported_at: string }[]) {
    const existing = batchMap.get(r.import_batch_id);
    if (!existing) {
      batchMap.set(r.import_batch_id, { count: 1, imported_at: r.imported_at });
    } else {
      existing.count++;
    }
  }

  return Array.from(batchMap.entries()).map(([id, { count, imported_at }]) => ({
    import_batch_id: id,
    count,
    imported_at,
    has_analysis: analyzedBatches.has(id),
  }));
}

export async function deleteImportBatch(batchId: string, teamId: string): Promise<void> {
  const admin = createAdminClient();

  // campaign_results削除
  const { error: err1 } = await admin
    .from('campaign_results')
    .delete()
    .eq('import_batch_id', batchId)
    .eq('team_id', teamId);
  if (err1) throw new Error(`deleteImportBatch (results) failed: ${err1.message}`);

  // organization_knowledge削除
  await admin
    .from('organization_knowledge')
    .delete()
    .eq('import_batch_id', batchId)
    .eq('team_id', teamId);
}

export async function saveOrganizationKnowledge(
  teamId: string,
  content: string,
  source: string,
  batchId?: string,
  userId?: string,
): Promise<void> {
  const admin = createAdminClient();
  const { error } = await admin.from('organization_knowledge').insert({
    team_id: teamId,
    content,
    source,
    import_batch_id: batchId ?? null,
    created_by: userId ?? null,
  });
  if (error) throw new Error(`saveOrganizationKnowledge failed: ${error.message}`);
}

export async function getOrganizationKnowledge(teamId: string): Promise<{ id: string; content: string; source: string; created_at: string }[]> {
  const admin = createAdminClient();
  const { data, error } = await admin
    .from('organization_knowledge')
    .select('id, content, source, created_at')
    .eq('team_id', teamId)
    .order('created_at', { ascending: false });
  if (error) throw new Error(`getOrganizationKnowledge failed: ${error.message}`);
  return (data ?? []) as { id: string; content: string; source: string; created_at: string }[];
}

/**
 * テキストのキーワードで類似した過去配信を検索する（簡易マッチ）
 */
export async function findSimilarCampaigns(
  teamId: string,
  channel: string,
  text: string,
): Promise<CampaignResult[]> {
  // チャネル変換 (email-subject/email-body → email)
  const dbChannel = channel.startsWith('email') ? 'email' : 'line';

  const all = await getCampaignResults(teamId, dbChannel, 100);
  if (all.length === 0) return [];

  // キーワード抽出（2文字以上の単語）
  const keywords = text.replace(/[【】「」（）！？。、\s]/g, ' ').split(' ').filter(w => w.length >= 2);
  if (keywords.length === 0) return all.slice(0, 3);

  // 各レコードのマッチスコアを計算
  const scored = all.map(r => {
    const target = `${r.subject ?? ''} ${r.body ?? ''}`;
    const matches = keywords.filter(k => target.includes(k)).length;
    return { record: r, score: matches };
  });

  // マッチ順にソートし、上位3件を返す（マッチなしは開封率の高い順）
  scored.sort((a, b) => b.score - a.score || (b.record.open_rate ?? 0) - (a.record.open_rate ?? 0));
  return scored.slice(0, 3).map(s => s.record);
}
