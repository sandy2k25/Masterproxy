#!/bin/bash

# DomCloud Debug Script
# Run this locally to verify your files before uploading

echo "🔍 DomCloud Deployment Debug Check"
echo "=================================="

# Check if package.json exists and is valid
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    echo "📋 Package.json content:"
    cat package.json | head -20
    echo ""
    
    # Validate JSON syntax
    if node -e "JSON.parse(require('fs').readFileSync('package.json', 'utf8'))" 2>/dev/null; then
        echo "✅ package.json is valid JSON"
    else
        echo "❌ package.json has invalid JSON syntax"
        exit 1
    fi
else
    echo "❌ package.json not found!"
    exit 1
fi

# Check if .domcloud exists
if [ -f ".domcloud" ]; then
    echo "✅ .domcloud configuration found"
    echo "📋 .domcloud content:"
    cat .domcloud
    echo ""
else
    echo "❌ .domcloud configuration not found!"
    exit 1
fi

# Check Node.js version
echo "📋 Current Node.js version:"
node --version
echo ""

# Test npm install
echo "🔧 Testing npm install..."
if npm install --production --dry-run; then
    echo "✅ npm install should work"
else
    echo "❌ npm install will fail"
    exit 1
fi

# Test build process
echo "🔧 Testing build process..."
if npm run build; then
    echo "✅ Build successful"
    
    # Check build output
    if [ -f "dist/index.js" ]; then
        echo "✅ dist/index.js created"
        echo "📏 File size: $(du -h dist/index.js | cut -f1)"
    else
        echo "❌ dist/index.js not created"
        exit 1
    fi
    
    if [ -d "dist/public" ]; then
        echo "✅ dist/public directory created"
        echo "📂 Contents:"
        ls -la dist/public/
    else
        echo "❌ dist/public directory not created"
        exit 1
    fi
else
    echo "❌ Build failed"
    exit 1
fi

echo ""
echo "🎉 All checks passed! Your project should deploy successfully on DomCloud."
echo ""
echo "📋 Upload checklist:"
echo "   1. Upload package.json to root directory"
echo "   2. Upload .domcloud to root directory"
echo "   3. Upload all source files"
echo "   4. Trigger deployment in DomCloud panel"
echo ""
echo "🔗 Your app will be available at: https://yoursite.domcloud.co"