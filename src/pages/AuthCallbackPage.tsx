import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'

export function AuthCallbackPage() {
  const navigate = useNavigate()

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (!session?.user) {
        navigate('/login', { replace: true })
        return
      }

      const { data: profile } = await supabase
        .from('users')
        .select('status, kakao_id')
        .eq('id', session.user.id)
        .single()

      if (!profile) {
        // 최초 로그인 → 회원가입
        navigate('/signup', { replace: true })
      } else if (profile.status === 'PENDING') {
        navigate('/pending', { replace: true })
      } else if (profile.status === 'APPROVED') {
        navigate('/', { replace: true })
      } else if (profile.status === 'BANNED') {
        navigate('/banned', { replace: true })
      } else {
        navigate('/login', { replace: true })
      }
    })
  }, [navigate])

  return (
    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <p>로그인 처리 중...</p>
    </div>
  )
}
