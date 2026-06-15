import { createContext, useContext, useEffect, useState } from 'react'
import { api, setAuthToken, getAuthToken, setUnauthorizedHandler } from '../api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(getAuthToken())
  const [ready, setReady] = useState(false) // finished the initial token check

  // Log out automatically if any protected request reports an expired session.
  useEffect(() => {
    setUnauthorizedHandler(() => {
      setAuthToken(null)
      setToken(null)
      setUser(null)
    })
  }, [])

  // On load, if we have a token, confirm it and fetch the user.
  useEffect(() => {
    let active = true
    const init = async () => {
      if (!getAuthToken()) {
        setReady(true)
        return
      }
      try {
        const { user } = await api.me()
        if (active) setUser(user)
      } catch {
        setAuthToken(null)
        if (active) setToken(null)
      } finally {
        if (active) setReady(true)
      }
    }
    init()
    return () => { active = false }
  }, [])

  const login = async (email, password) => {
    const res = await api.login(email, password)
    setAuthToken(res.token)
    setToken(res.token)
    setUser(res.user)
    return res.user
  }

  const register = async (payload) => {
    const res = await api.register(payload)
    setAuthToken(res.token)
    setToken(res.token)
    setUser(res.user)
    return res.user
  }

  const logout = () => {
    setAuthToken(null)
    setToken(null)
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, ready, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
