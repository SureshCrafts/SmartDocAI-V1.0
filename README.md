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
- **Password Visibility Toggle**: Eye icon to show/hide passwords in login/register
- **Real-time Search**: Instant document filtering as you type
- **Corporate Environment Support**: Flexible configurations for enterprise deployment
- **Enhanced Database Configuration**: Multiple MongoDB connection options
- **Rate Limiting Improvements**: Better development experience

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

#### Option 1: Standard Installation
1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd smart-doc-ai
   ```

2. **Backend setup**
   ```bash
   cd backend
   npm install
   cp env.example .env
   # Edit .env with your configuration
   ```

3. **Frontend setup**
   ```bash
   cd ../frontend
   npm install
   ```

4. **Start the application**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm start
   
   # Terminal 2 - Frontend
   cd frontend && npm start
   ```

5. **Access the application**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5001

#### Option 2: Corporate Environment Installation
For enterprise/corporate environments with proxy, firewall, or security restrictions:

1. **Use the corporate setup script**
   ```bash
   git clone <your-repo-url>
   cd smart-doc-ai
   ./setup-corporate.sh
   ```

2. **Configure environment variables**
   ```bash
   # Backend configuration
   cd backend
   cp env.corporate.example .env
   # Edit .env with your corporate settings
   
   # Frontend configuration (if needed)
   cd ../frontend
   # Create .env file if needed
   ```

3. **Start with corporate settings**
   ```bash
   # Terminal 1 - Backend
   cd backend && npm run start:corporate
   
   # Terminal 2 - Frontend
   cd frontend && npm run start:corporate
   ```

#### Option 3: Enhanced Dependencies (Legacy)
For older systems or specific requirements:
```bash
./setup-enhanced-deps.sh
```

---

## ⚙️ **Configuration**

### Environment Variables (backend/.env)
```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration
MONGO_URI=mongodb://localhost:27017/smartdoc-ai

# JWT Configuration
JWT_SECRET=your_strong_jwt_secret

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key

# Frontend URL (for CORS)
FRONTEND_URL=http://localhost:3000

# Rate Limiting (Development)
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=50
```

### Corporate Environment Variables
For enterprise deployments, see `backend/env.corporate.example` for advanced options including:
- MongoDB with SSL/TLS
- Corporate proxy settings
- Authentication configurations
- Replica set connections
- Custom timeouts and connection pools

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
smart-doc-ai/
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
│   ├── env.corporate.example # Corporate environment template
│   └── server.js           # Main server file
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # React components
│   │   │   └── PasswordInput.js # Password visibility component
│   │   ├── context/        # React context
│   │   ├── pages/          # Page components
│   │   ├── services/       # API services
│   │   └── App.js          # Main app component
│   └── package.json
├── setup-corporate.sh      # Corporate environment setup script
├── setup-enhanced-deps.sh  # Enhanced dependencies setup (legacy)
├── CORPORATE_SETUP_GUIDE.md # Comprehensive corporate deployment guide
├── docker-compose.yml      # Docker configuration
├── .gitignore             # Git ignore rules
└── README.md              # This file
```

### New Features & Files
- **PasswordInput.js**: Reusable password input component with visibility toggle
- **setup-corporate.sh**: Automated corporate environment setup script
- **CORPORATE_SETUP_GUIDE.md**: Comprehensive guide for enterprise deployment
- **env.corporate.example**: Template for corporate environment variables
- **Enhanced package.json**: Corporate-friendly configurations and overrides

### Available Scripts

#### Backend
```bash
npm start              # Start development server
npm run start:corporate # Start with corporate environment settings
npm run start:prod     # Start production server
npm test               # Run tests
npm run lint           # Lint code
```

#### Frontend
```bash
npm start              # Start development server
npm run start:corporate # Start with HTTPS and corporate settings
npm run build          # Build for production
npm test               # Run tests
npm run eject          # Eject from Create React App
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

#### Corporate Environment Issues
- **Proxy Configuration**: Use `setup-corporate.sh` script
- **Firewall Issues**: Check `CORPORATE_SETUP_GUIDE.md`
- **SSL Certificate Errors**: Generate self-signed certs or use corporate certificates
- **MongoDB Connection**: Use flexible connection options in `env.corporate.example`

#### React Dependencies Issues
- **Package Conflicts**: Use `--legacy-peer-deps` flag
- **Corporate Registry**: Configure npm registry for corporate mirrors
- **Network Restrictions**: Use offline installation methods

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

## 🆕 **New Features Quick Reference**

### Password Visibility Toggle
- Click the eye icon (👁️) in password fields to show/hide passwords
- Available in both Login and Register pages
- Improves user experience and accessibility

### Real-time Search
- Type in the search box to instantly filter documents
- Click "Clear" button to reset and show all documents
- No need to press Enter - search happens as you type

### Corporate Environment Support
- **Quick Setup**: Run `./setup-corporate.sh`
- **Proxy Support**: Automatic npm proxy configuration
- **SSL/HTTPS**: Self-signed certificate generation
- **Flexible Database**: Multiple MongoDB connection options
- **Firewall Friendly**: Comprehensive network configuration guide

### Enhanced Rate Limiting
- Development: 50 requests per 15 minutes (increased from 5)
- Production: Configurable via environment variables
- Better development experience without blocking

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
- ✅ Password visibility toggle for better UX
- ✅ Real-time search functionality
- ✅ Corporate environment support
- ✅ Flexible database configurations
- ✅ Enhanced rate limiting for development
- ✅ Corporate setup scripts and guides

---

**SmartDoc AI V1.0 - Your Intelligent Document Companion** 🚀 