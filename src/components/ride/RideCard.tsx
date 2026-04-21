import { useNavigate } from 'react-router-dom'
import type { Ride, User, Vehicle } from '../../types'
import { formatRelativeTime, formatDateTime } from '../../lib/utils'

interface Props {
  ride: Ride & { driver?: User; vehicle?: Vehicle }
  isMyRide?: boolean
  myRequestStatus?: 'PENDING' | 'APPROVED' | null
}

export function RideCard({ ride, isMyRide = false, myRequestStatus = null }: Props) {
  const navigate = useNavigate()
  const isFull = ride.status === 'FULL' || ride.current_seats >= ride.max_seats
  const remaining = ride.max_seats - ride.current_seats
  const accentColor = isMyRide ? 'var(--blue-hero)' : 'var(--driver)'
  const avatarBg = ride.driver?.gender === 'F' ? 'var(--rider-soft)' : 'var(--driver-soft)'

  return (
    <div
      className="post-card tap"
      onClick={() => navigate(`/rides/${ride.id}`)}
    >
      {/* 왼쪽 색상 바 */}
      <div className="post-card-accent" style={{ background: accentColor }} />

      <div className="post-card-body">
        {/* 상단: 배지 + 시간 */}
        <div className="post-card-head">
          <div className="post-card-badges">
            {isMyRide ? (
              <span className="post-badge post-badge--my">내 게시글</span>
            ) : (
              <span className="post-badge post-badge--driver">🚗 운전자</span>
            )}
            {ride.gender_preference === 'SAME_ONLY' && (
              <span className="post-badge post-badge--neutral">동성만</span>
            )}
            {myRequestStatus === 'APPROVED' && (
              <span className="post-badge post-badge--mint">확정</span>
            )}
            {myRequestStatus === 'PENDING' && (
              <span className="post-badge post-badge--neutral">대기중</span>
            )}
          </div>
          <div className="post-card-when">
            {formatDateTime(ride.departure_time)}
            <span style={{ color: 'var(--ink-40)', marginLeft: 4 }}>
              ({formatRelativeTime(ride.departure_time)})
            </span>
          </div>
        </div>

        {/* 경로 + 신청 버튼 */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div className="post-route" style={{ flex: 1 }}>
            <div className="post-route-line">
              <div className="post-route-dot" />
              <div className="post-route-connector" />
              <div className="post-route-diamond" style={{ background: accentColor }} />
            </div>
            <div className="post-route-text">
              <div className="post-route-from">{ride.origin}</div>
              <div className="post-route-to">{ride.destination}</div>
            </div>
          </div>

          {/* 신청 버튼 */}
          <div onClick={e => { e.stopPropagation(); navigate(`/rides/${ride.id}`) }}>
            {isMyRide ? (
              <span style={{
                fontSize: 11.5, fontWeight: 800, padding: '7px 12px', borderRadius: 10,
                background: 'var(--rider-soft)', color: 'var(--rider-ink)',
                whiteSpace: 'nowrap',
              }}>관리</span>
            ) : myRequestStatus === 'APPROVED' ? (
              <span style={{
                fontSize: 11.5, fontWeight: 800, padding: '7px 12px', borderRadius: 10,
                background: '#DEFAF5', color: 'var(--mint-ink)',
                whiteSpace: 'nowrap',
              }}>확정</span>
            ) : myRequestStatus === 'PENDING' ? (
              <span style={{
                fontSize: 11.5, fontWeight: 800, padding: '7px 12px', borderRadius: 10,
                background: 'var(--ink-10)', color: 'var(--ink-60)',
                whiteSpace: 'nowrap',
              }}>대기중</span>
            ) : isFull ? (
              <span style={{
                fontSize: 11.5, fontWeight: 700, padding: '7px 12px', borderRadius: 10,
                background: 'var(--ink-10)', color: 'var(--ink-40)',
                whiteSpace: 'nowrap',
              }}>마감</span>
            ) : (
              <span style={{
                fontSize: 11.5, fontWeight: 800, padding: '7px 14px', borderRadius: 10,
                background: accentColor, color: '#fff',
                whiteSpace: 'nowrap',
              }}>신청</span>
            )}
          </div>
        </div>

        {/* 메모 */}
        {ride.notice && (
          <div className="post-note">{ride.notice}</div>
        )}

        {/* 하단 */}
        <div className="post-footer">
          <div className="post-avatar-row">
            <div
              className="post-avatar"
              style={{ background: avatarBg }}
            >
              {ride.driver?.name?.charAt(0) ?? '?'}
            </div>
            <div>
              <div className="post-user-name">{ride.driver?.name}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                <span className="post-user-dept">{ride.driver?.department}</span>
                {ride.driver?.gender && (
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999,
                    background: ride.driver.gender === 'F' ? '#FFE4EF' : '#E4EEFF',
                    color: ride.driver.gender === 'F' ? '#C0185A' : '#1A38F5',
                  }}>
                    {ride.driver.gender === 'F' ? '여' : '남'}
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="post-right">
            {isFull ? (
              <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ink-40)' }}>마감</span>
            ) : (
              <span className="post-seats">
                <span style={{ color: accentColor, fontWeight: 800 }}>{remaining}</span>
                <span style={{ color: 'var(--ink-40)' }}>/{ride.max_seats}석</span>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
