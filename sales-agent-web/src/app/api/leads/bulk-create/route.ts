import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

interface LeadInput {
  company_name: string
  email: string
  website_url?: string
  industry?: string
  estimated_scale?: string
  discovery_method?: string
  source_query?: string
}

export async function POST(req: NextRequest) {
  const { leads } = (await req.json()) as { leads: LeadInput[] }
  if (!leads?.length) {
    return NextResponse.json({ error: 'leads required' }, { status: 400 })
  }

  let added = 0
  let skipped = 0

  for (const lead of leads) {
    const { error } = await supabase.from('sales_leads').insert({
      company_name: lead.company_name,
      email: lead.email,
      website_url: lead.website_url,
      industry: lead.industry,
      estimated_scale: lead.estimated_scale,
      discovery_method: lead.discovery_method ?? 'manual',
      source_query: lead.source_query,
      status: 'new',
    })

    if (error?.code === '23505') {
      // unique constraint 違反 = 重複メール
      skipped++
    } else if (!error) {
      added++
    }
  }

  return NextResponse.json({ added, skipped })
}
