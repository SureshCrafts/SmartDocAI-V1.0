# SmartDoc AI - Corporate Environment Setup Guide

This guide provides comprehensive instructions for deploying SmartDoc AI in corporate environments with various network configurations, proxy settings, and security requirements.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Network Configuration](#network-configuration)
3. [Database Configuration](#database-configuration)
4. [Proxy and Firewall Setup](#proxy-and-firewall-setup)
5. [SSL/HTTPS Configuration](#sslhttps-configuration)
6. [Corporate Package Installation](#corporate-package-installation)
7. [Environment Variables](#environment-variables)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

### System Requirements
- Node.js >= 18.0.0
- npm >= 8.0.0
- MongoDB >= 5.0 (local or cloud)
- Git

### Corporate Network Requirements
- Access to npm registry (or corporate npm mirror)
- Access to GitHub (or corporate Git mirror)
- Outbound HTTPS access for API calls
- Inbound access to application ports (3000, 5001)

## Network Configuration

### 1. Corporate Proxy Setup

If your corporate network uses a proxy, configure npm and Node.js:

```bash
# Configure npm proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080

# Configure Node.js proxy (if needed)
export HTTP_PROXY=http://proxy.company.com:8080
export HTTPS_PROXY=http://proxy.company.com:8080
export NO_PROXY=localhost,127.0.0.1,.company.com
```

### 2. Corporate NPM Registry

If your company uses a private npm registry:

```bash
# Set corporate npm registry
npm config set registry https://npm.company.com

# Or use .npmrc file in project root
echo "registry=https://npm.company.com" > .npmrc
```

## Database Configuration

### 1. MongoDB Connection Options

The application supports multiple MongoDB connection configurations:

#### Local MongoDB
```bash
# In backend/.env
MONGO_URI=mongodb://localhost:27017/smartdoc-ai
```

#### Corporate MongoDB Server
```bash
# In backend/.env
MONGO_URI=mongodb://corporate-mongo.company.com:27017/smartdoc-ai
```

#### MongoDB with Authentication
```bash
# In backend/.env
MONGO_URI=mongodb://username:password@corporate-mongo.company.com:27017/smartdoc-ai?authSource=admin
```

#### MongoDB Atlas (Cloud)
```bash
# In backend/.env
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/smartdoc-ai?retryWrites=true&w=majority
```

### 2. MongoDB Connection Options

Add these options to your MongoDB URI for corporate environments:

```bash
# Connection options for corporate networks
MONGO_URI=mongodb://corporate-mongo.company.com:27017/smartdoc-ai?connectTimeoutMS=30000&socketTimeoutMS=30000&serverSelectionTimeoutMS=30000&maxPoolSize=10&retryWrites=true&w=majority
```

## Proxy and Firewall Setup

### 1. Required Ports

Ensure these ports are open in your corporate firewall:

- **Frontend**: 3000 (HTTP/HTTPS)
- **Backend**: 5001 (HTTP/HTTPS)
- **MongoDB**: 27017 (if local)

### 2. Outbound Connections

The application requires outbound access to:

- OpenAI API: `api.openai.com:443`
- npm registry: `registry.npmjs.org:443`
- GitHub: `github.com:443` (for package installation)

### 3. Corporate Firewall Rules

Add these rules to your corporate firewall:

```bash
# Allow outbound HTTPS
iptables -A OUTPUT -p tcp --dport 443 -j ACCEPT

# Allow outbound HTTP (if needed)
iptables -A OUTPUT -p tcp --dport 80 -j ACCEPT

# Allow internal MongoDB
iptables -A INPUT -p tcp --dport 27017 -j ACCEPT
```

## SSL/HTTPS Configuration

### 1. Self-Signed Certificates (Development)

For development with HTTPS:

```bash
# Generate self-signed certificates
openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes

# Start frontend with HTTPS
npm run start:corporate
```

### 2. Corporate SSL Certificates

For production with corporate certificates:

```bash
# Copy corporate certificates
cp /path/to/corporate/cert.pem ./cert.pem
cp /path/to/corporate/key.pem ./key.pem

# Start with corporate certificates
HTTPS=true SSL_CRT_FILE=./cert.pem SSL_KEY_FILE=./key.pem npm start
```

## Corporate Package Installation

### 1. Offline Installation

If your corporate network blocks npm:

```bash
# Download packages on a machine with internet access
npm pack --pack-destination ./packages

# Transfer packages to corporate network
# Install from local packages
npm install ./packages/*.tgz
```

### 2. Corporate NPM Mirror

If your company has an npm mirror:

```bash
# Configure npm to use corporate mirror
npm config set registry https://npm-mirror.company.com

# Install packages
npm install
```

### 3. Package Overrides

The application includes package overrides for corporate environments:

```json
{
  "overrides": {
    "react-scripts": {
      "webpack": {
        "resolve": {
          "fallback": {
            "crypto": false,
            "stream": false,
            "util": false,
            "buffer": false,
            "process": false
          }
        }
      }
    }
  }
}
```

## Environment Variables

### 1. Backend Environment (.env)

```bash
# Server Configuration
PORT=5001
NODE_ENV=corporate

# Database Configuration
MONGO_URI=mongodb://corporate-mongo.company.com:27017/smartdoc-ai

# JWT Configuration
JWT_SECRET=your-corporate-jwt-secret

# OpenAI Configuration
OPENAI_API_KEY=your-openai-api-key

# Corporate Proxy (if needed)
HTTP_PROXY=http://proxy.company.com:8080
HTTPS_PROXY=http://proxy.company.com:8080
NO_PROXY=localhost,127.0.0.1,.company.com

# CORS Configuration
FRONTEND_URL=https://smartdoc.company.com
```

### 2. Frontend Environment (.env)

```bash
# API Configuration
REACT_APP_API_URL=https://api.company.com:5001/api/

# Corporate Proxy (if needed)
HTTPS_PROXY=http://proxy.company.com:8080
HTTP_PROXY=http://proxy.company.com:8080
```

## Installation Steps

### 1. Clone and Setup

```bash
# Clone the repository
git clone https://github.com/your-org/smart-doc-ai.git
cd smart-doc-ai

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment

```bash
# Backend configuration
cd backend
cp env.example .env
# Edit .env with your corporate settings

# Frontend configuration (if needed)
cd ../frontend
# Create .env file if needed
```

### 3. Start the Application

```bash
# Start backend
cd backend
npm run start:corporate

# Start frontend (in new terminal)
cd frontend
npm run start:corporate
```

## Troubleshooting

### 1. Network Issues

**Problem**: Cannot connect to npm registry
```bash
# Solution: Configure corporate proxy
npm config set proxy http://proxy.company.com:8080
npm config set https-proxy http://proxy.company.com:8080
```

**Problem**: Cannot connect to MongoDB
```bash
# Solution: Check firewall and connection string
# Test connection
mongo mongodb://corporate-mongo.company.com:27017/smartdoc-ai
```

### 2. Package Installation Issues

**Problem**: React scripts fail to install
```bash
# Solution: Use package overrides
npm install --legacy-peer-deps
# Or use the overrides in package.json
```

**Problem**: SSL certificate errors
```bash
# Solution: Configure corporate certificates
npm config set cafile /path/to/corporate/ca-bundle.crt
```

### 3. Application Issues

**Problem**: Frontend cannot connect to backend
```bash
# Solution: Check CORS and proxy settings
# Update backend/.env with correct FRONTEND_URL
# Check firewall rules for port 5001
```

**Problem**: MongoDB connection timeout
```bash
# Solution: Increase timeout values
MONGO_URI=mongodb://corporate-mongo.company.com:27017/smartdoc-ai?connectTimeoutMS=60000&socketTimeoutMS=60000
```

### 4. Corporate Security Issues

**Problem**: Antivirus blocking Node.js
```bash
# Solution: Add exclusions to antivirus
# Add node_modules/ and project directories to exclusions
```

**Problem**: Corporate firewall blocking API calls
```bash
# Solution: Request firewall rules for:
# - api.openai.com:443
# - registry.npmjs.org:443
# - github.com:443
```

## Security Considerations

### 1. Network Security
- Use HTTPS in production
- Configure proper CORS settings
- Implement rate limiting
- Use corporate certificates

### 2. Data Security
- Encrypt sensitive data
- Use secure JWT secrets
- Implement proper authentication
- Regular security updates

### 3. Access Control
- Implement role-based access
- Audit logging
- Secure file uploads
- Input validation

## Support

For corporate deployment support:
- Check the troubleshooting section above
- Review network configuration
- Verify firewall rules
- Test connectivity to external services

## Additional Resources

- [Node.js Corporate Setup](https://nodejs.org/en/docs/guides/nodejs-docker-webapp/)
- [MongoDB Corporate Deployment](https://docs.mongodb.com/manual/administration/)
- [React Corporate Setup](https://create-react-app.dev/docs/deployment/)
- [Corporate Proxy Configuration](https://docs.npmjs.com/cli/v8/using-npm/config) 