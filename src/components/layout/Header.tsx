'use client'
import { useRouter } from 'next/navigation'
import { useAuthContext } from '../../stores/authStore'

export function Header() {
  const router = useRouter()
  const { user } = useAuthContext()

  return (
    <header className="header">
      <button className="header-logo tap" onClick={() => router.push('/feed')}>
        P플
      </button>
      <div className="header-actions">
        {user?.is_admin && (
          <button className="tap" onClick={() => router.push('/admin')} aria-label="관리자">
            ⚙️
          </button>
        )}
        <button className="tap" onClick={() => router.push('/my')} aria-label="마이페이지">
          👤
        </button>
      </div>
    </header>
  )
}
