# Ubuntu VPS Deployment Guide

Deploy your M3U8 streaming proxy service on any Ubuntu VPS (DigitalOcean, Linode, AWS EC2, Google Cloud, etc.).

## Quick Deployment Steps

### 1. Server Preparation

#### Initial Server Setup
```bash
# Update system packages
sudo apt update && sudo apt upgrade -y

# Install essential tools
sudo apt install -y curl wget git unzip software-properties-common

# Create application user (optional but recommended)
sudo adduser --disabled-password --gecos "" m3u8proxy
sudo usermod -aG sudo m3u8proxy
```

#### Install Node.js 20 LTS
```bash
# Install Node.js 20 via NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify installation
node --version  # Should show v20.x.x
npm --version   # Should show v10.x.x

# Install PM2 for process management
sudo npm install -g pm2
```

### 2. Deploy Your Application

#### Clone and Setup
```bash
# Switch to application user (if created)
sudo su - m3u8proxy

# Clone your repository
git clone https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git m3u8-proxy
cd m3u8-proxy

# Install dependencies
npm install

# Build the application
npm run build

# Test the build
ls -la dist/  # Should show index.js and public/ directory
```

#### Environment Configuration
```bash
# Create environment file
cat > .env << EOF
NODE_ENV=production
PORT=3000
# Add any other environment variables here
EOF

# Make sure the environment is loaded
source .env
```

### 3. Process Management with PM2

#### Create PM2 Configuration
```bash
# Create PM2 ecosystem file
cat > ecosystem.config.js << 'EOF'
module.exports = {
  apps: [{
    name: 'm3u8-proxy',
    script: 'dist/index.js',
    cwd: '/home/m3u8proxy/m3u8-proxy',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    },
    error_file: '/var/log/m3u8-proxy/error.log',
    out_file: '/var/log/m3u8-proxy/access.log',
    log_file: '/var/log/m3u8-proxy/combined.log',
    time: true,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G'
  }]
}
EOF

# Create log directory
sudo mkdir -p /var/log/m3u8-proxy
sudo chown m3u8proxy:m3u8proxy /var/log/m3u8-proxy
```

#### Start the Application
```bash
# Start with PM2
pm2 start ecosystem.config.js

# Check status
pm2 status

# View logs
pm2 logs m3u8-proxy

# Save PM2 configuration
pm2 save

# Setup PM2 to start on boot
sudo pm2 startup
# Follow the command output instructions
```

### 4. Reverse Proxy with Nginx

#### Install and Configure Nginx
```bash
# Install Nginx
sudo apt install -y nginx

# Create Nginx configuration
sudo tee /etc/nginx/sites-available/m3u8-proxy << 'EOF'
server {
    listen 80;
    server_name your-domain.com www.your-domain.com;  # Replace with your domain
    
    # Security headers
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' http: https: data: blob: 'unsafe-inline'" always;

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/javascript application/json;

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
        
        # Streaming-specific settings
        proxy_buffering off;
        proxy_request_buffering off;
        
        # Timeouts for streaming
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }

    # Static file caching
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
        proxy_pass http://127.0.0.1:3000;
        proxy_set_header Host $host;
        expires 1y;
        add_header Cache-Control "public, immutable";
    }

    # Security: block access to sensitive files
    location ~ /\. {
        deny all;
    }
}
EOF

# Enable the site
sudo ln -s /etc/nginx/sites-available/m3u8-proxy /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default

# Test Nginx configuration
sudo nginx -t

# Start Nginx
sudo systemctl enable nginx
sudo systemctl restart nginx
```

### 5. SSL Certificate with Let's Encrypt

#### Install Certbot
```bash
# Install Certbot
sudo apt install -y certbot python3-certbot-nginx

# Get SSL certificate (replace with your domain)
sudo certbot --nginx -d your-domain.com -d www.your-domain.com

# Test auto-renewal
sudo certbot renew --dry-run
```

### 6. Firewall Configuration

#### Setup UFW Firewall
```bash
# Enable UFW
sudo ufw enable

# Allow SSH (important!)
sudo ufw allow ssh

# Allow HTTP and HTTPS
sudo ufw allow 80
sudo ufw allow 443

# Check status
sudo ufw status
```

## Monitoring and Maintenance

### Log Management
```bash
# View application logs
pm2 logs m3u8-proxy

# View Nginx logs
sudo tail -f /var/log/nginx/access.log
sudo tail -f /var/log/nginx/error.log

# Setup log rotation
sudo tee /etc/logrotate.d/m3u8-proxy << 'EOF'
/var/log/m3u8-proxy/*.log {
    daily
    missingok
    rotate 30
    compress
    delaycompress
    notifempty
    create 644 m3u8proxy m3u8proxy
    postrotate
        pm2 reloadLogs
    endscript
}
EOF
```

### Performance Monitoring
```bash
# Install monitoring tools
sudo apt install -y htop iotop nethogs

# Monitor system resources
htop

# Monitor PM2 processes
pm2 monit

# Check disk usage
df -h

# Check memory usage
free -h
```

### Backup Strategy
```bash
# Create backup script
sudo tee /usr/local/bin/backup-m3u8-proxy.sh << 'EOF'
#!/bin/bash
BACKUP_DIR="/home/m3u8proxy/backups"
DATE=$(date +%Y%m%d_%H%M%S)

# Create backup directory
mkdir -p $BACKUP_DIR

# Backup application files
tar -czf $BACKUP_DIR/m3u8-proxy_$DATE.tar.gz -C /home/m3u8proxy m3u8-proxy

# Keep only last 7 backups
find $BACKUP_DIR -name "m3u8-proxy_*.tar.gz" -mtime +7 -delete

echo "Backup completed: m3u8-proxy_$DATE.tar.gz"
EOF

sudo chmod +x /usr/local/bin/backup-m3u8-proxy.sh

# Setup daily backup cron job
(crontab -l 2>/dev/null; echo "0 2 * * * /usr/local/bin/backup-m3u8-proxy.sh") | crontab -
```

## Application Updates

### Update Process
```bash
# Navigate to application directory
cd /home/m3u8proxy/m3u8-proxy

# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Rebuild application
npm run build

# Restart application
pm2 restart m3u8-proxy

# Check status
pm2 status
```

## Security Hardening

### Basic Security Measures
```bash
# Disable root login (recommended)
sudo sed -i 's/PermitRootLogin yes/PermitRootLogin no/' /etc/ssh/sshd_config
sudo systemctl restart ssh

# Install fail2ban
sudo apt install -y fail2ban

# Configure fail2ban for SSH
sudo tee /etc/fail2ban/jail.local << 'EOF'
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 3

[sshd]
enabled = true
port = ssh
logpath = /var/log/auth.log
EOF

sudo systemctl enable fail2ban
sudo systemctl restart fail2ban
```

### Rate Limiting with Nginx
```bash
# Add to Nginx configuration (before server block)
sudo tee -a /etc/nginx/sites-available/m3u8-proxy << 'EOF'

# Rate limiting
limit_req_zone $binary_remote_addr zone=api:10m rate=10r/s;
limit_req_zone $binary_remote_addr zone=stream:10m rate=5r/s;

server {
    # ... existing configuration ...
    
    # API rate limiting
    location /api/ {
        limit_req zone=api burst=20 nodelay;
        proxy_pass http://127.0.0.1:3000;
        # ... other proxy settings ...
    }
    
    # Stream rate limiting
    location /stream/ {
        limit_req zone=stream burst=10 nodelay;
        proxy_pass http://127.0.0.1:3000;
        # ... other proxy settings ...
    }
}
EOF

sudo nginx -t && sudo systemctl reload nginx
```

## Performance Optimization

### System Optimization
```bash
# Increase file descriptor limits
echo "* soft nofile 65536" | sudo tee -a /etc/security/limits.conf
echo "* hard nofile 65536" | sudo tee -a /etc/security/limits.conf

# Optimize network settings for streaming
sudo tee -a /etc/sysctl.conf << 'EOF'
# Network optimizations for streaming
net.core.rmem_max = 16777216
net.core.wmem_max = 16777216
net.ipv4.tcp_rmem = 4096 12582912 16777216
net.ipv4.tcp_wmem = 4096 12582912 16777216
net.core.netdev_max_backlog = 5000
EOF

sudo sysctl -p
```

## Troubleshooting

### Common Issues

1. **Application Won't Start**
   ```bash
   # Check PM2 status
   pm2 status
   pm2 logs m3u8-proxy
   
   # Check if port is available
   sudo netstat -tlnp | grep :3000
   ```

2. **Nginx Configuration Issues**
   ```bash
   # Test Nginx config
   sudo nginx -t
   
   # Check Nginx status
   sudo systemctl status nginx
   
   # View Nginx logs
   sudo tail -f /var/log/nginx/error.log
   ```

3. **SSL Certificate Issues**
   ```bash
   # Check certificate status
   sudo certbot certificates
   
   # Renew certificate manually
   sudo certbot renew
   ```

4. **Performance Issues**
   ```bash
   # Monitor system resources
   htop
   
   # Check PM2 memory usage
   pm2 monit
   
   # Analyze Nginx access logs
   sudo tail -f /var/log/nginx/access.log
   ```

## Cost Estimation

### VPS Requirements
- **Minimum**: 1GB RAM, 1 CPU, 25GB SSD ($5-10/month)
- **Recommended**: 2GB RAM, 2 CPU, 50GB SSD ($10-20/month)
- **High Traffic**: 4GB RAM, 4 CPU, 100GB SSD ($20-40/month)

### Popular VPS Providers
- **DigitalOcean**: Starting at $6/month
- **Linode**: Starting at $5/month
- **Vultr**: Starting at $5/month
- **AWS Lightsail**: Starting at $5/month
- **Google Cloud**: Starting at $7/month

Your M3U8 proxy service will run excellently on Ubuntu VPS with full control, unlimited bandwidth, and professional-grade infrastructure!