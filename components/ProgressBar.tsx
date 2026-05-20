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
    <div className="gf-card px-6 py-4">
      <div className="flex items-center justify-between mb-3">
        <span className="text-sm font-semibold text-[#0A0A0A]">Session progress</span>
        <span className="text-xs font-semibold text-[#BF9A36] bg-[#FBDB79]/40 px-2.5 py-1 rounded-full">
          {done} of {total} submitted
        </span>
      </div>
      {/* Gold progress bar */}
      <div className="w-full bg-gray-100 rounded-full h-1.5 mb-4">
        <div
          className="h-1.5 rounded-full transition-all duration-700"
          style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #915825, #F8BB1A)',
          }}
        />
      </div>
      <div className="flex gap-5">
        {(['hr', 'delivery', 'sales'] as Department[]).map(dept => (
          <div key={dept} className="flex items-center gap-1.5">
            <div className={`w-2.5 h-2.5 rounded-full border-2 transition-colors ${
              submittedDepts.includes(dept)
                ? 'bg-[#F8BB1A] border-[#BF9A36]'
                : 'bg-transparent border-gray-300'
            }`} />
            <span className={`text-xs font-medium ${submittedDepts.includes(dept) ? 'text-[#915825]' : 'text-gray-400'}`}>
              {DEPT_LABELS[dept]}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
