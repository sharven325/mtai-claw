'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const DOC_TYPES = ['Policy', 'SOP', 'Data', 'Report', 'FAQ']
const SENSITIVITY = ['Low', 'Med', 'High']

const DEPT_EXAMPLES: Record<Department, string[]> = {
  hr: ['Leave Policy 2024', 'Employee Handbook', 'Medical Benefit Schedule', 'Disciplinary SOP', 'Onboarding Checklist', 'Payroll Calendar'],
  delivery: ['Delivery SLA Matrix', 'Returns SOP', 'Courier Partner Agreements', 'Customer Complaint Procedure', 'POD Verification Guide', 'COD Reconciliation Report'],
  sales: ['Product Pricing Sheet', 'Proposal Template Library', 'Discount Approval Matrix', 'Client NDA Template', 'Commission Scheme 2024', 'Competitor Battlecard'],
}

interface Props {
  sessionId: string
  department: Department
}

export function Section49({ sessionId, department }: Props) {
  const examples = DEPT_EXAMPLES[department]
  const rows = [0, 1, 2, 3, 4, 5]

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left border-b border-gray-200">
            <th className="pb-2 font-medium text-gray-600 w-8">#</th>
            <th className="pb-2 font-medium text-gray-600">Document name</th>
            <th className="pb-2 font-medium text-gray-600 w-28">Type</th>
            <th className="pb-2 font-medium text-gray-600 w-28">Sensitivity</th>
            <th className="pb-2 font-medium text-gray-600 w-36">Owner</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {rows.map(i => (
            <DocRow key={i} index={i} sessionId={sessionId} department={department} placeholder={examples[i] ?? ''} />
          ))}
        </tbody>
      </table>
    </div>
  )
}

function DocRow({ index, sessionId, department, placeholder }: {
  index: number
  sessionId: string
  department: Department
  placeholder: string
}) {
  const nameField = useFormField(sessionId, department, '4.9', `row_${index}_name`)
  const typeField = useFormField(sessionId, department, '4.9', `row_${index}_type`)
  const sensField = useFormField(sessionId, department, '4.9', `row_${index}_sensitivity`)
  const ownerField = useFormField(sessionId, department, '4.9', `row_${index}_owner`)

  return (
    <tr>
      <td className="py-2 text-gray-400 pr-2">{index + 1}</td>
      <td className="py-2 pr-2">
        <input type="text" className="form-input text-sm" placeholder={placeholder} {...nameField} />
      </td>
      <td className="py-2 pr-2">
        <select className="form-input text-sm" {...typeField}>
          <option value="">Type</option>
          {DOC_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
        </select>
      </td>
      <td className="py-2 pr-2">
        <select className="form-input text-sm" {...sensField}>
          <option value="">Sensitivity</option>
          {SENSITIVITY.map(s => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>
      </td>
      <td className="py-2">
        <input type="text" className="form-input text-sm" placeholder="Name / role" {...ownerField} />
      </td>
    </tr>
  )
}
