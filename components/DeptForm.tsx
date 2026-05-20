'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { ChevronDown, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { type Department, type Response } from '@/lib/supabase'
import { Section41 } from './sections/Section41'
import { Section42 } from './sections/Section42'
import { Section43 } from './sections/Section43'
import { Section44 } from './sections/Section44'
import { Section45 } from './sections/Section45'
import { Section46 } from './sections/Section46'
import { Section47 } from './sections/Section47'
import { Section48 } from './sections/Section48'
import { Section49 } from './sections/Section49'
import { Section410 } from './sections/Section410'
import { Section411 } from './sections/Section411'

interface FormCtx {
  sessionId: string
  department: Department
  values: Record<string, string>
  setField: (section: string, key: string, value: string) => void
  saving: boolean
}

const FormContext = createContext<FormCtx | null>(null)

export function useFormField(sessionId: string, department: Department, section: string, key: string) {
  const ctx = useContext(FormContext)
  if (!ctx) throw new Error('useFormField must be used inside DeptForm')
  const fieldId = `${section}__${key}`
  return {
    value: ctx.values[fieldId] ?? '',
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
      ctx.setField(section, key, e.target.value)
    },
  }
}

interface SectionMeta {
  id: string
  title: string
  requiredKeys: string[]
  component: (props: { sessionId: string; department: Department }) => React.ReactElement
}

const SECTION_META: SectionMeta[] = [
  { id: '4.1', title: '4.1  Session logistics', requiredKeys: ['4.1__date', '4.1__facilitator'], component: Section41 },
  { id: '4.2', title: '4.2  Current pain points & workflows', requiredKeys: ['4.2__row_0_description'], component: Section42 },
  { id: '4.3', title: '4.3  Scope & coverage', requiredKeys: ['4.3__top_topics'], component: Section43 },
  { id: '4.4', title: '4.4  Knowledge base content', requiredKeys: ['4.4__most_referenced'], component: Section44 },
  { id: '4.5', title: '4.5  Escalation & routing', requiredKeys: ['4.5__chain'], component: Section45 },
  { id: '4.6', title: '4.6  Language & communication style', requiredKeys: ['4.6__language', '4.6__tone'], component: Section46 },
  { id: '4.7', title: '4.7  Integration & access', requiredKeys: ['4.7__access_scope'], component: Section47 },
  { id: '4.8', title: '4.8  Feature priority matrix', requiredKeys: ['4.8__f1'], component: Section48 },
  { id: '4.9', title: '4.9  Data & documents', requiredKeys: ['4.9__row_0_name'], component: Section49 },
  { id: '4.10', title: '4.10  Hard boundaries', requiredKeys: ['4.10__row_0_topic'], component: Section410 },
  { id: '4.11', title: '4.11  Success criteria', requiredKeys: ['4.11__time_saving'], component: Section411 },
]

interface Props {
  sessionId: string
  department: Department
  initialResponses: Response[]
  isSubmitted: boolean
  facilitatorName: string
  onSubmitSuccess: () => void
}

export function DeptForm({ sessionId, department, initialResponses, isSubmitted, facilitatorName, onSubmitSuccess }: Props) {
  const [values, setValues] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const r of initialResponses) {
      map[`${r.section}__${r.field_key}`] = r.field_value
    }
    return map
  })
  const [openSection, setOpenSection] = useState<string>('4.1')
  const [saving, setSaving] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(isSubmitted)
  const pendingRef = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  const save = useCallback(async (section: string, key: string, value: string) => {
    try {
      await fetch('/api/responses', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, department, section, field_key: key, field_value: value }),
      })
    } catch (err) {
      console.error('Auto-save error', err)
    }
  }, [sessionId, department])

  const setField = useCallback((section: string, key: string, value: string) => {
    const fieldId = `${section}__${key}`
    setValues(prev => ({ ...prev, [fieldId]: value }))
    setSaving(true)
    const pendingKey = `${section}__${key}`
    if (pendingRef.current[pendingKey]) clearTimeout(pendingRef.current[pendingKey])
    pendingRef.current[pendingKey] = setTimeout(async () => {
      await save(section, key, value)
      setSaving(false)
    }, 1500)
  }, [save])

  function isComplete(section: SectionMeta) {
    return section.requiredKeys.every(k => values[k]?.trim())
  }

  async function handleSubmit() {
    setSubmitting(true)
    try {
      const res = await fetch('/api/submissions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ session_id: sessionId, department, submitted_by: facilitatorName }),
      })
      if (res.ok) {
        setSubmitted(true)
        onSubmitSuccess()
      }
    } finally {
      setSubmitting(false)
    }
  }

  const deptLabel = department === 'hr' ? 'HR' : department === 'delivery' ? 'Delivery' : 'Sales'
  const completedCount = SECTION_META.filter(isComplete).length

  return (
    <FormContext.Provider value={{ sessionId, department, values, setField, saving }}>
      <div className="space-y-3">
        <div className="flex items-center justify-between py-2">
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{completedCount} of {SECTION_META.length} sections complete</span>
            {saving && (
              <span className="flex items-center gap-1 text-xs text-gray-400">
                <Loader2 size={12} className="animate-spin" /> Saving
              </span>
            )}
          </div>
          {submitted && (
            <span className="flex items-center gap-1.5 text-sm text-[#1D9E75] font-medium">
              <CheckCircle2 size={16} /> Submitted
            </span>
          )}
        </div>

        {SECTION_META.map(meta => {
          const complete = isComplete(meta)
          const isOpen = openSection === meta.id
          const SectionComponent = meta.component
          return (
            <div key={meta.id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? '' : meta.id)}
                className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {complete
                    ? <CheckCircle2 size={16} className="text-[#1D9E75] shrink-0" />
                    : <Circle size={16} className="text-gray-300 shrink-0" />
                  }
                  <span className="text-sm font-medium text-gray-800">{meta.title}</span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>
              {isOpen && (
                <div className="px-5 pb-5 pt-1 border-t border-gray-100">
                  <SectionComponent sessionId={sessionId} department={department} />
                </div>
              )}
            </div>
          )
        })}

        {!submitted ? (
          <div className="pt-2">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="w-full bg-[#1D9E75] text-white rounded-xl py-3 text-sm font-medium hover:bg-[#178A65] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {submitting ? 'Submitting...' : `Submit ${deptLabel} requirements`}
            </button>
            <p className="text-xs text-gray-400 text-center mt-2">All sections are auto-saved. Submit when ready to lock in this department.</p>
          </div>
        ) : (
          <div className="bg-[#1D9E75]/10 border border-[#1D9E75]/20 rounded-xl p-4 text-center">
            <CheckCircle2 size={24} className="text-[#1D9E75] mx-auto mb-2" />
            <p className="text-sm font-medium text-[#1D9E75]">{deptLabel} requirements submitted</p>
            <p className="text-xs text-gray-500 mt-1">Use the export button to download the CLAUDE.md draft.</p>
          </div>
        )}
      </div>
    </FormContext.Provider>
  )
}
