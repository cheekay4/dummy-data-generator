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
  google_place_id?: string
  google_rating?: number | null
  google_review_count?: number | null
  phone?: string | null
  address?: string | null
  google_maps_url?: string | null
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
      google_place_id: lead.google_place_id,
      google_rating: lead.google_rating,
      google_review_count: lead.google_review_count,
      phone: lead.phone,
      address: lead.address,
      google_maps_url: lead.google_maps_url,
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
