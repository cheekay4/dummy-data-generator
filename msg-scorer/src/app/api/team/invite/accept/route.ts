import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { acceptInvite } from '@/lib/db/teams';

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'ログインが必要です。' }, { status: 401 });

  const { token } = await req.json() as { token: string };
  if (!token) return NextResponse.json({ error: 'トークンが必要です。' }, { status: 400 });

  const member = await acceptInvite(token, user.id, user.email ?? '');
  if (!member) {
    return NextResponse.json({ error: '招待が見つかりません。既に使用済みかもしれません。' }, { status: 404 });
  }

  return NextResponse.json({ member });
}
