import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import {
  getCustomSegments,
  saveCustomSegment,
  deleteCustomSegment,
} from '@/lib/db/custom-segments';
import { getUserPlan } from '@/lib/db/profiles';
import { getPlanLimits } from '@/lib/plan';

export async function GET(_req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 });

  const segments = await getCustomSegments(user.id);
  return NextResponse.json(segments);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 });

  const plan = await getUserPlan(user.id);
  const limits = getPlanLimits(plan);
  if (limits.customSegments === 0) {
    return NextResponse.json({ error: 'Proプランのみ利用できます。' }, { status: 403 });
  }

  const existing = await getCustomSegments(user.id);
  if (existing.length >= limits.customSegments) {
    return NextResponse.json(
      { error: `保存上限（${limits.customSegments}個）に達しています。` },
      { status: 429 },
    );
  }

  const { name, segment } = await req.json() as { name: string; segment: unknown };
  const saved = await saveCustomSegment(user.id, name, segment as Parameters<typeof saveCustomSegment>[2]);
  return NextResponse.json(saved, { status: 201 });
}

export async function DELETE(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  if (!id) return NextResponse.json({ error: 'id が必要です。' }, { status: 400 });

  await deleteCustomSegment(id, user.id);
  return NextResponse.json({ ok: true });
}
