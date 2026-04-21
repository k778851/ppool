import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { BottomNav } from '../components/layout/BottomNav'

type TripType = 'oneway' | 'regular' | 'roundtrip'

interface FormState {
  origin: string
  destination: string
  date: string
  time: string
  seats: number
  tripType: TripType
  notice: string
}

function StepLabel({ num, color, children }: { num: string; color: string; children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
      <div style={{
        width: 20, height: 20, borderRadius: 6,
        background: color, color: '#fff',
        fontSize: 11, fontWeight: 800,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>{num}</div>
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

function InputCell({
  label, value, onChange, placeholder, type = 'text', readOnly,
}: {
  label?: string
  value: string | number
  onChange?: (v: string) => void
  placeholder?: string
  type?: string
  readOnly?: boolean
}) {
  return (
    <FieldBox label={label}>
      <div className="write-input-wrap">
        <input
          className="write-input"
          type={type}
          value={value}
          placeholder={placeholder}
          readOnly={readOnly}
          onChange={e => onChange?.(e.target.value)}
        />
      </div>
    </FieldBox>
  )
}

// 오늘 날짜/시간 기본값
const now = new Date()
const pad = (n: number) => String(n).padStart(2, '0')
const defaultDate = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
const defaultTime = `${pad(now.getHours() + 1)}:00`

export function RideNewPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState<FormState>({
    origin: '',
    destination: '',
    date: defaultDate,
    time: defaultTime,
    seats: 3,
    tripType: 'oneway',
    notice: '',
  })
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setForm(prev => ({ ...prev, [key]: value }))

  const swapRoute = () => setForm(p => ({ ...p, origin: p.destination, destination: p.origin }))

  const validate = () => {
    const e: typeof errors = {}
    if (!form.origin.trim()) e.origin = '출발지를 입력해주세요'
    if (!form.destination.trim()) e.destination = '도착지를 입력해주세요'
    if (!form.date) e.date = '날짜를 선택해주세요'
    if (!form.time) e.time = '시간을 선택해주세요'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    alert('게시글 등록 완료!\n(DB 연결 후 실제 저장 예정)')
    navigate('/')
  }

  const tripLabels: Record<TripType, string> = {
    oneway: '편도', regular: '정기 반복', roundtrip: '왕복',
  }

  return (
    <div className="page-layout">

      {/* TopBar */}
      <div className="detail-topbar">
        <button className="detail-back-btn tap" onClick={() => navigate(-1)}>
          <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
            <path d="M9 1 L1 9 L9 17" stroke="var(--ink-100)" strokeWidth="2.2"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="detail-topbar-title">게시글 등록</span>
        <button className="btn-ghost" style={{ fontSize: 13, fontWeight: 700, color: 'var(--ink-40)' }}>
          임시저장
        </button>
      </div>

      <div className="write-body">

        {/* ① 경로 */}
        <section className="write-section">
          <StepLabel num="1" color="var(--driver)">어디서 → 어디로?</StepLabel>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <FieldBox label="출발지">
              <div className="write-input-wrap" style={{ borderColor: errors.origin ? 'var(--warn)' : undefined }}>
                <input className="write-input" placeholder="예) 강남역 11번 출구"
                  value={form.origin} onChange={e => set('origin', e.target.value)} />
              </div>
              {errors.origin && <div className="error">{errors.origin}</div>}
            </FieldBox>

            {/* 스왑 버튼 */}
            <div style={{ display: 'flex', justifyContent: 'center', height: 0, position: 'relative', zIndex: 2 }}>
              <button className="write-swap-btn tap" onClick={swapRoute}>
                <svg width="16" height="16" viewBox="0 0 16 16">
                  <path d="M8 2 L8 14 M3 6 L8 1 L13 6 M3 10 L8 15 L13 10"
                    stroke="var(--ink-60)" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                </svg>
              </button>
            </div>

            <FieldBox label="도착지">
              <div className="write-input-wrap" style={{ marginTop: 4, borderColor: errors.destination ? 'var(--warn)' : undefined }}>
                <input className="write-input" placeholder="예) 지파교회 청년부실"
                  value={form.destination} onChange={e => set('destination', e.target.value)} />
              </div>
              {errors.destination && <div className="error">{errors.destination}</div>}
            </FieldBox>
          </div>
        </section>

        {/* ② 출발 시각 */}
        <section className="write-section">
          <StepLabel num="2" color="var(--driver)">언제 출발해요?</StepLabel>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
            <InputCell label="날짜" type="date" value={form.date} onChange={v => set('date', v)} />
            <InputCell label="시간" type="time" value={form.time} onChange={v => set('time', v)} />
          </div>
          <div style={{ display: 'flex', gap: 6, marginTop: 10, flexWrap: 'wrap' }}>
            {(['oneway', 'regular', 'roundtrip'] as TripType[]).map(t => (
              <button
                key={t}
                className="tap"
                onClick={() => set('tripType', t)}
                style={{
                  padding: '6px 14px', borderRadius: 999,
                  background: form.tripType === t ? 'var(--ink-100)' : 'var(--ink-5)',
                  color: form.tripType === t ? '#fff' : 'var(--ink-60)',
                  fontSize: 12, fontWeight: 700, border: 'none', cursor: 'pointer',
                }}
              >
                {tripLabels[t]}
              </button>
            ))}
          </div>
        </section>

        {/* ③ 인원 */}
        <section className="write-section">
          <StepLabel num="3" color="var(--driver)">몇 명 태울 수 있어요?</StepLabel>
          <FieldBox label="탑승 인원">
            <div className="write-input-wrap write-spinner-wrap">
              <button className="write-spinner-btn tap"
                onClick={() => set('seats', Math.max(1, form.seats - 1))}>−</button>
              <span className="write-spinner-val">{form.seats} 명</span>
              <button className="write-spinner-btn tap"
                onClick={() => set('seats', Math.min(8, form.seats + 1))}>+</button>
            </div>
          </FieldBox>
        </section>

        {/* ④ 메모 */}
        <section className="write-section">
          <StepLabel num="4" color="var(--driver)">하고 싶은 말 <span style={{ fontSize: 12, color: 'var(--ink-40)', fontWeight: 600 }}>(선택)</span></StepLabel>
          <div style={{ position: 'relative' }}>
            <textarea
              className="write-textarea"
              placeholder="예) 11번 출구 앞에서 기다릴게요. 출발 5분 전 카톡 드립니다."
              value={form.notice}
              maxLength={120}
              onChange={e => set('notice', e.target.value)}
            />
            <div className="write-char-count">{form.notice.length} / 120</div>
          </div>
        </section>

        <div style={{ height: 120 }} />
      </div>

      {/* 하단 등록 버튼 */}
      <div className="write-bottom-cta">
        <button
          className="detail-cta-primary tap"
          style={{ background: 'var(--driver)' }}
          onClick={handleSubmit}
        >
          등록하기
        </button>
      </div>

      <BottomNav />
    </div>
  )
}
