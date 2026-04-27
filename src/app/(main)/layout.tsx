'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../../stores/authStore'

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) router.replace('/login')
    else if (user.status === 'PENDING') router.replace('/pending')
    else if (user.status === 'BANNED') router.replace('/banned')
    else if (user.status === 'REJECTED') router.replace('/login')
  }, [user, loading, router])

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <p>로딩 중...</p>
      </div>
    )
  }

  if (!user || user.status !== 'APPROVED') return null

  return <>{children}</>
}
