'use client'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../../stores/authStore'

interface Props {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function AuthGuard({ children, requireAdmin = false }: Props) {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/login'); return }
    if (user.status === 'PENDING') { router.replace('/pending'); return }
    if (user.status === 'BANNED') { router.replace('/banned'); return }
    if (user.status === 'REJECTED') { router.replace('/login'); return }
    if (requireAdmin && !user.is_admin) { router.replace('/feed'); return }
  }, [user, loading, requireAdmin, router])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>로딩 중...</p>
      </div>
    )
  }

  if (!user || user.status !== 'APPROVED') return null
  if (requireAdmin && !user.is_admin) return null

  return <>{children}</>
}
