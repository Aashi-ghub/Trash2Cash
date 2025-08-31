"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  Bell, 
  Target, 
  Gift, 
  TrendingUp, 
  AlertCircle, 
  CheckCircle, 
  X,
  Zap,
  Star,
  Coins
} from "lucide-react"

interface AINotification {
  id: string
  type: 'goal' | 'offer' | 'achievement' | 'tip' | 'alert'
  title: string
  message: string
  pointsNeeded?: number
  currentPoints?: number
  targetPoints?: number
  reward?: string
  progress?: number
  priority: 'high' | 'medium' | 'low'
  timestamp: Date
  isRead: boolean
}

// Mock AI notifications for MVP
const mockAINotifications: AINotification[] = [
  {
    id: '1',
    type: 'goal',
    title: '🎯 Goal Alert: Coffee Shop Voucher',
    message: 'You need 50 more points to redeem a free coffee voucher!',
    pointsNeeded: 50,
    currentPoints: 150,
    targetPoints: 200,
    reward: 'Free Coffee Voucher',
    progress: 75,
    priority: 'high',
    timestamp: new Date(),
    isRead: false
  },
  {
    id: '2',
    type: 'offer',
    title: '🔥 Limited Time: Movie Ticket Offer',
    message: 'Recycle 3 more items (30 points) to unlock 50% off movie tickets!',
    pointsNeeded: 30,
    currentPoints: 120,
    targetPoints: 150,
    reward: '50% Off Movie Tickets',
    progress: 80,
    priority: 'high',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    isRead: false
  },
  {
    id: '3',
    type: 'achievement',
    title: '🏆 Achievement Unlocked: Eco Warrior',
    message: 'Congratulations! You\'ve reached 200 points and unlocked the Eco Warrior badge.',
    currentPoints: 200,
    targetPoints: 200,
    reward: 'Eco Warrior Badge',
    progress: 100,
    priority: 'medium',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    isRead: true
  },
  {
    id: '4',
    type: 'tip',
    title: '💡 Smart Tip: Peak Hours',
    message: 'Visit bins between 2-4 PM for faster processing and bonus points!',
    priority: 'low',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    isRead: true
  },
  {
    id: '5',
    type: 'alert',
    title: '⚠️ High Fill Level Alert',
    message: 'BIN001 at Koramangala is 85% full. Consider visiting soon for optimal points!',
    priority: 'medium',
    timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
    isRead: false
  },
  {
    id: '6',
    type: 'goal',
    title: '🎁 Weekend Special: Restaurant Discount',
    message: 'Need 80 more points to get 25% off at your favorite restaurant!',
    pointsNeeded: 80,
    currentPoints: 220,
    targetPoints: 300,
    reward: '25% Restaurant Discount',
    progress: 73,
    priority: 'medium',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    isRead: false
  }
]

export function AINotifications() {
  const { user } = useAuth()
  const [notifications, setNotifications] = useState<AINotification[]>([])
  const [showAll, setShowAll] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch AI notifications from API
  useEffect(() => {
    const fetchNotifications = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        setLoading(true)
        setError(null)
        
        const token = localStorage.getItem('trash2cash_token')
        if (!token) {
          throw new Error('No authentication token')
        }

        const response = await fetch('https://trash2cash-j8zs.onrender.com/api/ai-notifications', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })

        if (!response.ok) {
          throw new Error('Failed to fetch notifications')
        }

        const data = await response.json()
        
        if (data.success) {
          // Convert API response to component format
          const formattedNotifications = data.notifications.map((notification: any) => ({
            ...notification,
            timestamp: new Date(notification.timestamp)
          }))
          setNotifications(formattedNotifications)
        } else {
          throw new Error(data.error || 'Failed to fetch notifications')
        }
      } catch (err) {
        console.error('Error fetching AI notifications:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch notifications')
        // Fallback to mock data for MVP
        setNotifications(mockAINotifications)
      } finally {
        setLoading(false)
      }
    }

    fetchNotifications()
  }, [user])

  useEffect(() => {
    const unread = notifications.filter(n => !n.isRead).length
    setUnreadCount(unread)
  }, [notifications])

  const markAsRead = (id: string) => {
    setNotifications(prev => 
      prev.map(n => n.id === id ? { ...n, isRead: true } : n)
    )
  }

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(n => ({ ...n, isRead: true }))
    )
  }

  const getNotificationIcon = (type: AINotification['type']) => {
    switch (type) {
      case 'goal': return <Target className="w-5 h-5" />
      case 'offer': return <Gift className="w-5 h-5" />
      case 'achievement': return <Star className="w-5 h-5" />
      case 'tip': return <Zap className="w-5 h-5" />
      case 'alert': return <AlertCircle className="w-5 h-5" />
      default: return <Bell className="w-5 h-5" />
    }
  }

  const getPriorityColor = (priority: AINotification['priority']) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-blue-600 bg-blue-50 border-blue-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getTypeColor = (type: AINotification['type']) => {
    switch (type) {
      case 'goal': return 'text-purple-600'
      case 'offer': return 'text-green-600'
      case 'achievement': return 'text-yellow-600'
      case 'tip': return 'text-blue-600'
      case 'alert': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const displayedNotifications = showAll ? notifications : notifications.slice(0, 3)

  return (
    <Card className="border-border/50">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <CardTitle className="font-serif flex items-center gap-2">
            <Bell className="w-5 h-5 text-primary" />
            AI Notifications
          </CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" className="text-xs">
              {unreadCount} new
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-2">
          {unreadCount > 0 && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={markAllAsRead}
              className="text-xs"
            >
              Mark all read
            </Button>
          )}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => setShowAll(!showAll)}
          >
            {showAll ? 'Show less' : 'Show all'}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading && (
          <div className="flex items-center justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <span className="ml-2 text-sm text-muted-foreground">Loading AI insights...</span>
          </div>
        )}

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">⚠️ {error}</p>
            <p className="text-xs text-red-500 mt-1">Using demo data for now</p>
          </div>
        )}

        <div className="space-y-4">
          <AnimatePresence>
            {displayedNotifications.map((notification) => (
              <motion.div
                key={notification.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className={`p-4 rounded-lg border transition-all ${
                  notification.isRead 
                    ? 'bg-muted/30 border-muted' 
                    : 'bg-background border-border shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3 flex-1">
                    <div className={`mt-1 ${getTypeColor(notification.type)}`}>
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="font-medium text-sm">{notification.title}</h4>
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {notification.message}
                      </p>
                      
                      {/* Progress for goal/offer notifications */}
                      {notification.pointsNeeded && notification.progress && (
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Progress: {notification.currentPoints}/{notification.targetPoints} points
                            </span>
                            <span className="font-medium">
                              Need {notification.pointsNeeded} more
                            </span>
                          </div>
                          <Progress value={notification.progress} className="h-2" />
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-muted-foreground">
                              Reward: {notification.reward}
                            </span>
                            <span className="font-medium text-green-600">
                              {notification.progress}% complete
                            </span>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs text-muted-foreground">
                          {notification.timestamp.toLocaleTimeString([], { 
                            hour: '2-digit', 
                            minute: '2-digit' 
                          })}
                        </span>
                        {!notification.isRead && (
                          <Badge variant="secondary" className="text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {!notification.isRead && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => markAsRead(notification.id)}
                        className="h-6 w-6 p-0"
                      >
                        <CheckCircle className="w-4 h-4" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {notifications.length === 0 && (
            <div className="text-center py-8">
              <Bell className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No notifications yet</p>
              <p className="text-sm text-muted-foreground">
                Start recycling to get AI-powered insights and offers!
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
