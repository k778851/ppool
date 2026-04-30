'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../stores/authStore'

export default function RootPage() {
  const { user, loading } = useAuthContext()
  const router = useRouter()

  useEffect(() => {
    if (loading) return
    if (!user) {
      router.replace('/login')
    } else if (user.gender === null) {
      // 최초 로그인 — 성별 미설정 → 셋업 화면
      router.replace('/setup')
    } else if (user.status === 'PENDING') {
      router.replace('/pending')
    } else if (user.status === 'BANNED') {
      router.replace('/banned')
    } else if (user.status === 'APPROVED') {
      router.replace('/feed')
    } else {
      router.replace('/login')
    }
  }, [user, loading, router])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p style={{ color: 'var(--ink-60)', fontSize: '0.9rem' }}>로딩 중...</p>
    </div>
  )
}
