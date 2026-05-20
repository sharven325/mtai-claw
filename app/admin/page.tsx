'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession, signOut } from 'next-auth/react'
import { Download, Plus, LogOut, CheckCircle2, Circle } from 'lucide-react'
import { type Department } from '@/lib/supabase'

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
  const { data: authSession, status } = useSession()
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading...</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-[#1D9E75] rounded-lg" />
            <span className="font-semibold text-gray-900">MTAI CLAW</span>
            <span className="text-xs text-gray-400 border border-gray-200 rounded px-1.5 py-0.5 ml-1">Admin</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => router.push('/session/new')}
              className="flex items-center gap-1.5 text-sm bg-[#1D9E75] text-white rounded-lg px-3 py-1.5 hover:bg-[#178A65] transition-colors"
            >
              <Plus size={14} />
              New session
            </button>
            <button
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              <LogOut size={14} />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-xl font-semibold text-gray-900">All sessions</h1>
          <p className="text-sm text-gray-500 mt-1">{sessions.length} session{sessions.length !== 1 ? 's' : ''}</p>
        </div>

        {sessions.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
            <p className="text-gray-500 text-sm">No sessions yet.</p>
            <button
              onClick={() => router.push('/session/new')}
              className="mt-4 text-sm text-[#1D9E75] font-medium hover:underline"
            >
              Create the first session
            </button>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 bg-gray-50">
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Session</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Facilitator</th>
                    <th className="text-left px-4 py-3 font-medium text-gray-600">Created</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">HR</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Delivery</th>
                    <th className="text-center px-4 py-3 font-medium text-gray-600">Sales</th>
                    <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {sessions.map(sess => {
                    const submittedDepts = sess.submissions?.map(s => s.department) ?? []
                    return (
                      <tr key={sess.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <button
                            onClick={() => router.push(`/session/${sess.id}`)}
                            className="text-left"
                          >
                            <p className="font-medium text-gray-900 hover:text-[#1D9E75] transition-colors">{sess.session_label}</p>
                            <p className="text-xs text-gray-400 font-mono mt-0.5">{sess.id.slice(0, 8)}</p>
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-600">{sess.facilitator_name}</td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {new Date(sess.created_at).toLocaleDateString('en-MY', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </td>
                        {DEPTS.map(dept => {
                          const sub = sess.submissions?.find(s => s.department === dept)
                          const cellKey = `${sess.id}-${dept}`
                          return (
                            <td key={dept} className="px-4 py-3 text-center">
                              {sub ? (
                                <button
                                  onClick={() => handleExport(sess.id, dept)}
                                  disabled={exportingCell === cellKey}
                                  title={`Export ${DEPT_LABELS[dept]} CLAUDE.md`}
                                  className="inline-flex items-center gap-1 text-[#1D9E75] hover:text-[#178A65] disabled:opacity-50 transition-colors"
                                >
                                  <CheckCircle2 size={15} />
                                  <Download size={12} />
                                </button>
                              ) : (
                                <Circle size={15} className="text-gray-300 mx-auto" />
                              )}
                            </td>
                          )
                        })}
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => router.push(`/session/${sess.id}`)}
                              className="text-xs text-[#1D9E75] font-medium hover:underline"
                            >
                              Open
                            </button>
                            {submittedDepts.length > 0 && (
                              <button
                                onClick={() => exportAll(sess.id, submittedDepts)}
                                className="text-xs text-gray-500 font-medium hover:text-gray-700 border border-gray-200 rounded px-2 py-1 hover:bg-gray-50 transition-colors"
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
