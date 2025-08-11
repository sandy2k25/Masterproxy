#!/bin/bash

# DomCloud Setup Script for M3U8 Proxy Service
# Run this script after uploading your files to DomCloud

echo "Setting up M3U8 Proxy Service on DomCloud..."

# Check Node.js version
echo "Current Node.js version:"
node --version

# Install dependencies
echo "Installing dependencies..."
npm install --production

# Build the application
echo "Building application..."
npm run build

# Check if build was successful
if [ -f "dist/index.js" ] && [ -d "dist/public" ]; then
    echo "✅ Build successful! Application ready for DomCloud deployment."
    echo ""
    echo "Your app structure:"
    ls -la dist/
    echo ""
    echo "Built files:"
    echo "- dist/index.js (main server file)"
    echo "- dist/public/ (frontend files)"
    echo ""
    echo "Next steps:"
    echo "1. Ensure your .domcloud configuration file is present"
    echo "2. Your app will start with: env PORT=\$PORT node index.js"
    echo "3. App root will be: public_html/dist"
    echo "4. Static files served from: public_html/dist/public"
    echo ""
    echo "Your app will be available at: https://yoursite.domcloud.co"
    echo "API endpoints: https://yoursite.domcloud.co/api/*"
    echo "Stream endpoint: https://yoursite.domcloud.co/stream/*"
else
    echo "❌ Build failed! Missing required files:"
    if [ ! -f "dist/index.js" ]; then
        echo "  - dist/index.js not found"
    fi
    if [ ! -d "dist/public" ]; then
        echo "  - dist/public directory not found"
    fi
    echo ""
    echo "Please check the build errors above and ensure:"
    echo "1. npm run build completes successfully"
    echo "2. All dependencies are installed"
    echo "3. TypeScript compilation succeeds"
    exit 1
fi