'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const PRIORITY_OPTIONS = ['Must Have', 'Nice to Have', 'Not Needed', 'More Info Needed'] as const

const FEATURES: Record<Department, { key: string; label: string; description: string }[]> = {
  hr: [
    { key: 'f1', label: 'FAQ / instant answers', description: 'Instant responses to common HR policy questions' },
    { key: 'f2', label: 'Leave & payroll self-service', description: 'Guide staff through leave applications and payslip queries' },
    { key: 'f3', label: 'Document retrieval', description: 'Fetch and share policy documents on request' },
    { key: 'f4', label: 'Escalation routing', description: 'Route complex cases to the correct HR contact' },
    { key: 'f5', label: 'Onboarding support', description: 'Guide new joiners through paperwork and orientation' },
    { key: 'f6', label: 'Policy guidance', description: 'Explain company policies in plain language' },
    { key: 'f7', label: 'Reporting & analytics', description: 'Surface query volume and trend reports for HR team' },
    { key: 'f8', label: 'Multi-language support', description: 'Respond in BM and English' },
  ],
  delivery: [
    { key: 'f1', label: 'FAQ / instant answers', description: 'Answer delivery and returns queries instantly' },
    { key: 'f2', label: 'Status tracking', description: 'Provide real-time parcel status lookups' },
    { key: 'f3', label: 'Document retrieval', description: 'Retrieve SOP and policy documents on request' },
    { key: 'f4', label: 'Escalation routing', description: 'Route disputes and P1 issues to on-call team' },
    { key: 'f5', label: 'Customer communication drafts', description: 'Draft update messages for affected customers' },
    { key: 'f6', label: 'SLA guidance', description: 'Explain delivery SLAs and exceptions to agents' },
    { key: 'f7', label: 'Reporting & analytics', description: 'Surface escalation trends and SLA breach summaries' },
    { key: 'f8', label: 'Multi-language support', description: 'Handle queries in BM and English' },
  ],
  sales: [
    { key: 'f1', label: 'FAQ / instant answers', description: 'Answer common product and pricing questions' },
    { key: 'f2', label: 'Proposal assistance', description: 'Help reps find and format proposal content' },
    { key: 'f3', label: 'Document retrieval', description: 'Retrieve pricing sheets, templates, and NDAs' },
    { key: 'f4', label: 'Escalation routing', description: 'Route approval requests to the right manager' },
    { key: 'f5', label: 'Lead qualification guidance', description: 'Help reps qualify leads using standard criteria' },
    { key: 'f6', label: 'Competitive guidance', description: 'Surface approved talking points and positioning' },
    { key: 'f7', label: 'Reporting & analytics', description: 'Pipeline summaries and quota progress snapshots' },
    { key: 'f8', label: 'Multi-language support', description: 'Support BM and English-speaking clients' },
  ],
}

interface Props {
  sessionId: string
  department: Department
}

export function Section48({ sessionId, department }: Props) {
  const features = FEATURES[department]

  return (
    <div className="space-y-3">
      <div className="hidden sm:grid grid-cols-[1fr_auto] gap-2 text-xs font-medium text-gray-500 pb-1 border-b border-gray-100">
        <span>Feature</span>
        <div className="grid grid-cols-4 gap-2 w-80 text-center">
          {PRIORITY_OPTIONS.map(o => <span key={o}>{o}</span>)}
        </div>
      </div>
      {features.map(f => (
        <FeatureRow key={f.key} featureKey={f.key} label={f.label} description={f.description} sessionId={sessionId} department={department} />
      ))}
    </div>
  )
}

function FeatureRow({ featureKey, label, description, sessionId, department }: {
  featureKey: string
  label: string
  description: string
  sessionId: string
  department: Department
}) {
  const field = useFormField(sessionId, department, '4.8', featureKey)

  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 p-3 bg-gray-50 rounded-lg">
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-800">{label}</p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
      <div className="flex sm:grid sm:grid-cols-4 gap-2 sm:w-80 flex-wrap">
        {PRIORITY_OPTIONS.map(opt => (
          <label key={opt} className="flex items-center gap-1.5 cursor-pointer sm:flex-col sm:items-center sm:gap-1">
            <input
              type="radio"
              name={`${department}-${featureKey}`}
              value={opt}
              checked={field.value === opt}
              onChange={() => field.onChange({ target: { value: opt } } as React.ChangeEvent<HTMLInputElement>)}
              className="accent-[#1D9E75]"
            />
            <span className="text-xs text-gray-600 sm:hidden">{opt}</span>
          </label>
        ))}
      </div>
    </div>
  )
}
