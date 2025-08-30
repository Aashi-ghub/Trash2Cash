"use client"

import { ProtectedRoute } from "@/components/protected-route"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Settings, Shield, Award, MapPin } from "lucide-react"
import { useAuth } from "@/components/auth-provider"

export default function ProfilePage() {
  const { user } = useAuth()

  return (
    <ProtectedRoute allowedRoles={["user", "host", "admin"]}>
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
            <p className="text-gray-600">Manage your account and preferences</p>
          </div>

          <Tabs defaultValue="profile" className="space-y-6">
            <TabsList>
              <TabsTrigger value="profile">Profile</TabsTrigger>
              <TabsTrigger value="preferences">Preferences</TabsTrigger>
              <TabsTrigger value="achievements">Achievements</TabsTrigger>
              <TabsTrigger value="security">Security</TabsTrigger>
            </TabsList>

            <TabsContent value="profile">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <User className="w-5 h-5" />
                      Personal Information
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex items-center gap-6">
                      <Avatar className="w-20 h-20">
                        <AvatarImage src="/placeholder.svg?height=80&width=80" />
                        <AvatarFallback className="text-lg">{user?.name?.charAt(0) || "U"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <Button variant="outline">Change Photo</Button>
                        <p className="text-sm text-muted-foreground mt-1">JPG, PNG or GIF. Max size 2MB.</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input id="name" defaultValue={user?.name || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue={user?.email || ""} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+1 (555) 123-4567" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="role">Account Type</Label>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary" className="capitalize">
                            {user?.role || "user"}
                          </Badge>
                          {user?.role === "host" && (
                            <Badge className="bg-green-100 text-green-800">Verified Host</Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="location">Location</Label>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <Input id="location" placeholder="City, State" />
                      </div>
                    </div>

                    <Button>Save Changes</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">1,247</div>
                        <p className="text-sm text-muted-foreground">T2C Tokens Earned</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">89</div>
                        <p className="text-sm text-muted-foreground">Items Recycled</p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">12</div>
                        <p className="text-sm text-muted-foreground">Days Active</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="preferences">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5" />
                    App Preferences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive updates about your deposits and rewards</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Push Notifications</Label>
                        <p className="text-sm text-muted-foreground">
                          Get notified about nearby bins and special offers
                        </p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Location Services</Label>
                        <p className="text-sm text-muted-foreground">Allow app to find nearby smart bins</p>
                      </div>
                      <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Marketing Communications</Label>
                        <p className="text-sm text-muted-foreground">
                          Receive promotional offers and sustainability tips
                        </p>
                      </div>
                      <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label>Data Analytics</Label>
                        <p className="text-sm text-muted-foreground">Help improve the app with anonymous usage data</p>
                      </div>
                      <Switch defaultChecked />
                    </div>
                  </div>

                  <Button>Save Preferences</Button>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="achievements">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="w-5 h-5" />
                    Achievements & Badges
                  </CardTitle>
                  <CardDescription>Track your recycling milestones and environmental impact</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-green-900">First Deposit</h3>
                        <p className="text-sm text-green-700">Made your first recycling deposit</p>
                        <Badge className="mt-2 bg-green-100 text-green-800">Unlocked</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-blue-50 border-blue-200">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-blue-900">Week Warrior</h3>
                        <p className="text-sm text-blue-700">Recycled for 7 consecutive days</p>
                        <Badge className="mt-2 bg-blue-100 text-blue-800">Unlocked</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-purple-50 border-purple-200">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-purple-900">Token Collector</h3>
                        <p className="text-sm text-purple-700">Earned 1000+ T2C tokens</p>
                        <Badge className="mt-2 bg-purple-100 text-purple-800">Unlocked</Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-gray-50 border-gray-200">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Eco Champion</h3>
                        <p className="text-sm text-gray-600">Save 10 tons of CO₂</p>
                        <Badge variant="outline" className="mt-2">
                          Locked
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-gray-50 border-gray-200">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Community Leader</h3>
                        <p className="text-sm text-gray-600">Refer 10 friends</p>
                        <Badge variant="outline" className="mt-2">
                          Locked
                        </Badge>
                      </div>
                    </div>

                    <div className="p-4 border rounded-lg bg-gray-50 border-gray-200">
                      <div className="text-center">
                        <div className="w-12 h-12 bg-gray-400 rounded-full flex items-center justify-center mx-auto mb-2">
                          <Award className="w-6 h-6 text-white" />
                        </div>
                        <h3 className="font-semibold text-gray-700">Master Recycler</h3>
                        <p className="text-sm text-gray-600">Recycle 1000 items</p>
                        <Badge variant="outline" className="mt-2">
                          Locked
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="security">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Shield className="w-5 h-5" />
                      Security Settings
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="current-password">Current Password</Label>
                        <Input id="current-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="new-password">New Password</Label>
                        <Input id="new-password" type="password" />
                      </div>
                      <div>
                        <Label htmlFor="confirm-password">Confirm New Password</Label>
                        <Input id="confirm-password" type="password" />
                      </div>
                    </div>
                    <Button>Update Password</Button>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Two-Factor Authentication</CardTitle>
                    <CardDescription>Add an extra layer of security to your account</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">SMS Authentication</p>
                        <p className="text-sm text-muted-foreground">Receive verification codes via SMS</p>
                      </div>
                      <Button variant="outline">Enable</Button>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Account Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Export Data</p>
                        <p className="text-sm text-muted-foreground">
                          Download your account data and transaction history
                        </p>
                      </div>
                      <Button variant="outline">Export</Button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-red-600">Delete Account</p>
                        <p className="text-sm text-muted-foreground">Permanently delete your account and all data</p>
                      </div>
                      <Button variant="destructive">Delete</Button>
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
