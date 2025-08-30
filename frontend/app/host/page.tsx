"use client"

import { useState } from "react"
import Link from "next/link"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trash2,
  MapPin,
  AlertTriangle,
  TrendingUp,
  Calendar,
  Plus,
  Settings,
  IndianRupee,
  BarChart3,
  Clock,
  Recycle,
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

// Mock data for host dashboard
const mockBins = [
  {
    id: 1,
    name: "Downtown Mall - Main Entrance",
    location: "123 Main St, Downtown",
    type: "Mixed Recycling",
    capacity: 85,
    status: "active",
    lastCollection: "2024-01-14",
    nextCollection: "2024-01-16",
    dailyUsage: 45,
    monthlyRevenue: 10417,
    alerts: ["High capacity"],
  },
  {
    id: 2,
    name: "City Park - North Gate",
    location: "456 Park Ave, City Center",
    type: "Organic Waste",
    capacity: 32,
    status: "active",
    lastCollection: "2024-01-15",
    nextCollection: "2024-01-17",
    dailyUsage: 28,
    monthlyRevenue: 7408,
    alerts: [],
  },
  {
    id: 3,
    name: "Office Building - Lobby",
    location: "789 Business Blvd, Financial District",
    type: "Paper & Cardboard",
    capacity: 92,
    status: "maintenance",
    lastCollection: "2024-01-13",
    nextCollection: "2024-01-16",
    dailyUsage: 0,
    monthlyRevenue: 13011,
    alerts: ["Maintenance required", "Sensor malfunction"],
  },
  {
    id: 4,
    name: "Shopping Center - Food Court",
    location: "321 Retail Way, Suburbs",
    type: "Plastic & Glass",
    capacity: 67,
    status: "active",
    lastCollection: "2024-01-14",
    nextCollection: "2024-01-17",
    dailyUsage: 38,
    monthlyRevenue: 8167,
    alerts: [],
  },
]

const mockStats = {
  totalBins: 4,
  activeBins: 3,
  totalRevenue: 39003,
  monthlyRevenue: 39003,
  totalCollections: 28,
  averageCapacity: 69,
  alertsCount: 3,
}

const mockMaintenanceRequests = [
  {
    id: 1,
    binName: "Office Building - Lobby",
    issue: "Sensor malfunction",
    priority: "high",
    status: "pending",
    requestDate: "2024-01-15",
    description: "Capacity sensor not reporting accurate readings",
  },
  {
    id: 2,
    binName: "Downtown Mall - Main Entrance",
    issue: "Door mechanism stuck",
    priority: "medium",
    status: "in-progress",
    requestDate: "2024-01-12",
    description: "Bin door occasionally gets stuck when opening",
  },
  {
    id: 3,
    binName: "City Park - North Gate",
    issue: "Cleaning required",
    priority: "low",
    status: "completed",
    requestDate: "2024-01-10",
    description: "Regular deep cleaning maintenance",
  },
]

export default function HostDashboard() {
  const { user } = useAuth()
  const [selectedBin, setSelectedBin] = useState<(typeof mockBins)[0] | null>(null)
  const [isAddingBin, setIsAddingBin] = useState(false)
  const [newBin, setNewBin] = useState({
    name: "",
    location: "",
    type: "Mixed Recycling",
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-primary text-primary-foreground"
      case "maintenance":
        return "bg-destructive text-destructive-foreground"
      case "offline":
        return "bg-muted text-muted-foreground"
      default:
        return "bg-secondary text-secondary-foreground"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-destructive"
      case "medium":
        return "text-accent"
      case "low":
        return "text-muted-foreground"
      default:
        return "text-foreground"
    }
  }

  const handleAddBin = () => {
    // Mock add bin functionality
    console.log("Adding new bin:", newBin)
    setIsAddingBin(false)
    setNewBin({ name: "", location: "", type: "Mixed Recycling" })
  }

  return (
    <ProtectedRoute requiredRole="host">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="font-serif font-bold text-xl text-foreground">Trash2Cash Host</span>
              </Link>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                  <IndianRupee className="w-4 h-4 text-primary" />
                  <span className="font-medium text-primary">₹{mockStats.monthlyRevenue.toLocaleString("en-IN")}</span>
                </div>
                <Button variant="outline" size="sm">
                  Profile
                </Button>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Welcome Section */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">
              Welcome back, {user?.name || "Host"}!
            </h1>
            <p className="text-muted-foreground">Manage your smart bins and track your hosting performance.</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Bins</CardTitle>
                <Trash2 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockStats.totalBins}</div>
                <p className="text-xs text-muted-foreground">{mockStats.activeBins} active</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Monthly Revenue</CardTitle>
                <IndianRupee className="h-4 w-4 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-secondary">
                  ₹{mockStats.monthlyRevenue.toLocaleString("en-IN")}
                </div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Collections</CardTitle>
                <Calendar className="h-4 w-4 text-accent" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-accent">{mockStats.totalCollections}</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card className="border-border/50">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Avg Capacity</CardTitle>
                <BarChart3 className="h-4 w-4 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-primary">{mockStats.averageCapacity}%</div>
                <p className="text-xs text-muted-foreground">
                  {mockStats.alertsCount > 0 && (
                    <span className="text-destructive">{mockStats.alertsCount} alerts</span>
                  )}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="bins" className="space-y-6">
            <div className="flex justify-between items-center">
              <TabsList className="grid w-auto grid-cols-3">
                <TabsTrigger value="bins">My Bins</TabsTrigger>
                <TabsTrigger value="maintenance">Maintenance</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>
              <Dialog open={isAddingBin} onOpenChange={setIsAddingBin}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Bin
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Add New Smart Bin</DialogTitle>
                    <DialogDescription>Register a new smart bin location for hosting.</DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="binName">Bin Name</Label>
                      <Input
                        id="binName"
                        placeholder="e.g., Downtown Mall - Main Entrance"
                        value={newBin.name}
                        onChange={(e) => setNewBin({ ...newBin, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="binLocation">Location</Label>
                      <Input
                        id="binLocation"
                        placeholder="e.g., 123 Main St, Downtown"
                        value={newBin.location}
                        onChange={(e) => setNewBin({ ...newBin, location: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="binType">Bin Type</Label>
                      <Select value={newBin.type} onValueChange={(value) => setNewBin({ ...newBin, type: value })}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Mixed Recycling">Mixed Recycling</SelectItem>
                          <SelectItem value="Organic Waste">Organic Waste</SelectItem>
                          <SelectItem value="Paper & Cardboard">Paper & Cardboard</SelectItem>
                          <SelectItem value="Plastic & Glass">Plastic & Glass</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={handleAddBin} className="flex-1">
                        Add Bin
                      </Button>
                      <Button variant="outline" onClick={() => setIsAddingBin(false)} className="flex-1">
                        Cancel
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <TabsContent value="bins" className="space-y-6">
              <div className="grid gap-6">
                {mockBins.map((bin) => (
                  <Card key={bin.id} className="border-border/50">
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="font-serif">{bin.name}</CardTitle>
                          <CardDescription className="flex items-center gap-1 mt-1">
                            <MapPin className="w-3 h-3" />
                            {bin.location}
                          </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(bin.status)}>{bin.status}</Badge>
                          <Button variant="outline" size="sm">
                            <Settings className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Capacity</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Progress value={bin.capacity} className="flex-1" />
                            <span className="text-sm font-medium">{bin.capacity}%</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Type</p>
                          <p className="font-medium">{bin.type}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Daily Usage</p>
                          <p className="font-medium">{bin.dailyUsage} items</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Monthly Revenue</p>
                          <p className="font-medium text-primary">₹{bin.monthlyRevenue.toLocaleString("en-IN")}</p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-4 pt-4 border-t">
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <span>Last: {bin.lastCollection}</span>
                          <span>Next: {bin.nextCollection}</span>
                        </div>
                        {bin.alerts.length > 0 && (
                          <div className="flex items-center gap-1 text-destructive">
                            <AlertTriangle className="w-4 h-4" />
                            <span className="text-sm">{bin.alerts.length} alert(s)</span>
                          </div>
                        )}
                      </div>

                      {bin.alerts.length > 0 && (
                        <div className="mt-2 space-y-1">
                          {bin.alerts.map((alert, index) => (
                            <Badge key={index} variant="destructive" className="mr-2">
                              {alert}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="maintenance" className="space-y-6">
              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Maintenance Requests</CardTitle>
                  <CardDescription>Track and manage maintenance issues for your bins</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {mockMaintenanceRequests.map((request) => (
                      <div key={request.id} className="flex items-start justify-between p-4 border rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h3 className="font-medium">{request.binName}</h3>
                            <Badge
                              variant={request.status === "completed" ? "default" : "secondary"}
                              className={
                                request.status === "completed"
                                  ? "bg-primary text-primary-foreground"
                                  : request.status === "in-progress"
                                    ? "bg-secondary text-secondary-foreground"
                                    : "bg-muted text-muted-foreground"
                              }
                            >
                              {request.status}
                            </Badge>
                          </div>
                          <p className="text-sm font-medium mb-1">{request.issue}</p>
                          <p className="text-sm text-muted-foreground mb-2">{request.description}</p>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {request.requestDate}
                            </span>
                            <span className={`font-medium ${getPriorityColor(request.priority)}`}>
                              {request.priority} priority
                            </span>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <div className="grid lg:grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif">Revenue Trends</CardTitle>
                    <CardDescription>Monthly revenue performance</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <TrendingUp className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Revenue chart would be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle className="font-serif">Usage Analytics</CardTitle>
                    <CardDescription>Bin usage patterns and trends</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 flex items-center justify-center bg-muted/30 rounded-lg">
                      <div className="text-center">
                        <BarChart3 className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
                        <p className="text-muted-foreground">Usage analytics would be displayed here</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-border/50">
                <CardHeader>
                  <CardTitle className="font-serif">Performance Summary</CardTitle>
                  <CardDescription>Key performance indicators for your hosting business</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-primary mb-1">94%</div>
                      <p className="text-sm text-muted-foreground">Uptime</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-secondary mb-1">4.8</div>
                      <p className="text-sm text-muted-foreground">User Rating</p>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-accent mb-1">156</div>
                      <p className="text-sm text-muted-foreground">Total Users Served</p>
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
