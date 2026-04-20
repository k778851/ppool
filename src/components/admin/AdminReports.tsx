import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Report } from '../../types'

const REASON_LABEL: Record<string, string> = {
  NO_SHOW: '노쇼', RUDE: '무례', UNSAFE: '위험운전', FARE: '요금문제', OTHER: '기타',
}

export function AdminReports() {
  const [reports, setReports] = useState<(Report & { reporter?: { name: string }; reported?: { name: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchReports() }, [])

  const fetchReports = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('reports')
      .select('*, reporter:reporter_id(name), reported:reported_id(name)')
      .eq('status', 'PENDING')
      .order('created_at')
    setReports(data ?? [])
    setLoading(false)
  }

  const handle = async (id: string, status: 'REVIEWED' | 'REJECTED') => {
    await supabase.from('reports').update({ status }).eq('id', id)
    fetchReports()
  }

  if (loading) return <p>불러오는 중...</p>
  if (reports.length === 0) return <p>처리할 신고가 없습니다.</p>

  return (
    <div className="admin-section">
      <h2 className="section-title">대기 중인 신고 ({reports.length})</h2>
      {reports.map(r => (
        <div key={r.id} className="card report-card">
          <div className="report-meta">
            <span className="badge">{REASON_LABEL[r.reason]}</span>
            <span>{r.reporter?.name} → {r.reported?.name}</span>
            <span className="text-muted">{new Date(r.created_at).toLocaleDateString('ko-KR')}</span>
          </div>
          {r.description && <p className="report-desc">{r.description}</p>}
          <div className="report-actions">
            <button className="btn-sm btn-approve tap" onClick={() => handle(r.id, 'REVIEWED')}>처리 완료</button>
            <button className="btn-sm btn-ghost tap" onClick={() => handle(r.id, 'REJECTED')}>반려</button>
          </div>
        </div>
      ))}
    </div>
  )
}
