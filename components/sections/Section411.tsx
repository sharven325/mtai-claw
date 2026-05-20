'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const DEPT_QUESTIONS: Record<Department, {
  time_saving: string
  failure: string
  four_week: string
}> = {
  hr: {
    time_saving: 'e.g. Reduce HR inbox queries by 40% in 4 weeks; save each HR exec 1.5 hrs/day on repetitive questions',
    failure: 'e.g. Staff still calling HR directly for basic policy questions; wrong escalation routing; incorrect leave balance info',
    four_week: 'e.g. 80%+ of leave and payslip queries handled by CLAW without escalation; positive feedback from 3 HODs',
  },
  delivery: {
    time_saving: 'e.g. Cut first-response time on customer queries from 4 hrs to under 30 mins; save ops team 2 hrs/day',
    failure: 'e.g. Customers still calling the hotline for status updates; CLAW giving wrong SLA information',
    four_week: 'e.g. 70%+ of delivery status queries self-served; SLA escalation tickets reduced by 30%',
  },
  sales: {
    time_saving: 'e.g. Reduce time reps spend on internal queries from 45 min/day to under 10 min; faster proposal turnaround',
    failure: 'e.g. Reps still going directly to Sales Manager for standard pricing queries; wrong approval routing',
    four_week: 'e.g. All reps using CLAW daily for pricing and template queries; manager query load visibly reduced',
  },
}

interface Props {
  sessionId: string
  department: Department
}

export function Section411({ sessionId, department }: Props) {
  const q = DEPT_QUESTIONS[department]
  const field = (key: string) => useFormField(sessionId, department, '4.11', key)

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Time-saving metric (measurable target)</label>
        <textarea rows={3} className="form-input resize-y text-sm" placeholder={q.time_saving} {...field('time_saving')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#E24B4A] mb-1">Failure definition — what does &quot;not working&quot; look like?</label>
        <textarea rows={3} className="form-input resize-y text-sm border-[#E24B4A]/30" placeholder={q.failure} {...field('failure_definition')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">4-week success definition</label>
        <textarea rows={3} className="form-input resize-y text-sm" placeholder={q.four_week} {...field('four_week_success')} />
      </div>
    </div>
  )
}
