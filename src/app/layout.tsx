import type { Metadata, Viewport } from 'next'
import { Providers } from './providers'
import '../styles.css'
import '../index.css'

export const metadata: Metadata = {
  title: 'PPOOL — 지파 청년부 카풀',
  description: '지파 청년부 전용 내부 카풀 서비스',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#1A38F5',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
