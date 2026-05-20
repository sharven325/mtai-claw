'use client'

import { type Department } from '@/lib/supabase'
import { useFormField } from '@/components/DeptForm'

const DEPT_TERMINOLOGY: Record<Department, string> = {
  hr: 'e.g. "MC" = medical certificate, "EA" = Employment Act, "PCB" = monthly tax deduction, "HRDF" = training levy',
  delivery: 'e.g. "POD" = proof of delivery, "COD" = cash on delivery, "OFD" = out for delivery, "RTS" = return to sender',
  sales: 'e.g. "RFP" = request for proposal, "GP" = gross profit, "PO" = purchase order, "NDA" = non-disclosure agreement',
}

interface Props {
  sessionId: string
  department: Department
}

export function Section46({ sessionId, department }: Props) {
  const termPlaceholder = DEPT_TERMINOLOGY[department]
  const langField = useFormField(sessionId, department, '4.6', 'language')
  const toneField = useFormField(sessionId, department, '4.6', 'tone')
  const termField = useFormField(sessionId, department, '4.6', 'terminology')

  return (
    <div className="space-y-5">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
        <div className="flex gap-3">
          {['BM', 'EN', 'Both'].map(lang => (
            <label key={lang} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`lang-${department}`}
                value={lang}
                checked={langField.value === lang}
                onChange={() => langField.onChange({ target: { value: lang } } as React.ChangeEvent<HTMLInputElement>)}
                className="accent-[#1D9E75]"
              />
              <span className="text-sm text-gray-700">{lang === 'BM' ? 'Bahasa Malaysia' : lang === 'EN' ? 'English' : 'Both (BM & EN)'}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Communication tone</label>
        <div className="flex gap-3 flex-wrap">
          {['Formal', 'Semi-formal', 'Friendly'].map(tone => (
            <label key={tone} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name={`tone-${department}`}
                value={tone}
                checked={toneField.value === tone}
                onChange={() => toneField.onChange({ target: { value: tone } } as React.ChangeEvent<HTMLInputElement>)}
                className="accent-[#1D9E75]"
              />
              <span className="text-sm text-gray-700">{tone}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Internal terminology / glossary</label>
        <p className="text-xs text-gray-500 mb-2">List department-specific acronyms and terms CLAW should recognise</p>
        <textarea rows={4} className="form-input resize-y text-sm" placeholder={termPlaceholder} {...termField} />
      </div>
    </div>
  )
}
