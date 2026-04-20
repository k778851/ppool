import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import type { User } from '../../types'

export function AdminUsers() {
  const [pending, setPending] = useState<User[]>([])
  const [all, setAll] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    setLoading(true)
    const [{ data: pendingData }, { data: allData }] = await Promise.all([
      supabase.from('users').select('*').eq('status', 'PENDING').order('created_at'),
      supabase.from('users').select('*').order('created_at', { ascending: false }),
    ])
    setPending(pendingData ?? [])
    setAll(allData ?? [])
    setLoading(false)
  }

  const approve = async (id: string) => {
    await supabase.from('users').update({ status: 'APPROVED', approved_at: new Date().toISOString() }).eq('id', id)
    fetchUsers()
  }

  const reject = async (id: string) => {
    await supabase.from('users').update({ status: 'REJECTED' }).eq('id', id)
    fetchUsers()
  }

  const ban = async (id: string) => {
    const until = new Date()
    until.setDate(until.getDate() + 30)
    await supabase.from('users').update({ status: 'BANNED', banned_until: until.toISOString() }).eq('id', id)
    fetchUsers()
  }

  const unban = async (id: string) => {
    await supabase.from('users').update({ status: 'APPROVED', banned_until: null }).eq('id', id)
    fetchUsers()
  }

  const filtered = all.filter(u =>
    u.name.includes(search) || u.department.includes(search)
  )

  if (loading) return <p>불러오는 중...</p>

  return (
    <div className="admin-section">
      {pending.length > 0 && (
        <>
          <h2 className="section-title">승인 대기 ({pending.length})</h2>
          <table className="admin-table">
            <thead>
              <tr><th>이름</th><th>부서</th><th>연락처</th><th>가입일</th><th>처리</th></tr>
            </thead>
            <tbody>
              {pending.map(u => (
                <tr key={u.id} className={u.no_show_count >= 2 ? 'row-warn' : ''}>
                  <td>{u.name}</td>
                  <td>{u.department}</td>
                  <td>{u.phone}</td>
                  <td>{new Date(u.created_at).toLocaleDateString('ko-KR')}</td>
                  <td>
                    <button className="btn-sm btn-approve tap" onClick={() => approve(u.id)}>승인</button>
                    <button className="btn-sm btn-reject tap" onClick={() => reject(u.id)}>거부</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </>
      )}

      <h2 className="section-title">전체 회원</h2>
      <input
        className="input"
        placeholder="이름 또는 부서 검색"
        value={search}
        onChange={e => setSearch(e.target.value)}
        style={{ marginBottom: 12 }}
      />
      <table className="admin-table">
        <thead>
          <tr><th>이름</th><th>부서</th><th>상태</th><th>노쇼</th><th>신고</th><th>처리</th></tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id} className={u.no_show_count >= 3 || u.report_count >= 3 ? 'row-warn' : ''}>
              <td>{u.name}</td>
              <td>{u.department}</td>
              <td><span className={`status-badge status-${u.status.toLowerCase()}`}>{u.status}</span></td>
              <td>{u.no_show_count}</td>
              <td>{u.report_count}</td>
              <td>
                {u.status === 'APPROVED' && (
                  <button className="btn-sm btn-reject tap" onClick={() => ban(u.id)}>정지</button>
                )}
                {u.status === 'BANNED' && (
                  <button className="btn-sm btn-approve tap" onClick={() => unban(u.id)}>해제</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
