'use client'

import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { SessionPending, useAuth } from '@/components/auth-provider'

export default function Home() {
  const { status } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (status === 'authenticated') router.replace('/dashboard')
    if (status === 'unauthenticated') router.replace('/login')
  }, [status, router])

  return <SessionPending />
}
