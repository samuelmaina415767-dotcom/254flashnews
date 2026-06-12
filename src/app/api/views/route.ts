import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function POST(request: NextRequest) {
  try {
    const { articleId } = await request.json()
    if (!articleId) {
      return NextResponse.json({ error: 'Missing articleId' }, { status: 400 })
    }

    // Use service role to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const { error } = await supabase.rpc('increment_view_count', { 
      article_id: articleId 
    })

    if (error) {
      console.error('View count error:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('View route error:', error)
    return NextResponse.json({ error: 'Failed' }, { status: 500 })
  }
}