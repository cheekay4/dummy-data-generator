import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { getTeamByUserId } from '@/lib/db/teams';

export async function GET() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ team: null, myMember: null });
  }

  const result = await getTeamByUserId(user.id);
  return NextResponse.json(result ?? { team: null, myMember: null });
}
