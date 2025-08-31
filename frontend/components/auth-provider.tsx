"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient, User as ApiUser } from "@/lib/api"
import { tokenUtils, StoredUser } from "@/lib/auth-utils"

interface User {
  id: string
  email: string
  name: string
  role: "user" | "host" | "admin"
  points: number
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = async () => {
    try {
      const token = tokenUtils.getToken()
      if (!token) {
        // No token, user is not logged in
        setUser(null)
        return
      }

      // Get user info from backend
      const response = await apiClient.getCurrentUser()
      if (response.status === 'success' && response.data) {
        const apiUser = response.data
        const user: User = {
          id: apiUser.user_id, // Use user_id from database
          email: apiUser.email,
          name: apiUser.display_name || apiUser.username || apiUser.email.split('@')[0],
          role: apiUser.role === 'admin' ? 'admin' : apiUser.role === 'host' ? 'host' : 'user',
          points: 150, // Default points for now
        }
        setUser(user)
        tokenUtils.setUser(user)
      } else {
        // Invalid token, clear auth
        tokenUtils.clearAuth()
        setUser(null)
      }
    } catch (error) {
      console.error("Failed to refresh user:", error)
      // Clear invalid auth
      tokenUtils.clearAuth()
      setUser(null)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing token first
        const token = tokenUtils.getToken()
        const savedUser = tokenUtils.getUser()
        
        if (token && savedUser) {
          // We have both token and user, try to refresh
          setUser(savedUser)
          try {
            await refreshUser()
          } catch (error) {
            console.error("Failed to refresh user, clearing auth:", error)
            // If refresh fails, clear auth but don't get stuck
            tokenUtils.clearAuth()
            setUser(null)
          }
        } else if (token) {
          // Only token, try to get user from backend
          try {
            await refreshUser()
          } catch (error) {
            console.error("Failed to get user with token, clearing auth:", error)
            // If getting user fails, clear auth but don't get stuck
            tokenUtils.clearAuth()
            setUser(null)
          }
        } else {
          // No saved data, user is not logged in
          setUser(null)
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
        // Clear invalid auth
        tokenUtils.clearAuth()
        setUser(null)
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login with:', email);
      
      const response = await apiClient.login({ email, password })
      console.log('📡 Login response:', response);
      
      if (response.status === 'success' && response.data?.token) {
        // Store the JWT token
        tokenUtils.setToken(response.data.token)
        console.log('🔑 Token stored');
        
        // Get user info
        const userResponse = await apiClient.getCurrentUser()
        console.log('👤 User response:', userResponse);
        
        if (userResponse.status === 'success' && userResponse.data) {
          const apiUser = userResponse.data
          const user: User = {
            id: apiUser.user_id, // Use user_id from database
            email: apiUser.email,
            name: apiUser.display_name || apiUser.username || apiUser.email.split('@')[0],
            role: apiUser.role === 'admin' ? 'admin' : apiUser.role === 'host' ? 'host' : 'user',
            points: 150, // Default points for now
          }
          console.log('✅ Setting user data:', user);
          setUser(user)
          tokenUtils.setUser(user)
        } else {
          throw new Error('Failed to get user profile')
        }
      } else {
        throw new Error(response.message || 'Login failed')
      }
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = () => {
    tokenUtils.clearAuth()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
