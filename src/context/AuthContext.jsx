import React, { createContext, useContext, useState, useEffect } from 'react'
import { authAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    try {
      const stored = localStorage.getItem('user')
      if (stored) setUser(JSON.parse(stored))
    } catch {}
    setLoading(false)
  }, [])

  const login = async (credentials) => {
    const res      = await authAPI.login(credentials)
    const userData = res.data
    localStorage.setItem('token', userData.accessToken)
    localStorage.setItem('user',  JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const register = async (data) => {
    const res      = await authAPI.register(data)
    const userData = res.data
    localStorage.setItem('token', userData.accessToken)
    localStorage.setItem('user',  JSON.stringify(userData))
    setUser(userData)
    return userData
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
    toast.success('Logged out successfully')
  }

  const isAdmin = () => user?.role === 'ADMIN'
  const isGuide = () => user?.role === 'GUIDE'

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAdmin, isGuide }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
