# DomCloud Deployment Guide

DomCloud provides affordable shared hosting with Node.js support, making it perfect for hosting your M3U8 streaming proxy service.

## Quick Deployment Steps

### 1. Prepare Your Account
1. **Sign up** at https://domcloud.co
2. **Create a new website** with Node.js template
3. **Choose your domain** (subdomain.domcloud.co or custom domain)
4. **Select Node.js** as your runtime environment

### 2. Upload Your Project

#### Option A: Git Deployment (Recommended)
```bash
# Push your code to GitHub first
git add .
git commit -m "Add DomCloud deployment configuration"
git push origin main

# Then use DomCloud's Git integration
# In DomCloud panel: Settings → Git → Connect Repository
```

#### Option B: File Upload
1. **Build locally**:
   ```bash
   npm install
   npm run build
   ```
2. **Upload files** via DomCloud file manager
3. **Upload the entire project** including `node_modules` or install dependencies

### 3. Configure Your Application

#### Environment Setup
In DomCloud control panel:
1. **Node.js Version**: Set to 20.x (latest LTS)
2. **Start Command**: `npm run start`
3. **Port**: DomCloud automatically assigns ports
4. **Environment Variables**: Add any required secrets

#### Domain Configuration
- **Default**: Your site will be available at `yoursite.domcloud.co`
- **Custom Domain**: Configure in DNS settings if you have one
- **HTTPS**: Automatically provided by DomCloud

### 4. Deployment Configuration

Create a `.domcloud` configuration file:

```yaml
features:
  - node lts
nginx:
  root: public_html/dist/public
  passenger:
    enabled: "on"
    app_start_command: env PORT=$PORT node index.js
    app_env: production
    app_root: public_html/dist
commands:
  - npm install --production
  - npm run build
```

## DomCloud-Specific Features

### ✅ Advantages
- **Affordable**: Starting from $1/month for basic hosting
- **Node.js 20 Support**: Full compatibility with your application
- **Traditional Hosting**: No serverless limitations, always-on server
- **Easy Management**: Simple control panel interface
- **Custom Domains**: Support for your own domain names
- **HTTPS**: Free SSL certificates included

### 📋 Requirements
- **Node.js Version**: 20.x (your app requires this)
- **Memory**: Minimum 512MB RAM (for streaming operations)
- **Storage**: At least 1GB for your application files
- **Bandwidth**: Depends on streaming usage

## Configuration Files

### Package.json Scripts
Your existing scripts work perfectly:
```json
{
  "scripts": {
    "dev": "NODE_ENV=development tsx server/index.ts",
    "build": "vite build && esbuild server/index.ts --platform=node --packages=external --bundle --format=esm --outdir=dist",
    "start": "NODE_ENV=production node dist/index.js"
  }
}
```

### Environment Variables
Set these in DomCloud control panel:
- `NODE_ENV=production`
- `PORT=auto` (DomCloud handles this)
- Add any API keys or database URLs as needed

## API Endpoints

After deployment, your endpoints will be:
- **Frontend**: `https://yoursite.domcloud.co/`
- **Stream API**: `https://yoursite.domcloud.co/stream/?origin=...&referer=.../your-stream.m3u8`
- **Validation**: `https://yoursite.domcloud.co/api/validate-url`
- **Proxy Requests**: `https://yoursite.domcloud.co/api/proxy-requests`

## Performance Optimization

### Caching
```javascript
// Add to your Express app for better performance
app.use(express.static('dist/public', {
  maxAge: '1d', // Cache static files for 1 day
  etag: true
}));
```

### Memory Management
```javascript
// Add memory monitoring for shared hosting
process.on('warning', (warning) => {
  console.warn(warning.name);
  console.warn(warning.message);
  console.warn(warning.stack);
});
```

## Costs and Plans

### Basic Plan ($1-3/month)
- **CPU**: Shared
- **Memory**: 512MB-1GB RAM
- **Storage**: 1-5GB SSD
- **Bandwidth**: 10-50GB/month
- **Good for**: Development and small-scale production

### Premium Plan ($5-10/month)
- **CPU**: Dedicated cores
- **Memory**: 2-4GB RAM
- **Storage**: 10-20GB SSD
- **Bandwidth**: 100-500GB/month
- **Good for**: Production streaming applications

## Troubleshooting

### Common Issues

1. **Module Not Found Error**
   ```
   Error: Cannot find module '/home/user/public_html/dist/src/index.js'
   ```
   **Solution**: This happens when the build path is incorrect. The fix:
   - Ensure your `.domcloud` file has `app_root: public_html/dist`
   - The `app_start_command` should be `node index.js` (not `node dist/index.js`)
   - Run `npm run build` to ensure `dist/index.js` exists

2. **Node.js Version Issues**
   - Ensure DomCloud is using Node.js 20.x or higher
   - Use `features: - node lts` in your `.domcloud` file
   - Check build logs for Node.js version confirmation

3. **Port Configuration**
   - Don't hardcode port 5000 in production
   - Use `process.env.PORT || 5000`
   - DomCloud automatically provides the PORT variable

4. **Build Failures**
   - Run `npm run build` locally first to test
   - Check that `dist/index.js` and `dist/public/` are created
   - Ensure all dependencies are in `package.json`

5. **File Permissions**
   - Ensure your files have correct permissions
   - Use DomCloud file manager to fix if needed

6. **Memory Limits**
   - Monitor memory usage in DomCloud dashboard
   - Upgrade plan if you hit limits
   - Optimize your application for lower memory usage

### Debugging
```javascript
// Add logging for DomCloud environment
console.log('Environment:', process.env.NODE_ENV);
console.log('Port:', process.env.PORT);
console.log('Memory usage:', process.memoryUsage());
```

## Comparison with Other Platforms

| Feature | **DomCloud** | **Railway** | **Netlify** | **Vercel** |
|---------|--------------|-------------|-------------|------------|
| **Cost (Monthly)** | $1-10 | $5+ | Free-$19 | Free-$20 |
| **Hosting Type** | Shared/VPS | Container | Serverless | Serverless |
| **Node.js 20** | ✅ Yes | ✅ Yes | ✅ Yes | ✅ Yes |
| **Always-On** | ✅ Yes | ✅ Yes | ❌ No | ❌ No |
| **Custom Domain** | ✅ Included | 💰 Paid | ✅ Free | ✅ Free |
| **Streaming** | ✅ Excellent | ✅ Excellent | ⚠️ Limited | ⚠️ Limited |
| **Setup Complexity** | 🟡 Medium | 🟢 Easy | 🟢 Easy | 🟢 Easy |

## Best Use Cases

**Choose DomCloud when:**
- You want the most affordable hosting option
- You need traditional hosting without serverless limitations
- You're comfortable with shared hosting management
- You want to host multiple projects on one account
- You need unlimited processing time for streaming

## Post-Deployment

After successful deployment:
1. **Test all endpoints** to ensure they work correctly
2. **Monitor performance** using DomCloud's analytics
3. **Set up monitoring** for uptime and performance
4. **Configure backups** for your application data

Your M3U8 proxy service will run exactly as it does locally, with the reliability of traditional hosting at an affordable price point.