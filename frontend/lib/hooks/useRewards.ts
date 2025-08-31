import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/components/auth-provider'
import { useUserPoints } from '@/lib/contexts/UserPointsContext'

export interface Reward {
  id: number
  name: string
  description: string
  points: number
  category: string
  image: string
  rating: number
  available: boolean
  popular: boolean
}

export interface RedemptionHistory {
  id: string
  reward: string
  points: number
  date: string
  status: string
  code?: string
  trackingNumber?: string
}

export interface UserRewardsData {
  totalPoints: number
  monthlyPoints: number
  rank: string
  nextRankPoints: number
}

export function useRewards() {
  const { user } = useAuth()
  const { userPoints, refreshUserPoints } = useUserPoints()
  const [redemptionHistory, setRedemptionHistory] = useState<RedemptionHistory[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserRewardsData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Fetch rewards history for redemption history
      const historyResponse = await apiClient.getRewardsHistory()
      
      if (historyResponse.status === 'success' && historyResponse.data) {
        const history = historyResponse.data
          .filter((item: any) => item.points_earned < 0) // Only show redemptions (negative points)
          .map((item: any, index: number) => ({
            id: item.id || index.toString(),
            reward: item.reason || 'Reward Redemption',
            points: Math.abs(item.points_earned) || 0,
            date: new Date(item.created_at).toLocaleDateString(),
            status: 'delivered', // Mock status for now
            code: `CODE${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
          }))
        setRedemptionHistory(history.slice(0, 10)) // Show last 10 redemptions
      }

    } catch (err) {
      console.error('Error fetching rewards data:', err)
      setError('Failed to load rewards data')
      
      setRedemptionHistory([
        {
          id: "1",
          reward: "Starbucks Gift Card",
          points: 500,
          date: "2024-01-10",
          status: "delivered",
          code: "SB123456789",
        },
        {
          id: "2",
          reward: "Eco-Friendly Water Bottle",
          points: 800,
          date: "2024-01-05",
          status: "shipped",
          trackingNumber: "TR987654321",
        },
        {
          id: "3",
          reward: "Netflix Subscription",
          points: 600,
          date: "2023-12-28",
          status: "delivered",
          code: "NF456789123",
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  const redeemReward = async (reward: Reward) => {
    if (!user || !userPoints) return false

    if (userPoints.totalPoints < reward.points) {
      throw new Error('Insufficient points!')
    }

    try {
      console.log('🔄 Starting redemption for:', reward.name, 'Cost:', reward.points)
      
      // Call the backend API to redeem the reward
      const response = await apiClient.redeemReward(reward.name, reward.points)
      
      console.log('📡 Redemption response:', response)
      
      if (response.status === 'success') {
        console.log('✅ Redemption successful, refreshing data...')
        
        // Refresh the shared user points context
        await refreshUserPoints()
        
        // Add a small delay to ensure the backend has processed the redemption
        await new Promise(resolve => setTimeout(resolve, 500))
        
        // Refresh redemption history
        await fetchUserRewardsData()

        console.log('✅ Data refresh completed')
        return true
      } else {
        console.error('❌ Redemption failed:', response)
        throw new Error(response.message || 'Failed to redeem reward')
      }
    } catch (err) {
      console.error('❌ Error redeeming reward:', err)
      throw err
    }
  }

  useEffect(() => {
    fetchUserRewardsData()
  }, [user])

  return {
    userData: userPoints,
    redemptionHistory,
    loading,
    error,
    redeemReward,
    refetch: fetchUserRewardsData,
  }
}
