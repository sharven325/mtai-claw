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

export function useFormField(_sessionId: string, _department: Department, section: string, key: string) {
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

        {/* Status bar — mimics Google Forms' top description card */}
        <div className="gf-card gf-card-active px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-sm font-semibold text-[#0A0A0A]">
              {completedCount} <span className="text-gray-400 font-normal">of {SECTION_META.length} sections filled</span>
            </div>
            {saving && (
              <span className="flex items-center gap-1 text-xs text-[#BF9A36]">
                <Loader2 size={11} className="animate-spin" /> Saving…
              </span>
            )}
          </div>
          {submitted && (
            <span className="flex items-center gap-1.5 text-xs font-semibold text-[#BF9A36] bg-[#FBDB79]/30 px-2.5 py-1 rounded-full">
              <CheckCircle2 size={13} /> Submitted
            </span>
          )}
        </div>

        {/* Section cards — Google Forms question card style */}
        {SECTION_META.map(meta => {
          const complete = isComplete(meta)
          const isOpen = openSection === meta.id
          const SectionComponent = meta.component
          return (
            <div
              key={meta.id}
              className={`gf-card transition-all ${isOpen ? 'border-l-4 border-l-[#F8BB1A]' : 'border-l-4 border-l-transparent'}`}
            >
              {/* Section header — clickable toggle */}
              <button
                type="button"
                onClick={() => setOpenSection(isOpen ? '' : meta.id)}
                className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-[#FBDB79]/10 transition-colors"
              >
                <div className="flex items-center gap-3">
                  {complete
                    ? <CheckCircle2 size={17} className="text-[#BF9A36] shrink-0" />
                    : <Circle size={17} className="text-gray-300 shrink-0" />
                  }
                  <span className={`text-sm font-semibold ${isOpen ? 'text-[#0A0A0A]' : 'text-gray-600'}`}>
                    {meta.title}
                  </span>
                </div>
                <ChevronDown
                  size={16}
                  className={`text-[#BF9A36] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
              </button>

              {/* Section body */}
              {isOpen && (
                <div className="px-6 pb-7 pt-2 border-t border-[#FBDB79]/40">
                  <SectionComponent sessionId={sessionId} department={department} />
                </div>
              )}
            </div>
          )
        })}

        {/* Submit / confirmation */}
        {!submitted ? (
          <div className="gf-card px-6 py-5 flex items-center justify-between">
            <p className="text-xs text-gray-400">Auto-saved · submit when this department is complete</p>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn-gold ml-4 shrink-0"
            >
              {submitting ? 'Submitting…' : `Submit ${deptLabel}`}
            </button>
          </div>
        ) : (
          <div className="gf-card border-l-4 border-l-[#F8BB1A] px-6 py-5 flex items-center gap-4 bg-[#FBDB79]/10">
            <CheckCircle2 size={28} className="text-[#BF9A36] shrink-0" />
            <div>
              <p className="text-sm font-bold text-[#0A0A0A]">{deptLabel} requirements submitted</p>
              <p className="text-xs text-gray-500 mt-0.5">Use the Export button to download the CLAUDE.md draft.</p>
            </div>
          </div>
        )}
      </div>
    </FormContext.Provider>
  )
}
