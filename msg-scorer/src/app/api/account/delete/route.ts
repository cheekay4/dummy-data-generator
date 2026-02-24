import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

/**
 * DELETE /api/account/delete
 * ログイン中ユーザー自身のアカウントとすべてのデータを削除する。
 * GDPR・個人情報保護法のアカウント削除義務に対応。
 */
export async function DELETE() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: '認証が必要です' }, { status: 401 });
  }

  const db = createAdminClient();
  const userId = user.id;

  try {
    // 1. ユーザーデータを削除（RLSをバイパスするためservice roleを使用）
    // score_history → cascade で関連データも削除される想定
    await db.from('score_history').delete().eq('user_id', userId);
    await db.from('daily_usage').delete().eq('user_id', userId);
    await db.from('custom_segments').delete().eq('user_id', userId);
    await db.from('feedback').delete().eq('user_id', userId);

    // 2. チームメンバーシップを解除
    // オーナーの場合はチーム自体は残す（他メンバーへの影響を避ける）
    await db.from('team_members').delete().eq('user_id', userId);

    // 3. 拡張トークン無効化（明示的に。profiles削除前に実施）
    await db.from('profiles').update({ extension_token_hash: null }).eq('id', userId);

    // 4. Stripe サブスクリプションをキャンセル（存在する場合）
    const { data: profile } = await db
      .from('profiles')
      .select('stripe_subscription_id')
      .eq('id', userId)
      .single();

    if (profile?.stripe_subscription_id) {
      try {
        const { stripe } = await import('@/lib/stripe/config');
        await stripe.subscriptions.cancel(profile.stripe_subscription_id);
      } catch (e) {
        // Stripeキャンセル失敗は致命的でないのでログのみ
        console.error('Stripe cancellation failed on account delete:', e);
      }
    }

    // 5. Supabase Auth からユーザーを削除（profilesはcascadeで削除される想定）
    const { error: deleteError } = await db.auth.admin.deleteUser(userId);
    if (deleteError) {
      console.error('Auth user deletion failed:', deleteError);
      return NextResponse.json({ error: 'アカウント削除に失敗しました' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Account deletion error:', err);
    return NextResponse.json({ error: 'データ削除中にエラーが発生しました' }, { status: 500 });
  }
}
