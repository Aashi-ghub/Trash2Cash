"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Progress } from "@/components/ui/progress"
import { DollarSign, TrendingUp, MapPin, Coins, BarChart3 } from "lucide-react"

export default function HostDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["host"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Host Dashboard</h1>
            <p className="text-gray-600">Manage your smart bins and track earnings</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Earnings</CardTitle>
                <Coins className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">2,847 T2C</div>
                <p className="text-xs text-muted-foreground">+12% from last month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Bins</CardTitle>
                <MapPin className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">8</div>
                <p className="text-xs text-muted-foreground">2 pending approval</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deposits</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">This month</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Commission Rate</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">15%</div>
                <p className="text-xs text-muted-foreground">Per deposit</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="bins" className="space-y-6">
            <TabsList>
              <TabsTrigger value="bins">My Bins</TabsTrigger>
              <TabsTrigger value="earnings">Earnings</TabsTrigger>
              <TabsTrigger value="analytics">Analytics</TabsTrigger>
            </TabsList>

            <TabsContent value="bins">
              <Card>
                <CardHeader>
                  <CardTitle>Smart Bin Management</CardTitle>
                  <CardDescription>Monitor and manage your hosted smart bins</CardDescription>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Bin ID</TableHead>
                        <TableHead>Location</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Capacity</TableHead>
                        <TableHead>Today's Deposits</TableHead>
                        <TableHead>Tokens Issued</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow>
                        <TableCell className="font-medium">BIN-001</TableCell>
                        <TableCell>Main Street Plaza</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={75} className="w-16" />
                            <span className="text-sm">75%</span>
                          </div>
                        </TableCell>
                        <TableCell>23</TableCell>
                        <TableCell>156 T2C</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">BIN-002</TableCell>
                        <TableCell>University Campus</TableCell>
                        <TableCell>
                          <Badge className="bg-green-100 text-green-800">Active</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={45} className="w-16" />
                            <span className="text-sm">45%</span>
                          </div>
                        </TableCell>
                        <TableCell>18</TableCell>
                        <TableCell>124 T2C</TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell className="font-medium">BIN-003</TableCell>
                        <TableCell>Shopping Center</TableCell>
                        <TableCell>
                          <Badge className="bg-red-100 text-red-800">Maintenance</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <Progress value={95} className="w-16" />
                            <span className="text-sm">95%</span>
                          </div>
                        </TableCell>
                        <TableCell>0</TableCell>
                        <TableCell>0 T2C</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="earnings">
              <Card>
                <CardHeader>
                  <CardTitle>Earnings Breakdown</CardTitle>
                  <CardDescription>Track your commission and token earnings</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">This Week</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">487 T2C</div>
                          <p className="text-xs text-green-600">+23% vs last week</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">This Month</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">1,847 T2C</div>
                          <p className="text-xs text-green-600">+12% vs last month</p>
                        </CardContent>
                      </Card>
                      <Card>
                        <CardHeader className="pb-2">
                          <CardTitle className="text-sm">All Time</CardTitle>
                        </CardHeader>
                        <CardContent>
                          <div className="text-2xl font-bold">12,847 T2C</div>
                          <p className="text-xs text-muted-foreground">Since joining</p>
                        </CardContent>
                      </Card>
                    </div>

                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Date</TableHead>
                          <TableHead>Bin ID</TableHead>
                          <TableHead>Deposits</TableHead>
                          <TableHead>Tokens Issued</TableHead>
                          <TableHead>Commission</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        <TableRow>
                          <TableCell>Today</TableCell>
                          <TableCell>BIN-001</TableCell>
                          <TableCell>23</TableCell>
                          <TableCell>156 T2C</TableCell>
                          <TableCell>23 T2C</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Today</TableCell>
                          <TableCell>BIN-002</TableCell>
                          <TableCell>18</TableCell>
                          <TableCell>124 T2C</TableCell>
                          <TableCell>19 T2C</TableCell>
                        </TableRow>
                        <TableRow>
                          <TableCell>Yesterday</TableCell>
                          <TableCell>BIN-001</TableCell>
                          <TableCell>31</TableCell>
                          <TableCell>198 T2C</TableCell>
                          <TableCell>30 T2C</TableCell>
                        </TableRow>
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <BarChart3 className="w-5 h-5" />
                      AI Insights & Predictions
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 rounded-lg">
                        <h4 className="font-semibold text-blue-900">Peak Usage Prediction</h4>
                        <p className="text-blue-700">
                          BIN-001 is expected to have high deposits between 2-4 PM today based on historical patterns.
                        </p>
                      </div>
                      <div className="p-4 bg-green-50 rounded-lg">
                        <h4 className="font-semibold text-green-900">Optimization Suggestion</h4>
                        <p className="text-green-700">
                          Consider adding a token multiplier campaign at BIN-002 to increase usage by an estimated 25%.
                        </p>
                      </div>
                      <div className="p-4 bg-orange-50 rounded-lg">
                        <h4 className="font-semibold text-orange-900">Maintenance Alert</h4>
                        <p className="text-orange-700">
                          BIN-003 requires immediate attention - capacity at 95% and showing error codes.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Environmental Impact</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">2.4 tons</div>
                        <p className="text-sm text-muted-foreground">CO₂ Saved</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">1,247</div>
                        <p className="text-sm text-muted-foreground">Items Recycled</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">89%</div>
                        <p className="text-sm text-muted-foreground">Diversion Rate</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </ProtectedRoute>
  )
}
