import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const db = createAdminClient()

  const [
    { data: profile },
    { data: replyProfiles },
    { data: recentUsage },
    { data: recentHistory },
    { data: subscription },
  ] = await Promise.all([
    db.from('profiles').select('*').eq('id', id).single(),
    db.from('reply_profiles').select('*').eq('user_id', id).order('created_at', { ascending: true }),
    db.from('daily_usage').select('usage_date, count').eq('user_id', id).order('usage_date', { ascending: false }).limit(30),
    db.from('reply_history').select('*').eq('user_id', id).order('created_at', { ascending: false }).limit(20),
    db.from('subscriptions').select('stripe_subscription_id, status').eq('user_id', id).maybeSingle(),
  ])

  if (!profile) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 })
  }

  const today = new Date().toISOString().slice(0, 10)
  const usageToday = (recentUsage ?? [])
    .filter((u) => u.usage_date === today)
    .reduce((sum, u) => sum + u.count, 0)

  return NextResponse.json({
    id: profile.id,
    email: profile.email,
    display_name: profile.display_name,
    plan: profile.plan,
    stripe_customer_id: profile.stripe_customer_id,
    created_at: profile.created_at,
    usageToday,
    profileCount: replyProfiles?.length ?? 0,
    replyProfiles: replyProfiles ?? [],
    recentUsage: (recentUsage ?? []).map((u) => ({ date: u.usage_date, count: u.count })),
    recentHistory: recentHistory ?? [],
    subscription: subscription ?? null,
  })
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const body = await request.json()
  const db = createAdminClient()

  // Get current profile for audit log
  const { data: current } = await db.from('profiles').select('plan').eq('id', id).single()
  if (!current) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  const updates: Record<string, string> = {}
  if (body.plan && (body.plan === 'free' || body.plan === 'pro')) {
    updates.plan = body.plan
  }

  if (Object.keys(updates).length === 0) {
    return NextResponse.json({ error: 'No valid fields to update' }, { status: 400 })
  }

  const { error } = await db.from('profiles').update(updates).eq('id', id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Audit log
  await db.from('admin_audit_log').insert({
    admin_id: admin.userId,
    action: 'plan_change',
    target_id: id,
    details: { old_plan: current.plan, new_plan: updates.plan },
    ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
  }).then(() => {}) // fire-and-forget, don't block on audit log failure

  return NextResponse.json({ success: true })
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const admin = await requireAdminApi()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const { id } = await params
  const db = createAdminClient()

  // Get user email for audit log
  const { data: profile } = await db.from('profiles').select('email').eq('id', id).single()
  if (!profile) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  // Delete from Supabase Auth (cascades to profiles via FK)
  const { error } = await db.auth.admin.deleteUser(id)
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Audit log
  await db.from('admin_audit_log').insert({
    admin_id: admin.userId,
    action: 'user_delete',
    target_id: id,
    details: { email: profile.email },
    ip_address: request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || null,
  }).then(() => {})

  return NextResponse.json({ success: true })
}
