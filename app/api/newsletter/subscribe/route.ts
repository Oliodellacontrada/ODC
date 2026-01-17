import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs'
import { cookies } from 'next/headers'
import { NextResponse } from 'next/server'

export async function POST(request: Request) {
  try {
    const { email } = await request.json()

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Email non valida' },
        { status: 400 }
      )
    }

    const supabase = createRouteHandlerClient({ cookies })

    // Controlla se l'email esiste già
    const { data: existing } = await supabase
      .from('newsletter_subscribers')
      .select('*')
      .eq('email', email)
      .single()

    if (existing) {
      // Se esiste ed è già iscritto
      if (existing.subscribed) {
        return NextResponse.json(
          { error: 'Email già registrata' },
          { status: 400 }
        )
      }
      
      // Se esiste ma è disiscritto, riattiva
      const { error } = await supabase
        .from('newsletter_subscribers')
        .update({ 
          subscribed: true,
          subscribed_at: new Date().toISOString(),
          unsubscribed_at: null
        })
        .eq('email', email)

      if (error) throw error

      return NextResponse.json({ 
        success: true, 
        message: 'Iscrizione riattivata con successo!' 
      })
    }

    // Se non esiste, crea nuovo record
    const { data, error } = await supabase
      .from('newsletter_subscribers')
      .insert([{ email, subscribed: true }])
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error('Newsletter subscribe error:', error)
    return NextResponse.json(
      { error: 'Errore durante l\'iscrizione' },
      { status: 500 }
    )
  }
}
