"use server"

import { redirect } from "next/navigation"
import { mockLoginApi } from "@/app/lib/api"
import { createSession, deleteSession } from "@/app/lib/session"

export type AuthState = {
  error?: string
} | null

export async function login(
  _prevState: AuthState,
  formData: FormData,
): Promise<AuthState> {
  const username = String(
    formData.get("username") ?? formData.get("email") ?? "",
  ).trim()
  const password = String(formData.get("password") ?? "")

  if (!username || !password) {
    return { error: "Username and password are required" }
  }
  try {
    const { token, user } = await mockLoginApi(username, password)
    console.log({ user })
    await createSession({ token, user })
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Login failed",
    }
  }

  redirect("/")
}

export async function logout() {
  await deleteSession()
  redirect("/login")
}
