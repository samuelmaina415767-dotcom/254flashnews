import { NextRequest, NextResponse } from 'next/server'
import { createServerClientInstance } from '@/lib/supabase-server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, subject, message } = body

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: 'All fields required' }, { status: 400 })
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
    }

    const supabase = await createServerClientInstance()
    const { error } = await supabase.from('contact_messages').insert({
      name: name.trim().slice(0, 100),
      email: email.trim().slice(0, 200),
      subject: subject.trim().slice(0, 200),
      message: message.trim().slice(0, 5000),
    })

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Contact form error:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
}
