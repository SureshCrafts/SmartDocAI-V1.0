# SmartDoc AI Project

## Your Intelligent Document Companion: Summarize, Ask, Understand.

![SmartDoc AI Dashboard Screenshot](https://via.placeholder.com/800x450?text=Modern+Dark-Themed+Dashboard)
_(Replace this with an actual screenshot of your new dashboard)_

---

### Table of Contents

1.  [Introduction](#1-introduction)
2.  [Key Features](#2-key-features)
3.  [Security Features](#3-security-features)
4.  [Technologies Used](#4-technologies-used)
5.  [Getting Started](#5-getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Running the Application](#running-the-application)
6.  [Project Structure](#6-project-structure)
7.  [Security & Performance Improvements](#7-security--performance-improvements)
8.  [API Documentation](#8-api-documentation)
9.  [Deployment](#9-deployment)
10. [Troubleshooting](#10-troubleshooting)

---

### 1. Introduction

The SmartDoc AI Project is a powerful, full-stack web application designed to revolutionize how individuals and small teams interact with their documents. Leveraging the latest Artificial Intelligence toolkits, it provides a secure and intuitive platform for uploading various document types, automatically generating concise summaries, and allowing users to ask natural language questions directly to the document's content.

In today's information-rich environment, professionals, students, and researchers are often overwhelmed by vast amounts of textual data. SmartDoc AI addresses the critical pain point of information overload by transforming lengthy reads into easily digestible insights, saving valuable time and enhancing comprehension.

### 2. Key Features

- **Secure User Authentication:** Robust user registration and login system with JWT-based authentication, password hashing, and account lockout protection.
- **Enhanced Multi-Document Type Support:** Upload and process PDFs (including scanned PDFs), DOCX files, plain text files, and images (JPEG, PNG, TIFF, BMP) with advanced OCR.
- **Intelligent Summarization:** AI-powered generation of concise summaries for uploaded documents.
- **Document Q&A:** Ask specific questions about document content and receive AI-generated answers sourced directly from the text.
- **Document Management:** Securely view, manage, and delete your uploaded documents with pagination and search.
- **Modern, Dark-Themed UI:** A responsive and aesthetically pleasing interface inspired by modern streaming services, featuring a card-based layout for easy document browsing.
- **Advanced Security:** Rate limiting, input validation, CORS protection, and comprehensive error handling.
- **Enhanced Processing:** Advanced image preprocessing, multi-page PDF support, and improved text extraction accuracy.

### 3. Security Features

#### Authentication & Authorization
- **JWT-based Authentication:** Secure token-based authentication with configurable expiration
- **Password Security:** Bcrypt hashing with salt rounds for secure password storage
- **Account Protection:** Automatic account lockout after failed login attempts
- **Input Validation:** Comprehensive sanitization and validation of all user inputs

#### API Security
- **Rate Limiting:** Configurable rate limiting to prevent abuse
- **CORS Protection:** Environment-based CORS configuration
- **Helmet Security:** HTTP headers security middleware
- **Request Validation:** File type and size validation
- **Error Handling:** Structured error responses without sensitive information exposure

#### File Upload Security
- **File Type Validation:** Whitelist-based file type checking
- **File Size Limits:** Configurable maximum file size (default: 5MB)
- **Secure File Names:** Random filename generation to prevent path traversal
- **Virus Scanning Ready:** Architecture supports integration with antivirus services

#### Data Protection
- **Input Sanitization:** XSS protection through input sanitization
- **SQL Injection Prevention:** Parameterized queries via Mongoose
- **Secure Headers:** Helmet middleware for security headers
- **Environment Variables:** Secure configuration management

### 4. Technologies Used

SmartDoc AI is built on a robust MERN (MongoDB, Express.js, React, Node.js) stack, enhanced with powerful AI capabilities and security features.

- **Frontend:**
  - **React.js:** For building a dynamic and responsive user interface.
  - **Styled Components:** For consistent and maintainable CSS-in-JS styling.
  - **React Router DOM:** For client-side routing.
  - **Axios:** For making HTTP requests to the backend API with enhanced error handling.
  - **React Toastify:** For user notifications and alerts.
  - **React Spinners:** For visual loading indicators.
- **Backend:**
  - **Node.js & Express.js:** For a fast and scalable server-side API.
  - **MongoDB & Mongoose:** For flexible NoSQL database management with indexing.
  - **Multer:** For handling secure file uploads with validation.
  - **PDF-Parse:** For extracting text from PDF documents.
- **PDF2Pic:** For converting PDF pages to images for OCR processing.
- **Sharp:** For advanced image preprocessing and optimization.
- **Mammoth.js:** For extracting text from DOCX documents.
- **Tesseract.js:** For Optical Character Recognition (OCR) on image files with enhanced accuracy.
- **PDF-Lib:** For advanced PDF manipulation and processing.
  - **Axios:** For making HTTP requests to the OpenAI API with retry logic.
  - **jsonwebtoken (JWT):** For secure user authentication.
  - **bcrypt.js:** For password hashing with salt rounds.
  - **dotenv:** For managing environment variables.
  - **express-async-handler:** For simplifying error handling in async Express routes.
  - **Winston:** For robust structured logging.
  - **Helmet:** For security headers.
  - **Express Rate Limit:** For API rate limiting.
- **AI Toolkit:**
  - **OpenAI API (GPT-3.5 Turbo):** Utilized for both document summarization and contextual question-answering with enhanced error handling and retry logic.

### 5. Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

#### Prerequisites

- Node.js (v18.x or higher recommended)
- npm (v9.x or higher recommended)
- MongoDB (local installation or cloud-hosted service like MongoDB Atlas)
- An OpenAI API Key (get one from [OpenAI Platform](https://platform.openai.com/))
- Git

#### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/SureshCrafts/SmartDocAI-Project.git
    cd SmartDocAI-Project
    ```

2.  **Enhanced Dependencies Setup:**
    Install enhanced PDF and image processing dependencies.

    ```bash
    ./setup-enhanced-deps.sh
    ```

3.  **Backend Setup:**
    Navigate into the `backend` directory, install dependencies, and set up environment variables.

    ```bash
    cd backend
    npm install
    ```

    Create a `.env` file in the `backend` directory and add your environment variables:

    ```env
    # Server Configuration
    PORT=5001
    NODE_ENV=development

    # Database Configuration
    MONGO_URI=your_mongodb_connection_string

    # JWT Configuration
    JWT_SECRET=a_strong_random_secret_key_for_jwt

    # OpenAI Configuration
    OPENAI_API_KEY=your_openai_api_key
    OPENAI_MODEL=gpt-3.5-turbo
    OPENAI_MAX_TOKENS=200
    OPENAI_MAX_RETRIES=3
    OPENAI_RETRY_DELAY=1000

    # Frontend URL (for CORS)
    FRONTEND_URL=http://localhost:3000

    # Logging
    LOG_LEVEL=info

    # File Upload Configuration
    MAX_FILE_SIZE=10485760
    UPLOAD_DIR=uploads

    # Rate Limiting
    RATE_LIMIT_WINDOW_MS=900000
    RATE_LIMIT_MAX_REQUESTS=100
    AUTH_RATE_LIMIT_MAX_REQUESTS=5
    ```

    - Replace `your_mongodb_connection_string` with your MongoDB URI (e.g., from MongoDB Atlas or local).
    - Replace `a_strong_random_secret_key_for_jwt` with a long, random string.
    - Replace `your_openai_api_key` with your actual OpenAI API key.

3.  **Frontend Setup:**
    Navigate into the `frontend` directory and install dependencies.
    ```bash
    cd ../frontend
    npm install
    ```

#### Running the Application

1.  **Start the Backend Server:**
    From the `backend` directory:

    ```bash
    npm start
    ```

    The server will run on `http://localhost:5001`.

2.  **Start the Frontend Development Server:**
    From the `frontend` directory:
    ```bash
    npm start
    ```
    The React app will open in your browser, usually at `http://localhost:3000`.

You can now register a new user, log in, and start uploading documents!

### 6. Project Structure

```
smart-doc-ai/
├── backend/
│   ├── config/             # Database connection configuration
│   ├── controllers/        # Handles API request/response logic with enhanced error handling
│   ├── middleware/         # Express middleware for authentication, validation, error handling
│   ├── models/             # Mongoose schemas with validation and indexing
│   ├── routes/             # Defines API endpoints with validation middleware
│   ├── services/           # Business logic services (OpenAI interaction with retry logic)
│   ├── uploads/            # Directory for storing uploaded documents (excluded from Git)
│   ├── utils/              # Utility functions (JWT token generation, logging)
│   ├── logs/               # Application logs (excluded from Git)
│   ├── .env                # Environment variables for backend (excluded from Git)
│   ├── env.example         # Example environment configuration
│   ├── package.json        # Backend dependencies and scripts
│   └── server.js           # Main entry point with security middleware
│
├── frontend/
│   ├── public/             # Static assets
│   ├── src/
│   │   ├── components/     # Reusable UI components with enhanced error handling
│   │   ├── context/        # React Context API for global state
│   │   ├── pages/          # Top-level page components with pagination
│   │   ├── services/       # Centralized API service calls with validation
│   │   ├── App.js          # Main application component, sets up routing
│   │   ├── index.js        # Entry point for the React application
│   │   └── index.css       # Global CSS styles
│   ├── package.json        # Frontend dependencies and scripts
│   └── README.md           # Frontend-specific README
│
├── .gitignore              # Files to be ignored by Git
└── README.md               # This comprehensive project README file
```

### 7. Security & Performance Improvements

#### Security Enhancements
- **Rate Limiting:** API endpoints are protected against abuse with configurable rate limits
- **Input Validation:** All user inputs are validated and sanitized
- **File Upload Security:** Secure file handling with type and size validation
- **Error Handling:** Structured error responses without information leakage
- **Authentication:** Enhanced JWT authentication with account lockout protection
- **CORS Protection:** Environment-based CORS configuration
- **Security Headers:** Helmet middleware for security headers

#### Performance Improvements
- **Database Indexing:** Optimized queries with strategic indexing
- **Pagination:** Efficient document loading with pagination
- **Caching Ready:** Architecture supports Redis integration
- **File Processing:** Optimized file processing with progress tracking
- **Error Recovery:** Retry logic for external API calls
- **Logging:** Structured logging for monitoring and debugging

#### Code Quality Improvements
- **Structured Error Handling:** Centralized error handling with custom error classes
- **Input Validation:** Comprehensive validation middleware
- **API Response Format:** Consistent API response structure
- **Logging:** Winston-based structured logging
- **Configuration:** Environment-based configuration management
- **Testing Ready:** Architecture supports unit and integration testing

### 8. API Documentation

#### Authentication Endpoints
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user profile
- `PUT /api/auth/profile` - Update user profile
- `PUT /api/auth/change-password` - Change password

#### Document Endpoints
- `GET /api/documents` - Get user documents (with pagination)
- `POST /api/documents` - Upload and process a document
- `GET /api/documents/:id` - Get a specific document
- `DELETE /api/documents/:id` - Delete a document
- `POST /api/documents/:id/ask` - Ask a question about a document

#### Health Check
- `GET /health` - Application health status

### 9. Deployment

#### Environment Setup
1. Set `NODE_ENV=production`
2. Configure production MongoDB connection
3. Set secure JWT secret
4. Configure production CORS settings
5. Set up proper logging

#### Security Checklist
- [ ] Change default JWT secret
- [ ] Configure production CORS
- [ ] Set up HTTPS
- [ ] Configure rate limiting
- [ ] Set up monitoring
- [ ] Configure backup strategy
- [ ] Set up error tracking

#### Performance Optimization
- [ ] Enable database indexing
- [ ] Configure CDN for static assets
- [ ] Set up caching layer
- [ ] Configure load balancing
- [ ] Monitor API usage

### 10. Troubleshooting

#### Common Issues

**Backend Issues:**
- **MongoDB Connection:** Ensure MongoDB is running and connection string is correct
- **OpenAI API:** Verify API key and check rate limits
- **File Uploads:** Check file size and type restrictions
- **Authentication:** Verify JWT secret and token expiration

**Frontend Issues:**
- **API Calls:** Check CORS configuration and API endpoints
- **File Upload:** Verify file type and size restrictions
- **Authentication:** Clear localStorage and re-login if token issues

#### Logs
- Application logs are stored in `backend/logs/`
- Check `combined.log` for general logs
- Check `error.log` for error-specific logs

#### Support
For issues and questions:
1. Check the logs for error details
2. Verify environment configuration
3. Test with minimal data
4. Check API documentation

---

## Recent Updates

### Enhanced PDF & Image Processing (Latest)
- ✅ **Advanced PDF Processing**: OCR fallback for scanned PDFs, multi-page support
- ✅ **Enhanced Image Support**: TIFF, BMP formats, advanced preprocessing
- ✅ **Improved OCR Accuracy**: Better image enhancement and text extraction
- ✅ **Increased File Size**: Support for files up to 10MB
- ✅ **Multi-language OCR**: Configurable language support
- ✅ **Better Error Handling**: Detailed error messages and recovery options

### Security Improvements (Latest)
- ✅ Enhanced input validation and sanitization
- ✅ Rate limiting for API endpoints
- ✅ Secure file upload handling
- ✅ Comprehensive error handling
- ✅ Account lockout protection
- ✅ CORS security configuration
- ✅ Security headers with Helmet

### Performance Improvements (Latest)
- ✅ Database indexing for faster queries
- ✅ Pagination for document lists
- ✅ Retry logic for external API calls
- ✅ Structured logging system
- ✅ Optimized file processing
- ✅ Enhanced error recovery

### Code Quality Improvements (Latest)
- ✅ Centralized error handling
- ✅ Input validation middleware
- ✅ Consistent API responses
- ✅ Environment-based configuration
- ✅ Enhanced documentation
- ✅ Testing-ready architecture

---

This project now includes comprehensive security features, performance optimizations, and enhanced code quality while maintaining the core AI-powered document processing functionality.
