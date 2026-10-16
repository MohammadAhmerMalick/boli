'use client'

import { useRouter } from 'next/navigation'
import {
  createContext,
  type ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { type AuthUser, mockLoginApi } from '@/lib/api'

const STORAGE_KEY = 'auth_session'

type Session = {
  token: string
  user: AuthUser
}

type AuthStatus = 'loading' | 'authenticated' | 'unauthenticated'

type AuthContextValue = {
  status: AuthStatus
  token: string | null
  user: AuthUser | null
  login: (username: string, password: string) => Promise<void>
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readSession(): Session | null {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<Session>
    if (!parsed.token || !parsed.user?.name) return null
    return { token: parsed.token, user: parsed.user as AuthUser }
  } catch {
    return null
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [status, setStatus] = useState<AuthStatus>('loading')

  useEffect(() => {
    const stored = readSession()
    setSession(stored)
    setStatus(stored ? 'authenticated' : 'unauthenticated')
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const result = await mockLoginApi(username, password)
    const next: Session = { token: result.token, user: result.user }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSession(next)
    setStatus('authenticated')
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY)
    setSession(null)
    setStatus('unauthenticated')
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      login,
      logout,
      status,
      token: session?.token ?? null,
      user: session?.user ?? null,
    }),
    [status, session, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}

export function SessionPending() {
  return (
    <div className="flex flex-1 items-center justify-center bg-[#f4f1ea] text-stone-600">
      <p className="text-sm tracking-wide">Checking session…</p>
    </div>
  )
}

export function RequireAuth({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.replace('/login')
    }
  }, [status, router])

  if (status !== 'authenticated') {
    return <SessionPending />
  }

  return children
}

export function GuestOnly({ children }: { children: ReactNode }) {
  const { status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') {
      router.replace('/dashboard')
    }
  }, [status, router])

  if (status !== 'unauthenticated') {
    return <SessionPending />
  }

  return children
}
