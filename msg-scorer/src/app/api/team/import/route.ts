import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTeamByUserId } from '@/lib/db/teams';
import { insertCampaignResults } from '@/lib/db/campaign-results';
import type { CampaignRecord } from '@/lib/types';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const { team, myMember } = teamResult;
  if (myMember.role !== 'owner') return NextResponse.json({ error: '管理者のみ実行できます。' }, { status: 403 });

  // Team Pro チェック
  if (team.plan !== 'team_pro') {
    return NextResponse.json({ error: 'Team Proプランが必要です。' }, { status: 403 });
  }

  let body: { records: CampaignRecord[]; filename?: string };
  try {
    body = await req.json() as { records: CampaignRecord[]; filename?: string };
  } catch {
    return NextResponse.json({ error: 'リクエスト形式が不正です。' }, { status: 400 });
  }

  const { records } = body;
  if (!Array.isArray(records) || records.length === 0) {
    return NextResponse.json({ error: 'インポートするデータがありません。' }, { status: 400 });
  }

  if (records.length > 5000) {
    return NextResponse.json({ error: '1回のインポートは5,000件までです。' }, { status: 400 });
  }

  const batchId = crypto.randomUUID();

  try {
    await insertCampaignResults(records, team.id, user.id, batchId);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    return NextResponse.json({ error: `インポートに失敗しました: ${msg}` }, { status: 500 });
  }

  return NextResponse.json({ success: true, batchId, count: records.length });
}
