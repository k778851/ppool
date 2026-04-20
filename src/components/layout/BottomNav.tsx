import { useLocation, useNavigate } from 'react-router-dom'

function IconHome({ active }: { active: boolean }) {
  const c = active ? 'var(--blue-hero)' : 'var(--ink-60)'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M3 10 L11 3 L19 10 L19 19 L14 19 L14 13 L8 13 L8 19 L3 19 Z"
        stroke={c} strokeWidth="1.8" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function IconMap({ active }: { active: boolean }) {
  const c = active ? 'var(--blue-hero)' : 'var(--ink-60)'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <path d="M2 5 L8 3 L14 5 L20 3 L20 17 L14 19 L8 17 L2 19 Z M8 3 L8 17 M14 5 L14 19"
        stroke={c} strokeWidth="1.6" strokeLinejoin="round" fill="none" />
    </svg>
  )
}

function IconWrite() {
  return (
    <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
      <circle cx="13" cy="13" r="12" fill="var(--mint)" stroke="var(--blue-hero)" strokeWidth="2" />
      <path d="M13 7 L13 19 M7 13 L19 13" stroke="var(--blue-hero)" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

function IconHistory({ active }: { active: boolean }) {
  const c = active ? 'var(--blue-hero)' : 'var(--ink-60)'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <rect x="4" y="3" width="14" height="16" rx="2" stroke={c} strokeWidth="1.7" fill="none" />
      <line x1="7" y1="8" x2="15" y2="8" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <line x1="7" y1="12" x2="15" y2="12" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
      <line x1="7" y1="16" x2="12" y2="16" stroke={c} strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  )
}

function IconProfile({ active }: { active: boolean }) {
  const c = active ? 'var(--blue-hero)' : 'var(--ink-60)'
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
      <circle cx="11" cy="8" r="4" stroke={c} strokeWidth="1.7" fill="none" />
      <path d="M3 20 C3 15 6.5 12 11 12 C15.5 12 19 15 19 20" stroke={c} strokeWidth="1.7" fill="none" strokeLinecap="round" />
    </svg>
  )
}

const TABS = [
  { key: 'home', path: '/', label: '홈' },
  { key: 'map', path: '/map', label: '지도' },
  { key: 'write', path: '/rides/new', label: '등록', center: true },
  { key: 'history', path: '/history', label: '내역' },
  { key: 'profile', path: '/my', label: '프로필' },
]

export function BottomNav() {
  const { pathname } = useLocation()
  const navigate = useNavigate()

  return (
    <nav className="bottom-nav">
      {TABS.map(tab => {
        const isActive = tab.path === '/' ? pathname === '/' : pathname.startsWith(tab.path)
        const color = isActive ? 'var(--blue-hero)' : 'var(--ink-60)'

        return (
          <button
            key={tab.key}
            className="bottom-nav-item tap"
            style={{ color }}
            onClick={() => navigate(tab.path)}
          >
            {tab.key === 'home' && <IconHome active={isActive} />}
            {tab.key === 'map' && <IconMap active={isActive} />}
            {tab.key === 'write' && <IconWrite />}
            {tab.key === 'history' && <IconHistory active={isActive} />}
            {tab.key === 'profile' && <IconProfile active={isActive} />}
            <span className="bottom-nav-label" style={{ color: tab.center ? 'var(--mint-ink)' : color }}>
              {tab.label}
            </span>
          </button>
        )
      })}
    </nav>
  )
}
