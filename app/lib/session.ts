import { cookies } from "next/headers"

const SESSION_COOKIE = "session"
const SESSION_MAX_AGE = 7 * 24 * 60 * 60 // 7 days

export type SessionUser = {
  id: number
  name: string
  role: string
}

export type Session = {
  token: string
  user: SessionUser
}

export async function createSession(session: Session) {
  const cookieStore = await cookies()

  cookieStore.set(SESSION_COOKIE, JSON.stringify(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_MAX_AGE,
  })
}

export async function getSession(): Promise<Session | null> {
  const cookieStore = await cookies()
  const value = cookieStore.get(SESSION_COOKIE)?.value

  if (!value) return null

  try {
    return JSON.parse(value) as Session
  } catch {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete(SESSION_COOKIE)
}
