import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { getServiceSupabase, type Department } from '@/lib/supabase'
import { generateMarkdown } from '@/lib/exportMarkdown'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { searchParams } = new URL(req.url)
  const sessionId = searchParams.get('session_id')
  const department = searchParams.get('department') as Department | null

  if (!sessionId || !department) {
    return NextResponse.json({ error: 'session_id and department required' }, { status: 400 })
  }

  const db = getServiceSupabase()

  const [{ data: sessionData }, { data: responses }, { data: submission }] = await Promise.all([
    db.from('sessions').select('*').eq('id', sessionId).single(),
    db.from('responses').select('*').eq('session_id', sessionId).eq('department', department),
    db.from('submissions').select('*').eq('session_id', sessionId).eq('department', department).maybeSingle(),
  ])

  if (!sessionData) return NextResponse.json({ error: 'Session not found' }, { status: 404 })

  const markdown = generateMarkdown(sessionData, department, responses ?? [], submission ?? undefined)
  return new NextResponse(markdown, {
    headers: {
      'Content-Type': 'text/markdown',
      'Content-Disposition': `attachment; filename="CLAUDE-${department}-${sessionId.slice(0, 8)}.md"`,
    },
  })
}
