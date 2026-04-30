'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** 시온로그인은 OAuth 콜백이 없으므로 바로 /login 으로 리다이렉트 */
export default function AuthCallbackPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/login') }, [router])
  return null
}
