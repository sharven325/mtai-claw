'use client'

import { useState } from 'react'
import { Download, X } from 'lucide-react'
import { type Department } from '@/lib/supabase'

interface Props {
  sessionId: string
  submittedDepts: Department[]
  onClose: () => void
}

const DEPT_LABELS: Record<Department, string> = {
  hr: 'HR',
  delivery: 'Delivery',
  sales: 'Sales',
}

export function ExportModal({ sessionId, submittedDepts, onClose }: Props) {
  const [loading, setLoading] = useState<Department | null>(null)

  async function handleExport(dept: Department) {
    setLoading(dept)
    try {
      const res = await fetch(`/api/export?session_id=${sessionId}&department=${dept}`)
      if (!res.ok) throw new Error('Export failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `CLAUDE-${dept}-${sessionId.slice(0, 8)}.md`
      a.click()
      URL.revokeObjectURL(url)
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="fixed inset-0 bg-[#0A0A0A]/60 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Modal header — branded */}
        <div className="bg-[#0A0A0A] px-6 py-4 flex items-center justify-between">
          <h2 className="text-sm font-bold text-white tracking-wide">Export CLAUDE.md files</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-[#F8BB1A] transition-colors">
            <X size={17} />
          </button>
        </div>

        <div className="p-6 space-y-3">
          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
            Download a markdown configuration draft for each submitted department. Paste it into the department&apos;s CLAUDE.md.
          </p>

          {(['hr', 'delivery', 'sales'] as Department[]).map(dept => {
            const submitted = submittedDepts.includes(dept)
            return (
              <div
                key={dept}
                className={`flex items-center justify-between px-4 py-3 rounded-lg border transition-colors ${
                  submitted
                    ? 'border-[#FBDB79] bg-[#FBDB79]/10'
                    : 'border-gray-100 bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div className={`w-2 h-2 rounded-full ${submitted ? 'bg-[#F8BB1A]' : 'bg-gray-300'}`} />
                  <span className={`text-sm font-semibold ${submitted ? 'text-[#0A0A0A]' : 'text-gray-400'}`}>
                    {DEPT_LABELS[dept]}
                  </span>
                  {!submitted && <span className="text-xs text-gray-400">not submitted</span>}
                </div>
                <button
                  onClick={() => handleExport(dept)}
                  disabled={!submitted || loading === dept}
                  className="flex items-center gap-1.5 text-xs font-bold text-[#915825] disabled:text-gray-300 disabled:cursor-not-allowed hover:text-[#F8BB1A] transition-colors"
                >
                  <Download size={13} />
                  {loading === dept ? 'Exporting…' : 'Download'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="px-6 pb-6">
          <button onClick={onClose} className="btn-outline w-full text-center">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
