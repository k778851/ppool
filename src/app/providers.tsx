'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthContext } from '../stores/authStore'
import { useAuth } from '../hooks/useAuth'
import { useState } from 'react'

function AuthProvider({ children }: { children: React.ReactNode }) {
  const auth = useAuth()
  return <AuthContext.Provider value={auth}>{children}</AuthContext.Provider>
}

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () => new QueryClient({ defaultOptions: { queries: { staleTime: 1000 * 60 } } })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>{children}</AuthProvider>
    </QueryClientProvider>
  )
}
