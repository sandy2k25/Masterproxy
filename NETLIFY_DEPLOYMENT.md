# Netlify Deployment Guide

Netlify can host your M3U8 streaming proxy service using serverless functions, similar to Vercel deployment but with Netlify's infrastructure.

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

### 2. Deploy on Netlify

#### Option A: Git Integration (Recommended)
1. **Visit**: https://netlify.com
2. **Sign up** with GitHub
3. **Click "New site from Git"**
4. **Select your repository**
5. **Build settings** (auto-detected from `netlify.toml`):
   - Build command: `npm run build`
   - Publish directory: `dist/public`
   - Functions directory: `netlify/functions`
   - Node.js version: 20.16.0

#### Option B: Manual Upload
1. Run `npm run build` locally
2. Drag and drop the `dist/public` folder to Netlify
3. Configure serverless functions separately

### 3. Environment Variables (Optional)
If you need database or other secrets:
- Go to Site settings → Environment variables
- Add any required environment variables

## Netlify vs Other Platforms

### ✅ Netlify Advantages
- **Free Tier**: Generous free tier with 100GB bandwidth
- **CDN Integration**: Built-in global CDN for fast content delivery
- **Easy SSL**: Automatic HTTPS certificates
- **Branch Previews**: Deploy previews for every Git branch
- **Form Handling**: Built-in form processing (bonus feature)

### ⚠️ Limitations
- **Function Timeout**: 10 seconds for free tier, 15 minutes for paid
- **Function Size**: 50MB limit for serverless functions
- **Cold Starts**: Serverless functions have cold start delays
- **Streaming**: May have limitations with large streaming files

## Configuration Files

The deployment includes these configuration files:

### `netlify.toml`
- Build configuration and redirect rules
- Serverless function settings
- Node.js version specification

### `netlify/functions/`
- Serverless function adapters for your API endpoints
- Converts Vercel-style functions to Netlify format

## API Endpoints

After deployment, your endpoints will be:

- **Frontend**: `https://your-site-name.netlify.app/`
- **Stream API**: `https://your-site-name.netlify.app/stream/?origin=...&referer=.../your-stream.m3u8`
- **Validation**: `https://your-site-name.netlify.app/api/validate-url`
- **Proxy Requests**: `https://your-site-name.netlify.app/api/proxy-requests`

## Costs

- **Free Tier**: 
  - 100GB bandwidth/month
  - 125k serverless function invocations/month
  - Usually sufficient for development and small-scale production

- **Pro Plan**: $19/month
  - 1TB bandwidth
  - Unlimited function invocations
  - Advanced features

## Production Considerations

### Performance Optimization
- **Edge Functions**: Consider Netlify Edge Functions for better performance
- **Caching**: Configure caching headers for better performance
- **CDN**: Leverage Netlify's global CDN

### Monitoring
- **Analytics**: Built-in site analytics
- **Function Logs**: Monitor serverless function performance
- **Error Tracking**: Set up error monitoring

## Troubleshooting

### Common Issues

1. **Function Timeouts**
   - Free tier functions timeout after 10 seconds
   - Upgrade to Pro for 15-minute timeout limits

2. **Build Failures**
   - Check Node.js version in build logs
   - Ensure all dependencies are in `package.json`

3. **Routing Issues**
   - Verify redirect rules in `netlify.toml`
   - Check function naming matches routes

### Function Size Limits
If your functions are too large:
- Remove unnecessary dependencies
- Use external bundling tools
- Consider splitting large functions

## Alternative: Netlify Edge Functions

For better performance, consider migrating to Netlify Edge Functions:
- Lower latency (runs closer to users)
- No cold starts
- Deno runtime instead of Node.js

## Comparison with Other Platforms

| Feature | Netlify | Vercel | Railway |
|---------|---------|---------|---------|
| **Hosting Type** | Serverless | Serverless | Container |
| **Cold Starts** | Yes | Yes | No |
| **Timeout (Free)** | 10s | 10s | No limit |
| **Streaming** | Limited | Limited | Excellent |
| **Cost (Free)** | 100GB | 100GB | $5 credit |
| **Custom Domain** | Free | Free | Paid |

**Recommendation**: Use Netlify for development and small-scale production. For high-traffic streaming applications, Railway provides better performance.