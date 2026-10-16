import { GuestOnly } from '@/components/auth-provider'
import { LoginForm } from '@/components/login-form'

export default function LoginPage() {
  return (
    <GuestOnly>
      <LoginForm />
    </GuestOnly>
  )
}
