# Vercel M3U8 Proxy Troubleshooting

## Common Issues and Solutions

### 1. 503 Service Unavailable Error

**Problem**: `{"error":"Failed to fetch stream: 503 Service Unavailable"}`

**Root Causes**:
- Vercel serverless function timeout (10 seconds on free tier)
- Origin server blocking Vercel IP addresses
- Too many headers causing request rejection
- Cold start delays

**Solutions**:

#### Quick Fix: Use the Simple Endpoint
Instead of `/mono.m3u8`, try:
```
https://your-vercel-site.vercel.app/mono-simple.m3u8
```

This uses minimal headers and better error handling.

#### Test Stream Availability
Check if the stream is accessible:
```
https://your-vercel-site.vercel.app/test-stream
```

This endpoint tests multiple header combinations.

#### Fix 1: Upgrade Vercel Plan
- **Free Tier**: 10-second timeout
- **Pro Tier**: 60-second timeout ($20/month)

#### Fix 2: Optimize Headers
The working curl command shows minimal headers work:
```bash
curl -H "Origin: https://webxzplay.cfd" -H "Referer: https://webxzplay.cfd" URL
```

#### Fix 3: Use Alternative Deployment
If Vercel continues having issues, try:
- **Railway**: No timeout limits, better for streaming
- **Ubuntu VPS**: Full control, no serverless restrictions

### 2. CORS Errors

**Problem**: `Cross-origin request blocked`

**Solution**: All endpoints include CORS headers:
```javascript
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
res.setHeader('Access-Control-Allow-Headers', '*');
```

### 3. Segment Loading Issues

**Problem**: M3U8 loads but video segments fail

**Solution**: Ensure segment proxy is working:
- Test: `https://your-site.vercel.app/api/segment/[encoded-url]`
- Check segment rewriting in M3U8 content
- Verify base URL construction

### 4. Stream Server Blocking

**Problem**: Server returns 403/503 errors

**Potential Causes**:
- Vercel IP ranges are blocked
- Too many requests from same IP
- Required headers missing or incorrect

**Solutions**:

#### Check Stream Status Manually
```bash
curl -I "https://zekonew.newkso.ru/zeko/premium598/mono.m3u8" \
     -H "Origin: https://webxzplay.cfd" \
     -H "Referer: https://webxzplay.cfd"
```

#### Use Different Headers
Try these header combinations:
1. **Full browser simulation**:
   ```
   Origin: https://webxzplay.cfd
   Referer: https://webxzplay.cfd
   User-Agent: Mozilla/5.0... (full string)
   Accept: application/x-mpegURL
   ```

2. **Minimal approach**:
   ```
   Referer: https://webxzplay.cfd
   User-Agent: Mozilla/5.0... (simple)
   ```

3. **Just User-Agent**:
   ```
   User-Agent: Mozilla/5.0...
   ```

### 5. Development vs Production Issues

**Problem**: Works locally but fails on Vercel

**Common Causes**:
- Environment differences
- Vercel edge locations have different IPs
- Different Node.js versions
- Timeout limits

**Solutions**:
- Test with `vercel dev` locally
- Check Vercel function logs
- Use shorter timeout functions
- Add extensive error logging

## Testing Your Deployment

### 1. Test Stream Access
```bash
# Test direct stream access
curl "https://your-site.vercel.app/mono.m3u8"

# Test simple version
curl "https://your-site.vercel.app/mono-simple.m3u8"

# Test stream diagnostic
curl "https://your-site.vercel.app/test-stream"
```

### 2. Test in Browser
```javascript
// Test M3U8 loading
fetch('https://your-site.vercel.app/mono.m3u8')
  .then(response => response.text())
  .then(console.log)
  .catch(console.error);
```

### 3. Test with Video Player
```html
<video controls>
  <source src="https://your-site.vercel.app/mono.m3u8" type="application/x-mpegURL">
</video>
```

## Alternative Solutions

### If Vercel Doesn't Work

1. **Railway Deployment** ($5/month)
   - No serverless limitations
   - Better for streaming applications
   - See `RAILWAY_DEPLOYMENT.md`

2. **Ubuntu VPS** ($5-20/month)
   - Full control and optimization
   - No timeout restrictions
   - See `UBUNTU_VPS_DEPLOYMENT.md`

3. **DomCloud** ($1-10/month)
   - Budget-friendly option
   - Traditional hosting
   - See `DOMCLOUD_DEPLOYMENT.md`

### Hybrid Approach
Use Vercel for the frontend and Railway/VPS for the streaming API:
```javascript
// Point to external streaming API
const streamUrl = 'https://your-railway-app.railway.app/mono.m3u8';
```

## Getting Help

If issues persist:

1. **Check Vercel Function Logs**:
   - Go to Vercel dashboard → Functions → View logs
   - Look for specific error messages

2. **Test Original Stream**:
   - Verify the source stream is still accessible
   - Check if headers requirements have changed

3. **Contact Support**:
   - Provide exact error messages
   - Include function logs
   - Share test URLs

Your M3U8 proxy should work with these troubleshooting steps!