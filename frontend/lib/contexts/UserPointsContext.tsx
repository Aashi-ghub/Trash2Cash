"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/components/auth-provider'

interface UserPointsData {
  totalPoints: number
  monthlyPoints: number
  rank: string
  nextRankPoints: number
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
      
      if (response.status === 'success' && response.data) {
        const data = response.data
        const pointsData = {
          totalPoints: data.total_points || 0,
          monthlyPoints: data.monthly_points || 0,
          rank: data.rank || 'Eco Warrior',
          nextRankPoints: data.next_rank_points || 0,
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
          loading: false,
          error: response.message || 'Failed to fetch points',
        })
      }
    } catch (err) {
      console.error('Error fetching user points:', err)
      setUserPoints({
        totalPoints: 0,
        monthlyPoints: 0,
        rank: 'Eco Warrior',
        nextRankPoints: 0,
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
