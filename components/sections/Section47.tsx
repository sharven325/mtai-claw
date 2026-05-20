'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const DEPT_SYSTEMS: Record<Department, string> = {
  hr: 'e.g. Aware of HRIS (SAP HR) for payroll data, but cannot query directly; can reference policy documents in SharePoint',
  delivery: 'e.g. Aware of Tracker system and courier API dashboards, but cannot action shipments directly',
  sales: 'e.g. Aware of Salesforce CRM and pricing engine, but cannot create deals or modify records',
}

const ACCESS_OPTIONS = [
  { value: 'all_staff', label: 'All staff' },
  { value: 'dept_only', label: 'Department staff only' },
  { value: 'hod_above', label: 'HOD and above only' },
  { value: 'custom', label: 'Custom (specify in notes)' },
]

const HOURS_OPTIONS = [
  '8am – 5pm (Mon–Fri)',
  '8am – 6pm (Mon–Fri)',
  '8am – 5pm (Mon–Sat)',
  '24/7',
  'Business hours only',
  'Custom',
]

interface Props {
  sessionId: string
  department: Department
}

export function Section47({ sessionId, department }: Props) {
  const systemsPlaceholder = DEPT_SYSTEMS[department]
  const accessField = useFormField(sessionId, department, '4.7', 'access_scope')
  const systemsField = useFormField(sessionId, department, '4.7', 'systems_aware')
  const hoursField = useFormField(sessionId, department, '4.7', 'operating_hours')

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Access scope — who can use CLAW?</label>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {ACCESS_OPTIONS.map(opt => (
            <label key={opt.value} className="flex items-center gap-2 p-3 border border-gray-200 rounded-lg cursor-pointer hover:border-[#1D9E75]/50 transition-colors">
              <input
                type="radio"
                name={`access-${department}`}
                value={opt.value}
                checked={accessField.value === opt.value}
                onChange={() => accessField.onChange({ target: { value: opt.value } } as React.ChangeEvent<HTMLInputElement>)}
                className="accent-[#1D9E75]"
              />
              <span className="text-sm text-gray-700">{opt.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Systems CLAW is aware of but cannot access</label>
        <textarea rows={3} className="form-input resize-y text-sm" placeholder={systemsPlaceholder} {...systemsField} />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Operating hours</label>
        <select className="form-input" {...hoursField}>
          <option value="">Select operating hours</option>
          {HOURS_OPTIONS.map(h => <option key={h} value={h}>{h}</option>)}
        </select>
      </div>
    </div>
  )
}
