import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { submitFeedback, getMyFeedback } from '@/lib/db/feedback';
import { getTeamByUserId } from '@/lib/db/teams';
import { sendSlackNotification } from '@/lib/slack';

// GET /api/feedback?score_history_id=xxx — 既存フィードバックチェック
export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ feedback: null });

  const scoreHistoryId = req.nextUrl.searchParams.get('score_history_id');
  if (!scoreHistoryId) return NextResponse.json({ feedback: null });

  const fb = await getMyFeedback(scoreHistoryId, user.id);
  return NextResponse.json({ feedback: fb });
}

// POST /api/feedback — フィードバック送信
export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: '未認証' }, { status: 401 });

  const body = await req.json() as {
    score_history_id: string;
    rating: 1 | -1;
    comment?: string;
  };

  const { score_history_id, rating, comment } = body;
  if (!score_history_id || (rating !== 1 && rating !== -1)) {
    return NextResponse.json({ error: 'invalid input' }, { status: 400 });
  }

  const teamResult = await getTeamByUserId(user.id);
  const teamId = teamResult?.team?.id;

  await submitFeedback({
    scoreHistoryId: score_history_id,
    userId: user.id,
    teamId,
    rating,
    comment: comment?.slice(0, 200),
  });

  if (teamId) {
    sendSlackNotification({
      type: 'feedback',
      teamId,
      data: {
        memberEmail: user.email,
        rating,
        ratingLabel: rating === 1 ? '👍 役立った' : '👎 改善が必要',
        comment: comment ?? '',
      },
    }).catch(() => {});
  }

  return NextResponse.json({ success: true });
}
