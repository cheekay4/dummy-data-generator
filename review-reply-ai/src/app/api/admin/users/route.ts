import { NextRequest, NextResponse } from 'next/server'
import { requireAdminApi } from '@/lib/admin'
import { createAdminClient } from '@/lib/supabase/admin'

export async function GET(request: NextRequest) {
  const admin = await requireAdminApi()
  if (!admin) return NextResponse.json({ error: 'Forbidden' }, { status: 403 })

  const db = createAdminClient()
  const { searchParams } = new URL(request.url)
  const search = searchParams.get('search') ?? ''
  const plan = searchParams.get('plan') ?? ''
  const sort = searchParams.get('sort') ?? 'created_at'
  const order = searchParams.get('order') ?? 'desc'
  const limit = Math.min(Number(searchParams.get('limit') ?? 50), 100)
  const offset = Number(searchParams.get('offset') ?? 0)
  const today = new Date().toISOString().slice(0, 10)

  // Build query
  let query = db.from('profiles').select('*', { count: 'exact' })
  if (search) query = query.ilike('email', `%${search}%`)
  if (plan === 'free' || plan === 'pro') query = query.eq('plan', plan)

  const validSorts = ['created_at', 'email', 'plan']
  const sortCol = validSorts.includes(sort) ? sort : 'created_at'
  query = query.order(sortCol, { ascending: order === 'asc' }).range(offset, offset + limit - 1)

  const { data: profiles, count } = await query

  if (!profiles) {
    return NextResponse.json({ users: [], total: 0 })
  }

  // Get today's usage & profile counts for all returned user IDs
  const userIds = profiles.map((p) => p.id)

  const [{ data: usageData }, { data: profileData }] = await Promise.all([
    db.from('daily_usage').select('user_id, count').eq('usage_date', today).in('user_id', userIds),
    db.from('reply_profiles').select('user_id'),
  ])

  const usageMap = new Map<string, number>()
  for (const u of usageData ?? []) {
    usageMap.set(u.user_id, (usageMap.get(u.user_id) ?? 0) + u.count)
  }

  const profileCountMap = new Map<string, number>()
  for (const p of profileData ?? []) {
    if (userIds.includes(p.user_id)) {
      profileCountMap.set(p.user_id, (profileCountMap.get(p.user_id) ?? 0) + 1)
    }
  }

  const users = profiles.map((p) => ({
    id: p.id,
    email: p.email,
    display_name: p.display_name,
    plan: p.plan,
    created_at: p.created_at,
    usageToday: usageMap.get(p.id) ?? 0,
    profileCount: profileCountMap.get(p.id) ?? 0,
  }))

  return NextResponse.json({ users, total: count ?? 0 })
}
