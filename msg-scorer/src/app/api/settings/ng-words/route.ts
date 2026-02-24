import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 });

  const { words } = await req.json() as { words: string[] };
  const admin = createAdminClient();
  await admin.from('profiles').update({ custom_ng_words: words }).eq('id', user.id);
  return NextResponse.json({ ok: true });
}
