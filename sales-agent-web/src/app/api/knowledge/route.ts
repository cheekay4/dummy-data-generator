import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'

/**
 * ナレッジ CRUD API
 * GET: 一覧取得 (optional ?product=xxx)
 * POST: 新規追加
 * PUT: 更新
 * DELETE: 削除
 */

export async function GET(req: NextRequest) {
  const product = req.nextUrl.searchParams.get('product')
  const category = req.nextUrl.searchParams.get('category')

  let query = supabase
    .from('sales_knowledge')
    .select('*')
    .order('category')
    .order('usage_count', { ascending: false })

  if (product) query = query.eq('product', product)
  if (category) query = query.eq('category', category)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(req: NextRequest) {
  const body = await req.json() as {
    category: string
    question: string
    answer: string
    keywords?: string[]
    product?: string
  }

  if (!body.category || !body.question || !body.answer) {
    return NextResponse.json({ error: 'category, question, answer は必須です' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('sales_knowledge')
    .insert({
      category: body.category,
      question: body.question,
      answer: body.answer,
      keywords: body.keywords ?? [],
      product: body.product ?? 'review-reply-ai',
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data, { status: 201 })
}

export async function PUT(req: NextRequest) {
  const body = await req.json() as {
    id: string
    category?: string
    question?: string
    answer?: string
    keywords?: string[]
    product?: string
  }

  if (!body.id) {
    return NextResponse.json({ error: 'id は必須です' }, { status: 400 })
  }

  const updates: Record<string, unknown> = { updated_at: new Date().toISOString() }
  if (body.category !== undefined) updates.category = body.category
  if (body.question !== undefined) updates.question = body.question
  if (body.answer !== undefined) updates.answer = body.answer
  if (body.keywords !== undefined) updates.keywords = body.keywords
  if (body.product !== undefined) updates.product = body.product

  const { data, error } = await supabase
    .from('sales_knowledge')
    .update(updates)
    .eq('id', body.id)
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function DELETE(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')

  if (!id) {
    return NextResponse.json({ error: 'id パラメータは必須です' }, { status: 400 })
  }

  const { error } = await supabase
    .from('sales_knowledge')
    .delete()
    .eq('id', id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
