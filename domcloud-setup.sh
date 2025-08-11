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
if [ -d "dist" ]; then
    echo "✅ Build successful! Application ready for DomCloud deployment."
    echo ""
    echo "Your app structure:"
    ls -la dist/
    echo ""
    echo "Next steps:"
    echo "1. Ensure your DomCloud website is configured with the .domcloud file"
    echo "2. Your app will be available at: https://yoursite.domcloud.co"
    echo "3. API endpoints will be at: https://yoursite.domcloud.co/api/*"
    echo "4. Stream endpoint: https://yoursite.domcloud.co/stream/*"
else
    echo "❌ Build failed! Please check the errors above."
    exit 1
fi