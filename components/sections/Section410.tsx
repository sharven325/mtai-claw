'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const DEPT_EXAMPLES: Record<Department, Array<{ topic: string; reason: string }>> = {
  hr: [
    { topic: 'Salary and bonus discussions', reason: 'Confidential compensation data — must go through HR Manager' },
    { topic: 'Disciplinary proceedings', reason: 'Legal sensitivity — only HR Director can advise' },
    { topic: 'Termination queries', reason: 'HR and Legal sign-off required' },
    { topic: 'Medical condition disclosures', reason: 'Personal data protection — PDPA compliance' },
  ],
  delivery: [
    { topic: 'Carrier commercial contract terms', reason: 'Confidential — only Procurement can disclose' },
    { topic: 'Customer compensation amounts', reason: 'Requires manager approval — financial authority limit' },
    { topic: 'Internal loss and damage rates', reason: 'Sensitive operational data — not for external sharing' },
    { topic: 'Legal dispute specifics', reason: 'Must route to Legal team directly' },
  ],
  sales: [
    { topic: 'Competitor pricing intelligence', reason: 'Legal risk — cannot share confidential third-party data' },
    { topic: 'Unapproved custom pricing', reason: 'Requires VP Sales sign-off — financial risk' },
    { topic: 'Client contract redlines', reason: 'Must route to Legal — contractual authority required' },
    { topic: 'Acquisition or partnership plans', reason: 'Board-level confidential — not to be discussed with clients' },
  ],
}

interface Props {
  sessionId: string
  department: Department
}

export function Section410({ sessionId, department }: Props) {
  const examples = DEPT_EXAMPLES[department]
  const rows = [0, 1, 2, 3]

  return (
    <div className="space-y-3">
      <div className="bg-[#E24B4A]/5 border border-[#E24B4A]/20 rounded-lg p-3 mb-4">
        <p className="text-sm text-[#E24B4A] font-medium">These become hard rules in CLAW&apos;s configuration. Be specific.</p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left border-b border-gray-200">
              <th className="pb-2 font-medium text-gray-600 w-8">#</th>
              <th className="pb-2 font-medium text-[#E24B4A]">Restricted topic</th>
              <th className="pb-2 font-medium text-gray-600">Reason / notes</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {rows.map(i => (
              <BoundaryRow key={i} index={i} sessionId={sessionId} department={department} example={examples[i]} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function BoundaryRow({ index, sessionId, department, example }: {
  index: number
  sessionId: string
  department: Department
  example: { topic: string; reason: string }
}) {
  const topicField = useFormField(sessionId, department, '4.10', `row_${index}_topic`)
  const reasonField = useFormField(sessionId, department, '4.10', `row_${index}_reason`)

  return (
    <tr>
      <td className="py-2 text-gray-400 pr-2">{index + 1}</td>
      <td className="py-2 pr-2">
        <input type="text" className="form-input text-sm border-[#E24B4A]/20" placeholder={example.topic} {...topicField} />
      </td>
      <td className="py-2">
        <input type="text" className="form-input text-sm" placeholder={example.reason} {...reasonField} />
      </td>
    </tr>
  )
}
