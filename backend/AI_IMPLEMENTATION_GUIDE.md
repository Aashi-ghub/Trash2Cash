# 🤖 AI Implementation Guide - Trash2Cash

This guide covers the comprehensive AI implementation in the Trash2Cash backend, including real OpenXAI integration, Ollama local LLM integration, advanced predictive analytics, and enhanced anomaly detection.

## 🚀 **Overview**

The AI system has been completely upgraded from mock services to real AI-powered analytics with the following components:

### **Core AI Services:**
1. **Real OpenXAI Integration** - Production-ready AI analysis
2. **Ollama Local LLM Integration** - Local AI processing with fallback
3. **Hybrid AI Service** - Intelligent switching between cloud and local AI
4. **Enhanced Anomaly Detection** - Multi-algorithm approach
5. **Predictive Analytics** - Advanced forecasting capabilities
6. **Real-time AI Processing** - Live insights and monitoring

---

## 🔧 **Setup & Configuration**

### **1. Environment Variables**

Add these to your `.env` file:

```bash
# OpenXAI Configuration
OPENXAI_API_KEY=your_openxai_api_key_here
OPENXAI_BASE_URL=https://api.openxai.com

# Ollama Configuration (Local LLM)
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama3

# Optional: Customize AI settings
AI_ANALYSIS_TIMEOUT=30000
AI_CONFIDENCE_THRESHOLD=0.6
AI_FALLBACK_ENABLED=true
```

### **2. Install Dependencies**

```bash
npm install axios
```

### **3. API Key Setup**

1. **Get OpenXAI API Key:**
   - Visit [OpenXAI Platform](https://openxai.com)
   - Create an account and generate API key
   - Add to your environment variables

2. **Fallback Mode:**
   - If no API key is provided, the system automatically uses fallback analysis
   - All AI features remain functional with simulated responses

### **4. Ollama Setup (Optional but Recommended)**

For local LLM processing, install and configure Ollama:

1. **Install Ollama:**
   ```bash
   # Windows: Download from https://ollama.ai/download
   # macOS/Linux:
   curl -fsSL https://ollama.ai/install.sh | sh
   ```

2. **Start Ollama Service:**
   ```bash
   ollama serve
   ```

3. **Download a Model:**
   ```bash
   ollama pull llama3
   ```

4. **Test Installation:**
   ```bash
   ollama run llama3
   ```

See `OLLAMA_SETUP_GUIDE.md` for detailed instructions.

---

## 🧠 **AI Services Architecture**

### **1. OpenXAI Service (`src/services/openXaiService.js`)**

**Features:**
- Real AI analysis of bin events
- Material classification with confidence scores
- Anomaly detection with detailed insights
- Environmental impact calculations
- Predictive analytics integration

**Key Methods:**
```javascript
// Analyze events with real AI
await openXaiService.analyzeEvents(events)

// Get predictive analytics
await openXaiService.getPredictiveAnalytics(binId, historicalData)
```

### **2. Ollama Service (`src/services/ollamaService.js`)**

**Features:**
- Local LLM processing with Ollama
- Real-time text generation and analysis
- Model management and switching
- Chat functionality for user interaction
- Fallback AI processing when cloud services unavailable

**Key Methods:**
```javascript
// Generate text with local LLM
await ollamaService.generateText(prompt, model)

// Chat with AI assistant
await ollamaService.chat(message, context)

// Get available models
await ollamaService.getAvailableModels()

// Pull new model
await ollamaService.pullModel(modelName)
```

### **3. Hybrid AI Service (`src/services/hybridAiService.js`)**

**Features:**
- Intelligent switching between OpenXAI and Ollama
- Automatic fallback mechanisms
- Service health monitoring
- Consistent API regardless of backend
- Performance optimization

**Key Methods:**
```javascript
// Analyze events with best available service
await hybridAiService.analyzeEvents(events)

// Set preferred service
await hybridAiService.setPreferredService('openxai' | 'ollama')

// Get service status
await hybridAiService.getServiceStatus()
```

### **4. Enhanced Anomaly Detection (`src/analytics/enhancedAnomalies.js`)**

**Algorithms Implemented:**
- **Statistical Analysis** - Z-score and IQR outlier detection
- **Pattern Detection** - Usage pattern and material composition analysis
- **AI-Powered Detection** - Integration with OpenXAI for advanced insights
- **Contextual Analysis** - Location and time-based anomaly detection
- **Temporal Analysis** - Time-series analysis for trends and spikes

**Detection Types:**
- Weight outliers and unusual patterns
- Fill level anomalies
- Purity score deviations
- Usage pattern irregularities
- Temporal spikes and drops
- User behavior anomalies

### **5. Predictive Analytics (`src/analytics/predictiveAnalytics.js`)**

**Prediction Capabilities:**
- **Capacity Forecasting** - Predict bin capacity requirements
- **Usage Pattern Prediction** - Forecast usage trends
- **Collection Optimization** - Optimal collection schedules
- **Revenue Forecasting** - Predict revenue based on usage
- **Maintenance Prediction** - Predict maintenance requirements

**Time Horizons:**
- **Short-term** (24 hours)
- **Medium-term** (1 week)
- **Long-term** (1 month)

---

## 📊 **API Endpoints**

### **AI Analytics Routes (`/api/ai-analytics`)**

#### **1. Health Check**
```http
GET /api/ai-analytics/health
```
Returns AI service status and capabilities.

#### **2. Event Analysis**
```http
POST /api/ai-analytics/analyze-events
Content-Type: application/json

{
  "events": [...],
  "options": {}
}
```
Analyze bin events with real AI processing.

#### **3. Anomaly Detection**
```http
GET /api/ai-analytics/anomalies/:binId?days=7
```
Get enhanced anomaly detection for a specific bin.

#### **4. Predictive Analytics**
```http
GET /api/ai-analytics/predictions/:binId?horizon=all
```
Get comprehensive predictions for a bin.

#### **5. Network Overview**
```http
GET /api/ai-analytics/network-overview
```
Get AI-powered network insights and statistics.

#### **6. Collection Optimization**
```http
POST /api/ai-analytics/optimize-collection
Content-Type: application/json

{
  "binIds": ["bin1", "bin2"],
  "constraints": {}
}
```
Get AI-powered collection optimization recommendations.

#### **7. Real-time Insights**
```http
GET /api/ai-analytics/real-time-insights
```
Get real-time AI insights for dashboard.

#### **8. Ollama Status**
```http
GET /api/ai-analytics/ollama/status
```
Get Ollama service status and available models.

#### **9. Ollama Chat**
```http
POST /api/ai-analytics/ollama/chat
Content-Type: application/json

{
  "message": "Your message",
  "context": "Optional context",
  "model": "Optional model name"
}
```
Chat with local Ollama AI assistant.

#### **10. Pull Ollama Model**
```http
POST /api/ai-analytics/ollama/pull-model
Content-Type: application/json

{
  "model_name": "model_name"
}
```
Download a new Ollama model.

#### **11. AI Services Status**
```http
GET /api/ai-analytics/ai-services/status
```
Get status of all AI services (OpenXAI and Ollama).

#### **12. Set Preferred AI Service**
```http
POST /api/ai-analytics/ai-services/preferred
Content-Type: application/json

{
  "service": "openxai" | "ollama"
}
```
Set the preferred AI service for processing.

---

## 🔍 **Enhanced Anomaly Detection**

### **Statistical Analysis**
- **Z-score Method** - Detects outliers beyond 2.5 standard deviations
- **IQR Method** - Uses interquartile range for robust outlier detection
- **Confidence Scoring** - Provides confidence levels for each detection

### **Pattern Detection**
- **Usage Patterns** - Analyzes hourly and daily usage patterns
- **Material Composition** - Detects unusual material mixes
- **Weight Distribution** - Identifies unusually heavy or light deposits

### **Contextual Analysis**
- **Location-based** - Considers bin location and type
- **Time-based** - Analyzes usage patterns by time of day
- **User Behavior** - Tracks individual user patterns

### **Temporal Analysis**
- **Spike Detection** - Identifies sudden increases in activity
- **Interval Analysis** - Detects unusual time intervals
- **Seasonal Patterns** - Analyzes weekly and monthly patterns

---

## 🔮 **Predictive Analytics**

### **Capacity Forecasting**
```javascript
{
  "short": {
    "predicted_capacity_kg": 25.5,
    "confidence": 0.85,
    "factors": {
      "daily_average": 25.5,
      "trend": "increasing",
      "seasonality": "stable"
    }
  }
}
```

### **Usage Pattern Prediction**
- Peak usage times identification
- Daily and weekly pattern forecasting
- Seasonal trend analysis
- User engagement predictions

### **Collection Optimization**
- Optimal collection schedules
- Cost analysis and savings
- Efficiency improvement recommendations
- Route optimization suggestions

### **Revenue Forecasting**
- Daily, weekly, and monthly revenue predictions
- Purity bonus calculations
- User engagement impact
- Market trend considerations

---

## 🚨 **Anomaly Types**

### **High Severity**
- **Weight Outliers** - Unusually heavy or light deposits
- **Temporal Spikes** - Sudden activity increases
- **System Failures** - Sensor or communication issues

### **Medium Severity**
- **Usage Pattern Anomalies** - Unusual usage patterns
- **Material Composition Issues** - High contamination rates
- **Performance Degradation** - Declining efficiency

### **Low Severity**
- **Minor Deviations** - Small variations from normal patterns
- **Seasonal Patterns** - Expected seasonal variations
- **User Behavior Changes** - Individual user pattern changes

---

## 📈 **Performance Monitoring**

### **AI Service Health**
```javascript
{
  "services": {
    "openxai": {
      "status": "operational",
      "api_key_configured": true,
      "fallback_mode": false
    },
    "anomaly_detection": {
      "status": "operational",
      "algorithms": ["statistical", "pattern", "ai", "contextual", "temporal"]
    }
  }
}
```

### **Metrics to Monitor**
- **Processing Time** - AI analysis response times
- **Accuracy** - Prediction accuracy rates
- **Coverage** - Percentage of events analyzed
- **Fallback Usage** - Frequency of fallback mode usage

---

## 🔧 **Customization**

### **Adjusting Detection Sensitivity**
```javascript
// In enhancedAnomalies.js
this.anomalyThresholds = {
  weight: { min: 0.1, max: 50.0, stdDev: 2.0 },
  fillLevel: { min: 0, max: 100, stdDev: 10 },
  purity: { min: 0.3, max: 1.0, stdDev: 0.15 }
};
```

### **Custom Prediction Horizons**
```javascript
// In predictiveAnalytics.js
this.predictionHorizons = {
  short: 24,    // 24 hours
  medium: 168,  // 1 week
  long: 720     // 1 month
};
```

### **AI Model Configuration**
```javascript
// In openXaiService.js
this.timeout = 30000; // 30 seconds
this.confidenceThreshold = 0.6;
```

---

## 🛠️ **Troubleshooting**

### **Common Issues**

#### **1. OpenXAI API Errors**
```bash
# Check API key configuration
echo $OPENXAI_API_KEY

# Verify API endpoint
curl -H "Authorization: Bearer $OPENXAI_API_KEY" \
     https://api.openxai.com/v1/health
```

#### **2. Fallback Mode Activation**
- System automatically switches to fallback when API is unavailable
- Check logs for fallback activation messages
- Verify network connectivity

#### **3. Performance Issues**
- Monitor processing times in logs
- Check database query performance
- Verify memory usage

### **Debug Mode**
```javascript
// Enable detailed logging
process.env.LOG_LEVEL = 'debug';
```

---

## 📚 **Integration Examples**

### **Frontend Integration**
```javascript
// Get real-time AI insights
const response = await fetch('/api/ai-analytics/real-time-insights', {
  headers: { 'Authorization': `Bearer ${token}` }
});
const insights = await response.json();

// Get predictions for a bin
const predictions = await fetch(`/api/ai-analytics/predictions/${binId}`);
const data = await predictions.json();
```

### **Scheduled Jobs**
```javascript
// Run anomaly detection every 10 minutes
setInterval(async () => {
  await enhancedAnomalyDetection.detectAnomalies(events);
}, 10 * 60 * 1000);
```

---

## 🎯 **Best Practices**

### **1. API Key Management**
- Store API keys securely in environment variables
- Rotate keys regularly
- Monitor API usage and costs

### **2. Error Handling**
- Always implement fallback mechanisms
- Log errors for debugging
- Provide meaningful error messages

### **3. Performance Optimization**
- Cache frequently accessed predictions
- Batch process events when possible
- Monitor and optimize database queries

### **4. Data Quality**
- Validate input data before AI processing
- Handle missing or corrupted data gracefully
- Maintain data consistency

---

## 🔮 **Future Enhancements**

### **Planned Features**
1. **Machine Learning Models** - Custom trained models for specific use cases
2. **Real-time Streaming** - Live event processing and analysis
3. **Advanced Visualization** - Interactive AI insights dashboard
4. **Multi-modal Analysis** - Image and sensor data integration
5. **Federated Learning** - Distributed AI training across bins

### **Scalability Improvements**
- **Microservices Architecture** - Separate AI services
- **Message Queues** - Asynchronous processing
- **Caching Layer** - Redis for performance
- **Load Balancing** - Multiple AI service instances

---

## 📞 **Support**

For issues or questions about the AI implementation:

1. **Check Logs** - Review application logs for error details
2. **API Documentation** - Refer to OpenXAI documentation
3. **Health Checks** - Use `/api/ai-analytics/health` endpoint
4. **Fallback Mode** - Verify system works without API key

---

## 🎉 **Success Metrics**

### **Key Performance Indicators**
- **AI Accuracy** - >90% prediction accuracy
- **Processing Speed** - <5 seconds per analysis
- **Uptime** - >99.9% service availability
- **Cost Efficiency** - Optimized API usage
- **User Satisfaction** - Improved insights quality

This comprehensive AI implementation provides production-ready intelligence for the Trash2Cash platform, enabling data-driven decision making and operational optimization.
