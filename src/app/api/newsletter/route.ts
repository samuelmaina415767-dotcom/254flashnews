import { NextRequest, NextResponse } from 'next/server'
import { createServerClientInstance } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const { email, name } = await request.json()

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Valid email required' }, { status: 400 })
    }

    const supabase = await createServerClientInstance()
    const { error } = await supabase.from('newsletter_subscribers').upsert(
      { email: email.toLowerCase().trim(), name: name?.trim() || null, is_active: true },
      { onConflict: 'email', ignoreDuplicates: false }
    )

    if (error) throw error
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Subscription failed' }, { status: 500 })
  }
}
