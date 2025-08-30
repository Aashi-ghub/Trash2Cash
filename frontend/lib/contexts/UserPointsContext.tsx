"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/components/auth-provider'

interface UserPointsData {
  totalPoints: number
  monthlyPoints: number
  rank: string
  nextRankPoints: number
  co2Saved: number
  loading: boolean
  error: string | null
}

interface UserPointsContextType {
  userPoints: UserPointsData | null
  refreshUserPoints: () => Promise<void>
}

const UserPointsContext = createContext<UserPointsContextType | undefined>(undefined)

export function UserPointsProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [userPoints, setUserPoints] = useState<UserPointsData | null>(null)

  const fetchUserPoints = async () => {
    if (!user) return

    try {
      const response = await apiClient.getRewardsSummary()
      
      // Handle both direct data response and wrapped response
      const data = response.data || response
      
      if (data && (data.total_points !== undefined || data.totalPoints !== undefined)) {
        const pointsData = {
          totalPoints: data.total_points || data.totalPoints || 0,
          monthlyPoints: data.monthly_points || data.monthlyPoints || 0,
          rank: data.rank || 'Eco Warrior',
          nextRankPoints: data.next_rank_points || data.nextRankPoints || 0,
          co2Saved: data.co2_saved || 0,
          loading: false,
          error: null,
        }
        setUserPoints(pointsData)
      } else {
        setUserPoints({
          totalPoints: 0,
          monthlyPoints: 0,
          rank: 'Eco Warrior',
          nextRankPoints: 0,
          co2Saved: 0,
          loading: false,
          error: 'Invalid response format',
        })
      }
    } catch (err) {
      setUserPoints({
        totalPoints: 0,
        monthlyPoints: 0,
        rank: 'Eco Warrior',
        nextRankPoints: 0,
        co2Saved: 0,
        loading: false,
        error: 'Failed to load points',
      })
    }
  }

  const refreshUserPoints = async () => {
    setUserPoints(prev => prev ? { ...prev, loading: true } : null)
    await fetchUserPoints()
  }

  useEffect(() => {
    if (user && user.id) {
      fetchUserPoints()
    } else {
      setUserPoints(null)
    }
  }, [user, user?.id])

  return (
    <UserPointsContext.Provider value={{ userPoints, refreshUserPoints }}>
      {children}
    </UserPointsContext.Provider>
  )
}

export function useUserPoints() {
  const context = useContext(UserPointsContext)
  if (context === undefined) {
    throw new Error('useUserPoints must be used within a UserPointsProvider')
  }
  return context
}
