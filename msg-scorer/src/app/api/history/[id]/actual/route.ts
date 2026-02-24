import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { updateActualResults } from '@/lib/db/score-history';

interface Props {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: Props) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 });
  }

  const body = await req.json();
  await updateActualResults(id, user.id, body);
  return NextResponse.json({ ok: true });
}
