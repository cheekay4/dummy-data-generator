import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const FREE_MANUAL_LIMIT = 3

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { data, error } = await supabase
    .from('manuals')
    .select('id, title, business_type, template_key, status, section_count, word_count, created_at, updated_at')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ manuals: data })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // プラン確認
  const { data: profile } = await supabase
    .from('profiles')
    .select('plan')
    .eq('id', user.id)
    .single()

  const plan = profile?.plan ?? 'free'

  if (plan === 'free') {
    const { count } = await supabase
      .from('manuals')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .neq('status', 'archived')

    if ((count ?? 0) >= FREE_MANUAL_LIMIT) {
      return NextResponse.json(
        { error: 'PLAN_LIMIT', message: `無料プランはマニュアル${FREE_MANUAL_LIMIT}件まで。Proプランにアップグレードしてください。` },
        { status: 403 }
      )
    }
  }

  const body = await request.json()
  const { title, businessType, templateKey } = body

  const { data, error } = await supabase
    .from('manuals')
    .insert({
      user_id: user.id,
      title: title || '無題のマニュアル',
      business_type: businessType || 'general',
      template_key: templateKey || 'general',
    })
    .select('id')
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json({ id: data.id }, { status: 201 })
}
