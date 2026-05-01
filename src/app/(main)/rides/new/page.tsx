'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { BottomNav } from '../../../../components/layout/BottomNav'
import type { RideType } from '../../../../types'

interface FormState {
  origin: string
  destination: string
  date: string
  time: string
  seats: number
  estimatedFare: string   // 택시합승 예상 요금(인당), '' = 미설정
  genderPref: 'ANY' | 'SAME_ONLY'
  notice: string
}

function StepLabel({ num, color, children }: { num: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{ width: 20, height: 20, borderRadius: 6, background: color, color: '#fff', fontSize: 11, fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</div>
      <div style={{ fontSize: 15, fontWeight: 800, color: 'var(--ink-100)' }}>{children}</div>
    </div>
  )
}

function FieldBox({ label, children }: { label?: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      {label && <div style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ink-60)' }}>{label}</div>}
      {children}
    </div>
  )
}

const now = new Date()
const pad = (n: number) => String(n).padStart(2, '0')
const defaultDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
const defaultTime = `${pad(now.getHours() + 1)}:00`

function RideNewPageInner() {
  const router = useRouter()
  const params = useSearchParams()

  // URL ?type=taxi 로 진입 시 택시합승 기본 선택
  const [rideType, setRideType] = useState<RideType>(
    params.get('type') === 'taxi' ? 'TAXI' : 'CARPOOL'
  )

  const [form, setForm] = useState<FormState>({
    origin: '', destination: '', date: defaultDate, time: defaultTime,
    seats: rideType === 'TAXI' ? 3 : 3,
    estimatedFare: '',
    genderPref: 'ANY',
    notice: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState | 'type', string>>>({})

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const swapRoute = () => setForm(p => ({ ...p, origin: p.destination, destination: p.origin }))

  const isTaxi = rideType === 'TAXI'
  const accentColor = isTaxi ? '#8B5CF6' : 'var(--driver)'
  const accentSoft = isTaxi ? '#F3EEFF' : 'var(--driver-soft)'

  const validate = () => {
    const e: typeof errors = {}
    if (!form.origin.trim()) e.origin = '출발지를 입력해주세요'
    if (!form.destination.trim()) e.destination = '도착지를 입력해주세요'
    if (form.estimatedFare && isNaN(Number(form.estimatedFare))) e.estimatedFare = '숫자만 입력해주세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    alert(`${isTaxi ? '택시합승' : '카풀'} 게시글 등록 완료!\n(백엔드 연결 후 실제 저장 예정)`)
    router.push('/feed')
  }

  return (
    <div className="page-layout">
      <div className="detail-topbar">
        <button className="detail-back-btn tap" onClick={() => router.back()}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1 L1 9 L9 17" stroke="var(--ink-100)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="detail-topbar-title">게시글 등록</span>
        <div style={{ width: 60 }} />
      </div>

      <div className="write-body">

        {/* ── 타입 선택 ── */}
        <section className="write-section" style={{ paddingBottom: 0 }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <button
              type="button"
              className="tap"
              onClick={() => setRideType('CARPOOL')}
              style={{
                padding: '14px 8px',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${rideType === 'CARPOOL' ? 'var(--driver)' : 'var(--ink-20)'}`,
                background: rideType === 'CARPOOL' ? 'var(--driver-soft)' : 'var(--ink-5)',
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 22 }}>🚗</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: rideType === 'CARPOOL' ? 'var(--driver-ink)' : 'var(--ink-60)' }}>카풀</div>
                <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 1 }}>내 차로 운전</div>
              </div>
            </button>

            <button
              type="button"
              className="tap"
              onClick={() => setRideType('TAXI')}
              style={{
                padding: '14px 8px',
                borderRadius: 'var(--radius-md)',
                border: `2px solid ${isTaxi ? '#8B5CF6' : 'var(--ink-20)'}`,
                background: isTaxi ? '#F3EEFF' : 'var(--ink-5)',
                display: 'flex', alignItems: 'center', gap: 10,
                cursor: 'pointer', fontFamily: 'inherit',
              }}
            >
              <span style={{ fontSize: 22 }}>🚕</span>
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontSize: 13, fontWeight: 800, color: isTaxi ? '#7C3AED' : 'var(--ink-60)' }}>택시합승</div>
                <div style={{ fontSize: 11, color: 'var(--ink-40)', marginTop: 1 }}>같이 택시 타요</div>
              </div>
            </button>
          </div>

          {/* 타입 안내 */}
          <div style={{ marginTop: 10, padding: '10px 14px', borderRadius: 'var(--radius-sm)', background: accentSoft, fontSize: 12, color: 'var(--ink-60)', lineHeight: 1.5 }}>
            {isTaxi
              ? '🚕 택시합승: 같이 택시 탈 분을 모집해요. 실제 택시 요금을 인원 수로 나눠 정산해요.'
              : '🚗 카풀: 운전자 등록이 필요합니다. 분담금은 인당 3,000원(유류비 분담)으로 고정돼요.'}
          </div>
        </section>

        {/* ── 경로 ── */}
        <section className="write-section">
          <StepLabel num="1" color={accentColor}>어디서 → 어디로?</StepLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <FieldBox label="출발지">
              <div className="write-input-wrap" style={{ borderColor: errors.origin ? 'var(--warn)' : undefined }}>
                <input className="write-input" placeholder="예) 강남역 11번 출구" value={form.origin} onChange={e => set('origin', e.target.value)} />
              </div>
              {errors.origin && <div className="error">{errors.origin}</div>}
            </FieldBox>
            <div style={{ display: 'flex', justifyContent: 'center', height: 0, position: 'relative', zIndex: 2 }}>
              <button className="write-swap-btn tap" onClick={swapRoute}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 2 L8 14 M3 6 L8 1 L13 6 M3 10 L8 15 L13 10" stroke="var(--ink-60)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </button>
            </div>
            <FieldBox label="도착지">
              <div className="write-input-wrap" style={{ marginTop: 4, borderColor: errors.destination ? 'var(--warn)' : undefined }}>
                <input className="write-input" placeholder="예) 지파교회 청년부실" value={form.destination} onChange={e => set('destination', e.target.value)} />
              </div>
              {errors.destination && <div className="error">{errors.destination}</div>}
            </FieldBox>
          </div>
        </section>

        {/* ── 출발 시각 ── */}
        <section className="write-section">
          <StepLabel num="2" color={accentColor}>언제 출발해요?</StepLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <FieldBox label="날짜">
              <div className="write-input-wrap">
                <input className="write-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
              </div>
            </FieldBox>
            <FieldBox label="시간">
              <div className="write-input-wrap">
                <input className="write-input" type="time" value={form.time} onChange={e => set('time', e.target.value)} />
              </div>
            </FieldBox>
          </div>
        </section>

        {/* ── 인원 ── */}
        <section className="write-section">
          <StepLabel num="3" color={accentColor}>
            {isTaxi ? '몇 명 같이 탈 수 있어요?' : '몇 명 태울 수 있어요?'}
          </StepLabel>
          <FieldBox label={isTaxi ? '모집 인원 (본인 제외)' : '탑승 인원 (본인 제외)'}>
            <div className="write-input-wrap write-spinner-wrap">
              <button className="write-spinner-btn tap" onClick={() => set('seats', Math.max(1, form.seats - 1))}>−</button>
              <span className="write-spinner-val">{form.seats} 명</span>
              <button className="write-spinner-btn tap" onClick={() => set('seats', Math.min(8, form.seats + 1))}>+</button>
            </div>
          </FieldBox>
        </section>

        {/* ── 요금 (택시합승만) ── */}
        {isTaxi && (
          <section className="write-section">
            <StepLabel num="4" color={accentColor}>예상 분담금 <span style={{ fontSize: 12, color: 'var(--ink-40)', fontWeight: 600 }}>(선택)</span></StepLabel>
            <FieldBox label="인당 예상 금액 (원)">
              <div className="write-input-wrap">
                <input
                  className="write-input"
                  type="number"
                  inputMode="numeric"
                  placeholder="예) 15000 (비워두면 현장 N빵으로 표시)"
                  value={form.estimatedFare}
                  onChange={e => set('estimatedFare', e.target.value)}
                />
              </div>
              {errors.estimatedFare && <div className="error">{errors.estimatedFare}</div>}
            </FieldBox>
            <div style={{ fontSize: 11.5, color: 'var(--ink-40)', lineHeight: 1.5, marginTop: -4 }}>
              비워두면 피드에 &apos;N빵&apos;으로 표시됩니다. 실제 정산은 탑승자끼리 직접 해주세요.
            </div>
          </section>
        )}

        {/* ── 성별 매칭 ── */}
        <section className="write-section">
          <StepLabel num={isTaxi ? '5' : '4'} color={accentColor}>성별 매칭</StepLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            {(['ANY', 'SAME_ONLY'] as const).map(v => (
              <button
                key={v}
                type="button"
                className="tap"
                onClick={() => set('genderPref', v)}
                style={{
                  padding: '12px 8px',
                  borderRadius: 'var(--radius-sm)',
                  border: `1.5px solid ${form.genderPref === v ? accentColor : 'var(--ink-20)'}`,
                  background: form.genderPref === v ? accentSoft : 'var(--ink-5)',
                  fontSize: 13, fontWeight: 700,
                  color: form.genderPref === v ? accentColor : 'var(--ink-60)',
                  cursor: 'pointer', fontFamily: 'inherit',
                }}
              >
                {v === 'ANY' ? '성별 무관' : '동성만'}
              </button>
            ))}
          </div>
        </section>

        {/* ── 메모 ── */}
        <section className="write-section">
          <StepLabel num={isTaxi ? '6' : '5'} color={accentColor}>
            하고 싶은 말 <span style={{ fontSize: 12, color: 'var(--ink-40)', fontWeight: 600 }}>(선택)</span>
          </StepLabel>
          <div style={{ position: 'relative' }}>
            <textarea
              className="write-textarea"
              placeholder={isTaxi ? '예) 3명 모이면 바로 콜택시 부를게요!' : '예) 11번 출구 앞에서 기다릴게요.'}
              value={form.notice}
              maxLength={120}
              onChange={e => set('notice', e.target.value)}
            />
            <div className="write-char-count">{form.notice.length} / 120</div>
          </div>
        </section>

        <div style={{ height: 120 }} />
      </div>

      <div className="write-bottom-cta">
        <button
          className="detail-cta-primary tap"
          style={{ background: accentColor }}
          onClick={handleSubmit}
        >
          {isTaxi ? '🚕 택시합승 모집 등록' : '🚗 카풀 등록하기'}
        </button>
      </div>

      <BottomNav />
    </div>
  )
}

export default function RideNewPage() {
  return (
    <Suspense>
      <RideNewPageInner />
    </Suspense>
  )
}
