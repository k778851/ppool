import { useState } from 'react'
import * as XLSX from 'xlsx'
import { supabase } from '../../lib/supabase'

const formatDate = (d: Date) =>
  `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`

const downloadExcel = (data: unknown[], filename: string) => {
  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()
  XLSX.utils.book_append_sheet(wb, ws, 'Sheet1')
  XLSX.writeFile(wb, `${filename}_${formatDate(new Date())}.xlsx`)
}

export function AdminBackup() {
  const [loading, setLoading] = useState<string | null>(null)

  const download = async (type: 'users' | 'rides' | 'reports') => {
    setLoading(type)
    const { data } = await supabase.from(type).select('*').order('created_at')
    if (data) downloadExcel(data, `ppool_${type}`)
    setLoading(null)
  }

  return (
    <div className="admin-section">
      <h2 className="section-title">데이터 백업</h2>
      <p className="text-muted" style={{ marginBottom: 16 }}>
        주 1회 이상 정기 백업을 권장합니다.
      </p>
      <div className="backup-buttons">
        {(['users', 'rides', 'reports'] as const).map(type => (
          <button
            key={type}
            className="btn-secondary tap"
            onClick={() => download(type)}
            disabled={loading === type}
          >
            {loading === type ? '다운로드 중...' : `${type === 'users' ? '전체 회원' : type === 'rides' ? '게시글 이력' : '신고 이력'} 엑셀 다운로드`}
          </button>
        ))}
      </div>
    </div>
  )
}
