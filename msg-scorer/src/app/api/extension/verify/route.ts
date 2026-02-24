import { NextRequest, NextResponse } from 'next/server';
import { validateExtensionToken } from '@/lib/db/extension-token';
import { getUserPlan } from '@/lib/db/profiles';

/** POST: トークンを検証し有効性とプランを返す（セッション不要） */
export async function POST(req: NextRequest) {
  let body: { token?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { token } = body;
  if (!token || typeof token !== 'string') {
    return NextResponse.json({ valid: false, plan: null });
  }

  const userId = await validateExtensionToken(token);
  if (!userId) {
    return NextResponse.json({ valid: false, plan: null });
  }

  const plan = await getUserPlan(userId);
  return NextResponse.json({ valid: true, plan });
}
