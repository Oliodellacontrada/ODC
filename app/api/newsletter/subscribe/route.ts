import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email non valida' }, { status: 400 })
    }

    // Controlla se esiste già
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single()

    if (existing) {
      if (existing.subscribed) {
        return NextResponse.json({ error: 'Email già registrata' }, { status: 400 })
      }
      // Riattiva iscrizione
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({
          subscribed: true,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null
        })
        .eq('email', email)
      if (error) throw error
      return NextResponse.json({ success: true, message: 'Iscrizione riattivata con successo!' })
    }

    // Nuovo iscritto
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, subscribed: true }])
      .select()
      .single()

    if (error) throw error
    return NextResponse.json({ success: true, data })

  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json({ error: 'Errore durante l\'iscrizione' }, { status: 500 })
  }
}
