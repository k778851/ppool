'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

/** 구 회원가입 화면은 시온로그인 도입으로 더 이상 사용하지 않습니다.
 *  최초 로그인 후 추가 정보 입력은 /setup 에서 처리합니다. */
export default function SignupPage() {
  const router = useRouter()
  useEffect(() => { router.replace('/login') }, [router])
  return null
}
