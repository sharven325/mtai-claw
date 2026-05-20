'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import { ClawLogo } from '@/components/ClawLogo'

function LoginForm() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/session/new'

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const res = await signIn('credentials', {
      password,
      role: 'facilitator',
      redirect: false,
      callbackUrl,
    })

    if (res?.error) {
      setError('Invalid password. Please try again.')
      setLoading(false)
    } else {
      router.push(callbackUrl)
    }
  }

  return (
    <div className="min-h-screen bg-[#F6F2EB] flex flex-col items-center justify-center p-4">
      {/* Google-Forms-style login card with branded header */}
      <div className="w-full max-w-md">
        {/* Header card */}
        <div className="gf-card border-t-8 border-t-[#F8BB1A] mb-0 rounded-b-none">
          <div className="px-8 pt-8 pb-6">
            {/* Logo */}
            <div className="flex items-center gap-3 mb-5">
              <ClawLogo size={44} />
              <div>
                <p className="font-bold text-[#0A0A0A] text-xl leading-tight tracking-wide">MTAI</p>
                <p className="text-[#BF9A36] font-semibold text-xs tracking-[0.2em] uppercase leading-tight">— CLAW —</p>
              </div>
            </div>
            <h1 className="text-2xl font-bold text-[#0A0A0A]">Requirements Portal</h1>
            <p className="text-sm text-gray-500 mt-1">CLAW AI Agent Deployment · M Telecommunications</p>
          </div>
        </div>

        {/* Form card */}
        <div className="gf-card rounded-t-none border-t border-gray-200 px-8 py-7">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-[#0A0A0A] mb-3">
                Facilitator password <span className="text-[#915825]">*</span>
              </label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="form-input"
                placeholder="Enter your password"
                required
              />
              <div className="h-px bg-gray-200 mt-0" />
            </div>

            {error && (
              <p className="text-[#915825] text-sm font-medium flex items-center gap-1.5">
                <span className="text-base">⚠</span> {error}
              </p>
            )}

            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-gray-400">Facilitator access only</span>
              <button type="submit" disabled={loading} className="btn-gold">
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  )
}
