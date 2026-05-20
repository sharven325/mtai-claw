'use client'

import { type Department } from '@/lib/supabase'

interface Props {
  submittedDepts: Department[]
}

const DEPT_LABELS: Record<Department, string> = {
  hr: 'HR',
  delivery: 'Delivery',
  sales: 'Sales',
}

export function ProgressBar({ submittedDepts }: Props) {
  const total = 3
  const done = submittedDepts.length
  const pct = (done / total) * 100

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-medium text-gray-700">Session progress</span>
        <span className="text-sm font-medium text-[#1D9E75]">{done} of {total} departments submitted</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 mb-3">
        <div
          className="bg-[#1D9E75] h-2 rounded-full transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      <div className="flex gap-4">
        {(['hr', 'delivery', 'sales'] as Department[]).map(dept => (
          <div key={dept} className="flex items-center gap-1.5">
            <div className={`w-2 h-2 rounded-full ${submittedDepts.includes(dept) ? 'bg-[#1D9E75]' : 'bg-gray-300'}`} />
            <span className="text-xs text-gray-600">{DEPT_LABELS[dept]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
