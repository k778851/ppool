'use client'
import { useEffect, useState, useCallback } from 'react'

const REASON_LABEL: Record<string, string> = {
  NO_SHOW: '노쇼', RUDE: '무례', UNSAFE: '위험운전', FARE: '요금문제', OTHER: '기타',
}

interface ReportItem {
  id: string
  reason: string
  description?: string
  created_at: string
  reporter_name?: string
  reported_name?: string
  status: string
}

export function AdminReports() {
  const [reports, setReports] = useState<ReportItem[]>([])
  const [loading, setLoading] = useState(true)

  const fetchReports = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/reports', {
        headers: { Authorization: `Bearer ${localStorage.getItem('ppool_token')}` },
      })
      if (res.ok) {
        const data = await res.json()
        setReports(data)
      }
    } catch {
      // 목업: 빈 배열
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchReports() }, [fetchReports])

  if (loading) return <p>불러오는 중...</p>
  if (reports.length === 0) return <p>처리할 신고가 없습니다.</p>

  return (
    <div className="admin-section">
      <h2 className="section-title">대기 중인 신고 ({reports.length})</h2>
      {reports.map(r => (
        <div key={r.id} className="card report-card">
          <div className="report-meta">
            <span className="badge">{REASON_LABEL[r.reason] ?? r.reason}</span>
            <span>{r.reporter_name} → {r.reported_name}</span>
            <span className="text-muted">{new Date(r.created_at).toLocaleDateString('ko-KR')}</span>
          </div>
          {r.description && <p className="report-desc">{r.description}</p>}
        </div>
      ))}
    </div>
  )
}
