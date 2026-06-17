import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { Session } from '@supabase/supabase-js'
import { getCurrentProfile, signInWithPassword, signOut, type ProfileWithCompany } from '@ginqs/core'
import { supabase } from '../lib/supabase'

interface AuthContextValue {
  session: Session | null
  profile: ProfileWithCompany | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<Session | null>(null)
  const [profile, setProfile] = useState<ProfileWithCompany | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    async function loadProfile() {
      try {
        const p = await getCurrentProfile(supabase)
        if (active) setProfile(p)
      } catch {
        if (active) setProfile(null)
      }
    }

    supabase.auth.getSession().then(async ({ data }) => {
      if (!active) return
      setSession(data.session)
      if (data.session) await loadProfile()
      if (active) setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange(async (_event, newSession) => {
      if (!active) return
      setSession(newSession)
      if (newSession) {
        await loadProfile()
      } else {
        setProfile(null)
      }
    })

    return () => {
      active = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      profile,
      loading,
      async signIn(email, password) {
        await signInWithPassword(supabase, email, password)
        // onAuthStateChange will refresh session + profile.
      },
      async logout() {
        await signOut(supabase)
      },
    }),
    [session, profile, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>')
  return ctx
}
