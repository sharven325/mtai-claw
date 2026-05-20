'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import { Download, LayoutDashboard } from 'lucide-react'
import { type Department, type Response, type Submission } from '@/lib/supabase'
import { DeptForm } from '@/components/DeptForm'
import { ProgressBar } from '@/components/ProgressBar'
import { ExportModal } from '@/components/ExportModal'
import { ClawLogo } from '@/components/ClawLogo'

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
      <div className="min-h-screen bg-[#F6F2EB] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <ClawLogo size={48} />
          <p className="text-sm text-gray-500 font-medium">Loading session…</p>
        </div>
      </div>
    )
  }

  if (isNew || showNewSession) {
    return (
      <div className="min-h-screen bg-[#F6F2EB] flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-lg">
          {/* Branded header card */}
          <div className="gf-card border-t-8 border-t-[#F8BB1A] rounded-b-none">
            <div className="bg-[#0A0A0A] px-8 py-6 flex items-center gap-4">
              <ClawLogo size={48} />
              <div>
                <p className="text-white font-bold text-xl tracking-wide">MTAI CLAW</p>
                <p className="text-[#FBDB79] text-xs font-medium tracking-widest uppercase">Requirements Portal</p>
              </div>
            </div>
            <div className="px-8 py-6">
              <h1 className="text-xl font-bold text-[#0A0A0A]">New session</h1>
              <p className="text-sm text-gray-500 mt-1">The session URL can be shared so multiple facilitators can fill from any device.</p>
            </div>
          </div>

          {/* Fields card */}
          <div className="gf-card rounded-t-none border-t border-gray-100 px-8 py-7 space-y-7">
            <div>
              <label className="block text-sm font-semibold text-[#0A0A0A] mb-3">
                Session label <span className="text-[#915825]">*</span>
              </label>
              <input type="text" value={newLabel} onChange={e => setNewLabel(e.target.value)}
                className="form-input" placeholder="e.g. Week 1 HOD Briefing — May 2025" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0A0A0A] mb-3">
                Facilitator name <span className="text-[#915825]">*</span>
              </label>
              <input type="text" value={newFacilitator} onChange={e => setNewFacilitator(e.target.value)}
                className="form-input" placeholder="Your full name" />
            </div>
            <div className="flex justify-end pt-1">
              <button onClick={createSession} disabled={creating || !newLabel.trim() || !newFacilitator.trim()}
                className="btn-gold">
                {creating ? 'Creating…' : 'Create session'}
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#F6F2EB]">
      {/* Top nav — Jet Black with gold logo */}
      <header className="bg-[#0A0A0A] sticky top-0 z-40 shadow-md">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <ClawLogo size={34} />
            <div>
              <p className="text-white font-semibold text-sm leading-tight">{sessionData?.session_label}</p>
              <p className="text-[#BF9A36] text-xs">{sessionData?.facilitator_name} · <span className="font-mono">{id?.slice(0, 8)}</span></p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setShowExport(true)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[#F8BB1A] border border-[#BF9A36] rounded-lg px-3 py-1.5 hover:bg-[#BF9A36]/20 transition-colors">
              <Download size={13} />
              <span className="hidden sm:inline">Export</span>
            </button>
            <button onClick={() => router.push('/admin')}
              className="flex items-center gap-1.5 text-xs font-semibold text-gray-400 border border-gray-700 rounded-lg px-3 py-1.5 hover:border-gray-500 transition-colors">
              <LayoutDashboard size={13} />
              <span className="hidden sm:inline">Admin</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-6 space-y-4">
        <ProgressBar submittedDepts={submittedDepts} />

        {/* Department tabs — Google Forms pill style */}
        <div className="gf-card">
          <div className="flex">
            {DEPT_TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-3.5 text-sm font-semibold transition-all relative ${
                  activeTab === tab.id
                    ? 'text-[#0A0A0A]'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <span className="flex items-center justify-center gap-1.5">
                  {tab.label}
                  {submittedDepts.includes(tab.id) && (
                    <span className="w-1.5 h-1.5 bg-[#F8BB1A] rounded-full" />
                  )}
                </span>
                {activeTab === tab.id && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#F8BB1A]" />
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
