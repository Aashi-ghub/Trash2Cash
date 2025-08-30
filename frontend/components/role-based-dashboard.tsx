"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import {
  MapPin,
  Gift,
  Leaf,
  TrendingUp,
  Award,
  Recycle,
  Navigation,
  Settings,
  Bell,
  ChevronDown,
  Menu,
  X,
  BarChart3,
  Users,
  AlertTriangle,
  Plus,
  Edit,
  Trash2,
  Activity,
  IndianRupee,
  Database,
  RefreshCw,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { ApiStatus } from "@/components/api-status"
import { DashboardSkeleton, HostDashboardSkeleton } from "@/components/ui/loading-skeleton"
import { useUserDashboardData, useHostDashboardData } from "@/lib/hooks/useDashboardData"
import { useUserPoints } from "@/lib/contexts/UserPointsContext"
import Link from "next/link"

type DashboardRole = "user" | "host"

// Fallback mock data for when API is not available
const fallbackUserStats = {
  totalPoints: 1247,
  monthlyPoints: 89,
  itemsRecycled: 156,
  co2Saved: 23.4,
  rank: "Eco Warrior",
  nextRankPoints: 253,
}

const fallbackHostStats = {
  totalBins: 12,
  activeBins: 10,
  totalCollections: 234,
  monthlyRevenue: 153550,
  avgFillLevel: 67,
  topPerformingBin: "Downtown Mall",
}

export default function RoleBasedDashboard() {
  const { user } = useAuth()
  const { userStats, loading } = useUserDashboardData()
  const { userPoints } = useUserPoints()
  const [currentRole, setCurrentRole] = useState<DashboardRole>("user")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false)

  // Persist role in localStorage
  useEffect(() => {
    const savedRole = localStorage.getItem("dashboardRole") as DashboardRole
    if (savedRole) {
      setCurrentRole(savedRole)
    }
  }, [])

  const handleRoleSwitch = (role: DashboardRole) => {
    setCurrentRole(role)
    localStorage.setItem("dashboardRole", role)
    setRoleDropdownOpen(false)
  }

  const userSidebarItems = [
    { icon: BarChart3, label: "Overview", href: "#overview" },
    { icon: MapPin, label: "Find Bins", href: "#map" },
    { icon: Gift, label: "Rewards", href: "/rewards" },
    { icon: Activity, label: "Activity", href: "#activity" },
    { icon: Award, label: "Leaderboard", href: "#leaderboard" },
    { icon: Bell, label: "Notifications", href: "#notifications" },
  ]

  const hostSidebarItems = [
    { icon: BarChart3, label: "Overview", href: "#overview" },
    { icon: MapPin, label: "Bin Management", href: "#bins" },
    { icon: TrendingUp, label: "Analytics", href: "#analytics" },
    { icon: Gift, label: "Rewards Config", href: "#rewards-config" },
    { icon: Users, label: "User Insights", href: "#users" },
    { icon: Settings, label: "System Health", href: "#health" },
  ]

  const sidebarItems = currentRole === "user" ? userSidebarItems : hostSidebarItems

  // Add API Status to sidebar items for testing
  const apiTestItems = [
    { icon: Database, label: "API Status", href: "#api-status" },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      {/* Top Navbar */}
      <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="flex justify-between items-center h-16 px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" className="lg:hidden" onClick={() => setSidebarOpen(!sidebarOpen)}>
              {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Recycle className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="font-serif font-bold text-xl text-foreground">Trash2Cash</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Points Display (User only) */}
            {currentRole === "user" && (
              <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                <Gift className="w-4 h-4 text-primary" />
                {userPoints?.loading ? (
                  <span className="font-medium text-primary">Loading...</span>
                ) : (
                  <span className="font-medium text-primary">
                    {userPoints?.totalPoints || 0} pts
                  </span>
                )}

              </div>
            )}

            {/* Role Switcher */}
            <div className="relative">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
                className="flex items-center gap-2"
              >
                <span className="capitalize">{currentRole}</span>
                <ChevronDown className="w-4 h-4" />
              </Button>

              <AnimatePresence>
                {roleDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="absolute right-0 mt-2 w-32 bg-card border rounded-lg shadow-lg z-50"
                  >
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleRoleSwitch("user")}
                    >
                      User
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start"
                      onClick={() => handleRoleSwitch("host")}
                    >
                      Host
                    </Button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <Button variant="outline" size="sm">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Button>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <AnimatePresence>
          {(sidebarOpen || window.innerWidth >= 1024) && (
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              className="fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r lg:translate-x-0"
            >
              <div className="flex flex-col h-full pt-16 lg:pt-0">
                <div className="p-4">
                  <h2 className="font-serif font-semibold text-lg capitalize">{currentRole} Dashboard</h2>
                </div>
                <nav className="flex-1 px-4 space-y-2">
                  {sidebarItems.map((item) => (
                    <Button key={item.label} variant="ghost" className="w-full justify-start" asChild>
                      <Link href={item.href}>
                        <item.icon className="w-4 h-4 mr-3" />
                        {item.label}
                      </Link>
                    </Button>
                  ))}
                  
                  {/* API Status for testing */}
                  <div className="pt-4 border-t">
                    <p className="text-xs text-muted-foreground px-3 mb-2">API Testing</p>
                    {apiTestItems.map((item) => (
                      <Button key={item.label} variant="ghost" className="w-full justify-start" asChild>
                        <Link href={item.href}>
                          <item.icon className="w-4 h-4 mr-3" />
                          {item.label}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </nav>
              </div>
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentRole}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentRole === "user" ? <UserDashboard /> : <HostDashboard />}
              
              {/* API Status Component for testing */}
              <div id="api-status" className="mt-8">
                <ApiStatus />
              </div>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  )
}

function UserDashboard() {
  const { userStats, userActivity, leaderboard, loading, error, refetch } = useUserDashboardData()
  const { user } = useAuth()
  const { userPoints } = useUserPoints()

  // Use points from context if available, otherwise fall back to userStats
  const displayStats = userPoints ? {
    ...userStats,
    totalPoints: userPoints.totalPoints,
    monthlyPoints: userPoints.monthlyPoints,
    rank: userPoints.rank,
    nextRankPoints: userPoints.nextRankPoints,
  } : userStats

  if (loading && !userPoints) {
    return <DashboardSkeleton />
  }

  if (error && !userPoints) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome back, {user?.name || 'User'}!</h1>
            <p className="text-muted-foreground">Here's your sustainability impact at a glance.</p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">Error loading dashboard data: {error}</p>
        </div>
      </div>
    )
  }

  const stats = displayStats || fallbackUserStats

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Welcome back, {user?.name || 'User'}!</h1>
          <p className="text-muted-foreground">Here's your sustainability impact at a glance.</p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reward Wallet</CardTitle>
              <Gift className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">
                {userPoints?.loading ? (
                  <span className="text-muted-foreground">Loading...</span>
                ) : (
                  userPoints?.totalPoints || 0
                )}
              </div>

              <Link href="/rewards">
                <Button size="sm" className="mt-2">
                  Claim Rewards
                </Button>
              </Link>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Items Recycled</CardTitle>
              <Recycle className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">
                {userPoints?.monthlyPoints || stats.itemsRecycled}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">CO₂ Saved</CardTitle>
              <Leaf className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">{stats.co2Saved} kg</div>
              <p className="text-xs text-muted-foreground">Environmental impact</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Rank</CardTitle>
              <Award className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold text-primary">
                {userPoints?.rank || stats.rank}
              </div>
              <Progress value={75} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Nearby Bins Map */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-serif">Nearby Smart Bins</CardTitle>
            <CardDescription>Find recycling bins near you</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="w-full h-48 bg-muted rounded-lg flex items-center justify-center mb-4">
              <div className="text-center">
                <MapPin className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                <p className="text-muted-foreground">Interactive map</p>
              </div>
            </div>
            <Button className="w-full">
              <Navigation className="w-4 h-4 mr-2" />
              Find Nearest Bin
            </Button>
          </CardContent>
        </Card>

        {/* Leaderboard */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-serif">Leaderboard</CardTitle>
            <CardDescription>See how you rank against others</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {leaderboard.map((user) => (
                <motion.div
                  key={user.rank}
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center justify-between p-3 rounded-lg ${
                    user.isCurrentUser ? "bg-primary/10 border border-primary/20" : "bg-muted/50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-sm">
                      {user.avatar}
                    </div>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">Rank #{user.rank}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary">{user.points}</p>
                    <p className="text-xs text-muted-foreground">points</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Activity Log */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-serif">Recent Activity</CardTitle>
          <CardDescription>Your latest recycling activities</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {userActivity.map((activity) => (
              <motion.div
                key={activity.id}
                whileHover={{ scale: 1.01 }}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div className="flex items-center gap-3">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      activity.type === "recycle" ? "bg-primary/10" : "bg-secondary/10"
                    }`}
                  >
                    {activity.type === "recycle" ? (
                      <Recycle className="w-5 h-5 text-primary" />
                    ) : (
                      <Gift className="w-5 h-5 text-secondary" />
                    )}
                  </div>
                  <div>
                    <p className="font-medium">{activity.item}</p>
                    <p className="text-sm text-muted-foreground">{activity.location}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-medium ${activity.points > 0 ? "text-primary" : "text-secondary"}`}>
                    {activity.points > 0 ? "+" : ""}
                    {activity.points} pts
                  </p>
                  <p className="text-sm text-muted-foreground">{activity.date}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function HostDashboard() {
  const { hostStats, hostBins, loading, error, refetch } = useHostDashboardData()
  const { user } = useAuth()

  if (loading) {
    return <HostDashboardSkeleton />
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Host Dashboard</h1>
            <p className="text-muted-foreground">Manage your smart bins and track performance.</p>
          </div>
          <Button onClick={refetch} variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Retry
          </Button>
        </div>
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-4">
          <p className="text-destructive">Error loading dashboard data: {error}</p>
        </div>
      </div>
    )
  }

  const stats = hostStats || fallbackHostStats

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Host Dashboard</h1>
          <p className="text-muted-foreground">Manage your smart bins and track performance.</p>
        </div>
        <Button onClick={refetch} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Host Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
              <MapPin className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.totalBins}</div>
              <p className="text-xs text-muted-foreground">{stats.activeBins} active</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Collections</CardTitle>
              <Recycle className="h-4 w-4 text-secondary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-secondary">{stats.totalCollections}</div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Revenue</CardTitle>
              <IndianRupee className="h-4 w-4 text-accent" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-accent">
                ₹{stats.monthlyRevenue.toLocaleString("en-IN")}
              </div>
              <p className="text-xs text-muted-foreground">This month</p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div whileHover={{ scale: 1.02 }} transition={{ duration: 0.2 }}>
          <Card className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Avg Fill Level</CardTitle>
              <BarChart3 className="h-4 w-4 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-primary">{stats.avgFillLevel}%</div>
              <Progress value={stats.avgFillLevel} className="h-2 mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Bin Management */}
      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="border-border/50">
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle className="font-serif">Bin Management</CardTitle>
              <CardDescription>Monitor and manage your smart bins</CardDescription>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Add Bin
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {hostBins.map((bin) => (
                <motion.div
                  key={bin.id}
                  whileHover={{ scale: 1.01 }}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${bin.status === "OK" ? "bg-green-500" : "bg-red-500"}`} />
                    <div>
                      <p className="font-medium">{bin.name}</p>
                      <p className="text-sm text-muted-foreground">Last collection: {bin.lastCollection}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <Progress value={bin.fillLevel} className="w-16 h-2 mb-1" />
                      <p className="text-xs text-muted-foreground">{bin.fillLevel}% full</p>
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline">
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* System Health */}
        <Card className="border-border/50">
          <CardHeader>
            <CardTitle className="font-serif">System Health</CardTitle>
            <CardDescription>Live status of your bin network</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Operational Bins</span>
                <Badge variant="secondary">
                  {stats.activeBins}/{stats.totalBins}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Bins Needing Attention</span>
                <Badge variant="destructive">2</Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Network Uptime</span>
                <Badge variant="default">99.8%</Badge>
              </div>
              <div className="pt-2 border-t">
                <div className="flex items-center gap-2 text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span className="text-sm font-medium">City Park bin needs collection</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics */}
      <Card className="border-border/50">
        <CardHeader>
          <CardTitle className="font-serif">Performance Analytics</CardTitle>
          <CardDescription>Usage patterns and revenue insights</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center">
              <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">Analytics charts would be displayed here</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
