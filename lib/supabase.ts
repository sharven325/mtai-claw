import { createClient } from '@supabase/supabase-js'

export function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  return createClient(url, key)
}

export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!
  return createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  })
}

export type Department = 'hr' | 'delivery' | 'sales'

export interface Session {
  id: string
  created_at: string
  session_label: string
  facilitator_name: string
}

export interface Response {
  id: string
  session_id: string
  department: Department
  section: string
  field_key: string
  field_value: string
  updated_at: string
}

export interface Submission {
  id: string
  session_id: string
  department: Department
  submitted_at: string
  submitted_by: string
}
