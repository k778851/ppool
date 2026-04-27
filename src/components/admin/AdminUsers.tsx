'use client'
import { useEffect, useState, useCallback } from 'react'
import { api } from '../../lib/api'
import type { User } from '../../types'

export function AdminUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchUsers = useCallback(async () => {
    setLoading(true)
    try {
      const data = await api.admin.users()
      setUsers(data)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchUsers() }, [fetchUsers])

  const approve = async (id: string) => {
    await api.admin.approveUser(id)
    fetchUsers()
  }

  const reject = async (id: string) => {
    await api.admin.rejectUser(id)
    fetchUsers()
  }

  const ban = async (id: string) => {
    await api.admin.banUser(id, 30)
    fetchUsers()
  }

  const unban = async (id: string) => {
    await api.admin.approveUser(id)
    fetchUsers()
  }

  const pending = users.filter(u => u.status === 'PENDING')
  const filtered = users.filter(u =>
    (u.name ?? '').includes(search) || (u.department ?? '').includes(search)
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
                  <td>{u.created_at ? new Date(u.created_at).toLocaleDateString('ko-KR') : '-'}</td>
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
          <tr><th>이름</th><th>부서</th><th>상태</th><th>노쇼</th><th>처리</th></tr>
        </thead>
        <tbody>
          {filtered.map(u => (
            <tr key={u.id} className={u.no_show_count >= 3 ? 'row-warn' : ''}>
              <td>{u.name}</td>
              <td>{u.department}</td>
              <td><span className={`status-badge status-${u.status?.toLowerCase()}`}>{u.status}</span></td>
              <td>{u.no_show_count}</td>
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
