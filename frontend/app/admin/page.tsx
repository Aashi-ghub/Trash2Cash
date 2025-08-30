"use client"

import { useState } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  Users,
  Building2,
  Trash2,
  Gift,
  TrendingUp,
  AlertTriangle,
  Search,
  MoreHorizontal,
  Shield,
  BarChart3,
  Settings,
  Eye,
  Edit,
  Ban,
  CheckCircle,
  XCircle,
  IndianRupee,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

// Mock data for admin dashboard
const mockSystemStats = {
  totalUsers: 12847,
  activeUsers: 8934,
  totalHosts: 234,
  activeHosts: 198,
  totalBins: 1456,
  activeBins: 1389,
  totalRewards: 89,
  activeRewards: 76,
  monthlyRevenue: 3791348, // converted from $45,678.9 to INR (45678.9 * 83)
  systemAlerts: 7,
}

const mockUsers = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "user",
    status: "active",
    points: 1247,
    joinDate: "2024-01-10",
    lastActive: "2024-01-15",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "host",
    status: "active",
    points: 0,
    joinDate: "2023-12-15",
    lastActive: "2024-01-14",
  },
  {
    id: 3,
    name: "Bob Wilson",
    email: "bob@example.com",
    role: "user",
    status: "suspended",
    points: 89,
    joinDate: "2024-01-05",
    lastActive: "2024-01-12",
  },
]

const mockHosts = [
  {
    id: 1,
    name: "Jane Smith",
    email: "jane@example.com",
    status: "approved",
    binsCount: 4,
    monthlyRevenue: 39003, // converted from $469.9 to INR (469.9 * 83)
    rating: 4.8,
    joinDate: "2023-12-15",
  },
  {
    id: 2,
    name: "Mike Johnson",
    email: "mike@example.com",
    status: "pending",
    binsCount: 0,
    monthlyRevenue: 0,
    rating: 0,
    joinDate: "2024-01-14",
  },
  {
    id: 3,
    name: "Sarah Davis",
    email: "sarah@example.com",
    status: "approved",
    binsCount: 7,
    monthlyRevenue: 74078, // converted from $892.5 to INR (892.5 * 83)
    rating: 4.9,
    joinDate: "2023-11-20",
  },
]

const mockSystemBins = [
  {
    id: 1,
    name: "Downtown Mall - Main Entrance",
    host: "Jane Smith",
    location: "Downtown",
    type: "Mixed Recycling",
    status: "active",
    capacity: 85,
    lastCollection: "2024-01-14",
    alerts: ["High capacity"],
  },
  {
    id: 2,
    name: "City Park - North Gate",
    host: "Sarah Davis",
    location: "City Center",
    type: "Organic Waste",
    status: "active",
    capacity: 32,
    lastCollection: "2024-01-15",
    alerts: [],
  },
  {
    id: 3,
    name: "Office Building - Lobby",
    host: "Jane Smith",
    location: "Financial District",
    type: "Paper & Cardboard",
    status: "maintenance",
    capacity: 92,
    lastCollection: "2024-01-13",
    alerts: ["Maintenance required", "Sensor malfunction"],
  },
]

const mockSystemRewards = [
  {
    id: 1,
    name: "Starbucks Gift Card",
    category: "food",
    points: 500,
    status: "active",
    stock: 45,
    redeemed: 234,
  },
  {
    id: 2,
    name: "Amazon Gift Card",
    category: "shopping",
    points: 1200,
    status: "active",
    stock: 23,
    redeemed: 156,
  },
  {
    id: 3,
    name: "Eco-Friendly Water Bottle",
    category: "eco",
    points: 800,
    status: "inactive",
    stock: 0,
    redeemed: 89,
  },
]

export default function AdminPanel() {
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<(typeof mockUsers)[0] | null>(null)
  const [selectedHost, setSelectedHost] = useState<(typeof mockHosts)[0] | null>(null)

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "approved":
        return "bg-primary text-primary-foreground"
      case "inactive":
      case "suspended":
        return "bg-destructive text-destructive-foreground"
      case "pending":
        return "bg-secondary text-secondary-foreground"
      case "maintenance":
        return "bg-accent text-accent-foreground"
      default:
        return "bg-muted text-muted-foreground"
    }
  }

  return (
    <ProtectedRoute requiredRole="admin">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-serif font-bold text-xl text-foreground">Trash2Cash Admin</span>
              </Link>
              <div className="flex items-center gap-4">
                {mockSystemStats.systemAlerts > 0 && (
                  <div className="flex items-center gap-2 bg-destructive/10 px-3 py-1 rounded-full">
                    <AlertTriangle className="w-4 h-4 text-destructive" />
                    <span className="font-medium text-destructive">{mockSystemStats.systemAlerts} alerts</span>
                  </div>
                )}
                <Button variant="outline" size="sm">
                  <Settings className="w-4 h-4 mr-2" />
                  Settings
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">System Administration</h1>
            <p className="text-muted-foreground">Monitor and manage the Trash2Cash platform.</p>
          </div>

          {/* System Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  {mockSystemStats.totalUsers.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockSystemStats.activeUsers.toLocaleString("en-IN")} active
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Hosts</CardTitle>
                <Building2 className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">{mockSystemStats.totalHosts}</div>
                <p className="text-xs text-muted-foreground">{mockSystemStats.activeHosts} active</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Smart Bins</CardTitle>
                <Trash2 className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">
                  {mockSystemStats.totalBins.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-muted-foreground">
                  {mockSystemStats.activeBins.toLocaleString("en-IN")} active
                </p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">
                  ₹{mockSystemStats.monthlyRevenue.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-muted-foreground">+15% from last month</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="users" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="users">Users</TabsTrigger>
              <TabsTrigger value="hosts">Hosts</TabsTrigger>
              <TabsTrigger value="bins">Bins</TabsTrigger>
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="font-serif">User Management</CardTitle>
                      <CardDescription>Manage platform users and their accounts</CardDescription>
                    </div>
                    <div className="relative w-64">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
                      <Input
                        placeholder="Search users..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>User</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Join Date</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockUsers.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{user.name}</p>
                              <p className="text-sm text-muted-foreground">{user.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{user.role}</Badge>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(user.status)}>{user.status}</Badge>
                          </TableCell>
                          <TableCell>{user.points.toLocaleString("en-IN")}</TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Ban className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="hosts" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Host Management</CardTitle>
                  <CardDescription>Approve and manage bin hosts</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Host</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Bins</TableHead>
                        <TableHead>Revenue</TableHead>
                        <TableHead>Rating</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockHosts.map((host) => (
                        <TableRow key={host.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{host.name}</p>
                              <p className="text-sm text-muted-foreground">{host.email}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(host.status)}>{host.status}</Badge>
                          </TableCell>
                          <TableCell>{host.binsCount}</TableCell>
                          <TableCell>₹{host.monthlyRevenue.toLocaleString("en-IN")}</TableCell>
                          <TableCell>{host.rating > 0 ? host.rating : "N/A"}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              {host.status === "pending" && (
                                <>
                                  <Button variant="outline" size="sm">
                                    <CheckCircle className="w-4 h-4 text-primary" />
                                  </Button>
                                  <Button variant="outline" size="sm">
                                    <XCircle className="w-4 h-4 text-destructive" />
                                  </Button>
                                </>
                              )}
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="bins" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Bin Management</CardTitle>
                  <CardDescription>Monitor all smart bins across the platform</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bin Name</TableHead>
                        <TableHead>Host</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Alerts</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSystemBins.map((bin) => (
                        <TableRow key={bin.id}>
                          <TableCell>
                            <div>
                              <p className="font-medium">{bin.name}</p>
                              <p className="text-sm text-muted-foreground">{bin.location}</p>
                            </div>
                          </TableCell>
                          <TableCell>{bin.host}</TableCell>
                          <TableCell>{bin.type}</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(bin.status)}>{bin.status}</Badge>
                          </TableCell>
                          <TableCell>{bin.capacity}%</TableCell>
                          <TableCell>
                            {bin.alerts.length > 0 ? (
                              <div className="flex items-center gap-1 text-destructive">
                                <AlertTriangle className="w-4 h-4" />
                                <span className="text-sm">{bin.alerts.length}</span>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">None</span>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="rewards" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle className="font-serif">Rewards Management</CardTitle>
                      <CardDescription>Manage available rewards and inventory</CardDescription>
                    </div>
                    <Button>
                      <Gift className="w-4 h-4 mr-2" />
                      Add Reward
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Reward</TableHead>
                        <TableHead>Category</TableHead>
                        <TableHead>Points</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Stock</TableHead>
                        <TableHead>Redeemed</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {mockSystemRewards.map((reward) => (
                        <TableRow key={reward.id}>
                          <TableCell className="font-medium">{reward.name}</TableCell>
                          <TableCell>
                            <Badge variant="outline">{reward.category}</Badge>
                          </TableCell>
                          <TableCell>{reward.points} pts</TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(reward.status)}>{reward.status}</Badge>
                          </TableCell>
                          <TableCell>{reward.stock}</TableCell>
                          <TableCell>{reward.redeemed}</TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <MoreHorizontal className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif">Platform Growth</CardTitle>
                    <CardDescription>User and host growth over time</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Growth analytics would be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif">Revenue Analytics</CardTitle>
                    <CardDescription>Platform revenue and transaction trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Revenue analytics would be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">System Health</CardTitle>
                  <CardDescription>Platform performance and system metrics</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-4 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">99.8%</div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary mb-1">1.2s</div>
                      <p className="text-sm text-muted-foreground">Avg Response</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">4.9</div>
                      <p className="text-sm text-muted-foreground">User Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">95%</div>
                      <p className="text-sm text-muted-foreground">Bin Uptime</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
