"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Gift, Search, Coffee, ShoppingBag, Leaf, Smartphone, Star, Clock, CheckCircle, Recycle, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { useRewards } from "@/lib/hooks/useRewards"
import { useUserPoints } from "@/lib/contexts/UserPointsContext"
import Link from "next/link"

// Available rewards data
const availableRewards = [
  {
    id: 1,
    name: "Starbucks Gift Card",
    description: "Enjoy your favorite coffee with a ₹830 Starbucks gift card",
    points: 500,
    category: "food",
    image: "/starbucks-gift-card.png",
    rating: 4.8,
    available: true,
    popular: true,
  },
  {
    id: 2,
    name: "Amazon Gift Card",
    description: "₹2075 Amazon gift card for all your shopping needs",
    points: 1200,
    category: "shopping",
    image: "/amazon-gift-card.png",
    rating: 4.9,
    available: true,
    popular: true,
  },
  {
    id: 3,
    name: "Eco-Friendly Water Bottle",
    description: "Sustainable stainless steel water bottle",
    points: 800,
    category: "eco",
    image: "/eco-water-bottle.png",
    rating: 4.7,
    available: true,
    popular: false,
  },
  {
    id: 4,
    name: "Netflix Subscription",
    description: "1 month Netflix premium subscription",
    points: 600,
    category: "entertainment",
    image: "/netflix-subscription-options.png",
    rating: 4.6,
    available: true,
    popular: false,
  },
  {
    id: 5,
    name: "Bamboo Phone Case",
    description: "Sustainable bamboo phone case for iPhone/Android",
    points: 400,
    category: "eco",
    image: "/bamboo-phone-case.png",
    rating: 4.5,
    available: true,
    popular: false,
  },
  {
    id: 6,
    name: "Local Restaurant Voucher",
    description: "₹1245 voucher for participating local restaurants",
    points: 750,
    category: "food",
    image: "/restaurant-voucher.png",
    rating: 4.4,
    available: false,
    popular: false,
  },
]

export default function RewardsPage() {
  const { user } = useAuth()
  const { userData, redemptionHistory, loading, error, redeemReward } = useRewards()
  const { userPoints, refreshUserPoints } = useUserPoints()
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedReward, setSelectedReward] = useState<(typeof availableRewards)[0] | null>(null)
  const [isRedeeming, setIsRedeeming] = useState(false)

  const currentPoints = userPoints?.totalPoints || 0

  const filteredRewards = availableRewards.filter((reward) => {
    const matchesSearch = reward.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || reward.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const handleRedeem = async (reward: (typeof availableRewards)[0]) => {
    if (currentPoints < reward.points) {
      alert("Insufficient points!")
      return
    }

    setIsRedeeming(true)
    try {
      console.log('🎯 Attempting to redeem:', reward.name, 'for', reward.points, 'points')
      
      await redeemReward(reward)
      
      // Refresh the shared user points context
      await refreshUserPoints()
      
      console.log('✅ Redemption completed successfully')
      
      // Show success message
      alert(`Successfully redeemed ${reward.name}! Your points have been updated.`)
      
      // Close the modal
      setSelectedReward(null)
      
      // Force a page refresh to ensure all data is updated
      window.location.reload()
      
    } catch (err) {
      console.error('❌ Redemption failed:', err)
      alert(`Failed to redeem reward: ${err instanceof Error ? err.message : 'Unknown error'}`)
    } finally {
      setIsRedeeming(false)
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "food":
        return <Coffee className="w-4 h-4" />
      case "shopping":
        return <ShoppingBag className="w-4 h-4" />
      case "eco":
        return <Leaf className="w-4 h-4" />
      case "entertainment":
        return <Smartphone className="w-4 h-4" />
      default:
        return <Gift className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "delivered":
        return "text-primary"
      case "shipped":
        return "text-secondary"
      case "processing":
        return "text-accent"
      default:
        return "text-muted-foreground"
    }
  }

  return (
    <ProtectedRoute requiredRole="user">
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
        {/* Header */}
        <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center gap-2">
                <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
                  <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                    <Recycle className="w-5 h-5 text-primary-foreground" />
                  </div>
                  <span className="font-serif font-bold text-xl text-foreground">Trash2Cash</span>
                </Link>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 bg-primary/10 px-3 py-1 rounded-full">
                  <Gift className="w-4 h-4 text-primary" />
                  {userPoints?.loading ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <span className="font-medium text-primary">{currentPoints} pts</span>
                  )}

                </div>
                <Link href="/dashboard">
                  <Button variant="outline" size="sm">
                    Dashboard
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Page Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-serif font-bold text-foreground mb-2">Rewards Store</h1>
            <p className="text-muted-foreground">Redeem your points for amazing rewards and eco-friendly products.</p>
          </div>

          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Search rewards..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          {/* Main Content */}
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="food">Food & Drink</TabsTrigger>
              <TabsTrigger value="shopping">Shopping</TabsTrigger>
              <TabsTrigger value="eco">Eco Products</TabsTrigger>
              <TabsTrigger value="entertainment">Entertainment</TabsTrigger>
            </TabsList>

            <TabsContent value={selectedCategory} className="space-y-6">
              {/* Rewards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRewards.map((reward) => (
                  <Card key={reward.id} className="border-border/50 hover:shadow-lg transition-shadow">
                    <div className="relative">
                      <img
                        src={reward.image || "/placeholder.svg"}
                        alt={reward.name}
                        className="w-full h-48 object-cover rounded-t-lg"
                      />
                      {reward.popular && (
                        <Badge className="absolute top-2 left-2 bg-primary text-primary-foreground">Popular</Badge>
                      )}
                      {!reward.available && (
                        <div className="absolute inset-0 bg-black/50 rounded-t-lg flex items-center justify-center">
                          <Badge variant="secondary">Out of Stock</Badge>
                        </div>
                      )}
                    </div>
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="font-serif text-lg">{reward.name}</CardTitle>
                          <CardDescription className="mt-1">{reward.description}</CardDescription>
                        </div>
                        <div className="flex items-center gap-1 ml-2">
                          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                          <span className="text-sm font-medium">{reward.rating}</span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {getCategoryIcon(reward.category)}
                          <span className="text-lg font-bold text-primary">{reward.points} pts</span>
                        </div>
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              disabled={!reward.available || currentPoints < reward.points}
                              onClick={() => setSelectedReward(reward)}
                            >
                              {currentPoints < reward.points ? "Insufficient Points" : "Redeem"}
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Redeem {selectedReward?.name}</DialogTitle>
                              <DialogDescription>
                                Are you sure you want to redeem this reward for {selectedReward?.points} points?
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center gap-4">
                                <img
                                  src={selectedReward?.image || "/placeholder.svg"}
                                  alt={selectedReward?.name}
                                  className="w-20 h-20 object-cover rounded-lg"
                                />
                                <div>
                                  <h3 className="font-medium">{selectedReward?.name}</h3>
                                  <p className="text-sm text-muted-foreground">{selectedReward?.description}</p>
                                  <p className="text-lg font-bold text-primary mt-1">{selectedReward?.points} points</p>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Button
                                  onClick={() => selectedReward && handleRedeem(selectedReward)}
                                  disabled={isRedeeming}
                                  className="flex-1"
                                >
                                  {isRedeeming ? "Redeeming..." : "Confirm Redemption"}
                                </Button>
                                <Button variant="outline" onClick={() => setSelectedReward(null)} className="flex-1">
                                  Cancel
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredRewards.length === 0 && (
                <div className="text-center py-12">
                  <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-foreground mb-2">No rewards found</h3>
                  <p className="text-muted-foreground">Try adjusting your search or category filter.</p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Redemption History */}
          <Card className="border-border/50 mt-8">
            <CardHeader>
              <CardTitle className="font-serif">Redemption History</CardTitle>
              <CardDescription>Track your recent reward redemptions</CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="w-6 h-6 animate-spin" />
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">Failed to load redemption history</p>
                </div>
              ) : redemptionHistory.length === 0 ? (
                <div className="text-center py-8">
                  <Gift className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">No redemption history yet</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {redemptionHistory.map((redemption) => (
                    <div key={redemption.id} className="flex items-center justify-between py-3 border-b last:border-b-0">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                          <Gift className="w-5 h-5 text-secondary" />
                        </div>
                        <div>
                          <p className="font-medium">{redemption.reward}</p>
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            <Clock className="w-3 h-3" />
                            {redemption.date}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-secondary">-{redemption.points} pts</p>
                        <div className="flex items-center gap-1">
                          <CheckCircle className={`w-3 h-3 ${getStatusColor(redemption.status)}`} />
                          <span className={`text-sm capitalize ${getStatusColor(redemption.status)}`}>
                            {redemption.status}
                          </span>
                        </div>
                        {redemption.code && <p className="text-xs text-muted-foreground mt-1">Code: {redemption.code}</p>}
                        {redemption.trackingNumber && (
                          <p className="text-xs text-muted-foreground mt-1">Tracking: {redemption.trackingNumber}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  )
}
