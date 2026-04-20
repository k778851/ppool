import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { IS_MOCK, MOCK_USER } from '../lib/mock'
import type { User } from '../types'

export function useAuth() {
  const [user, setUser] = useState<User | null>(IS_MOCK ? MOCK_USER : null)
  const [loading, setLoading] = useState(!IS_MOCK)

  useEffect(() => {
    if (IS_MOCK) return

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setUser(null)
        setLoading(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  const fetchProfile = async (authId: string) => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', authId)
      .single()

    setUser(data)
    setLoading(false)
  }

  const signInWithKakao = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'kakao',
      options: { redirectTo: `${window.location.origin}/auth/callback` },
    })
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return { user, loading, signInWithKakao, signOut, refetchProfile: () => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) fetchProfile(data.user.id)
    })
  }}
}
