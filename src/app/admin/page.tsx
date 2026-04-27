'use client'

import { useState } from 'react'
import { AdminUsers } from '../../components/admin/AdminUsers'
import { AdminReports } from '../../components/admin/AdminReports'
import { AdminRides } from '../../components/admin/AdminRides'
import { AdminBackup } from '../../components/admin/AdminBackup'

type Tab = 'users' | 'reports' | 'rides' | 'backup'
const TABS: { key: Tab; label: string }[] = [
  { key: 'users', label: '회원 관리' },
  { key: 'reports', label: '신고 관리' },
  { key: 'rides', label: '게시글 관리' },
  { key: 'backup', label: '백업' },
]

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('users')

  return (
    <div className="page-container">
      <h1 className="page-title">관리자</h1>
      <div className="tab-bar">
        {TABS.map(t => (
          <button key={t.key} className={`tab-btn tap ${tab === t.key ? 'active' : ''}`} onClick={() => setTab(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <div className="tab-content">
        {tab === 'users' && <AdminUsers />}
        {tab === 'reports' && <AdminReports />}
        {tab === 'rides' && <AdminRides />}
        {tab === 'backup' && <AdminBackup />}
      </div>
    </div>
  )
}
