'use client'
import { useEffect, useState, useCallback } from 'react'
import { api } from '../../lib/api'
import type { Ride } from '../../types'

export function AdminRides() {
  const [rides, setRides] = useState<Ride[]>([])
  const [loading, setLoading] = useState(true)

  const fetchRides = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.admin.rides()
      setRides(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchRides() }, [fetchRides])

  const cancelRide = async (id: string) => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return
    await api.rides.delete(id)
    fetchRides()
  }

  if (loading) return <p>불러오는 중...</p>
  if (rides.length === 0) return <p>활성 게시글이 없습니다.</p>

  return (
    <div className="admin-section">
      <h2 className="section-title">활성 게시글 ({rides.length})</h2>
      <table className="admin-table">
        <thead>
          <tr><th>출발지</th><th>도착지</th><th>출발 시각</th><th>운전자</th><th>상태</th><th>처리</th></tr>
        </thead>
        <tbody>
          {rides.map(r => (
            <tr key={r.id}>
              <td>{r.origin}</td>
              <td>{r.destination}</td>
              <td>{new Date(r.departure_time).toLocaleString('ko-KR')}</td>
              <td>{r.driver?.name}</td>
              <td><span className={`status-badge status-${r.status?.toLowerCase()}`}>{r.status}</span></td>
              <td>
                <button className="btn-sm btn-reject tap" onClick={() => cancelRide(r.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
