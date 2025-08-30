"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowRight, Recycle, Coins, MapPin, Gift, Smartphone, Leaf } from "lucide-react"
import Link from "next/link"

export default function HowItWorksPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-green-600">
            Trash2Cash
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">How Trash2Cash Works</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Turn your recyclables into rewards with our smart bin network. Earn T2C tokens for every deposit and redeem
            them for amazing rewards.
          </p>
        </div>

        {/* Process Steps */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle>1. Find a Smart Bin</CardTitle>
              <CardDescription>Use our app to locate the nearest Trash2Cash smart bin in your area</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Recycle className="w-8 h-8 text-blue-600" />
              </div>
              <CardTitle>2. Deposit Recyclables</CardTitle>
              <CardDescription>Sort and deposit your recyclables into the appropriate compartments</CardDescription>
            </CardHeader>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Coins className="w-8 h-8 text-purple-600" />
              </div>
              <CardTitle>3. Earn T2C Tokens</CardTitle>
              <CardDescription>
                Receive T2C tokens instantly based on the type and quantity of recyclables
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Token Categories */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Token Earning Categories</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-green-100 text-green-800">
                    HV
                  </Badge>
                  High Value Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Premium recyclables with higher token rewards</p>
                <ul className="space-y-2 text-sm">
                  <li>• Aluminum cans: 5-10 T2C tokens</li>
                  <li>• Glass bottles: 3-8 T2C tokens</li>
                  <li>• Electronics: 20-50 T2C tokens</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                    LV
                  </Badge>
                  Low Value Items
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Common recyclables with standard rewards</p>
                <ul className="space-y-2 text-sm">
                  <li>• Plastic bottles: 1-3 T2C tokens</li>
                  <li>• Paper/Cardboard: 1-2 T2C tokens</li>
                  <li>• Plastic containers: 2-4 T2C tokens</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800">
                    ORG
                  </Badge>
                  Organic Waste
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">Compostable materials for sustainability</p>
                <ul className="space-y-2 text-sm">
                  <li>• Food scraps: 1-2 T2C tokens</li>
                  <li>• Garden waste: 2-3 T2C tokens</li>
                  <li>• Biodegradable items: 1-3 T2C tokens</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Features */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">App Features</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Smartphone className="w-6 h-6 text-green-600" />
                  Smart Tracking
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Real-time token balance</li>
                  <li>• Deposit history and analytics</li>
                  <li>• Environmental impact tracking</li>
                  <li>• Daily/weekly goals and achievements</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gift className="w-6 h-6 text-blue-600" />
                  Rewards System
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li>• Gift cards and vouchers</li>
                  <li>• Eco-friendly products</li>
                  <li>• Local business discounts</li>
                  <li>• Exclusive sustainability items</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Environmental Impact */}
        <Card className="mb-16 bg-gradient-to-r from-green-500 to-blue-500 text-white">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl flex items-center justify-center gap-2">
              <Leaf className="w-8 h-8" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="text-3xl font-bold mb-2">50,000+</div>
                <div className="text-green-100">Items Recycled</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">25 Tons</div>
                <div className="text-green-100">CO₂ Saved</div>
              </div>
              <div>
                <div className="text-3xl font-bold mb-2">100+</div>
                <div className="text-green-100">Smart Bins Active</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* CTA */}
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Earning?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of users already making a difference while earning rewards
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/signup">
              <Button size="lg" className="flex items-center gap-2">
                Get Started Now <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button size="lg" variant="outline">
                View Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </main>
    </div>
  )
}
