'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { api, IS_MOCK } from '../../lib/api'

const schema = z.object({
  name: z.string().min(1, '이름을 입력해주세요').max(20),
  department: z.string().min(1, '부서를 선택해주세요'),
  phone: z.string().regex(/^01[0-9]-?[0-9]{3,4}-?[0-9]{4}$/, '올바른 휴대폰 번호를 입력해주세요'),
  gender: z.enum(['M', 'F', 'N']),
  agreeTerms: z.literal(true, { error: '필수 동의 항목입니다' }),
  agreePrivacy: z.literal(true, { error: '필수 동의 항목입니다' }),
  agreeLocation: z.boolean(),
})

type FormData = z.infer<typeof schema>

const DEPARTMENTS = ['청년1부', '청년2부', '청년3부', '청년4부', '청년5부', '청년6부', '청년7부', '청년8부']

export default function SignupPage() {
  const router = useRouter()
  const [submitting, setSubmitting] = useState(false)
  const [agreeAll, setAgreeAll] = useState(false)

  const { register, handleSubmit, setValue, watch, formState: { errors, isValid } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { gender: 'N', agreeTerms: undefined, agreePrivacy: undefined, agreeLocation: false },
    mode: 'onChange',
  })

  const watchedTerms = watch('agreeTerms')
  const watchedPrivacy = watch('agreePrivacy')
  const watchedLocation = watch('agreeLocation')

  useEffect(() => {
    setAgreeAll(!!watchedTerms && !!watchedPrivacy && !!watchedLocation)
  }, [watchedTerms, watchedPrivacy, watchedLocation])

  const handleAgreeAll = (checked: boolean) => {
    setAgreeAll(checked)
    setValue('agreeTerms', checked ? true : undefined as unknown as true, { shouldValidate: true })
    setValue('agreePrivacy', checked ? true : undefined as unknown as true, { shouldValidate: true })
    setValue('agreeLocation', checked)
  }

  const onSubmit = async (data: FormData) => {
    if (IS_MOCK) { router.replace('/pending'); return }
    setSubmitting(true)
    try {
      await api.auth.signup({
        name: data.name, department: data.department,
        phone: data.phone, gender: data.gender,
      })
      router.replace('/pending')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="page-container">
      <h1 className="page-title">회원 정보 입력</h1>
      <p className="page-subtitle">청년부 구성원 확인을 위해 아래 정보를 입력해주세요.</p>

      <form onSubmit={handleSubmit(onSubmit)} className="form">
        <div className="field">
          <label className="label">이름 <span className="required">*</span></label>
          <input className="input" {...register('name')} placeholder="실명 입력" />
          {errors.name && <span className="error">{errors.name.message}</span>}
        </div>

        <div className="field">
          <label className="label">부서 <span className="required">*</span></label>
          <select className="input" {...register('department')}>
            <option value="">부서 선택</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          {errors.department && <span className="error">{errors.department.message}</span>}
        </div>

        <div className="field">
          <label className="label">휴대폰 번호 <span className="required">*</span></label>
          <input className="input" {...register('phone')} placeholder="010-0000-0000" />
          {errors.phone && <span className="error">{errors.phone.message}</span>}
        </div>

        <div className="field">
          <label className="label">성별</label>
          <div className="radio-group">
            {[{ value: 'M', label: '남' }, { value: 'F', label: '여' }, { value: 'N', label: '미지정' }].map(
              ({ value, label }) => (
                <label key={value} className="radio-label">
                  <input type="radio" {...register('gender')} value={value} />
                  {label}
                </label>
              )
            )}
          </div>
        </div>

        <div className="terms-section">
          <label className="checkbox-label bold">
            <input type="checkbox" checked={agreeAll} onChange={e => handleAgreeAll(e.target.checked)} />
            위 약관에 모두 동의합니다. (전체 동의)
          </label>
          <div className="divider" />
          <label className="checkbox-label">
            <input type="checkbox" {...register('agreeTerms')} />
            <span>(필수) 서비스 이용약관에 동의합니다.</span>
            <a href="/terms" target="_blank" rel="noreferrer" className="terms-link">전문 보기</a>
          </label>
          {errors.agreeTerms && <span className="error">{errors.agreeTerms.message}</span>}
          <label className="checkbox-label">
            <input type="checkbox" {...register('agreePrivacy')} />
            <span>(필수) 개인정보 처리방침에 동의합니다.</span>
            <a href="/privacy" target="_blank" rel="noreferrer" className="terms-link">전문 보기</a>
          </label>
          {errors.agreePrivacy && <span className="error">{errors.agreePrivacy.message}</span>}
          <label className="checkbox-label">
            <input type="checkbox" {...register('agreeLocation')} />
            <span>(선택) 위치정보 이용에 동의합니다.</span>
            <a href="/location-terms" target="_blank" rel="noreferrer" className="terms-link">전문 보기</a>
          </label>
          <p className="terms-notice">※ 미동의 시 실시간 위치 공유 기능 이용이 제한됩니다.</p>
        </div>

        <button type="submit" className="btn-primary" disabled={!isValid || submitting}>
          {submitting ? '신청 중...' : '가입 신청'}
        </button>
      </form>
    </div>
  )
}
