import { useAuthContext } from '../stores/authStore'

const KAKAO_CHANNEL_URL = 'https://pf.kakao.com/_your_channel'

export function BannedPage() {
  const { user, signOut } = useAuthContext()

  const bannedUntil = user?.banned_until
    ? new Date(user.banned_until).toLocaleDateString('ko-KR')
    : null

  return (
    <div className="page-center">
      <div style={{ fontSize: 48 }}>🚫</div>
      <h1 className="page-title">이용이 정지된 계정입니다</h1>
      {bannedUntil && (
        <p className="page-subtitle">정지 해제일: {bannedUntil}</p>
      )}
      <p className="page-subtitle">
        노쇼 3회 이상 또는 이용약관 위반으로 인해 이용이 제한되었습니다.
      </p>
      <a
        href={KAKAO_CHANNEL_URL}
        target="_blank"
        rel="noreferrer"
        className="btn-kakao tap"
      >
        소명하기 (카카오톡 채널)
      </a>
      <button className="btn-ghost tap" onClick={signOut}>
        로그아웃
      </button>
    </div>
  )
}
