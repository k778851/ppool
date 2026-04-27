'use client'

import { useAuthContext } from '../../stores/authStore'

export default function BannedPage() {
  const { user, signOut } = useAuthContext()

  const until = user?.banned_until
    ? new Date(user.banned_until).toLocaleDateString('ko-KR')
    : '알 수 없음'

  return (
    <div className="page-center">
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>🚫</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>이용이 제한되었습니다</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.6, marginBottom: 8 }}>
          노쇼 또는 규정 위반으로 인해 일시적으로<br />이용이 제한되었습니다.
        </p>
        <p style={{ fontSize: 13, color: 'var(--warn)', fontWeight: 700, marginBottom: 24 }}>
          정지 해제일: {until}
        </p>
        <button className="btn-ghost" onClick={signOut}>로그아웃</button>
      </div>
    </div>
  )
}
