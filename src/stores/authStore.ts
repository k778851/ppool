import { createContext, useContext } from 'react'
import type { User } from '../types'

interface AuthContextValue {
  user: User | null
  loading: boolean
  signInWithZauth: (zauthId: string, password: string) => Promise<User>
  signOut: () => void
  refetchProfile: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

export function useAuthContext() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuthContext must be used inside AuthProvider')
  return ctx
}
