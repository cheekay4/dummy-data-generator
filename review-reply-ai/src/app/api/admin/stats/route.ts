import { NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

function getToday() {
  return new Date().toISOString().slice(0, 10)
}

function getWeekAgo() {
  const d = new Date()
  d.setDate(d.getDate() - 7)
  return d.toISOString()
}

export async function GET() {
  const admin = await requireAdminApi()
  if (!admin) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const db = createAdminClient()
  const today = getToday()
  const weekAgo = getWeekAgo()

  const [
    { count: totalUsers },
    { count: newUsersThisWeek },
    { count: proCount },
    { data: usageToday },
    { data: anonToday },
    { data: activeToday },
    { data: recentSignups },
  ] = await Promise.all([
    db.from('profiles').select('*', { count: 'exact', head: true }),
    db.from('profiles').select('*', { count: 'exact', head: true }).gte('created_at', weekAgo),
    db.from('profiles').select('*', { count: 'exact', head: true }).eq('plan', 'pro'),
    db.from('daily_usage').select('count').eq('usage_date', today),
    db.from('anonymous_trial_usage').select('count').eq('usage_date', today),
    db.from('daily_usage').select('user_id').eq('usage_date', today),
    db.from('profiles').select('email, created_at').order('created_at', { ascending: false }).limit(10),
  ])

  const generationsToday =
    (usageToday ?? []).reduce((sum, r) => sum + (r.count ?? 0), 0) +
    (anonToday ?? []).reduce((sum, r) => sum + (r.count ?? 0), 0)

  const anonymousTrialsToday = (anonToday ?? []).reduce((sum, r) => sum + (r.count ?? 0), 0)

  const uniqueUserIds = new Set((activeToday ?? []).map((r) => r.user_id))

  return NextResponse.json({
    totalUsers: totalUsers ?? 0,
    newUsersThisWeek: newUsersThisWeek ?? 0,
    proCount: proCount ?? 0,
    generationsToday,
    anonymousTrialsToday,
    activeUsersToday: uniqueUserIds.size,
    recentSignups: recentSignups ?? [],
  })
}
