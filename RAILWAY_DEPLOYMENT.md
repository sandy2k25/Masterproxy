# Railway Deployment Guide

Railway is perfect for your M3U8 streaming proxy because it provides a full Node.js environment without serverless limitations.

## Quick Deployment Steps

### 1. Prepare Your Repository
```bash
# Initialize git if not already done
git init
git add .
git commit -m "Initial commit - M3U8 Proxy Service"

# Push to GitHub (create repository first)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Deploy on Railway
1. **Visit**: https://railway.app
2. **Sign up** with GitHub
3. **Click "Deploy from GitHub"**
4. **Select your repository**
5. **Configure settings:**
   - Build Command: `npm run build`
   - Start Command: `npm run start` 
   - Port: Railway will auto-detect from your Express server
   - Node.js Version: Automatically detected from `.nvmrc` (v20.11.0+)

### 3. Environment Variables (Optional)
If you need database or other secrets:
- Go to your Railway project → Variables
- Add environment variables as needed

## Why Railway is Better

✅ **Full Node.js Runtime** - No serverless limitations  
✅ **Perfect for Streaming** - Handles binary data efficiently  
✅ **No Cold Starts** - Always-on server  
✅ **Easy Deployment** - Git push to deploy  
✅ **Custom Domains** - Free subdomain, paid custom domains  
✅ **Automatic HTTPS** - SSL certificates included  

## Costs
- **Free Tier**: $5 credit monthly (usually enough for development)
- **Pro Plan**: $5/month for production usage
- **Pay-per-use**: Only pay for what you use

## After Deployment

Your app will be available at: `https://your-app-name.railway.app`

Test your streaming endpoints:
- Frontend: `https://your-app-name.railway.app/`
- Stream API: `https://your-app-name.railway.app/stream/?origin=...&referer=.../your-stream.m3u8`
- Validation: `https://your-app-name.railway.app/api/validate-url`

## Production Configuration

Railway automatically handles:
- Process management (no PM2 needed)
- Load balancing
- Health checks
- Automatic restarts
- SSL certificates
- CDN integration

Your M3U8 proxy service will run exactly as it does locally, but with production-grade infrastructure.

## Troubleshooting

### Node.js Version Error
If you encounter an error like:
```
TypeError [ERR_INVALID_ARG_TYPE]: The "paths[0]" argument must be of type string. Received undefined
```

This indicates Railway is using an older Node.js version (18.x) instead of the required Node.js 20.x. The solution:

1. **Check your repository** has `.nvmrc` file with `20.11.0`
2. **Check your repository** has `nixpacks.toml` with Node.js 20 configuration
3. **Redeploy** your application after adding these files
4. **Verify** in Railway logs that it's using Node.js 20.x during build

### Common Issues
- **Build Failures**: Ensure all environment variables are set in Railway dashboard
- **Port Issues**: Railway automatically handles port allocation, no manual configuration needed
- **SSL Issues**: Railway provides automatic HTTPS, no manual setup required