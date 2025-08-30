"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { apiClient, User as ApiUser } from "@/lib/api"

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
      // For now, we'll use a demo user since the backend doesn't have authentication yet
      // In a real implementation, this would fetch the current user from the backend
      const demoUser: User = {
        id: "1",
        email: "demo@trash2cash.com",
        name: "Demo User",
        role: "user",
        points: 150,
      }
      setUser(demoUser)
      localStorage.setItem("trash2cash_user", JSON.stringify(demoUser))
    } catch (error) {
      console.error("Failed to refresh user:", error)
    }
  }

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Check for existing user session
        const savedUser = localStorage.getItem("trash2cash_user")
        if (savedUser) {
          setUser(JSON.parse(savedUser))
        } else {
          // Initialize with demo user
          await refreshUser()
        }
      } catch (error) {
        console.error("Auth initialization failed:", error)
        // Fallback to demo user
        await refreshUser()
      } finally {
        setIsLoading(false)
      }
    }

    initializeAuth()
  }, [])

  const login = async (email: string, password: string) => {
    try {
      // For now, we'll simulate a login with demo data
      // In a real implementation, this would call the backend auth endpoint
      const demoUser: User = {
        id: "1",
        email,
        name: email.split('@')[0], // Use email prefix as name
        role: "user",
        points: 150,
      }
      
      localStorage.setItem("trash2cash_user", JSON.stringify(demoUser))
      setUser(demoUser)
    } catch (error) {
      console.error("Login failed:", error)
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem("trash2cash_user")
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
