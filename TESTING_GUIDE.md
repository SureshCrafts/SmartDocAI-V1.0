# SmartDoc AI Testing Guide

## 🚀 Quick Start

### Prerequisites
1. **MongoDB** - Make sure MongoDB is running locally
2. **OpenAI API Key** - Get one from [OpenAI Platform](https://platform.openai.com/)

### Setup
1. Run the setup script: `./test-setup.sh`
2. Update `backend/.env` with your actual OpenAI API key
3. Start the backend: `cd backend && npm start`
4. Start the frontend: `cd frontend && npm start`

## 🧪 Test Scenarios

### 1. Authentication Tests

#### User Registration
- **Test**: Register a new user
- **Steps**:
  1. Go to http://localhost:3000/register
  2. Fill in username, email, and password
  3. Submit the form
- **Expected**: User should be registered and redirected to dashboard
- **Security Test**: Try registering with invalid email format
- **Expected**: Should show validation error

#### User Login
- **Test**: Login with valid credentials
- **Steps**:
  1. Go to http://localhost:3000/login
  2. Enter valid email and password
  3. Submit the form
- **Expected**: User should be logged in and redirected to dashboard

#### Account Lockout
- **Test**: Try multiple failed login attempts
- **Steps**:
  1. Try logging in with wrong password 5 times
  2. Try logging in with correct password
- **Expected**: Account should be temporarily locked

### 2. File Upload Tests

#### Valid File Upload
- **Test**: Upload a PDF file
- **Steps**:
  1. Login to the application
  2. Choose a PDF file
  3. Click "Upload Document"
- **Expected**: File should upload and show AI summary

#### File Type Validation
- **Test**: Try uploading invalid file types
- **Steps**:
  1. Try uploading a .exe file
  2. Try uploading a .zip file
- **Expected**: Should show "Invalid file type" error

#### File Size Validation
- **Test**: Try uploading a large file
- **Steps**:
  1. Try uploading a file larger than 5MB
- **Expected**: Should show "File too large" error

### 3. AI Processing Tests

#### Document Summarization
- **Test**: Check AI summary generation
- **Steps**:
  1. Upload a text document
  2. Wait for processing
  3. Click "Show Summary"
- **Expected**: Should display AI-generated summary

#### Document Q&A
- **Test**: Ask questions about uploaded document
- **Steps**:
  1. Upload a document
  2. Click "Q&A" button
  3. Ask a question about the document
  4. Click "Ask"
- **Expected**: Should get AI-generated answer based on document content

### 4. Security Tests

#### Rate Limiting
- **Test**: Rapid API requests
- **Steps**:
  1. Make multiple rapid requests to any endpoint
- **Expected**: Should get rate limit error after threshold

#### Input Validation
- **Test**: Malicious input
- **Steps**:
  1. Try entering `<script>alert('xss')</script>` in any field
- **Expected**: Input should be sanitized

#### CORS Protection
- **Test**: Cross-origin requests
- **Steps**:
  1. Try accessing API from different origin
- **Expected**: Should be blocked if not in allowed origins

### 5. Error Handling Tests

#### Network Errors
- **Test**: Disconnect internet during upload
- **Steps**:
  1. Start uploading a file
  2. Disconnect internet
- **Expected**: Should show appropriate error message

#### API Errors
- **Test**: Invalid OpenAI API key
- **Steps**:
  1. Set invalid OpenAI API key in .env
  2. Try uploading a document
- **Expected**: Should show "AI processing failed" error

### 6. Performance Tests

#### Pagination
- **Test**: Multiple document uploads
- **Steps**:
  1. Upload 15+ documents
  2. Check if pagination appears
- **Expected**: Should show pagination controls

#### Search Functionality
- **Test**: Document search
- **Steps**:
  1. Upload multiple documents with different names
  2. Use search box to find specific document
- **Expected**: Should filter documents by name

## 🔍 Monitoring

### Logs
- **Location**: `backend/logs/`
- **Files**:
  - `combined.log` - All application logs
  - `error.log` - Error-specific logs

### Health Check
- **Endpoint**: `GET http://localhost:5001/health`
- **Expected**: Should return status and uptime

## 🐛 Common Issues

### Backend Issues
1. **MongoDB Connection Error**
   - **Solution**: Make sure MongoDB is running
   - **Command**: `mongod`

2. **Port Already in Use**
   - **Solution**: Change PORT in .env or kill existing process
   - **Command**: `lsof -ti:5001 | xargs kill`

3. **OpenAI API Errors**
   - **Solution**: Check API key and billing
   - **Check**: OpenAI dashboard for usage

### Frontend Issues
1. **CORS Errors**
   - **Solution**: Check FRONTEND_URL in backend .env
   - **Fix**: Ensure it matches your frontend URL

2. **API Connection Errors**
   - **Solution**: Check if backend is running
   - **Check**: http://localhost:5001/health

## 📊 Performance Metrics

### Response Times
- **Registration**: < 2 seconds
- **Login**: < 1 second
- **File Upload**: < 10 seconds (depending on file size)
- **AI Processing**: < 30 seconds

### Memory Usage
- **Backend**: < 100MB
- **Frontend**: < 50MB

## 🧪 Automated Testing (Future)

The application is designed to support automated testing:

```bash
# Unit tests (to be implemented)
npm test

# Integration tests (to be implemented)
npm run test:integration

# E2E tests (to be implemented)
npm run test:e2e
```

## 📝 Test Report Template

```
Test Date: _______________
Tester: _________________

✅ Authentication
- [ ] User registration
- [ ] User login
- [ ] Account lockout
- [ ] Input validation

✅ File Upload
- [ ] Valid file types
- [ ] File size limits
- [ ] Error handling

✅ AI Processing
- [ ] Document summarization
- [ ] Q&A functionality
- [ ] Error recovery

✅ Security
- [ ] Rate limiting
- [ ] Input sanitization
- [ ] CORS protection

✅ Performance
- [ ] Pagination
- [ ] Search functionality
- [ ] Response times

Issues Found: _______________
Recommendations: _______________
```

## 🎯 Success Criteria

- ✅ All authentication flows work correctly
- ✅ File uploads handle all supported formats
- ✅ AI processing generates meaningful results
- ✅ Security measures prevent common attacks
- ✅ Performance meets acceptable standards
- ✅ Error handling provides clear feedback
- ✅ Logging captures important events

---

**Happy Testing! 🚀** 