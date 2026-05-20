'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const DEPT_QUESTIONS: Record<Department, { hod: string; channel: string }> = {
  hr: { hod: 'HR Director / Head of HR', channel: 'e.g. HR meeting room, Teams' },
  delivery: { hod: 'Head of Delivery / Operations Director', channel: 'e.g. Ops meeting room, Zoom' },
  sales: { hod: 'Head of Sales / Sales Director', channel: 'e.g. Sales floor, Teams' },
}

interface Props {
  sessionId: string
  department: Department
}

export function Section41({ sessionId, department }: Props) {
  const q = DEPT_QUESTIONS[department]
  const field = (key: string) => useFormField(sessionId, department, '4.1', key)

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Session date</label>
        <input type="date" className="form-input" {...field('date')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Session time</label>
        <input type="time" className="form-input" {...field('time')} />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Location / channel</label>
        <input type="text" className="form-input" placeholder={q.channel} {...field('location')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">MTAI facilitator name</label>
        <input type="text" className="form-input" placeholder="Full name" {...field('facilitator')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">HOD present</label>
        <select className="form-input" {...field('hod_present')}>
          <option value="">Select</option>
          <option value="yes">Yes</option>
          <option value="no">No</option>
          <option value="deputy">Deputy present</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">HOD name / title</label>
        <input type="text" className="form-input" placeholder={q.hod} {...field('hod_name')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Number of attendees</label>
        <input type="number" min="1" className="form-input" placeholder="e.g. 8" {...field('attendees')} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Session duration (mins)</label>
        <input type="number" min="15" step="15" className="form-input" placeholder="e.g. 90" {...field('duration')} />
      </div>
      <div className="sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">Follow-up date</label>
        <input type="date" className="form-input" {...field('followup_date')} />
      </div>
    </div>
  )
}
