'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const DEPT_PLACEHOLDERS: Record<Department, string[]> = {
  hr: [
    'Leave application errors and resubmissions',
    'Payslip queries from staff each month',
    'Policy clarification requests via email',
    'Onboarding document collection delays',
    'Disciplinary process questions',
  ],
  delivery: [
    'Manual tracking of delivery status updates',
    'Customer escalation routing between teams',
    'SLA breach reporting and documentation',
    'Courier coordination and rescheduling',
    'POD (proof of delivery) disputes',
  ],
  sales: [
    'Quotation approval bottlenecks',
    'CRM data entry duplication',
    'Lead follow-up tracking across teams',
    'Proposal formatting and versioning',
    'Commission calculation queries',
  ],
}

const FREQ_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Ad hoc']

interface Props {
  sessionId: string
  department: Department
}

export function Section42({ sessionId, department }: Props) {
  const placeholders = DEPT_PLACEHOLDERS[department]
  const rows = [0, 1, 2, 3, 4]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="pb-2 font-medium text-gray-600 w-8">#</th>
            <th className="pb-2 font-medium text-gray-600">Pain point description</th>
            <th className="pb-2 font-medium text-gray-600 w-36">Frequency</th>
            <th className="pb-2 font-medium text-gray-600 w-40">Time spent estimate</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(i => (
            <PainPointRow key={i} index={i} sessionId={sessionId} department={department} placeholder={placeholders[i]} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function PainPointRow({ index, sessionId, department, placeholder }: {
  index: number
  sessionId: string
  department: Department
  placeholder: string
}) {
  const descField = useFormField(sessionId, department, '4.2', `row_${index}_description`)
  const freqField = useFormField(sessionId, department, '4.2', `row_${index}_frequency`)
  const timeField = useFormField(sessionId, department, '4.2', `row_${index}_time_spent`)

  return (
    <tr>
      <td className="py-2 text-gray-400 pr-2">{index + 1}</td>
      <td className="py-2 pr-2">
        <input type="text" className="form-input text-sm" placeholder={placeholder} {...descField} />
      </td>
      <td className="py-2 pr-2">
        <select className="form-input text-sm" {...freqField}>
          <option value="">Select</option>
          {FREQ_OPTIONS.map(f => <option key={f} value={f}>{f}</option>)}
        </select>
      </td>
      <td className="py-2">
        <input type="text" className="form-input text-sm" placeholder="e.g. 2h/day" {...timeField} />
      </td>
    </tr>
  )
}
