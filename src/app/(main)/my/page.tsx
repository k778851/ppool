'use client'

import { useRouter } from 'next/navigation'
import { BottomNav } from '../../../components/layout/BottomNav'
import { MOCK_USER, MOCK_MY_REQUESTS, MOCK_RIDES } from '../../../lib/mock'
import { formatDateTime } from '../../../lib/utils'

function StatBox({ value, label }: { value: string | number; label: string }) {
  return (
    <div style={{ flex: 1, background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '10px', textAlign: 'center', backdropFilter: 'blur(10px)' }}>
      <div style={{ fontSize: 18, fontWeight: 800 }}>{value}</div>
      <div style={{ fontSize: 10.5, opacity: 0.85, marginTop: 2 }}>{label}</div>
    </div>
  )
}

function SectionHead({ title, right }: { title: string; right?: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0 16px', marginBottom: 10 }}>
      <div style={{ fontSize: 14, fontWeight: 800 }}>{title}</div>
      {right && <div style={{ fontSize: 12, color: 'var(--ink-60)', fontWeight: 600 }}>{right}</div>}
    </div>
  )
}

function ActiveRideCard({ rideId, status }: { rideId: string; status: string }) {
  const router = useRouter()
  const ride = MOCK_RIDES.find(r => r.id === rideId)
  if (!ride) return null

  const isMyRide = ride.driver_id === MOCK_USER.id
  const color = isMyRide ? 'var(--driver-soft)' : 'var(--rider-soft)'
  const inkColor = isMyRide ? 'var(--driver-ink)' : 'var(--rider-ink)'
  const badge = isMyRide ? '운전자' : '탑승자'
  const statusColor = status === '확정' ? 'var(--mint-ink)' : 'var(--ink-60)'
  const statusBg = status === '확정' ? '#DEFAF5' : 'var(--ink-10)'

  return (
    <div className="my-ride-card tap" onClick={() => router.push(`/rides/${rideId}`)}>
      <div className="my-ride-icon" style={{ background: color }}>
        <span style={{ fontSize: 20 }}>{isMyRide ? '🚗' : '🙋'}</span>
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <span className="post-badge" style={{ background: color, color: inkColor }}>{badge}</span>
          <span className="post-badge" style={{ background: statusBg, color: statusColor }}>{status}</span>
          <span style={{ fontSize: 11, color: 'var(--ink-60)', fontWeight: 600 }}>{formatDateTime(ride.departure_time)}</span>
        </div>
        <div style={{ fontSize: 13.5, fontWeight: 700, color: 'var(--ink-100)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {ride.origin.split(' ').slice(-1)[0]} → {ride.destination.split(' ').slice(-1)[0]}
        </div>
        <div style={{ fontSize: 11.5, color: 'var(--ink-60)', marginTop: 2 }}>
          {isMyRide ? `신청자 ${ride.current_seats}명` : `${ride.driver?.name} · ${ride.driver?.department}`}
        </div>
      </div>
      <svg width="8" height="14" viewBox="0 0 8 14" style={{ flexShrink: 0 }}>
        <path d="M1 1 L7 7 L1 13" stroke="var(--ink-40)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

function MenuRow({ icon, label, count, right, last, onClick }: { icon: string; label: string; count?: number; right?: React.ReactNode; last?: boolean; onClick?: () => void }) {
  return (
    <div className="my-menu-row tap" style={{ borderBottom: last ? 'none' : '1px solid var(--ink-10)' }} onClick={onClick}>
      <span style={{ fontSize: 18, width: 26, flexShrink: 0 }}>{icon}</span>
      <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{label}</span>
      {count !== undefined && <span style={{ fontSize: 12, color: 'var(--ink-60)', fontWeight: 700, marginRight: 4 }}>{count}</span>}
      {right}
      <svg width="8" height="14" viewBox="0 0 8 14">
        <path d="M1 1 L7 7 L1 13" stroke="var(--ink-40)" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      </svg>
    </div>
  )
}

export default function MyPage() {
  const router = useRouter()

  const activeRequests = MOCK_MY_REQUESTS.filter(r => r.status === 'APPROVED' || r.status === 'PENDING')
  const myRides = MOCK_RIDES.filter(r => r.driver_id === MOCK_USER.id && (r.status === 'OPEN' || r.status === 'FULL'))
  const totalUsage = MOCK_MY_REQUESTS.length + myRides.length
  const activeCount = activeRequests.length + myRides.length

  return (
    <div className="page-layout">
      <div className="detail-topbar">
        <div style={{ width: 32 }} />
        <span className="detail-topbar-title">마이페이지</span>
        <button style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
          <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
            <circle cx="11" cy="11" r="3" stroke="var(--ink-80)" strokeWidth="1.7" fill="none" />
            <path d="M11 2 L11 5 M11 17 L11 20 M2 11 L5 11 M17 11 L20 11 M4.5 4.5 L6.5 6.5 M15.5 15.5 L17.5 17.5 M4.5 17.5 L6.5 15.5 M15.5 6.5 L17.5 4.5" stroke="var(--ink-80)" strokeWidth="1.7" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="my-body">
        {/* 프로필 카드 */}
        <div className="my-profile-card">
          <div className="my-profile-illust">
            <svg width="110" height="110" viewBox="0 0 110 110" fill="none" opacity="0.85">
              <circle cx="55" cy="30" r="22" fill="var(--mint)" fillOpacity="0.9" />
              <ellipse cx="55" cy="82" rx="32" ry="28" fill="var(--mint)" fillOpacity="0.9" />
              <rect x="70" y="48" width="18" height="28" rx="5" fill="var(--mint)" fillOpacity="0.7" />
              <rect x="68" y="42" width="10" height="14" rx="5" fill="var(--mint)" fillOpacity="0.7" />
            </svg>
          </div>
          <span className="my-approved-badge">✓ 승인 완료</span>
          <div className="hand my-profile-name">{MOCK_USER.name}</div>
          <div className="my-profile-sub" style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span>{MOCK_USER.department}</span>
            {MOCK_USER.gender && (
              <span style={{ fontSize: 10.5, fontWeight: 700, padding: '2px 8px', borderRadius: 999, background: MOCK_USER.gender === 'F' ? 'rgba(255,228,239,0.9)' : 'rgba(228,238,255,0.9)', color: MOCK_USER.gender === 'F' ? '#C0185A' : '#1A38F5' }}>
                {MOCK_USER.gender === 'F' ? '여성' : '남성'}
              </span>
            )}
            <span>{MOCK_USER.phone.replace(/(\d{3})-(\d{4})-(\d{4})/, '$1-****-$3')}</span>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 14 }}>
            <StatBox value={totalUsage} label="이용" />
            <StatBox value={activeCount} label="진행중" />
            <StatBox value="4.9" label="신뢰도" />
          </div>
        </div>

        {/* 진행중 라이드 */}
        {(activeRequests.length > 0 || myRides.length > 0) && (
          <div>
            <SectionHead title="진행중인 라이드" right="전체 보기" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, padding: '0 16px' }}>
              {activeRequests.map(req => (
                <ActiveRideCard key={req.id} rideId={req.ride_id} status={req.status === 'APPROVED' ? '확정' : '대기중'} />
              ))}
              {myRides.map(ride => <ActiveRideCard key={ride.id} rideId={ride.id} status="모집중" />)}
            </div>
          </div>
        )}

        {/* 내 활동 */}
        <div>
          <SectionHead title="내 활동" />
          <div className="my-menu-group">
            <MenuRow icon="📝" label="내가 쓴 게시글" count={myRides.length} onClick={() => {}} />
            <MenuRow icon="🙋" label="내가 신청한 라이드" count={MOCK_MY_REQUESTS.length} onClick={() => {}} />
            <MenuRow icon="🚨" label="신고·분쟁 내역" last onClick={() => {}} />
          </div>
        </div>

        {/* 계정 */}
        <div>
          <SectionHead title="계정" />
          <div className="my-menu-group">
            <MenuRow icon="🛡️" label="개인정보 처리방침" onClick={() => router.push('/privacy')} />
            <MenuRow icon="📑" label="이용약관" onClick={() => router.push('/terms')} />
            <MenuRow icon="📍" label="위치정보 이용약관" onClick={() => router.push('/location-terms')} />
            <MenuRow icon="💬" label="문의하기 (카카오톡 채널)"
              right={<span className="post-badge post-badge--mint" style={{ marginRight: 4 }}>연결</span>}
              onClick={() => {}} />
            <MenuRow icon="🚪" label="로그아웃" last onClick={() => router.push('/login')} />
          </div>
        </div>

        <div className="my-disclaimer">
          PPOOL은 <b>지파 청년부 내부 유류비 분담</b> 서비스입니다.<br />
          운행 중 사고·분쟁 책임은 당사자에게 있으며, 플랫폼은 매칭만 제공합니다.
        </div>
        <div style={{ textAlign: 'center', fontSize: 10.5, color: 'var(--ink-40)', paddingBottom: 90 }}>
          PPOOL v0.1.0 MVP · made by ZIPA 청년부 정통부
        </div>
      </div>

      <BottomNav />
    </div>
  )
}
