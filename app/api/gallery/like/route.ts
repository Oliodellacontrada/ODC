import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

export async function POST(req: NextRequest) {
  try {
    const { id } = await req.json()
    if (!id) return NextResponse.json({ error: 'ID mancante' }, { status: 400 })

    const { data, error } = await supabase.rpc('increment_likes', { item_id: id })
    if (error) throw error

    return NextResponse.json({ success: true, likes: data })
  } catch (error) {
    console.error('Errore like:', error)
    return NextResponse.json({ error: 'Errore durante il like' }, { status: 500 })
  }
}
