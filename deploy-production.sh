#!/bin/bash

# SmartDoc AI V1.0 Production Deployment Script
# This script sets up the application for production deployment

set -e  # Exit on any error

echo "🚀 SmartDoc AI V1.0 Production Deployment"
echo "=========================================="

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

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root"
   exit 1
fi

# Check prerequisites
print_status "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    print_error "Node.js is not installed. Please install Node.js 18+ first."
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi

print_success "Node.js version: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    print_error "npm is not installed."
    exit 1
fi

print_success "npm version: $(npm -v)"

# Check Docker (optional)
if command -v docker &> /dev/null; then
    print_success "Docker is available"
    DOCKER_AVAILABLE=true
else
    print_warning "Docker not found. Will use manual deployment."
    DOCKER_AVAILABLE=false
fi

# Check Docker Compose (optional)
if command -v docker-compose &> /dev/null; then
    print_success "Docker Compose is available"
    DOCKER_COMPOSE_AVAILABLE=true
else
    print_warning "Docker Compose not found."
    DOCKER_COMPOSE_AVAILABLE=false
fi

echo ""
print_status "Starting deployment process..."

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p backend/uploads
mkdir -p backend/logs
mkdir -p frontend/build

# Install dependencies
print_status "Installing backend dependencies..."
cd backend
npm install --production

print_status "Installing frontend dependencies..."
cd ../frontend
npm install --production

# Build frontend for production
print_status "Building frontend for production..."
npm run build

cd ..

# Check if .env files exist
if [ ! -f "backend/.env" ]; then
    print_warning "backend/.env not found. Creating from example..."
    if [ -f "backend/env.example" ]; then
        cp backend/env.example backend/.env
        print_warning "Please edit backend/.env with your production values"
    else
        print_error "backend/env.example not found. Please create backend/.env manually"
    fi
fi

# Create production environment file
print_status "Creating production environment file..."
cat > .env.production << EOF
# SmartDoc AI V1.0 Production Environment
NODE_ENV=production

# Database Configuration
MONGO_URI=mongodb://admin:password123@localhost:27017/smartdoc?authSource=admin

# JWT Configuration
JWT_SECRET=$(openssl rand -base64 32)

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key_here

# Server Configuration
PORT=5001
FRONTEND_URL=http://localhost:3000

# File Upload Configuration
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX_REQUESTS=5
EOF

print_success "Production environment file created: .env.production"
print_warning "Please edit .env.production with your actual values"

# Create PM2 ecosystem file for process management
print_status "Creating PM2 ecosystem configuration..."
cat > ecosystem.config.js << EOF
module.exports = {
  apps: [
    {
      name: 'smartdoc-backend',
      script: './backend/server.js',
      cwd: './backend',
      instances: 'max',
      exec_mode: 'cluster',
      env: {
        NODE_ENV: 'production',
        PORT: 5001
      },
      env_file: '../.env.production',
      log_file: './logs/combined.log',
      error_file: './logs/error.log',
      out_file: './logs/out.log',
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z',
      merge_logs: true,
      max_memory_restart: '200M',
      restart_delay: 4000,
      max_restarts: 10,
      min_uptime: '10s'
    }
  ]
};
EOF

# Create systemd service file (optional)
print_status "Creating systemd service file..."
sudo tee /etc/systemd/system/smartdoc-ai.service > /dev/null << EOF
[Unit]
Description=SmartDoc AI Backend
After=network.target

[Service]
Type=forking
User=$USER
WorkingDirectory=$(pwd)/backend
ExecStart=/usr/bin/pm2 start ecosystem.config.js
ExecReload=/usr/bin/pm2 reload ecosystem.config.js
ExecStop=/usr/bin/pm2 stop ecosystem.config.js
Restart=on-failure
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

# Create nginx configuration
print_status "Creating nginx configuration..."
mkdir -p nginx
cat > nginx/nginx.conf << EOF
events {
    worker_connections 1024;
}

http {
    upstream backend {
        server localhost:5001;
    }

    upstream frontend {
        server localhost:3000;
    }

    server {
        listen 80;
        server_name localhost;

        # Frontend
        location / {
            proxy_pass http://frontend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Backend API
        location /api/ {
            proxy_pass http://backend;
            proxy_set_header Host \$host;
            proxy_set_header X-Real-IP \$remote_addr;
            proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
            proxy_set_header X-Forwarded-Proto \$scheme;
        }

        # Health check
        location /health {
            proxy_pass http://backend/health;
        }
    }
}
EOF

# Create deployment instructions
print_status "Creating deployment instructions..."
cat > DEPLOYMENT_INSTRUCTIONS.md << EOF
# SmartDoc AI V1.0 Production Deployment Instructions

## Prerequisites
- Node.js 18+
- npm
- MongoDB (local or cloud)
- OpenAI API Key

## Quick Start

### Option 1: Docker Deployment (Recommended)
\`\`\`bash
# Set environment variables
export OPENAI_API_KEY="your_openai_api_key"
export JWT_SECRET="your_jwt_secret"

# Start with Docker Compose
docker-compose up -d
\`\`\`

### Option 2: Manual Deployment
\`\`\`bash
# 1. Install PM2 globally
npm install -g pm2

# 2. Set up environment
cp .env.production backend/.env
# Edit backend/.env with your values

# 3. Start the application
pm2 start ecosystem.config.js

# 4. Serve frontend (using nginx or similar)
# Copy frontend/build to your web server
\`\`\`

### Option 3: Systemd Service
\`\`\`bash
# Enable and start the service
sudo systemctl enable smartdoc-ai
sudo systemctl start smartdoc-ai

# Check status
sudo systemctl status smartdoc-ai
\`\`\`

## Environment Variables
Edit \`.env.production\` with your actual values:
- \`OPENAI_API_KEY\`: Your OpenAI API key
- \`MONGO_URI\`: MongoDB connection string
- \`JWT_SECRET\`: Strong secret for JWT tokens

## Monitoring
- PM2 Dashboard: \`pm2 monit\`
- Logs: \`pm2 logs\`
- Status: \`pm2 status\`

## Troubleshooting
- Check logs: \`tail -f backend/logs/combined.log\`
- Restart services: \`pm2 restart all\`
- Health check: \`curl http://localhost:5001/health\`
EOF

print_success "Deployment instructions created: DEPLOYMENT_INSTRUCTIONS.md"

# Create startup script
print_status "Creating startup script..."
cat > start-production.sh << 'EOF'
#!/bin/bash

# SmartDoc AI V1.0 Production Startup Script

echo "🚀 Starting SmartDoc AI V1.0..."

# Check if PM2 is installed
if ! command -v pm2 &> /dev/null; then
    echo "Installing PM2..."
    npm install -g pm2
fi

# Start the application
cd backend
pm2 start ecosystem.config.js

echo "✅ SmartDoc AI V1.0 started successfully!"
echo "📊 Monitor with: pm2 monit"
echo "📝 View logs with: pm2 logs"
echo "🌐 Frontend: http://localhost:3000"
echo "🔧 Backend API: http://localhost:5001"
EOF

chmod +x start-production.sh

# Create stop script
print_status "Creating stop script..."
cat > stop-production.sh << 'EOF'
#!/bin/bash

# SmartDoc AI V1.0 Production Stop Script

echo "🛑 Stopping SmartDoc AI V1.0..."

pm2 stop ecosystem.config.js
pm2 delete ecosystem.config.js

echo "✅ SmartDoc AI V1.0 stopped successfully!"
EOF

chmod +x stop-production.sh

# Create restart script
print_status "Creating restart script..."
cat > restart-production.sh << 'EOF'
#!/bin/bash

# SmartDoc AI V1.0 Production Restart Script

echo "🔄 Restarting SmartDoc AI V1.0..."

pm2 restart ecosystem.config.js

echo "✅ SmartDoc AI V1.0 restarted successfully!"
EOF

chmod +x restart-production.sh

print_success "Production deployment setup completed!"
echo ""
echo "📋 Next Steps:"
echo "1. Edit .env.production with your actual values"
echo "2. Install PM2: npm install -g pm2"
echo "3. Start the application: ./start-production.sh"
echo "4. Monitor with: pm2 monit"
echo ""
echo "📚 For detailed instructions, see: DEPLOYMENT_INSTRUCTIONS.md"
echo "🐳 For Docker deployment, run: docker-compose up -d"
echo ""
print_success "SmartDoc AI V1.0 is ready for production! 🎉" 