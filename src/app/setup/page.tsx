'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../../stores/authStore'
import { api } from '../../lib/api'
import type { Gender } from '../../types'

export default function SetupPage() {
  const { user, loading, refetchProfile } = useAuthContext()
  const router = useRouter()

  /* ── 이미 셋업 완료된 경우 진입 차단 ── */
  useEffect(() => {
    if (loading) return
    if (!user) { router.replace('/login'); return }
    if (user.gender !== null) {
      // 이미 셋업 완료 → 상태에 맞는 화면으로
      if (user.status === 'PENDING') router.replace('/pending')
      else if (user.status === 'APPROVED') router.replace('/feed')
      else if (user.status === 'BANNED') router.replace('/banned')
      else router.replace('/pending')
    }
  }, [user, loading, router])

  /* ── 1단계: 성별 선택 ── */
  const [gender, setGender] = useState<Gender | ''>('')

  /* ── 2단계: 약관 동의 ── */
  const [agreeTerms, setAgreeTerms] = useState(false)
  const [agreePrivacy, setAgreePrivacy] = useState(false)
  const [agreeLocation, setAgreeLocation] = useState(false)

  /* ── 3단계: 운전자 등록 (선택) ── */
  const [wantDriver, setWantDriver] = useState<boolean | null>(null)
  const [plateNumber, setPlateNumber] = useState('')
  const [carModel, setCarModel] = useState('')
  const [maxSeats, setMaxSeats] = useState('4')
  const [checkInsurance, setCheckInsurance] = useState(false)
  const [checkLicense, setCheckLicense] = useState(false)
  const [checkNonCommercial, setCheckNonCommercial] = useState(false)

  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  /* ── 스텝 이동 ── */
  function goStep2() {
    if (!gender) { setError('성별을 선택해 주세요.'); return }
    setError('')
    setStep(2)
  }

  function goStep3() {
    if (!agreeTerms || !agreePrivacy) { setError('필수 약관에 동의해 주세요.'); return }
    setError('')
    setStep(3)
  }

  /* ── 최종 제출 ── */
  async function handleSubmit() {
    setError('')
    setSubmitting(true)
    try {
      // 1) 성별 + 약관 동의 등록
      await api.auth.setup(gender as Gender)

      // 2) 운전자 등록 선택 시
      if (wantDriver === true) {
        if (!plateNumber.trim()) { setError('차량번호를 입력해 주세요.'); setSubmitting(false); return }
        if (!checkInsurance || !checkLicense || !checkNonCommercial) {
          setError('운전자 확인 사항 3종에 모두 동의해 주세요.')
          setSubmitting(false)
          return
        }
        await api.users.addVehicle({
          plateNumber: plateNumber.trim(),
          carModel: carModel.trim() || undefined,
          maxSeats: parseInt(maxSeats, 10),
          insuranceConfirmed: checkInsurance,
          licenseConfirmed: checkLicense,
          nonCommercialConfirmed: checkNonCommercial,
        })
      }

      // 3) 프로필 갱신 후 이동
      await refetchProfile()
      router.replace('/pending')
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : '오류가 발생하였습니다. 다시 시도해 주세요.'
      setError(msg)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading || !user) {
    return (
      <div className="setup-loading">
        <p>로딩 중…</p>
      </div>
    )
  }

  return (
    <div className="setup-page">
      {/* 헤더 */}
      <div className="setup-header">
        <div className="setup-logo hand">P플</div>
        <p className="setup-sub">처음 오셨군요, {user.name}님 👋</p>
        <p className="setup-sub2">추가 정보를 입력하면 서비스를 이용할 수 있어요.</p>

        {/* 진행 표시 */}
        <div className="setup-steps">
          {[1, 2, 3].map(n => (
            <div
              key={n}
              className={`setup-step-dot ${step === n ? 'active' : step > n ? 'done' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* 본문 */}
      <div className="setup-body">

        {/* ── STEP 1: 성별 ── */}
        {step === 1 && (
          <div className="setup-section">
            <h2 className="setup-title">성별을 선택해 주세요</h2>
            <p className="setup-desc">성별 매칭 기능에 사용되며, 언제든지 수정할 수 있어요.</p>

            <div className="gender-group">
              {([
                { value: 'M', label: '남성', emoji: '🙋‍♂️' },
                { value: 'F', label: '여성', emoji: '🙋‍♀️' },
                { value: 'N', label: '선택 안 함', emoji: '🙂' },
              ] as const).map(({ value, label, emoji }) => (
                <button
                  key={value}
                  type="button"
                  className={`gender-btn tap ${gender === value ? 'selected' : ''}`}
                  onClick={() => setGender(value)}
                >
                  <span className="gender-emoji">{emoji}</span>
                  <span className="gender-label">{label}</span>
                </button>
              ))}
            </div>

            {error && <p className="form-error">{error}</p>}

            <button className="setup-next-btn tap" onClick={goStep2}>
              다음
            </button>
          </div>
        )}

        {/* ── STEP 2: 약관 동의 ── */}
        {step === 2 && (
          <div className="setup-section">
            <h2 className="setup-title">약관에 동의해 주세요</h2>

            <div className="agree-list">
              <label className="agree-item">
                <input
                  type="checkbox"
                  checked={agreeTerms && agreePrivacy && agreeLocation}
                  onChange={e => {
                    setAgreeTerms(e.target.checked)
                    setAgreePrivacy(e.target.checked)
                    setAgreeLocation(e.target.checked)
                  }}
                />
                <span className="agree-label bold">전체 동의</span>
              </label>

              <hr className="agree-divider" />

              <label className="agree-item">
                <input
                  type="checkbox"
                  checked={agreeTerms}
                  onChange={e => setAgreeTerms(e.target.checked)}
                />
                <span className="agree-label">
                  <span className="agree-badge required">필수</span>
                  이용약관
                </span>
                <a href="/terms" target="_blank" rel="noreferrer" className="agree-link">보기</a>
              </label>

              <label className="agree-item">
                <input
                  type="checkbox"
                  checked={agreePrivacy}
                  onChange={e => setAgreePrivacy(e.target.checked)}
                />
                <span className="agree-label">
                  <span className="agree-badge required">필수</span>
                  개인정보 처리방침
                </span>
                <a href="/privacy" target="_blank" rel="noreferrer" className="agree-link">보기</a>
              </label>

              <label className="agree-item">
                <input
                  type="checkbox"
                  checked={agreeLocation}
                  onChange={e => setAgreeLocation(e.target.checked)}
                />
                <span className="agree-label">
                  <span className="agree-badge optional">선택</span>
                  위치정보 이용약관
                </span>
                <a href="/location-terms" target="_blank" rel="noreferrer" className="agree-link">보기</a>
              </label>
            </div>

            {error && <p className="form-error">{error}</p>}

            <div className="setup-btn-row">
              <button className="setup-back-btn tap" onClick={() => { setError(''); setStep(1) }}>
                이전
              </button>
              <button className="setup-next-btn tap" onClick={goStep3}>
                다음
              </button>
            </div>
          </div>
        )}

        {/* ── STEP 3: 운전자 등록 ── */}
        {step === 3 && (
          <div className="setup-section">
            <h2 className="setup-title">운전자로 등록하시겠어요?</h2>
            <p className="setup-desc">나중에 마이페이지에서도 등록할 수 있어요.</p>

            <div className="driver-choice">
              <button
                type="button"
                className={`driver-choice-btn tap ${wantDriver === true ? 'selected driver' : ''}`}
                onClick={() => setWantDriver(true)}
              >
                🚗 네, 운전할게요
              </button>
              <button
                type="button"
                className={`driver-choice-btn tap ${wantDriver === false ? 'selected rider' : ''}`}
                onClick={() => setWantDriver(false)}
              >
                🙋 아니요, 탑승만 할게요
              </button>
            </div>

            {wantDriver === true && (
              <div className="driver-form">
                <div className="form-group">
                  <label className="form-label">차량번호 <span className="required-mark">*</span></label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: 12가 3456"
                    value={plateNumber}
                    onChange={e => setPlateNumber(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">차종 (선택)</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="예: 현대 아반떼"
                    value={carModel}
                    onChange={e => setCarModel(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">최대 탑승 인원 (본인 제외) <span className="required-mark">*</span></label>
                  <select
                    className="form-input"
                    value={maxSeats}
                    onChange={e => setMaxSeats(e.target.value)}
                  >
                    {[1, 2, 3, 4, 5, 6].map(n => (
                      <option key={n} value={n}>{n}명</option>
                    ))}
                  </select>
                </div>

                <div className="driver-checks">
                  <label className="check-item">
                    <input
                      type="checkbox"
                      checked={checkInsurance}
                      onChange={e => setCheckInsurance(e.target.checked)}
                    />
                    <span>자동차 보험에 가입되어 있습니다.</span>
                  </label>
                  <label className="check-item">
                    <input
                      type="checkbox"
                      checked={checkLicense}
                      onChange={e => setCheckLicense(e.target.checked)}
                    />
                    <span>운전면허가 유효한 상태입니다.</span>
                  </label>
                  <label className="check-item">
                    <input
                      type="checkbox"
                      checked={checkNonCommercial}
                      onChange={e => setCheckNonCommercial(e.target.checked)}
                    />
                    <span>분담금 3,000원은 유류비 분담 목적이며, 영리 목적으로 운행하지 않겠습니다.</span>
                  </label>
                </div>
              </div>
            )}

            {error && <p className="form-error">{error}</p>}

            <div className="setup-btn-row">
              <button className="setup-back-btn tap" onClick={() => { setError(''); setStep(2) }}>
                이전
              </button>
              <button
                className="setup-submit-btn tap"
                onClick={handleSubmit}
                disabled={submitting || wantDriver === null}
              >
                {submitting ? '등록 중…' : '완료'}
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .setup-loading {
          display: flex; align-items: center; justify-content: center;
          height: 100vh; color: var(--ink-60);
        }
        .setup-page {
          min-height: 100vh;
          display: flex;
          flex-direction: column;
          background: var(--blue-hero);
        }
        .setup-header {
          padding: 48px 24px 32px;
          text-align: center;
          color: #fff;
        }
        .setup-logo {
          font-size: 2rem;
          margin-bottom: 12px;
        }
        .setup-sub {
          margin: 0 0 4px;
          font-size: 1.1rem;
          font-weight: 700;
          color: #fff;
        }
        .setup-sub2 {
          margin: 0 0 20px;
          font-size: 0.85rem;
          color: rgba(255,255,255,.7);
        }
        .setup-steps {
          display: flex;
          gap: 8px;
          justify-content: center;
        }
        .setup-step-dot {
          width: 8px; height: 8px;
          border-radius: 50%;
          background: rgba(255,255,255,.35);
          transition: background .2s, transform .2s;
        }
        .setup-step-dot.active {
          background: #fff;
          transform: scale(1.25);
        }
        .setup-step-dot.done {
          background: var(--mint);
        }

        .setup-body {
          background: #fff;
          border-radius: 28px 28px 0 0;
          padding: 32px 24px 48px;
          flex: 1;
        }
        .setup-section {
          display: flex;
          flex-direction: column;
          gap: 16px;
        }
        .setup-title {
          margin: 0;
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--ink-100);
        }
        .setup-desc {
          margin: -8px 0 0;
          font-size: 0.85rem;
          color: var(--ink-60);
        }

        /* Gender */
        .gender-group {
          display: flex;
          gap: 10px;
        }
        .gender-btn {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 8px;
          padding: 18px 8px;
          border: 2px solid var(--ink-20);
          border-radius: var(--radius-lg);
          background: var(--ink-5);
          font-family: inherit;
          font-size: 0.9rem;
          font-weight: 600;
          color: var(--ink-60);
          transition: border-color .15s, background .15s, color .15s;
        }
        .gender-btn.selected {
          border-color: var(--blue-hero);
          background: #EEF0FF;
          color: var(--blue-hero);
        }
        .gender-emoji { font-size: 1.6rem; }
        .gender-label { font-size: 0.82rem; }

        /* Agree */
        .agree-list {
          display: flex;
          flex-direction: column;
          gap: 2px;
          background: var(--ink-5);
          border-radius: var(--radius-md);
          padding: 4px 16px;
        }
        .agree-item {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 12px 0;
          cursor: pointer;
          font-size: 0.88rem;
          color: var(--ink-80);
        }
        .agree-item input[type="checkbox"] {
          width: 18px; height: 18px;
          accent-color: var(--blue-hero);
          cursor: pointer;
          flex-shrink: 0;
        }
        .agree-label { flex: 1; display: flex; align-items: center; gap: 6px; }
        .agree-label.bold { font-weight: 700; color: var(--ink-100); }
        .agree-badge {
          font-size: 0.7rem;
          font-weight: 700;
          padding: 1px 6px;
          border-radius: 6px;
        }
        .agree-badge.required { background: #FFE5E5; color: var(--warn); }
        .agree-badge.optional { background: var(--ink-10); color: var(--ink-60); }
        .agree-link {
          font-size: 0.75rem;
          color: var(--ink-40);
          text-decoration: underline;
          flex-shrink: 0;
        }
        .agree-divider {
          border: none;
          border-top: 1px solid var(--ink-10);
          margin: 0;
        }

        /* Driver */
        .driver-choice {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .driver-choice-btn {
          height: 52px;
          border: 2px solid var(--ink-20);
          border-radius: var(--radius-md);
          background: var(--ink-5);
          font-family: inherit;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--ink-60);
          transition: border-color .15s, background .15s, color .15s;
        }
        .driver-choice-btn.selected.driver {
          border-color: var(--driver);
          background: var(--driver-soft);
          color: var(--driver-ink);
        }
        .driver-choice-btn.selected.rider {
          border-color: var(--rider);
          background: var(--rider-soft);
          color: var(--rider-ink);
        }
        .driver-form {
          display: flex;
          flex-direction: column;
          gap: 14px;
          padding: 16px;
          background: var(--ink-5);
          border-radius: var(--radius-md);
        }
        .driver-checks {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .check-item {
          display: flex;
          align-items: flex-start;
          gap: 10px;
          font-size: 0.85rem;
          color: var(--ink-80);
          line-height: 1.4;
          cursor: pointer;
        }
        .check-item input[type="checkbox"] {
          width: 18px; height: 18px;
          accent-color: var(--driver);
          cursor: pointer;
          flex-shrink: 0;
          margin-top: 1px;
        }

        /* Forms */
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .form-label {
          font-size: 0.82rem;
          font-weight: 600;
          color: var(--ink-60);
        }
        .required-mark { color: var(--warn); }
        .form-input {
          height: 48px;
          padding: 0 14px;
          border: 1.5px solid var(--ink-20);
          border-radius: var(--radius-sm);
          font-size: 0.95rem;
          font-family: inherit;
          color: var(--ink-100);
          background: #fff;
          outline: none;
          transition: border-color .15s;
        }
        .form-input:focus { border-color: var(--blue-hero); }
        select.form-input { cursor: pointer; }
        .form-error {
          margin: 0;
          font-size: 0.82rem;
          color: var(--warn);
          padding: 10px 14px;
          background: var(--warn-soft);
          border-radius: var(--radius-sm);
        }

        /* Buttons */
        .setup-btn-row {
          display: flex;
          gap: 10px;
        }
        .setup-back-btn {
          flex: 0 0 80px;
          height: 52px;
          background: var(--ink-10);
          color: var(--ink-60);
          border: none;
          border-radius: var(--radius-lg);
          font-size: 0.95rem;
          font-weight: 600;
          font-family: inherit;
        }
        .setup-next-btn {
          flex: 1;
          height: 52px;
          background: var(--blue-hero);
          color: #fff;
          border: none;
          border-radius: var(--radius-lg);
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
        }
        .setup-submit-btn {
          flex: 1;
          height: 52px;
          background: var(--mint-deep);
          color: #fff;
          border: none;
          border-radius: var(--radius-lg);
          font-size: 1rem;
          font-weight: 700;
          font-family: inherit;
          transition: opacity .15s;
        }
        .setup-submit-btn:disabled { opacity: 0.5; }
      `}</style>
    </div>
  )
}
