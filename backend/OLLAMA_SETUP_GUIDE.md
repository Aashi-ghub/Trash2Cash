# Ollama Integration Setup Guide

This guide will help you set up Ollama for local LLM processing in the Trash2Cash system. Ollama allows you to run large language models locally on your machine, providing AI capabilities without relying on external APIs.

## Prerequisites

Before setting up Ollama, ensure you have:

1. **Node.js** (v16 or higher) - Already installed for the project
2. **Sufficient RAM** - At least 8GB recommended for most models
3. **Storage Space** - Models can be 2-8GB each
4. **Internet Connection** - For downloading models initially

## Step 1: Install Ollama

### Windows
1. Download Ollama from [https://ollama.ai/download](https://ollama.ai/download)
2. Run the installer and follow the setup wizard
3. Ollama will be installed as a Windows service

### macOS
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

### Linux
```bash
curl -fsSL https://ollama.ai/install.sh | sh
```

## Step 2: Verify Installation

Open a terminal/command prompt and run:
```bash
ollama --version
```

You should see the Ollama version number.

## Step 3: Start Ollama Service

### Windows
Ollama should start automatically as a Windows service. If not:
```bash
ollama serve
```

### macOS/Linux
```bash
ollama serve
```

## Step 4: Download a Model

Download a model that suits your needs:

```bash
# For general purpose (recommended for Trash2Cash)
ollama pull llama3

# For smaller, faster processing
ollama pull llama3:8b

# For better performance (requires more RAM)
ollama pull llama3:70b

# Alternative models
ollama pull mistral
ollama pull codellama
```

## Step 5: Test the Model

Test that your model is working:

```bash
ollama run llama3
```

You should see a chat interface. Type a message and press Enter to test.

## Step 6: Configure Environment Variables

Add Ollama configuration to your `.env` file:

```env
# Ollama Configuration
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_DEFAULT_MODEL=llama3
```

## Step 7: Test Integration

Start your backend server and test the Ollama integration:

```bash
# Check Ollama status
curl http://localhost:3000/api/ai-analytics/ollama/status

# Test chat functionality
curl -X POST http://localhost:3000/api/ai-analytics/ollama/chat \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{"message": "Hello, how can you help with waste management?"}'
```

## Available Models

### Recommended Models for Trash2Cash

1. **llama3** (8B) - Good balance of performance and resource usage
2. **llama3** (70B) - Best performance, requires more RAM
3. **mistral** - Fast and efficient
4. **codellama** - Good for technical analysis

### Model Comparison

| Model | Size | RAM Required | Speed | Quality |
|-------|------|--------------|-------|---------|
| llama3:8b | ~4GB | 8GB | Fast | Good |
| llama3:70b | ~40GB | 64GB | Slow | Excellent |
| mistral | ~4GB | 8GB | Very Fast | Good |
| codellama | ~7GB | 16GB | Medium | Very Good |

## API Endpoints

### Ollama Status
```
GET /api/ai-analytics/ollama/status
```
Returns Ollama service status and available models.

### Chat with Ollama
```
POST /api/ai-analytics/ollama/chat
```
Body: `{"message": "Your message", "context": "Optional context", "model": "Optional model name"}`

### Pull New Model
```
POST /api/ai-analytics/ollama/pull-model
```
Body: `{"model_name": "model_name"}`

### AI Services Status
```
GET /api/ai-analytics/ai-services/status
```
Returns status of all AI services (OpenXAI and Ollama).

### Set Preferred Service
```
POST /api/ai-analytics/ai-services/preferred
```
Body: `{"service": "openxai" | "ollama"}`

## Usage Examples

### 1. Basic Chat
```javascript
const response = await fetch('/api/ai-analytics/ollama/chat', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    message: 'Analyze this waste collection data',
    context: 'Smart bin data from Bangalore'
  })
});
```

### 2. Event Analysis
The system automatically uses Ollama for:
- Event analysis when OpenXAI is unavailable
- Predictive analytics
- Anomaly detection
- Real-time insights

### 3. Model Management
```javascript
// Pull a new model
await fetch('/api/ai-analytics/ollama/pull-model', {
  method: 'POST',
  headers: { 'Authorization': `Bearer ${token}` },
  body: JSON.stringify({ model_name: 'mistral' })
});

// Check available models
const status = await fetch('/api/ai-analytics/ollama/status', {
  headers: { 'Authorization': `Bearer ${token}` }
});
```

## Troubleshooting

### Common Issues

1. **"Ollama service not available"**
   - Ensure Ollama is running: `ollama serve`
   - Check if the service is accessible: `curl http://localhost:11434/api/tags`

2. **"Model not found"**
   - Pull the model: `ollama pull model_name`
   - Check available models: `ollama list`

3. **"Out of memory"**
   - Use a smaller model (8B instead of 70B)
   - Close other applications to free RAM
   - Restart Ollama service

4. **"Connection refused"**
   - Check if Ollama is running on the correct port (11434)
   - Verify firewall settings
   - Restart Ollama service

### Performance Optimization

1. **Use appropriate model size** for your hardware
2. **Close unused models** to free memory
3. **Monitor system resources** during processing
4. **Use SSD storage** for faster model loading

### Security Considerations

1. **Local processing** - Data stays on your machine
2. **No internet required** after model download
3. **Customizable prompts** for domain-specific tasks
4. **Audit trail** - All processing is logged

## Integration with Trash2Cash

The hybrid AI service automatically:
- Uses OpenXAI when available (cloud-based)
- Falls back to Ollama when OpenXAI is unavailable
- Provides consistent API regardless of backend
- Logs which service was used for each request

### Benefits

1. **Offline operation** - Works without internet
2. **Cost reduction** - No API costs for local processing
3. **Privacy** - Data never leaves your system
4. **Customization** - Train or fine-tune models for specific use cases
5. **Reliability** - No dependency on external services

## Next Steps

1. **Test the integration** with sample data
2. **Monitor performance** and adjust model selection
3. **Customize prompts** for better waste management insights
4. **Consider fine-tuning** models for your specific use case
5. **Set up monitoring** for AI service health

## Support

For issues with:
- **Ollama installation**: Check [Ollama documentation](https://ollama.ai/docs)
- **Model issues**: Visit [Ollama model library](https://ollama.ai/library)
- **Integration problems**: Check the backend logs and API responses
- **Performance issues**: Monitor system resources and consider model size
