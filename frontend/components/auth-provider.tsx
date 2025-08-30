"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

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
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const mockUser: User = {
      id: "1",
      email: "demo@trash2cash.com",
      name: "Demo User",
      role: "user",
      points: 150,
    }
    setUser(mockUser)
    localStorage.setItem("trash2cash_user", JSON.stringify(mockUser))

    // Check for existing user session
    // const savedUser = localStorage.getItem("trash2cash_user")
    // if (savedUser) {
    //   setUser(JSON.parse(savedUser))
    // }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - replace with real auth
    const mockUser: User = {
      id: "1",
      email,
      name: "John Doe",
      role: "user",
      points: 150,
    }
    localStorage.setItem("trash2cash_user", JSON.stringify(mockUser))
    setUser(mockUser)
  }

  const logout = () => {
    localStorage.removeItem("trash2cash_user")
    setUser(null)
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
