'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Download, Plus, LogOut, CheckCircle2, Circle } from 'lucide-react'
import { type Department } from '@/lib/supabase'
import { ClawLogo } from '@/components/ClawLogo'

interface SessionRow {
  id: string
  created_at: string
  session_label: string
  facilitator_name: string
  submissions: Array<{ department: Department; submitted_at: string }>
}

const DEPTS: Department[] = ['hr', 'delivery', 'sales']
const DEPT_LABELS: Record<Department, string> = { hr: 'HR', delivery: 'Delivery', sales: 'Sales' }

export default function AdminPage() {
  const { status } = useSession()
  const router = useRouter()
  const [sessions, setSessions] = useState<SessionRow[]>([])
  const [loading, setLoading] = useState(true)
  const [exportingCell, setExportingCell] = useState<string | null>(null)

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login?callbackUrl=/admin')
  }, [status, router])

  useEffect(() => {
    if (status === 'authenticated') loadSessions()
  }, [status])

  async function loadSessions() {
    setLoading(true)
    try {
      const res = await fetch('/api/sessions')
      setSessions(await res.json())
    } finally {
      setLoading(false)
    }
  }

  async function handleExport(sessionId: string, dept: Department) {
    const key = `${sessionId}-${dept}`
    setExportingCell(key)
    try {
      const res = await fetch(`/api/export?session_id=${sessionId}&department=${dept}`)
      if (!res.ok) return
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CLAUDE-${dept}-${sessionId.slice(0, 8)}.md`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setExportingCell(null)
    }
  }

  async function exportAll(sessionId: string, submittedDepts: Department[]) {
    for (const dept of submittedDepts) {
      await handleExport(sessionId, dept)
    }
  }

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-[#F6F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <ClawLogo size={48} />
          <p className="text-sm text-gray-500 font-medium">Loading…</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F2EB]">
      {/* Jet Black header */}
      <header className="bg-[#0A0A0A] sticky top-0 z-40 shadow-md">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClawLogo size={34} />
            <div>
              <span className="text-white font-bold text-sm tracking-wide">MTAI CLAW</span>
              <span className="ml-2 text-[10px] font-semibold text-[#BF9A36] border border-[#BF9A36]/40 rounded px-1.5 py-0.5 tracking-widest uppercase">Admin</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/session/new')}
              className="flex items-center gap-1.5 text-xs font-bold btn-gold"
            >
              <Plus size={13} />
              New session
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 border border-gray-700 rounded-lg px-3 py-1.5 hover:border-gray-500 transition-colors"
            >
              <LogOut size={13} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Page title */}
        <div className="mb-5">
          <h1 className="text-xl font-bold text-[#0A0A0A]">All sessions</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {sessions.length} session{sessions.length !== 1 ? 's' : ''}
          </p>
        </div>

        {sessions.length === 0 ? (
          <div className="gf-card p-12 text-center">
            <ClawLogo size={48} />
            <p className="text-gray-500 text-sm mt-4">No sessions yet.</p>
            <button
              onClick={() => router.push('/session/new')}
              className="btn-gold mt-5"
            >
              Create the first session
            </button>
          </div>
        ) : (
          <div className="gf-card overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm font-sans">
                <thead>
                  <tr className="border-b-2 border-[#FBDB79]/60 bg-[#FBDB79]/10">
                    <th className="text-left px-5 py-3 font-bold text-[#0A0A0A] text-xs uppercase tracking-wide">Session</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0A0A0A] text-xs uppercase tracking-wide">Facilitator</th>
                    <th className="text-left px-4 py-3 font-bold text-[#0A0A0A] text-xs uppercase tracking-wide">Created</th>
                    <th className="text-center px-4 py-3 font-bold text-[#0A0A0A] text-xs uppercase tracking-wide">HR</th>
                    <th className="text-center px-4 py-3 font-bold text-[#0A0A0A] text-xs uppercase tracking-wide">Delivery</th>
                    <th className="text-center px-4 py-3 font-bold text-[#0A0A0A] text-xs uppercase tracking-wide">Sales</th>
                    <th className="text-right px-5 py-3 font-bold text-[#0A0A0A] text-xs uppercase tracking-wide">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sessions.map(sess => {
                    const submittedDepts = sess.submissions?.map(s => s.department) ?? []
                    return (
                      <tr key={sess.id} className="hover:bg-[#FBDB79]/5 transition-colors">
                        <td className="px-5 py-3.5">
                          <button onClick={() => router.push(`/session/${sess.id}`)} className="text-left">
                            <p className="font-semibold text-[#0A0A0A] hover:text-[#915825] transition-colors leading-tight">
                              {sess.session_label}
                            </p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{sess.id.slice(0, 8)}</p>
                          </button>
                        </td>
                        <td className="px-4 py-3.5 text-sm text-gray-600">{sess.facilitator_name}</td>
                        <td className="px-4 py-3.5 text-xs text-gray-500">
                          {new Date(sess.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        {DEPTS.map(dept => {
                          const sub = sess.submissions?.find(s => s.department === dept)
                          const cellKey = `${sess.id}-${dept}`
                          return (
                            <td key={dept} className="px-4 py-3.5 text-center">
                              {sub ? (
                                <button
                                  onClick={() => handleExport(sess.id, dept)}
                                  disabled={exportingCell === cellKey}
                                  title={`Export ${DEPT_LABELS[dept]} CLAUDE.md`}
                                  className="inline-flex items-center gap-1 text-[#BF9A36] hover:text-[#F8BB1A] disabled:opacity-40 transition-colors"
                                >
                                  <CheckCircle2 size={15} />
                                  <Download size={12} />
                                </button>
                              ) : (
                                <Circle size={15} className="text-gray-200 mx-auto" />
                              )}
                            </td>
                          )
                        })}
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => router.push(`/session/${sess.id}`)}
                              className="text-xs font-bold text-[#915825] hover:text-[#F8BB1A] transition-colors"
                            >
                              Open
                            </button>
                            {submittedDepts.length > 0 && (
                              <button
                                onClick={() => exportAll(sess.id, submittedDepts)}
                                className="text-xs font-semibold text-gray-500 border border-gray-200 rounded px-2.5 py-1 hover:border-[#BF9A36] hover:text-[#915825] transition-colors"
                              >
                                Export all
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
