import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '../services/authService'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token')
        if (token) {
          const response = await authService.getMe()
          if (response.user) {
            setUser(response.user)
          } else {
            localStorage.removeItem('token')
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error)
        localStorage.removeItem('token')
      } finally {
        setLoading(false)
      }
    }

    initAuth()
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await authService.login(credentials)
      
      if (response.user && response.token) {
        localStorage.setItem('token', response.token)
        setUser(response.user)
        toast.success('Welcome back to NotesHub!')
        return { success: true }
      }
      
      return { success: false, message: 'Login failed' }
    } catch (error) {
      const message = error.response?.data?.message || 'Login failed'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const signup = async (userData) => {
    try {
      setLoading(true)
      const response = await authService.signup(userData)
      
      if (response.user && response.token) {
        localStorage.setItem('token', response.token)
        setUser(response.user)
        toast.success('Welcome to NotesHub!')
        return { success: true }
      }
      
      return { success: false, message: 'Signup failed' }
    } catch (error) {
      const message = error.response?.data?.message || 'Signup failed'
      toast.error(message)
      return { success: false, message }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      await authService.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      toast.success('Logged out successfully')
    }
  }

  const updateUser = (updatedUser) => {
    setUser(prev => ({ ...prev, ...updatedUser }))
  }

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
