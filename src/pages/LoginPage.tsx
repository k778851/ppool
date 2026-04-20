import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../stores/authStore'

export function LoginPage() {
  const { user, loading, signInWithKakao } = useAuthContext()
  const navigate = useNavigate()

  useEffect(() => {
    if (!loading && user) {
      if (user.status === 'PENDING') navigate('/pending', { replace: true })
      else if (user.status === 'APPROVED') navigate('/', { replace: true })
      else if (user.status === 'BANNED') navigate('/banned', { replace: true })
    }
  }, [user, loading, navigate])

  return (
    <div className="login-page">
      <div className="login-hero">
        <div className="login-logo hand">P플 👍</div>
        <p className="login-sub">지파 청년부 카풀 서비스</p>
      </div>

      <div className="login-body">
        <button className="kakao-btn tap" onClick={signInWithKakao}>
          <img src="/kakao-icon.svg" alt="" width={20} height={20} />
          카카오 로그인
        </button>

        <p className="login-terms-notice">
          로그인 시{' '}
          <a href="/terms" target="_blank" rel="noreferrer">이용약관</a>,{' '}
          <a href="/privacy" target="_blank" rel="noreferrer">개인정보 처리방침</a>,{' '}
          <a href="/location-terms" target="_blank" rel="noreferrer">위치정보 이용약관</a>에
          동의한 것으로 간주됩니다.
        </p>
      </div>
    </div>
  )
}
