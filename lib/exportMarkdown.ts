import type { Department, Response, Session, Submission } from './supabase'

function getFieldValue(responses: Response[], dept: Department, section: string, key: string): string {
  return responses.find(r => r.department === dept && r.section === section && r.field_key === key)?.field_value ?? ''
}

function getTableRows(responses: Response[], dept: Department, section: string, rowPrefix: string, cols: string[]): string[][] {
  const rows: string[][] = []
  for (let i = 0; i < 10; i++) {
    const row = cols.map(col => getFieldValue(responses, dept, section, `${rowPrefix}_${i}_${col}`))
    if (row.some(v => v.trim())) rows.push(row)
  }
  return rows
}

export function generateMarkdown(session: Session, dept: Department, responses: Response[], submission?: Submission): string {
  const deptLabel = dept === 'hr' ? 'HR' : dept === 'delivery' ? 'Delivery' : 'Sales'
  const date = submission ? new Date(submission.submitted_at).toLocaleDateString('en-MY') : new Date().toLocaleDateString('en-MY')
  const g = (section: string, key: string) => getFieldValue(responses, dept, section, key)

  const painPoints = getTableRows(responses, dept, '4.2', 'row', ['description', 'frequency', 'time_spent'])
  const docs = getTableRows(responses, dept, '4.9', 'row', ['name', 'type', 'sensitivity', 'owner'])
  const boundaries = getTableRows(responses, dept, '4.10', 'row', ['topic', 'reason'])

  const featureLabels: Record<string, string> = {
    f1: 'FAQ / instant answers',
    f2: 'Leave & payroll self-service',
    f3: 'Document retrieval',
    f4: 'Escalation routing',
    f5: 'Onboarding support',
    f6: 'Policy guidance',
    f7: 'Reporting & analytics',
    f8: 'Multi-language support',
  }

  const features = Object.entries(featureLabels)
    .map(([key, label]) => {
      const val = g('4.8', key)
      return val ? `- **${label}**: ${val}` : null
    })
    .filter(Boolean)
    .join('\n')

  return `# CLAUDE.md — ${deptLabel} Configuration
Generated: ${date} | Session: ${session.id} | Facilitator: ${session.facilitator_name}

---

## Scope

**Top enquiry topics (ranked):**
${g('4.3', 'top_topics') || '_Not specified_'}

**Undocumented processes CLAW should capture:**
${g('4.3', 'undocumented_processes') || '_Not specified_'}

**Topics CLAW must never answer:**
${g('4.3', 'never_answer') || '_Not specified_'}

**Staff-only vs ${deptLabel} team access:**
${g('4.3', 'staff_vs_team') || '_Not specified_'}

---

## Current pain points

${
  painPoints.length
    ? `| Pain Point | Frequency | Time Spent |\n|---|---|---|\n${painPoints.map(r => `| ${r.join(' | ')} |`).join('\n')}`
    : '_No pain points recorded_'
}

---

## Knowledge base documents

${
  docs.length
    ? `| Document | Type | Sensitivity | Owner |\n|---|---|---|---|\n${docs.map(r => `| ${r.join(' | ')} |`).join('\n')}`
    : '_No documents recorded_'
}

**Most referenced documents:**
${g('4.4', 'most_referenced') || '_Not specified_'}

**Update frequency & owner:**
${g('4.4', 'update_frequency') || '_Not specified_'}

**Documented vs verbal knowledge:**
${g('4.4', 'documented_vs_verbal') || '_Not specified_'}

**Existing FAQ status:**
${g('4.4', 'faq_status') || '_Not specified_'}

---

## Hard boundaries

${
  boundaries.length
    ? boundaries.map(r => `- **NEVER answer:** ${r[0]}${r[1] ? ` — _${r[1]}_` : ''}`).join('\n')
    : '_No hard boundaries recorded_'
}

---

## Escalation chain

**Chain:**
${g('4.5', 'chain') || '_Not specified_'}

**Always-escalate query types:**
${g('4.5', 'always_escalate') || '_Not specified_'}

**Unresolved query logging preference:**
${g('4.5', 'logging_preference') || '_Not specified_'}

---

## Language & tone

**Language:** ${g('4.6', 'language') || '_Not specified_'}
**Tone:** ${g('4.6', 'tone') || '_Not specified_'}

**Internal terminology:**
${g('4.6', 'terminology') || '_Not specified_'}

---

## Access & integration

**Access scope:** ${g('4.7', 'access_scope') || '_Not specified_'}
**Systems aware but no access:**
${g('4.7', 'systems_aware') || '_Not specified_'}
**Operating hours:** ${g('4.7', 'operating_hours') || '_Not specified_'}

---

## Feature priority

${features || '_No feature priorities recorded_'}

---

## Success criteria

**Time-saving metric:**
${g('4.11', 'time_saving') || '_Not specified_'}

**Failure definition:**
${g('4.11', 'failure_definition') || '_Not specified_'}

**4-week success definition:**
${g('4.11', 'four_week_success') || '_Not specified_'}
`
}
