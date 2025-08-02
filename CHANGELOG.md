# Changelog

All notable changes to SmartDoc AI will be documented in this file.

## [1.0.0] - 2025-08-02

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
