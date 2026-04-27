'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'

const TABS = [
  {
    key: 'home', path: '/feed', label: '홈',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M3 10 L11 3 L19 10 L19 19 L14 19 L14 14 L8 14 L8 19 L3 19 Z"
          stroke={active ? 'var(--blue-hero)' : 'var(--ink-40)'}
          strokeWidth="1.8" fill={active ? 'var(--blue-hero)' : 'none'}
          fillOpacity={active ? 0.12 : 0} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    key: 'map', path: '/map', label: '지도',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <path d="M11 2 C7.5 2 5 5 5 8.5 C5 13 11 20 11 20 C11 20 17 13 17 8.5 C17 5 14.5 2 11 2 Z"
          stroke={active ? 'var(--blue-hero)' : 'var(--ink-40)'}
          strokeWidth="1.8" fill={active ? 'var(--blue-hero)' : 'none'} fillOpacity={active ? 0.12 : 0} />
        <circle cx="11" cy="8.5" r="2.5"
          stroke={active ? 'var(--blue-hero)' : 'var(--ink-40)'} strokeWidth="1.6" fill="none" />
      </svg>
    ),
  },
  {
    key: 'write', path: '/rides/new', label: '등록', center: true as const,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    icon: (_active?: boolean) => (
      <svg width="26" height="26" viewBox="0 0 26 26" fill="none">
        <line x1="13" y1="7" x2="13" y2="19" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
        <line x1="7" y1="13" x2="19" y2="13" stroke="#fff" strokeWidth="2.2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'history', path: '/history', label: '내역',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <rect x="3" y="3" width="16" height="16" rx="3"
          stroke={active ? 'var(--blue-hero)' : 'var(--ink-40)'} strokeWidth="1.8"
          fill={active ? 'var(--blue-hero)' : 'none'} fillOpacity={active ? 0.1 : 0} />
        <line x1="7" y1="8" x2="15" y2="8" stroke={active ? 'var(--blue-hero)' : 'var(--ink-40)'} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="7" y1="11" x2="15" y2="11" stroke={active ? 'var(--blue-hero)' : 'var(--ink-40)'} strokeWidth="1.6" strokeLinecap="round" />
        <line x1="7" y1="14" x2="11" y2="14" stroke={active ? 'var(--blue-hero)' : 'var(--ink-40)'} strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    key: 'profile', path: '/my', label: '프로필',
    icon: (active: boolean) => (
      <svg width="22" height="22" viewBox="0 0 22 22" fill="none">
        <circle cx="11" cy="8" r="4"
          stroke={active ? 'var(--blue-hero)' : 'var(--ink-40)'} strokeWidth="1.8"
          fill={active ? 'var(--blue-hero)' : 'none'} fillOpacity={active ? 0.12 : 0} />
        <path d="M3 20 C3 15 6.5 12.5 11 12.5 C15.5 12.5 19 15 19 20"
          stroke={active ? 'var(--blue-hero)' : 'var(--ink-40)'} strokeWidth="1.8" strokeLinecap="round" fill="none" />
      </svg>
    ),
  },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="bottom-nav">
      {TABS.map(tab => {
        const isActive = pathname === tab.path || (tab.path !== '/feed' && pathname.startsWith(tab.path))

        if (tab.center) {
          return (
            <Link key={tab.key} href={tab.path} className="bottom-nav-center-btn tap">
              {tab.icon(isActive)}
              <span className="bottom-nav-label" style={{ color: '#fff' }}>{tab.label}</span>
            </Link>
          )
        }

        return (
          <Link key={tab.key} href={tab.path}
            className="bottom-nav-item tap"
            style={{ color: isActive ? 'var(--blue-hero)' : 'var(--ink-40)' }}>
            {tab.icon(isActive)}
            <span className="bottom-nav-label">{tab.label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
