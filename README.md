# SmartDoc AI V1.0 🚀

## Your Intelligent Document Companion: Enhanced PDF & Image Processing

![SmartDoc AI Dashboard](https://via.placeholder.com/800x450?text=SmartDoc+AI+V1.0+Dashboard)

---

## 🎯 **V1.0 Enhanced Features**

### ✨ **Major Improvements**
- **Enhanced PDF Processing**: OCR fallback for scanned PDFs, multi-page support
- **Advanced Image Support**: TIFF, BMP formats with intelligent preprocessing
- **Improved OCR Accuracy**: Better image enhancement and text extraction
- **Increased File Size**: Support for files up to 10MB
- **Multi-language OCR**: Configurable language support
- **Better Error Handling**: Detailed error messages and recovery options

### 📄 **Supported File Types**
- **PDFs**: Including scanned PDFs with OCR fallback
- **Images**: JPEG, PNG, TIFF, BMP with enhanced preprocessing
- **Documents**: DOCX, DOC, TXT files
- **File Size**: Up to 10MB (increased from 5MB)

---

## 🚀 **Quick Start**

### Prerequisites
- Node.js (v18.x or higher)
- npm (v9.x or higher)
- MongoDB (local or cloud-hosted)
- OpenAI API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd SmartDocAI-V1.0
   ```

2. **Install enhanced dependencies**
   ```bash
   ./setup-enhanced-deps.sh
   ```

3. **Backend setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   ```

4. **Frontend setup**
   ```bash
   cd ../frontend
   npm install
   ```

5. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

---

## ⚙️ **Configuration**

### Environment Variables (backend/.env)
```env
# Server Configuration
PORT=5001
NODE_ENV=production

# Database Configuration
MONGO_URI=your_mongodb_connection_string

# JWT Configuration
JWT_SECRET=your_strong_jwt_secret

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_MAX_TOKENS=200
OPENAI_MAX_RETRIES=3
OPENAI_RETRY_DELAY=1000

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
```

---

## 🏗️ **Production Deployment**

### Option 1: Docker Deployment

1. **Build and run with Docker Compose**
   ```bash
   docker-compose up -d
   ```

2. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with production values
   ```

### Option 2: Manual Deployment

1. **Backend deployment**
   ```bash
   cd backend
   npm install --production
   npm run build
   pm2 start ecosystem.config.js
   ```

2. **Frontend deployment**
   ```bash
   cd frontend
   npm install --production
   npm run build
   # Serve build folder with nginx/apache
   ```

### Option 3: Cloud Platforms

#### Heroku
```bash
# Backend
heroku create smartdoc-ai-backend
heroku config:set NODE_ENV=production
git push heroku main

# Frontend
heroku create smartdoc-ai-frontend
heroku buildpacks:set mars/create-react-app
git push heroku main
```

#### Vercel
```bash
# Frontend
vercel --prod

# Backend (API routes)
vercel --prod
```

#### Railway
```bash
railway login
railway init
railway up
```

---

## 🔧 **Development**

### Project Structure
```
SmartDocAI-V1.0/
├── backend/
│   ├── config/             # Database configuration
│   ├── controllers/        # API controllers
│   ├── middleware/         # Express middleware
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── services/           # Business logic
│   │   └── textExtractionService.js  # Enhanced text extraction
│   ├── uploads/            # File storage
│   ├── utils/              # Utility functions
│   └── server.js           # Main server file
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   └── package.json
├── setup-enhanced-deps.sh  # Enhanced dependencies setup
├── docker-compose.yml      # Docker configuration
├── .gitignore             # Git ignore rules
└── README_V1.0.md         # This file
```

### Available Scripts

#### Backend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run lint       # Lint code
```

#### Frontend
```bash
npm start          # Start development server
npm run build      # Build for production
npm test           # Run tests
npm run eject      # Eject from Create React App
```

---

## 🧪 **Testing**

### Manual Testing
```bash
# Run the test script
./test-app.js

# Or test individual components
curl http://localhost:5001/health
```

### Automated Testing
```bash
# Backend tests
cd backend && npm test

# Frontend tests
cd frontend && npm test
```

### Test Scenarios
See `ENHANCED_TESTING_GUIDE.md` for comprehensive testing scenarios.

---

## 🔒 **Security Features**

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: Bcrypt with salt rounds
- **Rate Limiting**: API protection against abuse
- **Input Validation**: Comprehensive sanitization
- **File Upload Security**: Type and size validation
- **CORS Protection**: Environment-based configuration
- **Security Headers**: Helmet middleware

---

## 📊 **Performance**

### Benchmarks
- **Small files (< 1MB)**: < 10 seconds processing
- **Medium files (1-5MB)**: < 30 seconds processing
- **Large files (5-10MB)**: < 60 seconds processing
- **Memory usage**: < 200MB during processing

### Optimization
- Database indexing for faster queries
- Pagination for document lists
- Retry logic for external API calls
- Structured logging system
- Optimized file processing

---

## 🐛 **Troubleshooting**

### Common Issues

#### Canvas Library Issues
```bash
# macOS
brew install pkg-config cairo pango libpng jpeg giflib librsvg
npm rebuild canvas

# Ubuntu
sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm rebuild canvas
```

#### Memory Issues
- Check system resources
- Consider streaming for very large files
- Monitor memory usage during processing

#### OCR Accuracy Issues
- Ensure images are clear
- Check preprocessing settings
- Verify image format support

### Logs
- Application logs: `backend/logs/`
- Combined logs: `backend/logs/combined.log`
- Error logs: `backend/logs/error.log`

---

## 🤝 **Contributing**

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

### Code Style
- Use ESLint configuration
- Follow existing code patterns
- Add comments for complex logic
- Update documentation

---

## 📄 **License**

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🆘 **Support**

For issues and questions:
1. Check the troubleshooting section
2. Review the logs
3. Test with minimal data
4. Create an issue with detailed information

---

## 🎉 **Changelog**

### V1.0.0 (Current)
- ✅ Enhanced PDF processing with OCR fallback
- ✅ Advanced image support (TIFF, BMP)
- ✅ Improved OCR accuracy with preprocessing
- ✅ Increased file size limit to 10MB
- ✅ Multi-language OCR support
- ✅ Better error handling and recovery
- ✅ Enhanced user experience with file input clearing
- ✅ Comprehensive testing guide
- ✅ Production deployment configurations

---

**SmartDoc AI V1.0 - Your Intelligent Document Companion** 🚀 