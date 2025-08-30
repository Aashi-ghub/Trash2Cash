import { useState, useEffect } from 'react'
import { apiClient } from '@/lib/api'
import { useAuth } from '@/components/auth-provider'

export interface UserStats {
  totalPoints: number
  monthlyPoints: number
  itemsRecycled: number
  co2Saved: number
  rank: string
  nextRankPoints: number
}

export interface HostStats {
  totalBins: number
  activeBins: number
  totalCollections: number
  monthlyRevenue: number
  avgFillLevel: number
  topPerformingBin: string
}

export interface UserActivity {
  id: string
  type: 'recycle' | 'redeem'
  item: string
  points: number
  date: string
  location: string
}

export interface HostBin {
  id: string
  name: string
  status: 'OK' | 'Needs Attention' | 'Maintenance'
  fillLevel: number
  lastCollection: string
  revenue: number
}

export interface LeaderboardEntry {
  rank: number
  name: string
  points: number
  avatar: string
  isCurrentUser?: boolean
}

export function useUserDashboardData(userPoints?: { totalPoints: number } | null) {
  const { user } = useAuth()
  const [userStats, setUserStats] = useState<UserStats | null>(null)
  const [userActivity, setUserActivity] = useState<UserActivity[]>([])
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUserData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Fetch rewards summary
      const rewardsResponse = await apiClient.getRewardsSummary()
      if (rewardsResponse.status === 'success' && rewardsResponse.data) {
        const rewards = rewardsResponse.data
        setUserStats({
          totalPoints: rewards.total_points || 0,
          monthlyPoints: rewards.monthly_points || 0,
          itemsRecycled: rewards.total_events || 0,
          co2Saved: rewards.co2_saved || 0,
          rank: rewards.rank || 'Eco Warrior',
          nextRankPoints: rewards.next_rank_points || 0,
        })
      }

      // Fetch rewards history for activity
      const activityResponse = await apiClient.getRewardsHistory()
      if (activityResponse.status === 'success' && activityResponse.data) {
        const activities = activityResponse.data.map((item: any, index: number) => ({
          id: item.id || index.toString(),
          type: item.points_earned > 0 ? 'recycle' : 'redeem',
          item: item.reason || 'Recycling Activity',
          points: item.points_earned || 0,
          date: new Date(item.created_at).toLocaleDateString(),
          location: item.bin_events?.bins?.location || 'Smart Bin',
        }))
        setUserActivity(activities.slice(0, 5)) // Show last 5 activities
      }

      // Create leaderboard with real user data and some mock competitors
      const currentUserPoints = userPoints?.totalPoints || userStats?.totalPoints || 0
      const userRank = currentUserPoints > 2450 ? 1 : currentUserPoints > 2100 ? 2 : currentUserPoints > 1180 ? 3 : 4
      
      const leaderboardData = [
        { rank: 1, name: "EcoChampion", points: 2450, avatar: "EC" },
        { rank: 2, name: "GreenWarrior", points: 2100, avatar: "GW" },
        { rank: 3, name: "RecycleKing", points: 1180, avatar: "RK" },
        { rank: 4, name: "EcoExplorer", points: 890, avatar: "EE" },
      ]
      
      // Insert user at correct rank
      const updatedLeaderboard = [...leaderboardData]
      const userEntry = {
        rank: userRank,
        name: user.name || "You",
        points: currentUserPoints,
        avatar: "YU",
        isCurrentUser: true
      }
      
      // Remove user from their current position if they exist
      const filteredLeaderboard = updatedLeaderboard.filter(entry => !entry.isCurrentUser)
      
      // Insert user at correct rank
      filteredLeaderboard.splice(userRank - 1, 0, userEntry)
      
      // Update ranks
      const finalLeaderboard = filteredLeaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))
      
      setLeaderboard(finalLeaderboard)

    } catch (err) {
      console.error('Error fetching user dashboard data:', err)
      setError('Failed to load dashboard data')
      
      // Fallback to mock data if API fails
      setUserStats({
        totalPoints: 1247,
        monthlyPoints: 89,
        itemsRecycled: 156,
        co2Saved: 23.4,
        rank: "Eco Warrior",
        nextRankPoints: 253,
      })
      setUserActivity([
        { id: "1", type: "recycle", item: "Plastic Bottles", points: 15, date: "2024-01-15", location: "Downtown Mall" },
        { id: "2", type: "redeem", item: "Coffee Voucher", points: -50, date: "2024-01-14", location: "Rewards Store" },
        { id: "3", type: "recycle", item: "Aluminum Cans", points: 12, date: "2024-01-13", location: "City Park" },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUserData()
  }, [user])

  // Update leaderboard when userPoints changes
  useEffect(() => {
    if (user && userStats) {
      const currentUserPoints = userPoints?.totalPoints || userStats.totalPoints || 0
      const userRank = currentUserPoints > 2450 ? 1 : currentUserPoints > 2100 ? 2 : currentUserPoints > 1180 ? 3 : 4
      
      const leaderboardData = [
        { rank: 1, name: "EcoChampion", points: 2450, avatar: "EC" },
        { rank: 2, name: "GreenWarrior", points: 2100, avatar: "GW" },
        { rank: 3, name: "RecycleKing", points: 1180, avatar: "RK" },
        { rank: 4, name: "EcoExplorer", points: 890, avatar: "EE" },
      ]
      
      // Insert user at correct rank
      const updatedLeaderboard = [...leaderboardData]
      const userEntry = {
        rank: userRank,
        name: user.name || "You",
        points: currentUserPoints,
        avatar: "YU",
        isCurrentUser: true
      }
      
      // Remove user from their current position if they exist
      const filteredLeaderboard = updatedLeaderboard.filter(entry => !entry.isCurrentUser)
      
      // Insert user at correct rank
      filteredLeaderboard.splice(userRank - 1, 0, userEntry)
      
      // Update ranks
      const finalLeaderboard = filteredLeaderboard.map((entry, index) => ({
        ...entry,
        rank: index + 1
      }))
      
      setLeaderboard(finalLeaderboard)
    }
  }, [user, userStats, userPoints?.totalPoints])

  return {
    userStats,
    userActivity,
    leaderboard,
    loading,
    error,
    refetch: fetchUserData,
  }
}

export function useHostDashboardData() {
  const { user } = useAuth()
  const [hostStats, setHostStats] = useState<HostStats | null>(null)
  const [hostBins, setHostBins] = useState<HostBin[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchHostData = async () => {
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      // Fetch user's bins
      const binsResponse = await apiClient.getBinsByUser(user.id)
      if (binsResponse.status === 'success' && binsResponse.data) {
        const bins = binsResponse.data.map((bin: any) => ({
          id: bin.bin_id,
          name: bin.location || `Bin ${bin.bin_code}`,
          status: bin.status === 'active' ? 'OK' : 'Needs Attention',
          fillLevel: bin.fill_level_pct || 0,
          lastCollection: bin.last_collection || 'Unknown',
          revenue: bin.revenue || 0,
        }))
        setHostBins(bins)

        // Calculate stats from bins data
        const activeBins = bins.filter((bin: any) => bin.status === 'OK').length
        const avgFillLevel = bins.length > 0 
          ? bins.reduce((sum: number, bin: any) => sum + bin.fillLevel, 0) / bins.length 
          : 0
        const totalRevenue = bins.reduce((sum: number, bin: any) => sum + bin.revenue, 0)

        setHostStats({
          totalBins: bins.length,
          activeBins,
          totalCollections: bins.length * 20, // Mock calculation
          monthlyRevenue: totalRevenue,
          avgFillLevel: Math.round(avgFillLevel),
          topPerformingBin: bins[0]?.name || 'No bins',
        })
      }

    } catch (err) {
      console.error('Error fetching host dashboard data:', err)
      setError('Failed to load dashboard data')
      
      // Fallback to mock data if API fails
      setHostStats({
        totalBins: 12,
        activeBins: 10,
        totalCollections: 234,
        monthlyRevenue: 153550,
        avgFillLevel: 67,
        topPerformingBin: "Downtown Mall",
      })
      setHostBins([
        { id: "1", name: "Downtown Mall", status: "OK", fillLevel: 75, lastCollection: "2 hours ago", revenue: 37350 },
        { id: "2", name: "City Park", status: "Needs Attention", fillLevel: 95, lastCollection: "1 day ago", revenue: 26560 },
        { id: "3", name: "Office Building", status: "OK", fillLevel: 45, lastCollection: "4 hours ago", revenue: 23240 },
      ])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchHostData()
  }, [user])

  return {
    hostStats,
    hostBins,
    loading,
    error,
    refetch: fetchHostData,
  }
}
