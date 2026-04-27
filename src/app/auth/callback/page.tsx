'use client'

import { useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { api, IS_MOCK } from '../../../lib/api'
import { Suspense } from 'react'

function CallbackHandler() {
  const router = useRouter()
  const searchParams = useSearchParams()

  useEffect(() => {
    if (IS_MOCK) { router.replace('/feed'); return }

    const code = searchParams.get('code')
    if (!code) { router.replace('/login'); return }

    api.auth.kakaoCallback(code)
      .then(({ token, user }) => {
        localStorage.setItem('ppool_token', token)
        if (!user.name) router.replace('/signup')
        else if (user.status === 'PENDING') router.replace('/pending')
        else if (user.status === 'APPROVED') router.replace('/feed')
        else router.replace('/login')
      })
      .catch(() => router.replace('/login'))
  }, [router, searchParams])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>로그인 처리 중...</p>
    </div>
  )
}

export default function AuthCallbackPage() {
  return (
    <Suspense fallback={<div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}><p>로딩 중...</p></div>}>
      <CallbackHandler />
    </Suspense>
  )
}
