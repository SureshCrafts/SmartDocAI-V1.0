#!/bin/bash

echo "🚀 Setting up enhanced dependencies for SmartDoc AI..."

# Navigate to backend directory
cd backend

echo "📦 Installing enhanced PDF and image processing dependencies..."

# Install new dependencies
npm install pdf2pic@^3.1.0 sharp@^0.33.0 jimp@^0.22.10 canvas@^2.11.2 pdf-lib@^1.17.1

echo "✅ Enhanced dependencies installed successfully!"

# Check if canvas installation was successful (it can be tricky on some systems)
if npm list canvas > /dev/null 2>&1; then
    echo "✅ Canvas library installed successfully"
else
    echo "⚠️  Canvas library installation may need manual setup"
    echo "   On macOS: brew install pkg-config cairo pango libpng jpeg giflib librsvg"
    echo "   On Ubuntu: sudo apt-get install build-essential libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev"
    echo "   Then run: npm rebuild canvas"
fi

echo ""
echo "🎉 Enhanced setup complete!"
echo ""
echo "New features available:"
echo "✅ Enhanced PDF processing with OCR fallback"
echo "✅ Better image preprocessing for OCR"
echo "✅ Support for TIFF and BMP images"
echo "✅ Improved text extraction accuracy"
echo "✅ Increased file size limit to 10MB"
echo ""
echo "You can now start the application with enhanced capabilities!" 