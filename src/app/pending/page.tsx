'use client'

export default function PendingPage() {
  return (
    <div className="page-center">
      <div style={{ textAlign: 'center', padding: '40px 24px' }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>⏳</div>
        <h1 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>승인 대기 중</h1>
        <p style={{ fontSize: 14, color: 'var(--ink-60)', lineHeight: 1.6, marginBottom: 24 }}>
          관리자 확인 후 승인이 완료되면<br />서비스를 이용하실 수 있습니다.
        </p>
        <a
          href="https://pf.kakao.com/_ppool"
          target="_blank"
          rel="noreferrer"
          className="btn-primary"
          style={{ display: 'inline-block', textDecoration: 'none', maxWidth: 240 }}
        >
          카카오톡 채널 문의
        </a>
      </div>
    </div>
  )
}
