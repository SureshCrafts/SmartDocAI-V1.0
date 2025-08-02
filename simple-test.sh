#!/bin/bash

echo "🧪 SmartDoc AI - Simple Test Script"
echo "=================================="

# Test Backend
echo "🏥 Testing backend..."
if curl -s http://localhost:5001/health > /dev/null 2>&1; then
    echo "✅ Backend is running on http://localhost:5001"
else
    echo "❌ Backend is not running"
    echo "   Start with: cd backend && npm start"
fi

# Test Frontend
echo "🌐 Testing frontend..."
if curl -s http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Frontend is running on http://localhost:3000"
else
    echo "❌ Frontend is not running"
    echo "   Start with: cd frontend && npm start"
fi

# Test MongoDB
echo "🗄️ Testing MongoDB..."
if pgrep -x "mongod" > /dev/null; then
    echo "✅ MongoDB is running"
else
    echo "❌ MongoDB is not running"
    echo "   Start with: brew services start mongodb-community"
fi

echo ""
echo "📋 Manual Testing Steps:"
echo "1. Open http://localhost:3000 in your browser"
echo "2. Register a new user account"
echo "3. Login with your credentials"
echo "4. Upload a document (PDF, DOCX, TXT, or image)"
echo "5. Test the AI summarization feature"
echo "6. Test the Q&A feature"
echo ""
echo "🔍 Monitor logs: tail -f backend/logs/combined.log"
echo ""
echo "🎯 Test Security Features:"
echo "- Try uploading invalid file types"
echo "- Try rapid API requests (rate limiting)"
echo "- Try invalid login credentials (account lockout)"
echo "- Try entering malicious input in forms" 