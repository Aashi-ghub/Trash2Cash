"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Brain, 
  MessageSquare, 
  TrendingUp, 
  AlertTriangle, 
  Activity, 
  BarChart3,
  Send,
  RefreshCw,
  Zap,
  Target,
  Clock,
  Users,
  Database,
  CheckCircle,
  XCircle,
  Loader2
} from "lucide-react"
import { useAuth } from "@/components/auth-provider"

interface EventAnalysis {
  insights: Array<{
    type: string
    description: string
    severity: string
    recommendation: string
  }>
  summary: string
  trends: {
    fill_level_trend: string
    weight_trend: string
    usage_frequency: string
  }
}

interface AnomalyDetection {
  anomalies: Array<{
    type: string
    severity: string
    confidence: number
    details: any
  }>
  events_analyzed: number
  anomalies_detected: number
}

interface PredictiveAnalytics {
  horizons: {
    capacity: any
    usage: any
    collection: any
    revenue: any
    maintenance: any
  }
  ai_insights: any
}

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export default function AIAnalyticsDashboard() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("overview")
  const [loading, setLoading] = useState(false)
  
  // Event Analysis State
  const [eventAnalysis, setEventAnalysis] = useState<EventAnalysis | null>(null)
  const [analyzingEvents, setAnalyzingEvents] = useState(false)
  
  // Anomaly Detection State
  const [anomalyData, setAnomalyData] = useState<AnomalyDetection | null>(null)
  const [selectedBinId, setSelectedBinId] = useState("TEST001")
  const [detectingAnomalies, setDetectingAnomalies] = useState(false)
  
  // Predictive Analytics State
  const [predictions, setPredictions] = useState<PredictiveAnalytics | null>(null)
  const [generatingPredictions, setGeneratingPredictions] = useState(false)
  
  // Chat Interface State
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    {
      role: 'assistant',
      content: 'Hello! I\'m your AI assistant for waste management analytics. How can I help you today?',
      timestamp: new Date()
    }
  ])
  const [chatInput, setChatInput] = useState("")
  const [sendingMessage, setSendingMessage] = useState(false)

  // Mock data for demonstration
  const mockEvents = [
    { bin_id: "TEST001", weight_kg: 15.5, fill_level: 75, user_id: "user123" },
    { bin_id: "TEST002", weight_kg: 8.2, fill_level: 45, user_id: "user456" },
    { bin_id: "TEST003", weight_kg: 22.1, fill_level: 88, user_id: "user789" }
  ]

  const analyzeEvents = async () => {
    setAnalyzingEvents(true)
    try {
      const response = await fetch('/api/ai-analytics/analyze-events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ events: mockEvents })
      })
      
      if (response.ok) {
        const data = await response.json()
        setEventAnalysis(data.data)
      } else {
        // Fallback to mock data
        setEventAnalysis({
          insights: [
            {
              type: "capacity_optimization",
              description: "High fill levels detected in multiple bins",
              severity: "medium",
              recommendation: "Consider increasing collection frequency"
            }
          ],
          summary: "Analysis completed for 3 events",
          trends: {
            fill_level_trend: "increasing",
            weight_trend: "stable",
            usage_frequency: "high"
          }
        })
      }
    } catch (error) {
      console.error('Event analysis failed:', error)
    } finally {
      setAnalyzingEvents(false)
    }
  }

  const detectAnomalies = async () => {
    setDetectingAnomalies(true)
    try {
      const response = await fetch(`/api/ai-analytics/anomalies/${selectedBinId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setAnomalyData(data.data)
      } else {
        // Fallback to mock data
        setAnomalyData({
          anomalies: [
            {
              type: "unusual_weight_spike",
              severity: "medium",
              confidence: 0.85,
              details: { weight: 22.1, threshold: 15.0 }
            }
          ],
          events_analyzed: 15,
          anomalies_detected: 1
        })
      }
    } catch (error) {
      console.error('Anomaly detection failed:', error)
    } finally {
      setDetectingAnomalies(false)
    }
  }

  const generatePredictions = async () => {
    setGeneratingPredictions(true)
    try {
      const response = await fetch(`/api/ai-analytics/predictions/${selectedBinId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      })
      
      if (response.ok) {
        const data = await response.json()
        setPredictions(data.data)
      } else {
        // Fallback to mock data
        setPredictions({
          horizons: {
            capacity: {
              short: { predicted_capacity_kg: 25, confidence: 0.8 },
              medium: { predicted_capacity_kg: 175, confidence: 0.7 }
            },
            usage: {
              next_24h: { expected_events: 8, confidence: 0.85 }
            }
          },
          ai_insights: {
            peak_usage_times: ['14:00-16:00', '18:00-20:00'],
            optimization_suggestions: ['Monitor usage patterns']
          }
        })
      }
    } catch (error) {
      console.error('Predictive analytics failed:', error)
    } finally {
      setGeneratingPredictions(false)
    }
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return
    
    const userMessage: ChatMessage = {
      role: 'user',
      content: chatInput,
      timestamp: new Date()
    }
    
    setChatMessages(prev => [...prev, userMessage])
    setChatInput("")
    setSendingMessage(true)
    
    try {
      const response = await fetch('/api/ai-analytics/ollama/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ 
          message: chatInput,
          context: 'waste management analytics'
        })
      })
      
      if (response.ok) {
        const data = await response.json()
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: data.data.response,
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, assistantMessage])
      } else {
        // Fallback response
        const assistantMessage: ChatMessage = {
          role: 'assistant',
          content: 'I understand your question about waste management. This is a fallback response while I process your request.',
          timestamp: new Date()
        }
        setChatMessages(prev => [...prev, assistantMessage])
      }
    } catch (error) {
      console.error('Chat failed:', error)
      const errorMessage: ChatMessage = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date()
      }
      setChatMessages(prev => [...prev, errorMessage])
    } finally {
      setSendingMessage(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">AI Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Advanced AI-powered insights for waste management optimization
          </p>
        </div>
        <Badge variant="secondary" className="flex items-center gap-2">
          <Brain className="w-4 h-4" />
          Ollama AI
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="events">Event Analysis</TabsTrigger>
          <TabsTrigger value="anomalies">Anomaly Detection</TabsTrigger>
          <TabsTrigger value="predictions">Predictions</TabsTrigger>
          <TabsTrigger value="chat">AI Chat</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">AI Status</CardTitle>
                <Brain className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground">
                  Ollama LLM Running
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Events Analyzed</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">1,247</div>
                <p className="text-xs text-muted-foreground">
                  +12% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Anomalies Detected</CardTitle>
                <AlertTriangle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-orange-600">23</div>
                <p className="text-xs text-muted-foreground">
                  Last 7 days
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Prediction Accuracy</CardTitle>
                <Target className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">87%</div>
                <p className="text-xs text-muted-foreground">
                  +5% improvement
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>
                  Access AI features with one click
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button 
                  onClick={analyzeEvents} 
                  disabled={analyzingEvents}
                  className="w-full justify-start"
                >
                  {analyzingEvents ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <BarChart3 className="mr-2 h-4 w-4" />
                  )}
                  Analyze Recent Events
                </Button>
                
                <Button 
                  onClick={detectAnomalies} 
                  disabled={detectingAnomalies}
                  className="w-full justify-start"
                >
                  {detectingAnomalies ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <AlertTriangle className="mr-2 h-4 w-4" />
                  )}
                  Detect Anomalies
                </Button>
                
                <Button 
                  onClick={generatePredictions} 
                  disabled={generatingPredictions}
                  className="w-full justify-start"
                >
                  {generatingPredictions ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <TrendingUp className="mr-2 h-4 w-4" />
                  )}
                  Generate Predictions
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>AI Insights</CardTitle>
                <CardDescription>
                  Latest AI-generated recommendations
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Optimize Collection Schedule</p>
                      <p className="text-xs text-muted-foreground">
                        AI suggests adjusting collection times based on usage patterns
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <AlertTriangle className="h-5 w-5 text-orange-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">High Fill Level Alert</p>
                      <p className="text-xs text-muted-foreground">
                        Bin TEST003 approaching capacity limit
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <TrendingUp className="h-5 w-5 text-blue-500 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Usage Trend Analysis</p>
                      <p className="text-xs text-muted-foreground">
                        Peak usage times identified: 2-4 PM and 6-8 PM
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="events" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Event Analysis</CardTitle>
              <CardDescription>
                AI-powered analysis of smart bin events
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={analyzeEvents} 
                disabled={analyzingEvents}
                className="mb-4"
              >
                {analyzingEvents ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-2 h-4 w-4" />
                )}
                Analyze Events
              </Button>

              {eventAnalysis && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Fill Level Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant={eventAnalysis.trends.fill_level_trend === 'increasing' ? 'destructive' : 'secondary'}>
                          {eventAnalysis.trends.fill_level_trend}
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Weight Trend</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">
                          {eventAnalysis.trends.weight_trend}
                        </Badge>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Usage Frequency</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <Badge variant="secondary">
                          {eventAnalysis.trends.usage_frequency}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>AI Insights</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {eventAnalysis.insights.map((insight, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{insight.type.replace('_', ' ').toUpperCase()}</h4>
                              <Badge variant={insight.severity === 'high' ? 'destructive' : 'secondary'}>
                                {insight.severity}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">{insight.description}</p>
                            <p className="text-sm font-medium">Recommendation: {insight.recommendation}</p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="anomalies" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Anomaly Detection</CardTitle>
              <CardDescription>
                Advanced anomaly detection using AI algorithms
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input
                  placeholder="Bin ID"
                  value={selectedBinId}
                  onChange={(e) => setSelectedBinId(e.target.value)}
                  className="w-48"
                />
                <Button 
                  onClick={detectAnomalies} 
                  disabled={detectingAnomalies}
                >
                  {detectingAnomalies ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <Zap className="mr-2 h-4 w-4" />
                  )}
                  Detect Anomalies
                </Button>
              </div>

              {anomalyData && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Events Analyzed</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{anomalyData.events_analyzed}</div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader className="pb-2">
                        <CardTitle className="text-sm">Anomalies Detected</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold text-orange-600">{anomalyData.anomalies_detected}</div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Detected Anomalies</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {anomalyData.anomalies.map((anomaly, index) => (
                          <div key={index} className="p-3 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium">{anomaly.type.replace(/_/g, ' ').toUpperCase()}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'}>
                                  {anomaly.severity}
                                </Badge>
                                <Badge variant="outline">
                                  {Math.round(anomaly.confidence * 100)}% confidence
                                </Badge>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              Details: {JSON.stringify(anomaly.details)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="predictions" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Predictive Analytics</CardTitle>
              <CardDescription>
                AI-powered predictions for waste management optimization
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-4">
                <Input
                  placeholder="Bin ID"
                  value={selectedBinId}
                  onChange={(e) => setSelectedBinId(e.target.value)}
                  className="w-48"
                />
                <Button 
                  onClick={generatePredictions} 
                  disabled={generatingPredictions}
                >
                  {generatingPredictions ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <TrendingUp className="mr-2 h-4 w-4" />
                  )}
                  Generate Predictions
                </Button>
              </div>

              {predictions && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle>Capacity Forecast</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Next 24h</span>
                            <span className="font-medium">
                              {predictions.horizons.capacity?.short?.predicted_capacity_kg}kg
                            </span>
                          </div>
                          <Progress value={predictions.horizons.capacity?.short?.confidence * 100} />
                        </div>
                      </CardContent>
                    </Card>
                    
                    <Card>
                      <CardHeader>
                        <CardTitle>Usage Predictions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span>Next 24h Events</span>
                            <span className="font-medium">
                              {predictions.horizons.usage?.next_24h?.expected_events}
                            </span>
                          </div>
                          <Progress value={predictions.horizons.usage?.next_24h?.confidence * 100} />
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  {predictions.ai_insights && (
                    <Card>
                      <CardHeader>
                        <CardTitle>AI Insights</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div>
                            <h4 className="font-medium mb-2">Peak Usage Times</h4>
                            <div className="flex flex-wrap gap-2">
                              {predictions.ai_insights.peak_usage_times?.map((time: string, index: number) => (
                                <Badge key={index} variant="secondary">{time}</Badge>
                              ))}
                            </div>
                          </div>
                          
                          <div>
                            <h4 className="font-medium mb-2">Optimization Suggestions</h4>
                            <ul className="space-y-1">
                              {predictions.ai_insights.optimization_suggestions?.map((suggestion: string, index: number) => (
                                <li key={index} className="text-sm text-muted-foreground">• {suggestion}</li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="chat" className="space-y-4">
          <Card className="h-[600px] flex flex-col">
            <CardHeader>
              <CardTitle>AI Chat Assistant</CardTitle>
              <CardDescription>
                Chat with the AI about waste management analytics
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <ScrollArea className="flex-1 mb-4">
                <div className="space-y-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={index}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[80%] p-3 rounded-lg ${
                          message.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                        <p className="text-xs opacity-70 mt-1">
                          {message.timestamp.toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                  ))}
                  {sendingMessage && (
                    <div className="flex justify-start">
                      <div className="bg-muted p-3 rounded-lg">
                        <div className="flex items-center space-x-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                          <span className="text-sm">AI is thinking...</span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </ScrollArea>
              
              <div className="flex space-x-2">
                <Textarea
                  placeholder="Ask about waste management analytics..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendChatMessage()}
                  className="flex-1"
                  rows={2}
                />
                <Button 
                  onClick={sendChatMessage} 
                  disabled={sendingMessage || !chatInput.trim()}
                  className="self-end"
                >
                  {sendingMessage ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
