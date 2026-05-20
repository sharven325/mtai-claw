'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const DEPT_QUESTIONS: Record<Department, {
  top_topics: string
  undocumented: string
  never_answer: string
  staff_vs_team: string
}> = {
  hr: {
    top_topics: 'e.g. 1. Leave balance queries  2. Payroll deductions  3. Medical claim procedures',
    undocumented: 'e.g. Verbal policy interpretations, manager discretion cases, ad hoc approvals',
    never_answer: 'e.g. Salary negotiations, disciplinary decisions, termination discussions',
    staff_vs_team: 'e.g. All staff can query leave; only HR team can access headcount reports',
  },
  delivery: {
    top_topics: 'e.g. 1. Parcel status  2. Return procedures  3. Delivery SLA policies',
    undocumented: 'e.g. Informal courier substitution rules, verbal escalation paths',
    never_answer: 'e.g. Customer compensation decisions, carrier contract terms',
    staff_vs_team: 'e.g. Customer-facing agents can query status; only ops team sees courier dashboards',
  },
  sales: {
    top_topics: 'e.g. 1. Product pricing  2. Discount approvals  3. Proposal templates',
    undocumented: 'e.g. Verbal client commitments, manager override pricing rules',
    never_answer: 'e.g. Contract negotiation specifics, competitor pricing discussions',
    staff_vs_team: 'e.g. All sales can query pricing; only managers can approve custom quotes',
  },
}

interface Props {
  sessionId: string
  department: Department
}

export function Section43({ sessionId, department }: Props) {
  const q = DEPT_QUESTIONS[department]
  const field = (key: string) => useFormField(sessionId, department, '4.3', key)

  return (
    <div className="space-y-5">
      <QField label="Top enquiry topics (ranked by volume)" placeholder={q.top_topics} {...field('top_topics')} />
      <QField label="Undocumented processes CLAW should capture" placeholder={q.undocumented} {...field('undocumented_processes')} />
      <QField
        label="Topics CLAW must never answer"
        placeholder={q.never_answer}
        {...field('never_answer')}
        highlight
      />
      <QField label="Staff-only access vs team-only access" placeholder={q.staff_vs_team} {...field('staff_vs_team')} />
    </div>
  )
}

function QField({ label, placeholder, highlight, value, onChange }: {
  label: string
  placeholder: string
  highlight?: boolean
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <div>
      <label className={`block text-sm font-medium mb-1 ${highlight ? 'text-[#E24B4A]' : 'text-gray-700'}`}>
        {label}
      </label>
      <textarea
        rows={3}
        className={`form-input resize-y text-sm ${highlight ? 'border-[#E24B4A]/30 focus:ring-[#E24B4A]/50' : ''}`}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
    </div>
  )
}
