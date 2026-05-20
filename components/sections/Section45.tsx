'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const DEPT_QUESTIONS: Record<Department, { chain: string; always_escalate: string; logging: string }> = {
  hr: {
    chain: 'e.g. Staff → CLAW → HR Executive → HR Manager → HR Director',
    always_escalate: 'e.g. Termination queries, harassment complaints, salary disputes, medical MC disputes',
    logging: 'e.g. Log to Freshdesk ticket, tag as HR-Unresolved, notify HR Manager via email',
  },
  delivery: {
    chain: 'e.g. Customer → CLAW → Ops Agent → Ops Supervisor → Ops Manager',
    always_escalate: 'e.g. Legal claims, missing parcels >RM500 value, courier partner disputes',
    logging: 'e.g. Log to Zendesk, create P1 ticket, notify Ops Manager on-call via SMS',
  },
  sales: {
    chain: 'e.g. Lead/Client → CLAW → Sales Exec → Sales Manager → VP Sales',
    always_escalate: 'e.g. Enterprise deals >RM100k, contract redlines, competitor-sensitive discussions',
    logging: 'e.g. Log in CRM as unresolved, assign to account manager, flag in daily standup',
  },
}

interface Props {
  sessionId: string
  department: Department
}

export function Section45({ sessionId, department }: Props) {
  const q = DEPT_QUESTIONS[department]
  const field = (key: string) => useFormField(sessionId, department, '4.5', key)

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Escalation chain</label>
        <textarea rows={3} className="form-input resize-y text-sm" placeholder={q.chain} {...field('chain')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-[#E24B4A] mb-1">Always-escalate query types</label>
        <textarea rows={3} className="form-input resize-y text-sm border-[#E24B4A]/30 focus:ring-[#E24B4A]/50" placeholder={q.always_escalate} {...field('always_escalate')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Unresolved query logging preference</label>
        <textarea rows={3} className="form-input resize-y text-sm" placeholder={q.logging} {...field('logging_preference')} />
      </div>
    </div>
  )
}
