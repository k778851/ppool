import { useNavigate } from 'react-router-dom'
import { BottomNav } from './BottomNav'

interface Props {
  children: React.ReactNode
  title?: string
  showBack?: boolean
  hideNav?: boolean
  rightSlot?: React.ReactNode
}

export function PageLayout({ children, title, showBack = false, hideNav = false, rightSlot }: Props) {
  const navigate = useNavigate()

  return (
    <div className="page-layout">
      <header className="header">
        {showBack ? (
          <button className="header-back tap" onClick={() => navigate(-1)}>
            ← 뒤로
          </button>
        ) : (
          <button className="header-logo tap" onClick={() => navigate('/')}>
            P플 👍
          </button>
        )}
        {title && <span className="header-title">{title}</span>}
        <div className="header-right">{rightSlot ?? null}</div>
      </header>

      <main className="page-main">{children}</main>

      {!hideNav && <BottomNav />}
    </div>
  )
}
