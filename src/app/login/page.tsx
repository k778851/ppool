'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../../stores/authStore'

export default function LoginPage() {
  const { user, loading, signInWithZauth } = useAuthContext()
  const router = useRouter()

  const [zauthId, setZauthId] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  /* 이미 로그인된 경우 적절한 화면으로 이동 */
  useEffect(() => {
    if (loading || !user) return
    if (user.gender === null) router.replace('/setup')
    else if (user.status === 'PENDING') router.replace('/pending')
    else if (user.status === 'APPROVED') router.replace('/feed')
    else if (user.status === 'BANNED') router.replace('/banned')
  }, [user, loading, router])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!zauthId.trim()) { setError('고유번호를 입력해 주세요.'); return }
    if (!password) { setError('비밀번호를 입력해 주세요.'); return }

    setSubmitting(true)
    try {
      const profile = await signInWithZauth(zauthId.trim(), password)
      // 로그인 성공 → 상태에 따라 이동
      if (profile.gender === null) router.replace('/setup')
      else if (profile.status === 'PENDING') router.replace('/pending')
      else if (profile.status === 'APPROVED') router.replace('/feed')
      else if (profile.status === 'BANNED') router.replace('/banned')
      else router.replace('/pending')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '로그인에 실패하였습니다.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      {/* 히어로 */}
      <div className="login-hero">
        <div className="login-logo hand">P플</div>
        <p className="login-sub">지파 청년부 전용 카풀 서비스</p>
      </div>

      {/* 로그인 폼 */}
      <div className="login-body">
        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <div className="form-group">
            <label htmlFor="zauthId" className="form-label">시온로그인 고유번호</label>
            <input
              id="zauthId"
              type="text"
              inputMode="numeric"
              className="form-input"
              placeholder="고유번호를 입력하세요"
              value={zauthId}
              onChange={e => setZauthId(e.target.value)}
              autoComplete="username"
              disabled={submitting}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password" className="form-label">비밀번호</label>
            <input
              id="password"
              type="password"
              className="form-input"
              placeholder="비밀번호를 입력하세요"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              disabled={submitting}
            />
          </div>

          {error && <p className="form-error">{error}</p>}

          <button
            type="submit"
            className="login-btn tap"
            disabled={submitting}
          >
            {submitting ? '로그인 중…' : '시온로그인으로 로그인'}
          </button>
        </form>

        <p className="login-terms-notice">
          로그인 시{' '}
          <a href="/terms" target="_blank" rel="noreferrer">이용약관</a>,{' '}
          <a href="/privacy" target="_blank" rel="noreferrer">개인정보 처리방침</a>,{' '}
          <a href="/location-terms" target="_blank" rel="noreferrer">위치정보 이용약관</a>에
          동의한 것으로 간주됩니다.
        </p>
      </div>

      <style>{`
        .login-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--blue-hero);
        }
        .login-hero {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          padding: 60px 24px 40px;
          color: #fff;
          text-align: center;
        }
        .login-logo {
          font-size: 3.2rem;
          color: #fff;
          line-height: 1;
          margin-bottom: 10px;
          text-shadow: 0 2px 12px rgba(0,0,0,.18);
        }
        .login-sub {
          margin: 0;
          font-size: 1rem;
          color: rgba(255,255,255,.75);
          letter-spacing: -0.01em;
        }
        .login-body {
          background: #fff;
          border-radius: 28px 28px 0 0;
          padding: 32px 24px 40px;
        }
        .login-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          margin-bottom: 20px;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--ink-60);
        }
        .form-input {
          height: 50px;
          padding: 0 16px;
          border: 1.5px solid var(--ink-20);
          border-radius: var(--radius-md);
          font-size: 1rem;
          font-family: inherit;
          color: var(--ink-100);
          background: var(--ink-5);
          outline: none;
          transition: border-color .15s;
        }
        .form-input:focus {
          border-color: var(--blue-hero);
          background: #fff;
        }
        .form-input:disabled {
          opacity: 0.6;
        }
        .form-error {
          margin: 0;
          font-size: 0.82rem;
          color: var(--warn);
          padding: 10px 14px;
          background: var(--warn-soft);
          border-radius: var(--radius-sm);
        }
        .login-btn {
          height: 52px;
          background: var(--blue-hero);
          color: #fff;
          border: none;
          border-radius: var(--radius-lg);
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          letter-spacing: -0.01em;
          margin-top: 4px;
        }
        .login-btn:disabled {
          opacity: 0.55;
        }
        .login-terms-notice {
          font-size: 0.75rem;
          color: var(--ink-40);
          text-align: center;
          line-height: 1.6;
          margin: 0;
        }
        .login-terms-notice a {
          color: var(--ink-60);
          text-decoration: underline;
        }
      `}</style>
    </div>
  )
}
