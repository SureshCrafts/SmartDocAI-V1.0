#!/bin/bash

echo "🚀 Setting up SmartDoc AI for testing..."

# Create backend .env file
cat > backend/.env << EOF
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/smartdoc-ai-test

# JWT Configuration
JWT_SECRET=test-jwt-secret-key-for-development-only

# OpenAI Configuration
OPENAI_API_KEY=sk-test-key-for-development
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=200
OPENAI_MAX_RETRIES=3
OPENAI_RETRY_DELAY=1000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Logging
LOG_LEVEL=debug

# File Upload Configuration
MAX_FILE_SIZE=5242880
UPLOAD_DIR=uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
EOF

echo "✅ Backend environment file created"

# Create uploads directory
mkdir -p backend/uploads

# Create logs directory
mkdir -p backend/logs

echo "✅ Directories created"

echo ""
echo "📋 Testing Checklist:"
echo "1. Make sure MongoDB is running locally"
echo "2. Update the OpenAI API key in backend/.env with your actual key"
echo "3. Start the backend: cd backend && npm start"
echo "4. Start the frontend: cd frontend && npm start"
echo ""
echo "🧪 Test Scenarios:"
echo "- User registration and login"
echo "- File upload with different formats"
echo "- AI summarization and Q&A"
echo "- Rate limiting (try rapid requests)"
echo "- Input validation (try invalid data)"
echo "- Error handling (try uploading invalid files)"
echo ""
echo "🔍 Monitor logs in backend/logs/ for detailed information" 