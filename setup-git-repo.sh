#!/bin/bash

# SmartDoc AI V1.0 Git Repository Setup Script

echo "🚀 Setting up SmartDoc AI V1.0 Git Repository"
echo "=============================================="

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

print_success "Git version: $(git --version)"

# Initialize git repository
print_status "Initializing Git repository..."
git init

# Add all files
print_status "Adding files to Git..."
git add .

# Create initial commit
print_status "Creating initial commit..."
git commit -m "🎉 SmartDoc AI V1.0 - Initial Release

✨ Enhanced Features:
- Enhanced PDF processing with OCR fallback
- Advanced image support (TIFF, BMP)
- Improved OCR accuracy with preprocessing
- Increased file size limit to 10MB
- Multi-language OCR support
- Better error handling and recovery
- Enhanced user experience with file input clearing
- Comprehensive testing guide
- Production deployment configurations

📄 Supported File Types:
- PDFs (including scanned PDFs)
- Images (JPEG, PNG, TIFF, BMP)
- Documents (DOCX, DOC, TXT)
- File size up to 10MB

🔧 Technical Improvements:
- Enhanced text extraction service
- Better file validation
- Improved error handling
- Production-ready deployment scripts
- Docker support
- PM2 process management
- Comprehensive documentation"

print_success "Git repository initialized successfully!"

# Create .gitignore for backend and frontend if they don't exist
print_status "Checking for additional .gitignore files..."

if [ ! -f "backend/.gitignore" ]; then
    print_status "Creating backend/.gitignore..."
    cat > backend/.gitignore << EOF
# Dependencies
node_modules/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
logs/
*.log

# Uploads
uploads/

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOF
fi

if [ ! -f "frontend/.gitignore" ]; then
    print_status "Creating frontend/.gitignore..."
    cat > frontend/.gitignore << EOF
# Dependencies
node_modules/

# Production builds
build/
dist/

# Environment variables
.env
.env.local
.env.development.local
.env.test.local
.env.production.local

# Logs
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Coverage directory
coverage/

# nyc test coverage
.nyc_output

# Dependency directories
node_modules/
jspm_packages/

# Optional npm cache directory
.npm

# Optional REPL history
.node_repl_history

# Output of 'npm pack'
*.tgz

# Yarn Integrity file
.yarn-integrity

# dotenv environment variables file
.env

# IDE files
.vscode/
.idea/
*.swp
*.swo

# OS generated files
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db
EOF
fi

# Create version file
print_status "Creating version file..."
cat > VERSION << EOF
SmartDoc AI V1.0.0

Release Date: $(date +"%Y-%m-%d")
Build: $(git rev-parse --short HEAD)

Enhanced Features:
- Enhanced PDF processing with OCR fallback
- Advanced image support (TIFF, BMP)
- Improved OCR accuracy with preprocessing
- Increased file size limit to 10MB
- Multi-language OCR support
- Better error handling and recovery
- Enhanced user experience with file input clearing
- Comprehensive testing guide
- Production deployment configurations

Supported File Types:
- PDFs (including scanned PDFs)
- Images (JPEG, PNG, TIFF, BMP)
- Documents (DOCX, DOC, TXT)
- File size up to 10MB
EOF

# Create CHANGELOG
print_status "Creating CHANGELOG..."
cat > CHANGELOG.md << EOF
# Changelog

All notable changes to SmartDoc AI will be documented in this file.

## [1.0.0] - $(date +"%Y-%m-%d")

### Added
- Enhanced PDF processing with OCR fallback for scanned PDFs
- Advanced image support for TIFF and BMP formats
- Improved OCR accuracy with intelligent image preprocessing
- Increased file size limit from 5MB to 10MB
- Multi-language OCR support (configurable)
- Better error handling with detailed error messages
- Enhanced user experience with file input clearing after upload
- Comprehensive testing guide with detailed scenarios
- Production deployment configurations (Docker, PM2, Systemd)
- Docker Compose setup for easy deployment
- Nginx configuration for reverse proxy
- PM2 ecosystem configuration for process management
- Systemd service file for Linux systems
- Enhanced text extraction service with multiple fallback methods
- Image preprocessing using Sharp library
- PDF-to-image conversion for OCR processing
- Better file validation and error recovery
- Structured logging system
- Performance optimizations

### Changed
- Upgraded file processing capabilities
- Improved text extraction accuracy
- Enhanced error handling and user feedback
- Better file type validation
- Optimized memory usage during processing

### Fixed
- File input field not clearing after upload
- Improved error messages for failed uploads
- Better handling of corrupted files
- Enhanced security with comprehensive validation

### Technical Improvements
- Modular text extraction service
- Better separation of concerns
- Enhanced error handling middleware
- Improved logging and monitoring
- Production-ready deployment scripts
- Comprehensive documentation
EOF

# Add new files to git
print_status "Adding new files to Git..."
git add .

# Commit new files
print_status "Committing additional files..."
git commit -m "📝 Add version tracking and documentation

- Add VERSION file with release information
- Add CHANGELOG.md with detailed change history
- Add backend/.gitignore and frontend/.gitignore
- Complete repository setup for V1.0"

print_success "Git repository setup completed!"

echo ""
echo "🎉 SmartDoc AI V1.0 Git Repository is ready!"
echo ""
echo "📋 Next Steps:"
echo "1. Create a new repository on GitHub/GitLab:"
echo "   - Name: SmartDocAI-V1.0"
echo "   - Description: Enhanced PDF & Image Processing AI Document Assistant"
echo ""
echo "2. Add remote origin:"
echo "   git remote add origin <your-repo-url>"
echo ""
echo "3. Push to remote:"
echo "   git branch -M main"
echo "   git push -u origin main"
echo ""
echo "4. Create a release tag:"
echo "   git tag -a v1.0.0 -m 'SmartDoc AI V1.0 Release'"
echo "   git push origin v1.0.0"
echo ""
echo "📚 Files created:"
echo "✅ .gitignore (comprehensive)"
echo "✅ README_V1.0.md (detailed documentation)"
echo "✅ docker-compose.yml (Docker deployment)"
echo "✅ deploy-production.sh (production setup)"
echo "✅ VERSION (version tracking)"
echo "✅ CHANGELOG.md (change history)"
echo "✅ backend/.gitignore & frontend/.gitignore"
echo ""
print_success "Your SmartDoc AI V1.0 repository is ready for production! 🚀" 