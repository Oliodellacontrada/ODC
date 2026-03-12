import { NextRequest, NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createServerClient } from '@/lib/supabase-server'

const resend = new Resend(process.env.RESEND_API_KEY)

type Subscriber = {
  email: string
}

export async function POST(req: NextRequest) {
  const supabase = createServerClient()

  const { data: { session } } = await supabase.auth.getSession()
  if (!session) {
    return NextResponse.json({ error: 'Non autorizzato' }, { status: 401 })
  }

  const { subject, content } = await req.json()

  if (!subject || !content) {
    return NextResponse.json({ error: 'Oggetto e contenuto sono obbligatori' }, { status: 400 })
  }

  const { data: subscribers } = await supabase
    .from('newsletter_subscribers')
    .select('email')
    .eq('confirmed', true)

  const emails = ((subscribers || []) as Subscriber[]).map((s) => s.email)

  if (emails.length === 0) {
    return NextResponse.json({ error: 'Nessun iscritto trovato' }, { status: 400 })
  }

  const html = `
    <!DOCTYPE html>
    <html lang="it">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="margin:0;padding:0;background:#f5f5f0;font-family:Georgia,serif;">
      <div style="max-width:600px;margin:40px auto;background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.08);">
        
        <!-- Header -->
        <div style="background:linear-gradient(135deg,#5a6541,#72814f);padding:40px 32px;text-align:center;">
          <img src="https://res.cloudinary.com/dg1x0q7te/image/upload/v1773327006/0MGrsFMZTQSL17ohWQpJ3w-removebg-preview_hygpgc.png" alt="Olio della Contrada" style="height:80px;margin-bottom:16px;" />
          <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:bold;">Olio della Contrada</h1>
          <p style="color:#c5cfad;margin:8px 0 0;font-size:14px;">Dalla nostra campagna alla tua tavola</p>
        </div>

        <!-- Contenuto -->
        <div style="padding:40px 32px;">
          <h2 style="color:#4a5236;font-size:22px;margin:0 0 24px;">${subject}</h2>
          <div style="color:#555;font-size:16px;line-height:1.8;">${content}</div>
        </div>

        <!-- Footer -->
        <div style="background:#f7f8f3;padding:24px 32px;text-align:center;border-top:2px solid #dce2cd;">
          <p style="color:#8d9f67;font-size:13px;margin:0 0 8px;">
            Famiglia Longo &mdash; Contrada Vespano 1, 87030 Cleto (CS)
          </p>
          <p style="color:#a8b885;font-size:12px;margin:0;">
            Hai ricevuto questa email perche ti sei iscritto alla nostra newsletter.
            <br/>
            <a href="https://www.oliodellacontrada.it/unsubscribe" style="color:#72814f;">Cancellati dalla newsletter</a>
          </p>
        </div>

      </div>
    </body>
    </html>
  `

  try {
    await resend.emails.send({
      from: 'Olio della Contrada <info@oliodellacontrada.it>',
      to: emails,
      subject: subject,
      html: html,
    })

    return NextResponse.json({ success: true, sent: emails.length })
  } catch (error) {
    console.error('Errore invio newsletter:', error)
    return NextResponse.json({ error: 'Errore durante il invio' }, { status: 500 })
  }
}
