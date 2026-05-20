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
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md">
        <div className="flex items-center justify-between p-5 border-b border-gray-200">
          <h2 className="text-base font-semibold text-gray-900">Export CLAUDE.md files</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X size={18} />
          </button>
        </div>

        <div className="p-5 space-y-3">
          <p className="text-sm text-gray-500 mb-4">Download a markdown configuration file for each submitted department. Paste the contents into the department&apos;s CLAUDE.md.</p>

          {(['hr', 'delivery', 'sales'] as Department[]).map(dept => {
            const submitted = submittedDepts.includes(dept)
            return (
              <div key={dept} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${submitted ? 'bg-[#1D9E75]' : 'bg-gray-300'}`} />
                  <span className="text-sm font-medium text-gray-800">{DEPT_LABELS[dept]}</span>
                  {!submitted && <span className="text-xs text-gray-400">(not submitted)</span>}
                </div>
                <button
                  onClick={() => handleExport(dept)}
                  disabled={!submitted || loading === dept}
                  className="flex items-center gap-1.5 text-sm text-[#1D9E75] font-medium disabled:text-gray-300 disabled:cursor-not-allowed hover:text-[#178A65] transition-colors"
                >
                  <Download size={14} />
                  {loading === dept ? 'Exporting...' : 'Export'}
                </button>
              </div>
            )
          })}
        </div>

        <div className="px-5 pb-5">
          <button onClick={onClose} className="w-full border border-gray-200 text-gray-600 rounded-lg py-2.5 text-sm font-medium hover:bg-gray-50 transition-colors">
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
