import React, { createContext, useContext, useState, useEffect } from 'react'
const AuthContext = createContext()

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem('user')) || null)
  const isAuthenticated = !!user
  const role = user?.role

  const login = async (email, password, selectedRole) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role: selectedRole })
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
      }
      return data
    } catch (err) {
      return { success: false, message: 'Network error' }
    }
  }

  const signup = async (name, email, password, role) => {
    try {
      const res = await fetch('http://localhost:5000/api/users/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role })
      })
      const data = await res.json()
      if (data.success) {
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
        setUser(data.user)
      }
      return data
    } catch (err) {
      return { success: false, message: 'Network error' }
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, role, isAuthenticated, login, signup, logout }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
