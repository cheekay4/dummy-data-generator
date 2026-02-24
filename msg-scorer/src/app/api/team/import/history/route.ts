import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTeamByUserId } from '@/lib/db/teams';
import { getImportBatches, deleteImportBatch, getOrganizationKnowledge } from '@/lib/db/campaign-results';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const batches = await getImportBatches(teamResult.team.id);
  return NextResponse.json({ batches });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const { myMember, team } = teamResult;
  if (myMember.role !== 'owner') return NextResponse.json({ error: '管理者のみ実行できます。' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get('batchId');
  if (!batchId) return NextResponse.json({ error: 'batchIdが必要です。' }, { status: 400 });

  await deleteImportBatch(batchId, team.id);
  return NextResponse.json({ success: true });
}

export async function PATCH(req: NextRequest) {
  // 分析結果取得エンドポイント
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '認証が必要です。' }, { status: 401 });

  const teamResult = await getTeamByUserId(user.id);
  if (!teamResult) return NextResponse.json({ error: 'チームに所属していません。' }, { status: 403 });

  const { searchParams } = new URL(req.url);
  const batchId = searchParams.get('batchId');

  const knowledge = await getOrganizationKnowledge(teamResult.team.id);
  const filtered = batchId ? knowledge.filter(k => (k as { import_batch_id?: string }).import_batch_id === batchId) : knowledge;

  return NextResponse.json({ knowledge: filtered });
}
