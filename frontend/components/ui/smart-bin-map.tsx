"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { 
  MapPin, 
  Navigation, 
  Clock, 
  Battery, 
  Signal, 
  Wifi, 
  Star,
  Phone,
  Route,
  Zap,
  Leaf,
  Recycle,
  Search,
  Filter,
  SlidersHorizontal
} from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the map components to avoid SSR issues
const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false })
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false })
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false })
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false })
const Circle = dynamic(() => import("react-leaflet").then(mod => mod.Circle), { ssr: false })

// Import Leaflet for icon creation
let L: any = null
if (typeof window !== 'undefined') {
  L = require('leaflet')
}

// Mock data for Bangalore smart bins with real coordinates
const mockBins = [
  {
    id: 1,
    name: "MG Road Smart Bin",
    location: "MG Road, Bangalore",
    coordinates: { lat: 12.9716, lng: 77.5946 },
    fillLevel: 85,
    status: "active",
    distance: 0.2,
    rating: 4.8,
    lastCollection: "2 hours ago",
    battery: 92,
    signal: "strong",
    rewards: 15,
    features: ["plastic", "paper", "metal", "glass"],
    address: "MG Road, Brigade Road Junction, Bangalore 560001"
  },
  {
    id: 2,
    name: "Koramangala Hub",
    location: "Koramangala, Bangalore",
    coordinates: { lat: 12.9352, lng: 77.6245 },
    fillLevel: 45,
    status: "active",
    distance: 0.8,
    rating: 4.6,
    lastCollection: "4 hours ago",
    battery: 78,
    signal: "good",
    rewards: 12,
    features: ["plastic", "paper", "e-waste"],
    address: "Koramangala 8th Block, Bangalore 560034"
  },
  {
    id: 3,
    name: "Indiranagar Station",
    location: "Indiranagar, Bangalore",
    coordinates: { lat: 12.9789, lng: 77.6417 },
    fillLevel: 92,
    status: "needs_collection",
    distance: 1.2,
    rating: 4.9,
    lastCollection: "6 hours ago",
    battery: 65,
    signal: "strong",
    rewards: 18,
    features: ["plastic", "paper", "metal", "glass", "organic"],
    address: "Indiranagar Metro Station, Bangalore 560038"
  },
  {
    id: 4,
    name: "Whitefield Tech Park",
    location: "Whitefield, Bangalore",
    coordinates: { lat: 12.9692, lng: 77.7499 },
    fillLevel: 23,
    status: "active",
    distance: 2.1,
    rating: 4.7,
    lastCollection: "1 hour ago",
    battery: 95,
    signal: "excellent",
    rewards: 20,
    features: ["plastic", "paper", "metal"],
    address: "Whitefield Main Road, Bangalore 560066"
  },
  {
    id: 5,
    name: "Electronic City Hub",
    location: "Electronic City, Bangalore",
    coordinates: { lat: 12.8458, lng: 77.6655 },
    fillLevel: 67,
    status: "active",
    distance: 3.5,
    rating: 4.5,
    lastCollection: "3 hours ago",
    battery: 88,
    signal: "good",
    rewards: 14,
    features: ["plastic", "paper", "e-waste", "glass"],
    address: "Electronic City Phase 1, Bangalore 560100"
  },
  {
    id: 6,
    name: "Marathahalli Bridge",
    location: "Marathahalli, Bangalore",
    coordinates: { lat: 12.9584, lng: 77.7014 },
    fillLevel: 78,
    status: "active",
    distance: 1.8,
    rating: 4.4,
    lastCollection: "5 hours ago",
    battery: 72,
    signal: "moderate",
    rewards: 16,
    features: ["plastic", "paper", "metal"],
    address: "Marathahalli Bridge, Outer Ring Road, Bangalore 560037"
  }
]

// Bangalore city center coordinates
const BANGALORE_CENTER = { lat: 12.9716, lng: 77.5946 }

interface SmartBinMapProps {
  className?: string
  showDetails?: boolean
}

export function SmartBinMap({ className = "", showDetails = true }: SmartBinMapProps) {
  const [selectedBin, setSelectedBin] = useState<typeof mockBins[0] | null>(null)
  const [userLocation, setUserLocation] = useState(BANGALORE_CENTER)
  const [nearestBin, setNearestBin] = useState(mockBins[0])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [showNavigation, setShowNavigation] = useState(false)
  const [isMapLoaded, setIsMapLoaded] = useState(false)

  useEffect(() => {
    // Simulate getting user location
    const getUserLocation = () => {
      // Mock user location near MG Road
      setUserLocation({ lat: 12.9716, lng: 77.5946 })
      
      // Find nearest bin
      const nearest = mockBins.reduce((prev, current) => 
        prev.distance < current.distance ? prev : current
      )
      setNearestBin(nearest)
    }

    getUserLocation()
    
    // Load Leaflet CSS
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css'
    link.integrity = 'sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY='
    link.crossOrigin = ''
    document.head.appendChild(link)

    return () => {
      // Cleanup
      const existingLink = document.querySelector('link[href*="leaflet"]')
      if (existingLink) {
        existingLink.remove()
      }
    }
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-500"
      case "needs_collection": return "bg-amber-500"
      case "maintenance": return "bg-red-500"
      default: return "bg-gray-500"
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case "active": return "Available"
      case "needs_collection": return "Needs Collection"
      case "maintenance": return "Maintenance"
      default: return "Unknown"
    }
  }

  const getSignalIcon = (signal: string) => {
    switch (signal) {
      case "excellent": return <Wifi className="w-4 h-4 text-green-500" />
      case "strong": return <Wifi className="w-4 h-4 text-green-400" />
      case "good": return <Wifi className="w-4 h-4 text-yellow-500" />
      case "moderate": return <Wifi className="w-4 h-4 text-orange-500" />
      default: return <Wifi className="w-4 h-4 text-red-500" />
    }
  }

  // Filter bins based on search and status
  const filteredBins = mockBins.filter(bin => {
    const matchesSearch = bin.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         bin.location.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = filterStatus === "all" || bin.status === filterStatus
    return matchesSearch && matchesStatus
  })

  // Navigation functions
  const handleNavigateToNearest = () => {
    setShowNavigation(true)
    // Simulate navigation - in real app this would open maps app
    setTimeout(() => {
      alert(`🚗 Navigating to ${nearestBin.name} (${nearestBin.distance}km away)\n\nIn a real app, this would open Google Maps or your preferred navigation app.`)
      setShowNavigation(false)
    }, 1500)
  }

  const handleNavigateToBin = (bin: typeof mockBins[0]) => {
    setShowNavigation(true)
    setTimeout(() => {
      alert(`🚗 Navigating to ${bin.name} (${bin.distance}km away)\n\nIn a real app, this would open Google Maps or your preferred navigation app.`)
      setShowNavigation(false)
    }, 1500)
  }

  const handleShowRoute = () => {
    alert(`🗺️ Showing route to ${nearestBin.name} via Google Maps\n\nIn a real app, this would open Google Maps with the route.`)
  }

  // Custom marker icon for smart bins
  const createCustomIcon = (status: string) => {
    if (!L) return undefined
    
    const color = status === "needs_collection" ? "#f59e0b" : "#10b981"
    return L.divIcon({
      className: 'custom-marker',
      html: `
        <div style="
          width: 24px; 
          height: 36px; 
          background: ${color}; 
          border: 2px solid white; 
          border-radius: 50% 50% 50% 0; 
          transform: rotate(-45deg); 
          position: relative;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        ">
          <div style="
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) rotate(45deg);
            color: white;
            font-size: 12px;
            font-weight: bold;
          ">♻</div>
        </div>
      `,
      iconSize: [24, 36],
      iconAnchor: [12, 36],
      popupAnchor: [0, -36]
    })
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Map Visualization */}
      <Card className="border-border/50 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <CardTitle className="font-serif flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Smart Bin Network - Bangalore
              </CardTitle>
              <CardDescription>
                Find the nearest recycling bin to you
              </CardDescription>
            </div>
            <Badge variant="secondary" className="flex items-center gap-1">
              <Signal className="w-3 h-3" />
              {filteredBins.length} of {mockBins.length} Bins
            </Badge>
          </div>
          
          {/* Search and Filter Controls */}
          <div className="flex items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search bins by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="w-4 h-4 text-muted-foreground" />
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                <option value="all">All Status</option>
                <option value="active">Available</option>
                <option value="needs_collection">Needs Collection</option>
                <option value="maintenance">Maintenance</option>
              </select>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {/* Real Map Container */}
          <div className="relative w-full h-80">
            {typeof window !== 'undefined' && (
              <MapContainer
                center={[userLocation.lat, userLocation.lng]}
                zoom={13}
                className="w-full h-full"
                style={{ height: '320px' }}
                whenCreated={() => setIsMapLoaded(true)}
              >
                {/* OpenStreetMap Tiles */}
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                
                {/* User Location */}
                <Circle
                  center={[userLocation.lat, userLocation.lng]}
                  radius={100}
                  pathOptions={{
                    color: '#3b82f6',
                    fillColor: '#3b82f6',
                    fillOpacity: 0.2
                  }}
                />
                <Marker position={[userLocation.lat, userLocation.lng]}>
                  <Popup>
                    <div className="text-center">
                      <div className="font-medium text-blue-600">You are here</div>
                      <div className="text-sm text-gray-600">MG Road, Bangalore</div>
                    </div>
                  </Popup>
                </Marker>

                {/* Smart Bin Markers */}
                {filteredBins.map((bin) => (
                  <Marker
                    key={bin.id}
                    position={[bin.coordinates.lat, bin.coordinates.lng]}
                    icon={createCustomIcon(bin.status)}
                  >
                    <Popup>
                      <div className="p-2 min-w-48">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-800">{bin.name}</h3>
                          <Badge variant={bin.status === "needs_collection" ? "destructive" : "secondary"} className="text-xs">
                            {getStatusText(bin.status)}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">{bin.address}</p>
                        <div className="space-y-1 text-xs">
                          <div className="flex justify-between">
                            <span>Fill Level:</span>
                            <span className="font-medium">{bin.fillLevel}%</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Distance:</span>
                            <span className="font-medium">{bin.distance} km</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Rating:</span>
                            <div className="flex items-center gap-1">
                              <Star className="w-3 h-3 text-yellow-500 fill-current" />
                              <span className="font-medium">{bin.rating}</span>
                            </div>
                          </div>
                        </div>
                        <Button
                          size="sm"
                          className="w-full mt-2"
                          onClick={() => handleNavigateToBin(bin)}
                          disabled={showNavigation}
                        >
                          <Navigation className="w-3 h-3 mr-1" />
                          {showNavigation ? "Navigating..." : "Navigate"}
                        </Button>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
            
            {/* Map Legend */}
            <div className="absolute top-2 left-2 bg-white/95 backdrop-blur-sm rounded-lg p-3 text-xs shadow-lg border z-[1000]">
              <div className="font-medium text-gray-800 mb-2">Map Legend</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">Available Bins</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span className="text-gray-700">Needs Collection</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-blue-500 rounded-full opacity-20"></div>
                  <span className="text-gray-700">Your Location</span>
                </div>
              </div>
            </div>
          </div>

          {/* Map Controls */}
          <div className="p-4 bg-muted/30 border-t">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleNavigateToNearest}
                  disabled={showNavigation}
                >
                  <Navigation className="w-4 h-4" />
                  {showNavigation ? "Navigating..." : "Navigate to Nearest"}
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={handleShowRoute}
                >
                  <Route className="w-4 h-4" />
                  Show Route
                </Button>
                <Button size="sm" variant="outline" className="flex items-center gap-2">
                  <SlidersHorizontal className="w-4 h-4" />
                  Map Settings
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    Available
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    Needs Collection
                  </div>
                </div>
                <div className="flex items-center gap-2 text-xs">
                  <Leaf className="w-3 h-3 text-green-500" />
                  <span>Network Status: Operational</span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Network Statistics */}
      {showDetails && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">{mockBins.length}</p>
                  <p className="text-xs text-muted-foreground">Total Bins</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">6</p>
                  <p className="text-xs text-muted-foreground">Areas Covered</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Zap className="w-5 h-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">15.8</p>
                  <p className="text-xs text-muted-foreground">Avg Points</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="border-border/50">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-purple-600">98%</p>
                  <p className="text-xs text-muted-foreground">Uptime</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Bin Details */}
      {showDetails && (
        <div className="grid md:grid-cols-2 gap-4">
          {/* Nearest Bin Card */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif flex items-center gap-2">
                <Star className="w-5 h-5 text-yellow-500" />
                Nearest Bin
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-medium">{nearestBin.name}</h3>
                    <p className="text-sm text-muted-foreground">{nearestBin.address}</p>
                  </div>
                  <Badge variant="secondary">{nearestBin.distance} km away</Badge>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Fill Level</span>
                    <span className="font-medium">{nearestBin.fillLevel}%</span>
                  </div>
                  <Progress value={nearestBin.fillLevel} className="h-2" />
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <Battery className="w-4 h-4 text-green-500" />
                    <span>{nearestBin.battery}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getSignalIcon(nearestBin.signal)}
                    <span className="capitalize">{nearestBin.signal}</span>
                  </div>
                </div>

                <Button 
                  className="w-full"
                  onClick={() => handleNavigateToBin(nearestBin)}
                  disabled={showNavigation}
                >
                  <Navigation className="w-4 h-4 mr-2" />
                  {showNavigation ? "Navigating..." : "Navigate to Bin"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* All Bins List */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="font-serif">All Nearby Bins</CardTitle>
              <CardDescription>Click on a bin for details</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {filteredBins.map((bin) => (
                  <motion.div
                    key={bin.id}
                    whileHover={{ scale: 1.02 }}
                    className={`p-3 border rounded-lg cursor-pointer transition-all duration-200 ${
                      selectedBin?.id === bin.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => setSelectedBin(bin)}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${getStatusColor(bin.status)}`}></div>
                        <div>
                          <p className="font-medium text-sm">{bin.name}</p>
                          <p className="text-xs text-muted-foreground">{bin.distance} km</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-1">
                          <Star className="w-3 h-3 text-yellow-500 fill-current" />
                          <span className="text-sm font-medium">{bin.rating}</span>
                        </div>
                        <p className="text-xs text-muted-foreground">{bin.fillLevel}% full</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Selected Bin Details Modal */}
      <AnimatePresence>
        {selectedBin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
            onClick={() => setSelectedBin(null)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-card rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-serif font-bold">{selectedBin.name}</h2>
                  <Badge variant={selectedBin.status === "needs_collection" ? "destructive" : "secondary"}>
                    {getStatusText(selectedBin.status)}
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm text-muted-foreground">Address</p>
                    <p className="font-medium">{selectedBin.address}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Distance</p>
                      <p className="font-medium">{selectedBin.distance} km</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Rating</p>
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span className="font-medium">{selectedBin.rating}</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Fill Level</p>
                    <Progress value={selectedBin.fillLevel} className="h-3" />
                    <p className="text-sm mt-1">{selectedBin.fillLevel}% full</p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Accepted Materials</p>
                    <div className="flex flex-wrap gap-2">
                      {selectedBin.features.map((feature) => (
                        <Badge key={feature} variant="outline" className="text-xs">
                          {feature}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center gap-2">
                      <Battery className="w-4 h-4 text-green-500" />
                      <span className="text-sm">{selectedBin.battery}% battery</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {getSignalIcon(selectedBin.signal)}
                      <span className="text-sm capitalize">{selectedBin.signal} signal</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Last collection: {selectedBin.lastCollection}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm">
                    <Zap className="w-4 h-4 text-yellow-500" />
                    <span className="font-medium">{selectedBin.rewards} points per item</span>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <Button 
                    className="flex-1"
                    onClick={() => handleNavigateToBin(selectedBin)}
                    disabled={showNavigation}
                  >
                    <Navigation className="w-4 h-4 mr-2" />
                    {showNavigation ? "Navigating..." : "Navigate"}
                  </Button>
                  <Button variant="outline" className="flex-1">
                    <Phone className="w-4 h-4 mr-2" />
                    Call Support
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
