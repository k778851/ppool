'use client'

import { useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { BottomNav } from '../../../../components/layout/BottomNav'
import { MOCK_RIDES, MOCK_USER, MOCK_MY_REQUESTS, MOCK_REQUESTS_TO_MY_RIDE } from '../../../../lib/mock'
import { formatDateTime, formatRelativeTime } from '../../../../lib/utils'

export default function RideDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()

  const ride = MOCK_RIDES.find(r => r.id === id)
  const myRequest = MOCK_MY_REQUESTS.find(r => r.ride_id === id) ?? null
  const isMyRide = ride?.driver_id === MOCK_USER.id
  const applicants = isMyRide ? MOCK_REQUESTS_TO_MY_RIDE.filter(r => r.ride_id === id) : []

  const [requestState, setRequestState] = useState<'none' | 'pending' | 'approved' | 'cancelled'>(
    myRequest?.status === 'APPROVED' ? 'approved'
    : myRequest?.status === 'PENDING' ? 'pending'
    : 'none'
  )

  if (!ride) {
    return (
      <div className="page-center">
        <p>게시글을 찾을 수 없습니다.</p>
        <button className="btn-primary" style={{ maxWidth: 200 }} onClick={() => router.push('/feed')}>홈으로</button>
      </div>
    )
  }

  const isTaxi = ride.ride_type === 'TAXI'
  const isFull = ride.status === 'FULL' || ride.current_seats >= ride.max_seats
  const remaining = ride.max_seats - ride.current_seats
  const organizer = ride.driver   // TAXI의 경우 모집자, CARPOOL의 경우 운전자
  const vehicle = ride.vehicle

  // 색상
  const accentColor = isMyRide ? 'var(--blue-hero)' : isTaxi ? '#8B5CF6' : 'var(--driver)'
  const accentSoft = isTaxi ? '#F3EEFF' : 'var(--driver-soft)'

  // 분담금 표시
  const fareDisplay = isTaxi
    ? (ride.fare_per_person > 0
        ? `≈₩${ride.fare_per_person.toLocaleString()}`
        : '현장 N빵')
    : `₩${ride.fare_per_person.toLocaleString()}`
  const fareSub = isTaxi
    ? (ride.fare_per_person > 0 ? '예상 · 인당' : '실제 택시비 정산')
    : '정액 · 인당'

  return (
    <div className="page-layout">
      {/* TopBar */}
      <div className="detail-topbar">
        <button className="detail-back-btn tap" onClick={() => router.back()}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1 L1 9 L9 17" stroke="var(--ink-100)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="detail-topbar-title">
          {isMyRide ? '내 게시글' : isTaxi ? '택시합승' : '카풀'}
        </span>
        <div style={{ width: 32 }} />
      </div>

      {/* 히어로 배너 */}
      <div className="detail-hero" style={{ background: accentColor }}>
        <div className="detail-hero-car">
          {isTaxi ? (
            /* 택시 SVG */
            <svg width="130" height="78" viewBox="0 0 130 78" fill="none">
              <rect x="10" y="26" width="110" height="36" rx="14" fill="#fff" fillOpacity="0.18" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" />
              <rect x="24" y="10" width="76" height="30" rx="9" fill="#fff" fillOpacity="0.18" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" />
              {/* 체커 무늬 */}
              <rect x="10" y="38" width="8" height="8" fill="#fff" fillOpacity="0.35" />
              <rect x="18" y="38" width="8" height="8" fill="#fff" fillOpacity="0.15" />
              <rect x="26" y="38" width="8" height="8" fill="#fff" fillOpacity="0.35" />
              <rect x="34" y="38" width="8" height="8" fill="#fff" fillOpacity="0.15" />
              <circle cx="32" cy="64" r="11" fill="#fff" fillOpacity="0.28" stroke="#fff" strokeWidth="2" />
              <circle cx="32" cy="64" r="5" fill="#fff" fillOpacity="0.6" />
              <circle cx="98" cy="64" r="11" fill="#fff" fillOpacity="0.28" stroke="#fff" strokeWidth="2" />
              <circle cx="98" cy="64" r="5" fill="#fff" fillOpacity="0.6" />
              {/* 택시 표시등 */}
              <rect x="50" y="4" width="30" height="10" rx="4" fill="#fff" fillOpacity="0.5" />
              <text x="65" y="12" textAnchor="middle" fill={accentColor} fontSize="7" fontWeight="bold">TAXI</text>
              <rect x="30" y="14" width="26" height="20" rx="4" fill="rgba(255,255,255,0.25)" />
              <rect x="64" y="14" width="26" height="20" rx="4" fill="rgba(255,255,255,0.25)" />
            </svg>
          ) : (
            /* 카풀 기존 SVG */
            <svg width="130" height="78" viewBox="0 0 130 78" fill="none">
              <rect x="8" y="28" width="108" height="34" rx="12" fill="#fff" fillOpacity="0.2" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" />
              <rect x="22" y="10" width="78" height="30" rx="9" fill="#fff" fillOpacity="0.2" stroke="#fff" strokeOpacity="0.4" strokeWidth="1.5" />
              <circle cx="30" cy="64" r="11" fill="#fff" fillOpacity="0.3" stroke="#fff" strokeWidth="2" />
              <circle cx="30" cy="64" r="5" fill="#fff" fillOpacity="0.6" />
              <circle cx="96" cy="64" r="11" fill="#fff" fillOpacity="0.3" stroke="#fff" strokeWidth="2" />
              <circle cx="96" cy="64" r="5" fill="#fff" fillOpacity="0.6" />
              <rect x="28" y="14" width="28" height="22" rx="4" fill="rgba(255,255,255,0.28)" />
              <rect x="62" y="14" width="28" height="22" rx="4" fill="rgba(255,255,255,0.28)" />
            </svg>
          )}
        </div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <span className="detail-hero-badge">
            {isMyRide ? '⭐ MY' : isTaxi ? '🚕 TAXI' : '🚗 CARPOOL'}
          </span>
          <div className="detail-hero-route">
            {ride.origin.split(' ').slice(-1)[0]} → {ride.destination.split(' ').slice(-1)[0]}
          </div>
          <div className="detail-hero-time">
            {formatDateTime(ride.departure_time)}
            <span style={{ opacity: 0.8, marginLeft: 6 }}>({formatRelativeTime(ride.departure_time)} 출발)</span>
          </div>
        </div>
      </div>

      {/* 본문 */}
      <div className="detail-body">
        {/* 경로 */}
        <section className="detail-section">
          <div className="detail-section-title">경로</div>
          <div className="detail-route">
            <div className="detail-route-line">
              <div className="detail-route-dot" />
              <div className="detail-route-connector" />
              <div className="detail-route-diamond" style={{ background: accentColor }} />
            </div>
            <div className="detail-route-text">
              <div><div className="detail-route-label">출발</div><div className="detail-route-addr">{ride.origin}</div></div>
              <div><div className="detail-route-label">도착</div><div className="detail-route-addr">{ride.destination}</div></div>
            </div>
          </div>
          <div className="detail-map-placeholder"><span>🗺 카카오맵 경로 미리보기</span></div>
        </section>

        {/* 정보 그리드 */}
        <div className="detail-info-grid">
          <div className="detail-info-tile">
            <div className="detail-info-label">{isTaxi ? '예상 분담금' : '분담금'}</div>
            <div className="detail-info-value">{fareDisplay}</div>
            <div className="detail-info-sub">{fareSub}</div>
          </div>
          <div className="detail-info-tile">
            <div className="detail-info-label">남은 좌석</div>
            <div className="detail-info-value" style={{ color: isFull ? 'var(--ink-40)' : accentColor }}>
              {isFull ? '마감' : `${remaining}석`}
            </div>
            <div className="detail-info-sub">총 {ride.max_seats}석 중</div>
          </div>
          {isTaxi ? (
            <div className="detail-info-tile">
              <div className="detail-info-label">유형</div>
              <div className="detail-info-value" style={{ fontSize: 14 }}>택시합승</div>
              <div className="detail-info-sub">일반 택시 이용</div>
            </div>
          ) : (
            <div className="detail-info-tile">
              <div className="detail-info-label">차량</div>
              <div className="detail-info-value">{vehicle?.car_model ?? '-'}</div>
              <div className="detail-info-sub">{vehicle?.car_number ?? '-'}</div>
            </div>
          )}
          <div className="detail-info-tile">
            <div className="detail-info-label">성별 매칭</div>
            <div className="detail-info-value" style={{ fontSize: 14 }}>{ride.gender_preference === 'SAME_ONLY' ? '동성만' : '무관'}</div>
            <div className="detail-info-sub">자유 취소 30분 전</div>
          </div>
        </div>

        {/* 택시합승 안내 */}
        {isTaxi && (
          <section className="detail-section">
            <div style={{ padding: '12px 16px', background: '#F3EEFF', borderRadius: 'var(--radius-md)', fontSize: 13, color: '#5B21B6', lineHeight: 1.6 }}>
              <div style={{ fontWeight: 700, marginBottom: 4 }}>🚕 택시합승 안내</div>
              <div>• 택시 요금은 탑승자끼리 현장에서 직접 정산해요.</div>
              <div>• 모집자가 콜택시 또는 일반 택시를 이용해요.</div>
              <div>• 출발 10분 전 취소 시 노쇼로 기록돼요.</div>
            </div>
          </section>
        )}

        {/* 운전자 / 모집자 */}
        <section className="detail-section">
          <div className="detail-section-title">{isTaxi ? '모집자' : '운전자'}</div>
          <div className="detail-driver-card">
            <div
              className="detail-driver-avatar"
              style={{ background: organizer?.gender === 'F' ? 'var(--rider-soft)' : isTaxi ? '#F3EEFF' : 'var(--driver-soft)' }}
            >
              {organizer?.name?.charAt(0) ?? '?'}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 6 }}>
                {organizer?.name}
                <span className="post-badge post-badge--mint" style={{ fontSize: 10.5 }}>인증</span>
                {organizer?.gender && organizer.gender !== 'N' && (
                  <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 999, background: organizer.gender === 'F' ? '#FFE4EF' : '#E4EEFF', color: organizer.gender === 'F' ? '#C0185A' : '#1A38F5' }}>
                    {organizer.gender === 'F' ? '여성' : '남성'}
                  </span>
                )}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ink-60)', marginTop: 2 }}>
                {organizer?.department} · {isTaxi ? '택시 모집자' : (isMyRide ? '직접 등록' : '운전자')}
              </div>
            </div>
          </div>
        </section>

        {/* 신청자 목록 (내 게시글) */}
        {isMyRide && (
          <section className="detail-section">
            <div className="detail-section-title">신청자 {applicants.length}명</div>
            {applicants.length === 0 ? (
              <div style={{ fontSize: 13, color: 'var(--ink-60)', padding: '12px 0' }}>아직 신청자가 없습니다.</div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 10 }}>
                {applicants.map(req => (
                  <div key={req.id} className="detail-applicant-row">
                    <div className="detail-driver-avatar" style={{ width: 38, height: 38, fontSize: 13, background: req.passenger?.gender === 'F' ? 'var(--rider-soft)' : 'var(--driver-soft)' }}>
                      {req.passenger?.name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center', gap: 5 }}>
                        {req.passenger?.name}
                        {req.passenger?.gender && req.passenger.gender !== 'N' && (
                          <span style={{ fontSize: 10, fontWeight: 700, padding: '1px 6px', borderRadius: 999, background: req.passenger.gender === 'F' ? '#FFE4EF' : '#E4EEFF', color: req.passenger.gender === 'F' ? '#C0185A' : '#1A38F5' }}>
                            {req.passenger.gender === 'F' ? '여' : '남'}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: 11.5, color: 'var(--ink-60)' }}>{req.passenger?.department} · {req.pickup_location}</div>
                    </div>
                    <span className={`post-badge ${req.status === 'APPROVED' ? 'post-badge--mint' : 'post-badge--neutral'}`}>
                      {req.status === 'APPROVED' ? '확정' : '대기중'}
                    </span>
                    {req.status === 'PENDING' && (
                      <div style={{ display: 'flex', gap: 6, marginLeft: 6 }}>
                        <button className="detail-action-btn detail-action-approve tap">승인</button>
                        <button className="detail-action-btn detail-action-reject tap">거절</button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 메모 */}
        {ride.notice && (
          <section className="detail-section">
            <div className="detail-section-title">메모</div>
            <div className="detail-notice-box" style={{ background: isMyRide ? 'var(--rider-soft)' : accentSoft, color: isMyRide ? 'var(--rider-ink)' : (isTaxi ? '#5B21B6' : 'var(--driver-ink)') }}>
              {ride.notice}
            </div>
          </section>
        )}

        <div className="detail-legal">
          <span style={{ fontSize: 14, marginRight: 6 }}>ℹ️</span>
          <div>
            {isTaxi
              ? '택시합승은 정규 택시 이용이며, 실제 택시 요금을 인원수로 나눠 정산합니다.'
              : '본 서비스는 지파 청년부 내부 유류비 분담 목적의 카풀 서비스입니다.'}
          </div>
        </div>
        <div style={{ height: 100 }} />
      </div>

      {/* 하단 CTA */}
      <div className="detail-bottom-cta">
        {isMyRide ? (
          <button
            className="detail-cta-primary tap"
            style={{ background: accentColor }}
            onClick={() => alert('출발 처리 (구현 예정)')}
          >
            {isTaxi ? '🚕 택시 출발하기' : '🚗 출발하기'}
          </button>
        ) : requestState === 'approved' ? (
          <button className="detail-cta-ghost tap" onClick={() => setRequestState('none')}>
            ✅ {isTaxi ? '합승' : '탑승'} 확정 · 취소하기
          </button>
        ) : requestState === 'pending' ? (
          <button className="detail-cta-ghost tap" onClick={() => setRequestState('none')}>
            ⏳ 신청 검토중 · 취소하기
          </button>
        ) : isFull ? (
          <button className="detail-cta-primary tap" disabled style={{ background: 'var(--ink-20)', color: 'var(--ink-60)', cursor: 'not-allowed' }}>
            마감된 게시글입니다
          </button>
        ) : (
          <button
            className="detail-cta-primary tap"
            style={{ background: accentColor }}
            onClick={() => setRequestState('pending')}
          >
            {isTaxi
              ? `🚕 택시합승 신청하기${ride.fare_per_person > 0 ? ` (≈₩${ride.fare_per_person.toLocaleString()})` : ' (현장 N빵)'}`
              : `₩${ride.fare_per_person.toLocaleString()} 에 신청하기`}
          </button>
        )}
      </div>

      <BottomNav />
    </div>
  )
}
