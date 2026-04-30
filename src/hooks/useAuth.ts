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
      Promise.resolve().then(() => setLoading(false))
      return
    }

    api.users.me()
      .then(profile => setUser(profile))
      .catch(() => { clearToken(); setUser(null) })
      .finally(() => setLoading(false))
  }, [])

  /** 시온로그인: 고유번호+비밀번호로 JWT 발급 */
  const signInWithZauth = useCallback(async (zauthId: string, password: string) => {
    if (IS_MOCK) {
      setUser(MOCK_USER)
      return MOCK_USER
    }
    const { token, user: profile } = await api.auth.zauthLogin(zauthId, password)
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

  return { user, loading, signInWithZauth, signOut, refetchProfile }
}
