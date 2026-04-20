import { useAuthContext } from '../stores/authStore'

const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_your_channel'

export function PendingPage() {
  const { signOut } = useAuthContext()

  return (
    <div className="page-center">
      <div className="pending-icon">⏳</div>
      <h1 className="page-title">관리자 승인 대기 중입니다</h1>
      <p className="page-subtitle">
        청년부 구성원 확인 후 승인됩니다.<br />
        통상 1~2일 소요됩니다.
      </p>
      <a
        href={KAKAO_CHANNEL_URL}
        target="_blank"
        rel="noreferrer"
        className="btn-kakao tap"
      >
        카카오톡 채널 문의
      </a>
      <button className="btn-ghost tap" onClick={signOut}>
        로그아웃
      </button>
    </div>
  )
}
