import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { Ride } from '../../types'

export function AdminRides() {
  const [rides, setRides] = useState<(Ride & { driver?: { name: string } })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchRides() }, [])

  const fetchRides = async () => {
    setLoading(true)
    const { data } = await supabase
      .from('rides')
      .select('*, driver:driver_id(name)')
      .in('status', ['OPEN', 'FULL', 'STARTED'])
      .order('departure_time')
    setRides(data ?? [])
    setLoading(false)
  }

  const deleteRide = async (id: string) => {
    if (!confirm('게시글을 삭제하시겠습니까?')) return
    await supabase.from('rides').update({ status: 'CANCELLED' }).eq('id', id)
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
              <td><span className={`status-badge status-${r.status.toLowerCase()}`}>{r.status}</span></td>
              <td>
                <button className="btn-sm btn-reject tap" onClick={() => deleteRide(r.id)}>삭제</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
