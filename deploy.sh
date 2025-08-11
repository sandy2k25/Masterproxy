#!/bin/bash

# M3U8 Proxy Service - Ubuntu VPS Deployment Script
# Run with: bash deploy.sh

set -e  # Exit on any error

echo "🚀 Starting M3U8 Proxy Service deployment on Ubuntu VPS..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if running as root
if [[ $EUID -eq 0 ]]; then
   print_error "This script should not be run as root for security reasons"
   print_status "Please run as a regular user with sudo privileges"
   exit 1
fi

# Update system packages
print_status "Updating system packages..."
sudo apt update && sudo apt upgrade -y

# Install essential tools
print_status "Installing essential tools..."
sudo apt install -y curl wget git unzip software-properties-common htop nginx

# Install Node.js 20 LTS if not already installed
if ! command -v node &> /dev/null || [[ $(node -v | cut -d'.' -f1 | sed 's/v//') -lt 20 ]]; then
    print_status "Installing Node.js 20 LTS..."
    curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
    sudo apt-get install -y nodejs
else
    print_status "Node.js 20+ already installed: $(node -v)"
fi

# Install PM2 globally if not already installed
if ! command -v pm2 &> /dev/null; then
    print_status "Installing PM2 process manager..."
    sudo npm install -g pm2
else
    print_status "PM2 already installed: $(pm2 -v)"
fi

# Create logs directory
print_status "Creating logs directory..."
mkdir -p logs

# Install dependencies
print_status "Installing project dependencies..."
npm install

# Build the application
print_status "Building the application..."
npm run build

# Verify build
if [[ ! -f "dist/index.js" ]]; then
    print_error "Build failed! dist/index.js not found"
    exit 1
fi

if [[ ! -d "dist/public" ]]; then
    print_error "Build failed! dist/public directory not found"
    exit 1
fi

print_status "Build successful! ✅"

# Setup PM2 ecosystem if it doesn't exist
if [[ ! -f "ecosystem.config.js" ]]; then
    print_warning "ecosystem.config.js not found, creating default configuration..."
    cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'm3u8-proxy',
    script: 'dist/index.js',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: './logs/error.log',
    out_file: './logs/access.log',
    log_file: './logs/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOF
fi

# Stop existing PM2 processes
print_status "Stopping existing PM2 processes..."
pm2 stop all || true

# Start the application with PM2
print_status "Starting application with PM2..."
pm2 start ecosystem.config.js

# Save PM2 configuration
pm2 save

# Setup PM2 startup script
print_status "Setting up PM2 startup script..."
sudo pm2 startup -u $USER --hp $HOME || true

# Configure Nginx (basic configuration)
NGINX_CONF="/etc/nginx/sites-available/m3u8-proxy"
if [[ ! -f "$NGINX_CONF" ]]; then
    print_status "Creating Nginx configuration..."
    sudo tee $NGINX_CONF > /dev/null << 'EOF'
server {
    listen 80;
    server_name _;

    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;

    # Main application
    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
        
        # Streaming optimizations
        proxy_buffering off;
        proxy_request_buffering off;
    }
}
EOF

    # Enable the site
    sudo ln -sf $NGINX_CONF /etc/nginx/sites-enabled/
    sudo rm -f /etc/nginx/sites-enabled/default
else
    print_status "Nginx configuration already exists"
fi

# Test and reload Nginx
print_status "Testing Nginx configuration..."
if sudo nginx -t; then
    print_status "Reloading Nginx..."
    sudo systemctl enable nginx
    sudo systemctl reload nginx
else
    print_error "Nginx configuration test failed!"
    exit 1
fi

# Setup basic firewall
print_status "Configuring firewall..."
sudo ufw --force enable
sudo ufw allow ssh
sudo ufw allow 80
sudo ufw allow 443

# Show status
print_status "Deployment completed! 🎉"
echo ""
echo "==================================="
echo "   DEPLOYMENT SUMMARY"
echo "==================================="
echo "✅ Node.js: $(node -v)"
echo "✅ PM2: $(pm2 -v)"
echo "✅ Application: Running on port 3000"
echo "✅ Nginx: Proxying requests"
echo "✅ Firewall: Configured"
echo ""
echo "Your M3U8 Proxy Service is now running!"
echo ""
echo "📍 Application Status:"
pm2 status
echo ""
echo "📍 Access your application:"
echo "   Local: http://localhost"
echo "   External: http://$(curl -s ifconfig.me 2>/dev/null || echo 'YOUR_SERVER_IP')"
echo ""
echo "📍 Useful commands:"
echo "   View logs: pm2 logs m3u8-proxy"
echo "   Restart app: pm2 restart m3u8-proxy"
echo "   Monitor: pm2 monit"
echo "   Nginx logs: sudo tail -f /var/log/nginx/access.log"
echo ""
echo "📍 Next steps:"
echo "   1. Configure your domain DNS to point to this server"
echo "   2. Install SSL certificate: sudo certbot --nginx"
echo "   3. Monitor performance and logs"
echo ""
print_status "Deployment script completed successfully!"