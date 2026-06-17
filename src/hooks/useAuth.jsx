import { useState, useEffect, useRef, createContext, useContext } from 'react'
import { supabase } from '../lib/supabaseClient'

const AuthContext = createContext(null)

async function fetchProfile(userId) {
  const { data } = await supabase
    .from('profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle()
  return data ?? null
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const initializedRef = useRef(false) // guard against StrictMode double-run

  useEffect(() => {
    // Prevent double-initialization from StrictMode or any re-mount
    if (initializedRef.current) return
    initializedRef.current = true

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const sessionUser = session?.user ?? null
        setUser(sessionUser)
        if (sessionUser) setProfile(await fetchProfile(sessionUser.id))
      } catch (err) {
        console.error('useAuth init error:', err)
      } finally {
        setLoading(false)
      }
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        const sessionUser = session?.user ?? null
        setUser(sessionUser)

        if (!sessionUser) {
          setProfile(null)
          return
        }

        if (event === 'SIGNED_IN') {
          await new Promise(r => setTimeout(r, 400))
          let prof = await fetchProfile(sessionUser.id)

          const metaUsername = sessionUser.user_metadata?.username
          if (metaUsername && prof && prof.username?.startsWith('user_')) {
            const { data: updated } = await supabase
              .from('profiles')
              .update({ username: metaUsername, avatar_url: '/default-avatar.png' })
              .eq('user_id', sessionUser.id)
              .select()
              .single()
            if (updated) prof = updated
          }

          setProfile(prof)
        } else {
          setProfile(await fetchProfile(sessionUser.id))
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    await supabase.auth.signOut()
  }

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within AuthProvider')
  return context
}