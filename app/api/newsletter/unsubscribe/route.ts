import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email, token } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    let query = supabase
      .from('newsletter_subscribers')
      .update({ subscribed: false, unsubscribed_at: new Date().toISOString() })
      .eq('email', email)

    if (token) {
      query = query.eq('unsubscribe_token', token)
    }

    const { error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    return NextResponse.json(
      { error: 'Errore durante la disiscrizione' },
      { status: 500 }
    )
  }
}
