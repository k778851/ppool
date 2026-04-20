import { HashRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext } from './stores/authStore'
import { useAuth } from './hooks/useAuth'
import { AuthGuard } from './components/layout/AuthGuard'

import { LoginPage } from './pages/LoginPage'
import { AuthCallbackPage } from './pages/AuthCallbackPage'
import { SignupPage } from './pages/SignupPage'
import { PendingPage } from './pages/PendingPage'
import { BannedPage } from './pages/BannedPage'
import { MainPage } from './pages/MainPage'
import { RideDetailPage } from './pages/RideDetailPage'
import { RideNewPage } from './pages/RideNewPage'
import { MyPage } from './pages/MyPage'
import { AdminPage } from './pages/admin/AdminPage'

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 1000 * 60 } },
})

function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <HashRouter>
        <AuthProvider>
          <Routes>
            {/* 공개 라우트 */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/auth/callback" element={<AuthCallbackPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/pending" element={<PendingPage />} />
            <Route path="/banned" element={<BannedPage />} />

            {/* 약관 페이지 (Sprint 4에서 내용 채움) */}
            <Route path="/terms" element={<div className="page-container"><h1>이용약관</h1></div>} />
            <Route path="/privacy" element={<div className="page-container"><h1>개인정보 처리방침</h1></div>} />
            <Route path="/location-terms" element={<div className="page-container"><h1>위치정보 이용약관</h1></div>} />

            {/* 인증 필요 라우트 */}
            <Route path="/" element={<AuthGuard><MainPage /></AuthGuard>} />
            <Route path="/rides/new" element={<AuthGuard><RideNewPage /></AuthGuard>} />
            <Route path="/rides/:id" element={<AuthGuard><RideDetailPage /></AuthGuard>} />
            <Route path="/my" element={<AuthGuard><MyPage /></AuthGuard>} />

            {/* 관리자 전용 라우트 */}
            <Route path="/admin/*" element={<AuthGuard requireAdmin><AdminPage /></AuthGuard>} />

            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </HashRouter>
    </QueryClientProvider>
  )
}
