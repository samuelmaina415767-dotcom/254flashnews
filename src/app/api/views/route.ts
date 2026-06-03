import { NextRequest, NextResponse } from 'next/server'
import { createServerClientInstance } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()
    if (!articleId) return NextResponse.json({ error: 'Missing articleId' }, { status: 400 })

    const supabase = await createServerClientInstance()
    await supabase.rpc('increment_view_count', { article_id: articleId })

    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}
