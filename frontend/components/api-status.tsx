"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { apiClient } from "@/lib/api"
import { CheckCircle, XCircle, Loader2, Database, Users, MapPin, Activity } from "lucide-react"

export function ApiStatus() {
  const [status, setStatus] = useState<{
    health: 'loading' | 'success' | 'error'
    users: 'loading' | 'success' | 'error'
    bins: 'loading' | 'success' | 'error'
    events: 'loading' | 'success' | 'error'
  }>({
    health: 'loading',
    users: 'loading',
    bins: 'loading',
    events: 'loading'
  })

  const [data, setData] = useState<{
    health?: any
    users?: any[]
    bins?: any[]
    events?: any[]
  }>({})

  const testHealth = async () => {
    setStatus(prev => ({ ...prev, health: 'loading' }))
    try {
      const response = await apiClient.healthCheck()
      if (response.status === 'success') {
        setStatus(prev => ({ ...prev, health: 'success' }))
        setData(prev => ({ ...prev, health: response.data }))
      } else {
        setStatus(prev => ({ ...prev, health: 'error' }))
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, health: 'error' }))
    }
  }

  const testUsers = async () => {
    setStatus(prev => ({ ...prev, users: 'loading' }))
    try {
      const response = await apiClient.getUsers()
      if (response.status === 'success') {
        setStatus(prev => ({ ...prev, users: 'success' }))
        setData(prev => ({ ...prev, users: response.data }))
      } else {
        setStatus(prev => ({ ...prev, users: 'error' }))
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, users: 'error' }))
    }
  }

  const testBins = async () => {
    setStatus(prev => ({ ...prev, bins: 'loading' }))
    try {
      const response = await apiClient.getBins()
      if (response.status === 'success') {
        setStatus(prev => ({ ...prev, bins: 'success' }))
        setData(prev => ({ ...prev, bins: response.data }))
      } else {
        setStatus(prev => ({ ...prev, bins: 'error' }))
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, bins: 'error' }))
    }
  }

  const testEvents = async () => {
    setStatus(prev => ({ ...prev, events: 'loading' }))
    try {
      const response = await apiClient.getEvents({ limit: 5 })
      if (response.status === 'success') {
        setStatus(prev => ({ ...prev, events: 'success' }))
        setData(prev => ({ ...prev, events: response.data }))
      } else {
        setStatus(prev => ({ ...prev, events: 'error' }))
      }
    } catch (error) {
      setStatus(prev => ({ ...prev, events: 'error' }))
    }
  }

  const testAll = async () => {
    await Promise.all([
      testHealth(),
      testUsers(),
      testBins(),
      testEvents()
    ])
  }

  useEffect(() => {
    testAll()
  }, [])

  const getStatusIcon = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin" />
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />
    }
  }

  const getStatusBadge = (status: 'loading' | 'success' | 'error') => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Loading...</Badge>
      case 'success':
        return <Badge variant="default">Connected</Badge>
      case 'error':
        return <Badge variant="destructive">Error</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="w-5 h-5" />
            Backend API Status
          </CardTitle>
          <CardDescription>
            Test the connection to the deployed backend at eco-hive-network.onrender.com
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Health Check */}
            <div key="health" className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4" />
                <span className="text-sm font-medium">Health</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.health)}
                {getStatusBadge(status.health)}
              </div>
            </div>

            {/* Users API */}
            <div key="users" className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4" />
                <span className="text-sm font-medium">Users</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.users)}
                {getStatusBadge(status.users)}
              </div>
            </div>

            {/* Bins API */}
            <div key="bins" className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Bins</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.bins)}
                {getStatusBadge(status.bins)}
              </div>
            </div>

            {/* Events API */}
            <div key="events" className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Events</span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(status.events)}
                {getStatusBadge(status.events)}
              </div>
            </div>
          </div>

          <div className="mt-4 flex gap-2">
            <Button key="test-all" onClick={testAll} size="sm">
              Test All APIs
            </Button>
            <Button key="test-health" onClick={testHealth} size="sm" variant="outline">
              Health Check
            </Button>
            <Button key="test-users" onClick={testUsers} size="sm" variant="outline">
              Test Users
            </Button>
            <Button key="test-bins" onClick={testBins} size="sm" variant="outline">
              Test Bins
            </Button>
            <Button key="test-events" onClick={testEvents} size="sm" variant="outline">
              Test Events
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Data Display */}
      {data.users && data.users.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Users Data</CardTitle>
            <CardDescription>Recent users from the backend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.users.slice(0, 3).map((user: any, index: number) => (
                <div key={user.id || `user-${index}`} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{user.display_name}</p>
                    <p className="text-sm text-muted-foreground">{user.email}</p>
                  </div>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.bins && data.bins.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Bins Data</CardTitle>
            <CardDescription>Recent bins from the backend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.bins.slice(0, 3).map((bin: any, index: number) => (
                <div key={bin.id || `bin-${index}`} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">{bin.bin_code}</p>
                    <p className="text-sm text-muted-foreground">{bin.location}</p>
                  </div>
                  <Badge variant={bin.status === 'active' ? 'default' : 'secondary'}>
                    {bin.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data.events && data.events.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sample Events Data</CardTitle>
            <CardDescription>Recent events from the backend</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.events.slice(0, 3).map((event: any, index: number) => (
                <div key={event.id || `event-${index}`} className="flex items-center justify-between p-2 border rounded">
                  <div>
                    <p className="font-medium">Bin Event</p>
                    <p className="text-sm text-muted-foreground">
                      Fill Level: {event.fill_level_pct}% | Weight: {event.weight_kg_total}kg
                    </p>
                  </div>
                  <Badge variant="outline">
                    {new Date(event.timestamp_utc).toLocaleDateString()}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
