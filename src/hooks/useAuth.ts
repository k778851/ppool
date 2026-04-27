import { useEffect, useState, useCallback } from 'react'
import { api, IS_MOCK, setToken, clearToken } from '../lib/api'
import { MOCK_USER } from '../lib/mock'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(IS_MOCK ? MOCK_USER : null)
  const [loading, setLoading] = useState(!IS_MOCK)

  useEffect(() => {
    if (IS_MOCK) return

    const token = typeof window !== 'undefined'
      ? localStorage.getItem('ppool_token')
      : null

    if (!token) {
      // Use a microtask so setState isn't called synchronously inside the effect body
      Promise.resolve().then(() => setLoading(false))
      return
    }

    api.users.me()
      .then(profile => setUser(profile))
      .catch(() => { clearToken(); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  /** 카카오 로그인 페이지로 이동 */
  const signInWithKakao = useCallback(() => {
    if (IS_MOCK) {
      setUser(MOCK_USER)
      return
    }
    const clientId = process.env.NEXT_PUBLIC_KAKAO_CLIENT_ID
    const redirectUri = encodeURIComponent(`${window.location.origin}/auth/callback`)
    window.location.href =
      `https://kauth.kakao.com/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code`
  }, [])

  /** 카카오 콜백에서 호출 — JWT 저장 후 유저 세팅 */
  const handleCallback = useCallback(async (code: string) => {
    const { token, user: profile } = await api.auth.kakaoCallback(code)
    setToken(token)
    setUser(profile)
    return profile
  }, [])

  const signOut = useCallback(() => {
    clearToken()
    setUser(null)
  }, [])

  const refetchProfile = useCallback(async () => {
    try {
      const profile = await api.users.me()
      setUser(profile)
    } catch {
      clearToken()
      setUser(null)
    }
  }, [])

  return { user, loading, signInWithKakao, handleCallback, signOut, refetchProfile }
}
