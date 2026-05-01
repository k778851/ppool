'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { BottomNav } from '../../../components/layout/BottomNav'
import { RideCard } from '../../../components/ride/RideCard'
import { MOCK_RIDES, MOCK_USER } from '../../../lib/mock'

type FilterType = 'all' | 'carpool' | 'taxi' | 'available' | 'female'

export default function FeedPage() {
  const router = useRouter()
  const [activeFilter, setActiveFilter] = useState<FilterType>('all')

  const filtered = useMemo(() => {
    return MOCK_RIDES.filter(ride => {
      if (ride.status === 'CANCELLED' || ride.status === 'COMPLETED') return false
      if (activeFilter === 'carpool' && ride.ride_type !== 'CARPOOL') return false
      if (activeFilter === 'taxi' && ride.ride_type !== 'TAXI') return false
      if (activeFilter === 'available' && (ride.status === 'FULL' || ride.current_seats >= ride.max_seats)) return false
      if (activeFilter === 'female' && ride.gender_preference !== 'SAME_ONLY') return false
      return true
    }).sort((a, b) => new Date(a.departure_time).getTime() - new Date(b.departure_time).getTime())
  }, [activeFilter])

  const FILTERS: { key: FilterType; label: string; dot?: string }[] = [
    { key: 'all',       label: '전체' },
    { key: 'carpool',   label: '🚗 카풀',    dot: 'var(--driver)' },
    { key: 'taxi',      label: '🚕 택시합승', dot: '#8B5CF6' },
    { key: 'available', label: '잔여석 있는' },
    { key: 'female',    label: '동성매칭' },
  ]

  return (
    <div className="page-layout">
      {/* ── 히어로 헤더 ── */}
      <div className="hero-header">
        <div className="hero-car-bg">
          <svg width="120" height="72" viewBox="0 0 120 72" fill="none">
            <rect x="8" y="28" width="96" height="30" rx="10" fill="var(--mint)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            <rect x="20" y="12" width="68" height="28" rx="8" fill="var(--mint)" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" />
            <circle cx="28" cy="60" r="10" fill="#0A1EC7" stroke="#fff" strokeWidth="2" />
            <circle cx="28" cy="60" r="4.5" fill="#fff" />
            <circle cx="86" cy="60" r="10" fill="#0A1EC7" stroke="#fff" strokeWidth="2" />
            <circle cx="86" cy="60" r="4.5" fill="#fff" />
            <rect x="26" y="16" width="24" height="20" rx="4" fill="rgba(255,255,255,0.32)" />
            <rect x="56" y="16" width="24" height="20" rx="4" fill="rgba(255,255,255,0.32)" />
            <path d="M100 36 L112 36 L116 44 L112 54 L100 54" fill="var(--driver)" stroke="rgba(255,255,255,0.5)" strokeWidth="1" />
          </svg>
        </div>

        <div className="hero-logo-row">
          <img src="/logo.png" alt="PPOOL" className="hero-logo-img" />
          <button className="hero-bell-btn tap" aria-label="알림">
            <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
              <path d="M11 3 C7.5 3 5 5.5 5 9 L5 13 L3 16 L19 16 L17 13 L17 9 C17 5.5 14.5 3 11 3 Z" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
              <path d="M9 18 C9 19.5 10 20.5 11 20.5 C12 20.5 13 19.5 13 18" stroke="#fff" strokeWidth="1.8" strokeLinecap="round" fill="none" />
            </svg>
          </button>
        </div>

        <div className="hero-greeting">
          <div className="hand hero-name">안녕, {MOCK_USER.name} 👋</div>
          <div className="hero-sub">오늘 예배, 누구랑 같이 가볼까?</div>
        </div>

        {/* CTA: 3개 버튼 */}
        <div className="hero-cta hero-cta-3">
          {/* 카풀 운전자 */}
          <button
            className="hero-cta-btn hero-cta-driver tap"
            onClick={() => router.push(MOCK_USER.is_driver ? '/rides/new?type=carpool' : '/my/driver')}
          >
            <div className="hero-cta-icon-wrap">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <path d="M3 14 L3 10 L6 5 L14 5 L17 10 L17 14 M5 14 L5 16 M15 14 L15 16" stroke="#fff" strokeWidth="1.8" strokeLinejoin="round" fill="none" />
                <circle cx="6.5" cy="13" r="1.4" fill="#fff" />
                <circle cx="13.5" cy="13" r="1.4" fill="#fff" />
              </svg>
            </div>
            <div>
              <div className="hero-cta-title">카풀 등록</div>
              <div className="hero-cta-sub">내 차로 운전</div>
            </div>
          </button>

          {/* 택시합승 */}
          <button
            className="hero-cta-btn tap"
            style={{ background: 'linear-gradient(135deg,#7C3AED,#5B21B6)' }}
            onClick={() => router.push('/rides/new?type=taxi')}
          >
            <div className="hero-cta-icon-wrap">
              {/* 택시 아이콘 */}
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                <rect x="2" y="8" width="16" height="8" rx="3" fill="none" stroke="#fff" strokeWidth="1.7" />
                <path d="M5 8 L7 4 L13 4 L15 8" stroke="#fff" strokeWidth="1.7" strokeLinejoin="round" fill="none" />
                <circle cx="5.5" cy="16.5" r="1.5" fill="#fff" />
                <circle cx="14.5" cy="16.5" r="1.5" fill="#fff" />
                <rect x="8" y="3" width="4" height="1.5" rx="0.5" fill="#fff" />
              </svg>
            </div>
            <div>
              <div className="hero-cta-title">택시 모집</div>
              <div className="hero-cta-sub">같이 택시 타요</div>
            </div>
          </button>

          {/* 탑승 신청 */}
          <button className="hero-cta-btn hero-cta-rider tap" onClick={() => setActiveFilter('available')}>
            <div className="hero-cta-icon-wrap">
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="6" r="3" stroke="#fff" strokeWidth="1.7" fill="none" />
                <path d="M2 17 C2 12.5 5 10 9 10 C13 10 16 12.5 16 17" stroke="#fff" strokeWidth="1.7" strokeLinecap="round" fill="none" />
              </svg>
            </div>
            <div>
              <div className="hero-cta-title">탑승 신청</div>
              <div className="hero-cta-sub">탑승자 등록</div>
            </div>
          </button>
        </div>
      </div>

      {/* ── 필터 칩 ── */}
      <div className="feed-filter noscroll">
        {FILTERS.map(f => (
          <button
            key={f.key}
            className={`feed-chip tap${activeFilter === f.key ? ' active' : ''}`}
            onClick={() => setActiveFilter(f.key)}
            style={activeFilter === f.key && f.dot ? { background: f.dot, borderColor: f.dot } : undefined}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* ── 피드 ── */}
      <div className="feed-body">
        <div className="feed-meta">
          <span className="feed-count">총 {filtered.length}건</span>
          <span className="feed-sort">출발 빠른 순 ∨</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, padding: '0 16px 90px' }}>
          {filtered.length === 0 ? (
            <div className="feed-empty">
              <p>조건에 맞는 게시글이 없습니다.</p>
              <p className="text-muted">필터를 바꿔보거나 직접 게시글을 올려보세요.</p>
            </div>
          ) : (
            filtered.map(ride => (
              <RideCard key={ride.id} ride={ride} isMyRide={ride.driver_id === MOCK_USER.id} />
            ))
          )}

          {/* 안내 카드 */}
          <div className="notice-card">
            <div style={{ flexShrink: 0, width: 44, height: 44, borderRadius: '50%', background: 'rgba(10,30,199,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
                <path d="M4 5 L18 5 L18 15 L11 15 L8 18 L8 15 L4 15 Z" stroke="var(--blue-hero-deep)" strokeWidth="1.8" fill="none" strokeLinejoin="round" />
                <circle cx="11" cy="10" r="1.5" fill="var(--blue-hero-deep)" />
              </svg>
            </div>
            <div>
              <div className="notice-text-main">카풀 분담금 3,000원 · 택시는 실비 N빵</div>
              <div className="notice-text-sub">카풀은 유류비 분담 목적 · 영리 운송 아님</div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-cta-3 {
          grid-template-columns: 1fr 1fr 1fr !important;
        }
      `}</style>

      <BottomNav />
    </div>
  )
}
