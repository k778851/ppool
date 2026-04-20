import { createContext, useContext } from 'react'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithKakao: () => Promise<void>
  signOut: () => Promise<void>
  refetchProfile: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
