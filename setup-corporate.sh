#!/bin/bash

# SmartDoc AI - Corporate Environment Setup Script
# This script helps set up the application in corporate environments

set -e

echo "🚀 SmartDoc AI - Corporate Environment Setup"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running in corporate environment
check_corporate_environment() {
    print_status "Checking corporate environment..."
    
    # Check for proxy environment variables
    if [[ -n "$HTTP_PROXY" || -n "$HTTPS_PROXY" ]]; then
        print_warning "Proxy detected: HTTP_PROXY=$HTTP_PROXY, HTTPS_PROXY=$HTTPS_PROXY"
        print_status "Configuring npm for proxy..."
        npm config set proxy "$HTTP_PROXY" 2>/dev/null || true
        npm config set https-proxy "$HTTPS_PROXY" 2>/dev/null || true
    fi
    
    # Check for corporate npm registry
    if [[ -n "$NPM_REGISTRY" ]]; then
        print_status "Setting corporate npm registry: $NPM_REGISTRY"
        npm config set registry "$NPM_REGISTRY"
    fi
}

# Setup backend
setup_backend() {
    print_status "Setting up backend..."
    
    cd backend
    
    # Check if .env exists
    if [[ ! -f ".env" ]]; then
        print_status "Creating .env file from corporate example..."
        if [[ -f "env.corporate.example" ]]; then
            cp env.corporate.example .env
            print_warning "Please edit backend/.env with your corporate settings"
        else
            cp env.example .env
            print_warning "Please edit backend/.env with your corporate settings"
        fi
    fi
    
    # Install dependencies with corporate-friendly options
    print_status "Installing backend dependencies..."
    npm install --legacy-peer-deps || {
        print_warning "Standard install failed, trying with additional flags..."
        npm install --legacy-peer-deps --no-optional || {
            print_error "Backend dependency installation failed"
            return 1
        }
    }
    
    print_success "Backend setup completed"
    cd ..
}

# Setup frontend
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd frontend
    
    # Check if .env exists
    if [[ ! -f ".env" ]]; then
        print_status "Creating frontend .env file..."
        cat > .env << EOF
# Frontend Environment Configuration
REACT_APP_API_URL=http://localhost:5001/api/

# Corporate proxy settings (uncomment if needed)
# HTTPS_PROXY=http://proxy.company.com:8080
# HTTP_PROXY=http://proxy.company.com:8080
EOF
        print_warning "Please edit frontend/.env with your corporate settings"
    fi
    
    # Install dependencies with corporate-friendly options
    print_status "Installing frontend dependencies..."
    npm install --legacy-peer-deps || {
        print_warning "Standard install failed, trying with additional flags..."
        npm install --legacy-peer-deps --no-optional || {
            print_error "Frontend dependency installation failed"
            return 1
        }
    }
    
    print_success "Frontend setup completed"
    cd ..
}

# Generate SSL certificates for development
generate_ssl_certs() {
    print_status "Generating SSL certificates for development..."
    
    if [[ ! -f "cert.pem" || ! -f "key.pem" ]]; then
        openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost" 2>/dev/null || {
            print_warning "SSL certificate generation failed. You can generate them manually:"
            print_status "openssl req -x509 -newkey rsa:4096 -keyout key.pem -out cert.pem -days 365 -nodes"
        }
    else
        print_status "SSL certificates already exist"
    fi
}

# Test connectivity
test_connectivity() {
    print_status "Testing connectivity..."
    
    # Test npm registry
    if npm ping 2>/dev/null; then
        print_success "npm registry is accessible"
    else
        print_warning "npm registry may not be accessible. Check your proxy settings."
    fi
    
    # Test MongoDB connection (if configured)
    if [[ -f "backend/.env" ]]; then
        MONGO_URI=$(grep "^MONGO_URI=" backend/.env | cut -d'=' -f2-)
        if [[ -n "$MONGO_URI" ]]; then
            print_status "MongoDB URI found in configuration"
        else
            print_warning "MongoDB URI not configured. Please set MONGO_URI in backend/.env"
        fi
    fi
}

# Main setup function
main() {
    print_status "Starting corporate environment setup..."
    
    # Check prerequisites
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js >= 18.0.0"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed. Please install npm >= 8.0.0"
        exit 1
    fi
    
    print_success "Prerequisites check passed"
    
    # Check corporate environment
    check_corporate_environment
    
    # Setup backend
    setup_backend || {
        print_error "Backend setup failed"
        exit 1
    }
    
    # Setup frontend
    setup_frontend || {
        print_error "Frontend setup failed"
        exit 1
    }
    
    # Generate SSL certificates
    generate_ssl_certs
    
    # Test connectivity
    test_connectivity
    
    print_success "Corporate environment setup completed!"
    echo ""
    echo "Next steps:"
    echo "1. Edit backend/.env with your corporate settings"
    echo "2. Edit frontend/.env with your API URL"
    echo "3. Start the backend: cd backend && npm run start:corporate"
    echo "4. Start the frontend: cd frontend && npm run start:corporate"
    echo ""
    echo "For detailed configuration options, see CORPORATE_SETUP_GUIDE.md"
}

# Run main function
main "$@" 