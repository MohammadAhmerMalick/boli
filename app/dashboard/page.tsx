import { RequireAuth } from '@/components/auth-provider'
import { Dashboard } from '@/components/dashboard'

export default function DashboardPage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  )
}
