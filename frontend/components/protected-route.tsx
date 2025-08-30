"use client"

import type React from "react"

import { useAuth } from "./auth-provider"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface ProtectedRouteProps {
  children: React.ReactNode
  requiredRole?: "user" | "host" | "admin"
}

export function ProtectedRoute({ children, requiredRole }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // if (!isLoading && !user) {
    //   router.push("/login")
    // } else if (user && requiredRole && user.role !== requiredRole && user.role !== "admin") {
    //   router.push("/dashboard")
    // }
  }, [user, isLoading, requiredRole, router])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  // if (!user) {
  //   return null
  // }

  // if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
  //   return null
  // }

  return <>{children}</>
}
