import { useNavigate } from 'react-router-dom'
import { useAuthContext } from '../../stores/authStore'

export function Header() {
  const navigate = useNavigate()
  const { user } = useAuthContext()

  return (
    <header className="header">
      <button className="header-logo tap" onClick={() => navigate('/')}>
        P플
      </button>
      <div className="header-actions">
        {user?.is_admin && (
          <button className="tap" onClick={() => navigate('/admin')} aria-label="관리자">
            ⚙️
          </button>
        )}
        <button className="tap" onClick={() => navigate('/my')} aria-label="마이페이지">
          👤
        </button>
      </div>
    </header>
  )
}
