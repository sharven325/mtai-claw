'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Download, LogOut } from 'lucide-react'
import { type Department, type Response, type Submission } from '@/lib/supabase'
import { DeptForm } from '@/components/DeptForm'
import { ProgressBar } from '@/components/ProgressBar'
import { ExportModal } from '@/components/ExportModal'

const DEPT_TABS: { id: Department; label: string }[] = [
  { id: 'hr', label: 'HR' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'sales', label: 'Sales' },
]

interface SessionData {
  id: string
  session_label: string
  facilitator_name: string
  created_at: string
}

export default function SessionPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: authSession, status } = useSession()

  const [activeTab, setActiveTab] = useState<Department>('hr')
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [responses, setResponses] = useState<Record<Department, Response[]>>({ hr: [], delivery: [], sales: [] })
  const [submissions, setSubmissions] = useState<Submission[]>([])
  const [loading, setLoading] = useState(true)
  const [showExport, setShowExport] = useState(false)
  const [showNewSession, setShowNewSession] = useState(false)
  const [newLabel, setNewLabel] = useState('')
  const [newFacilitator, setNewFacilitator] = useState('')
  const [creating, setCreating] = useState(false)

  const isNew = id === 'new'

  useEffect(() => {
    if (status === 'unauthenticated') router.push('/login')
  }, [status, router])

  useEffect(() => {
    if (status !== 'authenticated') return
    if (isNew) {
      setLoading(false)
      setShowNewSession(true)
      return
    }
    loadSession()
  }, [id, status])

  async function loadSession() {
    setLoading(true)
    try {
      const [respRes, subRes] = await Promise.all([
        fetch(`/api/responses?session_id=${id}`),
        fetch(`/api/sessions`),
      ])

      const allResponses: Response[] = await respRes.json()
      const allSessions: SessionData[] = await subRes.json()

      const sess = allSessions.find(s => s.id === id)
      if (!sess) { router.push('/session/new'); return }
      setSessionData(sess)

      const grouped: Record<Department, Response[]> = { hr: [], delivery: [], sales: [] }
      for (const r of allResponses) grouped[r.department].push(r)
      setResponses(grouped)

      const subListRes = await fetch(`/api/responses?session_id=${id}`)
      const subList = await subListRes.json()

      const submissionsRes = await fetch(`/api/sessions`)
      const sessionsWithSubs: Array<SessionData & { submissions: Submission[] }> = await submissionsRes.json()
      const thisSess = sessionsWithSubs.find(s => s.id === id)
      setSubmissions(thisSess?.submissions ?? [])
    } finally {
      setLoading(false)
    }
  }

  async function createSession() {
    if (!newLabel.trim() || !newFacilitator.trim()) return
    setCreating(true)
    try {
      const res = await fetch('/api/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_label: newLabel, facilitator_name: newFacilitator }),
      })
      const data = await res.json()
      router.push(`/session/${data.id}`)
    } finally {
      setCreating(false)
    }
  }

  const submittedDepts = submissions.map(s => s.department)

  if (loading || status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-sm text-gray-500">Loading session...</div>
      </div>
    )
  }

  if (isNew || showNewSession) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 w-full max-w-md">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-7 h-7 bg-[#1D9E75] rounded-lg" />
            <span className="font-semibold text-gray-900">MTAI CLAW</span>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">New requirements session</h1>
          <p className="text-sm text-gray-500 mb-6">Create a session for this HOD briefing. The session link can be shared for multi-device access.</p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Session label</label>
              <input
                type="text"
                value={newLabel}
                onChange={e => setNewLabel(e.target.value)}
                className="form-input"
                placeholder="e.g. Week 1 HOD Briefing — May 2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Facilitator name</label>
              <input
                type="text"
                value={newFacilitator}
                onChange={e => setNewFacilitator(e.target.value)}
                className="form-input"
                placeholder="Your full name"
              />
            </div>
            <button
              onClick={createSession}
              disabled={creating || !newLabel.trim() || !newFacilitator.trim()}
              className="w-full bg-[#1D9E75] text-white rounded-lg py-2.5 text-sm font-medium hover:bg-[#178A65] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {creating ? 'Creating...' : 'Create session'}
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top nav */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-[#1D9E75] rounded-lg shrink-0" />
            <div>
              <p className="text-sm font-semibold text-gray-900 leading-tight">{sessionData?.session_label}</p>
              <p className="text-xs text-gray-400">{sessionData?.facilitator_name} · {id?.slice(0, 8)}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              <Download size={14} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button
              onClick={() => router.push('/admin')}
              className="flex items-center gap-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 transition-colors"
            >
              <LogOut size={14} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-6 space-y-5">
        <ProgressBar submittedDepts={submittedDepts} />

        {/* Department tabs */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="flex border-b border-gray-200">
            {DEPT_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3 text-sm font-medium transition-colors relative ${
                  activeTab === tab.id
                    ? 'text-[#1D9E75]'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
                {submittedDepts.includes(tab.id) && (
                  <span className="ml-1.5 w-1.5 h-1.5 bg-[#1D9E75] rounded-full inline-block align-middle" />
                )}
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#1D9E75]" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Department form */}
        {!loading && sessionData && (
          <DeptForm
            key={activeTab}
            sessionId={id}
            department={activeTab}
            initialResponses={responses[activeTab]}
            isSubmitted={submittedDepts.includes(activeTab)}
            facilitatorName={sessionData.facilitator_name}
            onSubmitSuccess={loadSession}
          />
        )}
      </main>

      {showExport && (
        <ExportModal
          sessionId={id}
          submittedDepts={submittedDepts}
          onClose={() => setShowExport(false)}
        />
      )}
    </div>
  )
}
