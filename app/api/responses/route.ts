import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getServiceSupabase } from '@/lib/supabase'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  const department = searchParams.get('department')

  if (!sessionId) return NextResponse.json({ error: 'session_id required' }, { status: 400 })

  const db = getServiceSupabase()
  let query = db.from('responses').select('*').eq('session_id', sessionId)
  if (department) query = query.eq('department', department)

  const { data, error } = await query
  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await req.json()
  const { session_id, department, section, field_key, field_value } = body

  if (!session_id || !department || !section || !field_key) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }

  const db = getServiceSupabase()
  const { data, error } = await db
    .from('responses')
    .upsert(
      { session_id, department, section, field_key, field_value, updated_at: new Date().toISOString() },
      { onConflict: 'session_id,department,section,field_key' }
    )
    .select()
    .single()

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })
  return NextResponse.json(data)
}
