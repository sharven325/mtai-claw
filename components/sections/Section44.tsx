'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const DEPT_QUESTIONS: Record<Department, {
  most_referenced: string
  update_frequency: string
  documented_vs_verbal: string
  faq_status: string
}> = {
  hr: {
    most_referenced: 'e.g. Leave policy, EA handbook, medical benefit schedule',
    update_frequency: 'e.g. Leave policy — HR Manager, updated annually; Pay schedule — Payroll, monthly',
    documented_vs_verbal: 'e.g. 70% documented (SharePoint), 30% verbal between HR team members',
    faq_status: 'e.g. No existing FAQ; some WhatsApp pinned messages used informally',
  },
  delivery: {
    most_referenced: 'e.g. SLA matrix, courier partner SOP, customer complaint procedure',
    update_frequency: 'e.g. SLA matrix — Ops Manager, quarterly; courier SOP — updated per partner contract',
    documented_vs_verbal: 'e.g. 60% in SharePoint, 40% tribal knowledge within ops leads',
    faq_status: 'e.g. Partial FAQ in internal wiki, last updated 8 months ago',
  },
  sales: {
    most_referenced: 'e.g. Pricing sheet, proposal template library, discount approval matrix',
    update_frequency: 'e.g. Pricing sheet — Sales Manager, monthly; templates — on ad hoc basis',
    documented_vs_verbal: 'e.g. 50% in shared drive, 50% verbal agreements with individual managers',
    faq_status: 'e.g. No FAQ; questions go directly to sales coordinator via Teams',
  },
}

interface Props {
  sessionId: string
  department: Department
}

export function Section44({ sessionId, department }: Props) {
  const q = DEPT_QUESTIONS[department]
  const field = (key: string) => useFormField(sessionId, department, '4.4', key)

  return (
    <div className="space-y-5">
      <QField label="Most referenced documents" placeholder={q.most_referenced} {...field('most_referenced')} />
      <QField label="Update frequency & document owner" placeholder={q.update_frequency} {...field('update_frequency')} />
      <QField label="Documented vs verbal knowledge ratio" placeholder={q.documented_vs_verbal} {...field('documented_vs_verbal')} />
      <QField label="Existing FAQ status" placeholder={q.faq_status} {...field('faq_status')} />
    </div>
  )
}

function QField({ label, placeholder, value, onChange }: {
  label: string
  placeholder: string
  value: string
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      <textarea rows={3} className="form-input resize-y text-sm" placeholder={placeholder} value={value} onChange={onChange} />
    </div>
  )
}
