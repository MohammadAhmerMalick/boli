'use client'

import { useRouter } from 'next/navigation'
import { type FormEvent, useState } from 'react'
import { useAuth } from '@/components/auth-provider'

type FieldErrors = {
  username?: string
  password?: string
}

export function LoginForm() {
  const { login } = useAuth()
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({})
  const [formError, setFormError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const nextErrors: FieldErrors = {}
    if (!username.trim()) nextErrors.username = 'Username is required.'
    if (!password) nextErrors.password = 'Password is required.'
    setFieldErrors(nextErrors)
    setFormError(null)
    if (nextErrors.username || nextErrors.password) return

    setSubmitting(true)
    try {
      await login(username.trim(), password)
      router.replace('/dashboard')
    } catch (error) {
      setFormError(
        error instanceof Error ? error.message : 'Unable to sign in.'
      )
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-1 bg-[#f4f1ea] text-stone-900">
      <section className="hidden w-1/2 flex-col justify-between bg-[#1c3a2e] px-14 py-12 text-[#f4f1ea] lg:flex">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#e7f0ea] font-semibold text-[#1c3a2e] text-sm">
            B
          </span>
          <span className="font-semibold text-lg tracking-tight">Boli</span>
        </div>
        <div className="max-w-md">
          <h1 className="font-semibold text-4xl leading-tight tracking-tight">
            Equipment, ready when you are.
          </h1>
          <p className="mt-4 text-[#d5e3db] text-base leading-7">
            Sign in to browse hardware, monitors, and accessories from a single
            catalog.
          </p>
        </div>
        <p className="text-[#b7c9bf] text-sm">Internal equipment catalog</p>
      </section>

      <section className="flex flex-1 items-center justify-center px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="mb-8 flex items-center gap-3 lg:hidden">
            <span className="grid h-9 w-9 place-items-center rounded-lg bg-[#1c3a2e] font-semibold text-[#f4f1ea] text-sm">
              B
            </span>
            <span className="font-semibold text-lg tracking-tight">Boli</span>
          </div>
          <h2 className="font-semibold text-2xl tracking-tight">Sign in</h2>
          <p className="mt-2 text-sm text-stone-600 leading-6">
            Use your workspace credentials to open the catalog.
          </p>

          <form className="mt-8 space-y-5" noValidate onSubmit={handleSubmit}>
            {formError ? (
              <p
                role="alert"
                className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-rose-800 text-sm"
              >
                {formError}
              </p>
            ) : null}

            <div className="space-y-1.5">
              <label htmlFor="username" className="font-medium text-sm">
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                autoComplete="username"
                value={username}
                onChange={(event) => {
                  setUsername(event.target.value)
                  setFieldErrors((current) => ({
                    ...current,
                    username: undefined,
                  }))
                }}
                aria-invalid={Boolean(fieldErrors.username)}
                aria-describedby={
                  fieldErrors.username ? 'username-error' : undefined
                }
                className="h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#1c3a2e] focus:ring-2 focus:ring-[#1c3a2e]/20"
              />
              {fieldErrors.username ? (
                <p id="username-error" className="text-rose-700 text-sm">
                  {fieldErrors.username}
                </p>
              ) : null}
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="font-medium text-sm">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(event) => {
                  setPassword(event.target.value)
                  setFieldErrors((current) => ({
                    ...current,
                    password: undefined,
                  }))
                }}
                aria-invalid={Boolean(fieldErrors.password)}
                aria-describedby={
                  fieldErrors.password ? 'password-error' : undefined
                }
                className="h-11 w-full rounded-lg border border-stone-300 bg-white px-3 text-sm outline-none transition focus:border-[#1c3a2e] focus:ring-2 focus:ring-[#1c3a2e]/20"
              />
              {fieldErrors.password ? (
                <p id="password-error" className="text-rose-700 text-sm">
                  {fieldErrors.password}
                </p>
              ) : null}
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="h-11 w-full rounded-lg bg-[#1c3a2e] font-medium text-[#f4f1ea] text-sm transition hover:bg-[#163028] disabled:cursor-not-allowed disabled:opacity-70"
            >
              {submitting ? 'Signing in…' : 'Sign in'}
            </button>
          </form>

          <p className="mt-6 text-sm text-stone-500">
            Demo account:{' '}
            <span className="font-medium text-stone-700">admin</span> /{' '}
            <span className="font-medium text-stone-700">password123</span>
          </p>
        </div>
      </section>
    </div>
  )
}
