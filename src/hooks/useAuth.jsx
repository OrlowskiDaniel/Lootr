import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabaseClient'

// ─── Context ────────────────────────────────────────────────────────────────
const AuthContext = createContext(null)

// ─── Provider ───────────────────────────────────────────────────────────────
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // TODO: Get initial session from Supabase
    // supabase.auth.getSession().then(({ data: { session } }) => { ... })

    // TODO: Listen for auth state changes
    // const { data: { subscription } } = supabase.auth.onAuthStateChange(...)

    // Placeholder user for UI development
    setUser({ id: '1', username: 'GamerPro', avatar_url: null })
    setLoading(false)
  }, [])

  const value = {
    user,
    session,
    loading,
    // TODO: implement these with Supabase Auth
    signIn: async (email, password) => {},
    signUp: async (email, password, username) => {},
    signOut: async () => {},
    signInWithDiscord: async () => {},
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}
