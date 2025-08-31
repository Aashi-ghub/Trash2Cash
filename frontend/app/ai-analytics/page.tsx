import { ProtectedRoute } from "@/components/protected-route"
import AIAnalyticsDashboard from "@/components/ui/ai-analytics-dashboard"

export default function AIAnalyticsPage() {
  return (
    <ProtectedRoute>
      <div className="container mx-auto p-6">
        <AIAnalyticsDashboard />
      </div>
    </ProtectedRoute>
  )
}
