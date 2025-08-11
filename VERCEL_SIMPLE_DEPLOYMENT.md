# Simple Vercel Deployment for M3U8 Streaming

Deploy your M3U8 proxy to Vercel with clean URLs that work with required headers automatically.

## 🎯 Example Usage

After deployment, your stream will be accessible at:
```
https://your-vercel-site.vercel.app/mono.m3u8
```

If you get a 503 error, try the simplified version:
```
https://your-vercel-site.vercel.app/mono-simple.m3u8
```

This automatically proxies:
```
https://zekonew.newkso.ru/zeko/premium598/mono.m3u8|origin=https://webxzplay.cfd&referer=https://webxzplay.cfd
```

## 🚀 Quick Deployment

### Step 1: Deploy to Vercel

1. **Connect GitHub**: Link your repository to Vercel
2. **Import Project**: Select your M3U8 proxy repository
3. **Deploy**: Vercel automatically builds and deploys

### Step 2: Test Your Stream

Visit your deployed URL:
```
https://your-project-name.vercel.app/mono.m3u8
```

## 📋 How It Works

### Clean URL Structure
```
https://your-site.vercel.app/mono.m3u8
├── Automatically adds Origin: https://webxzplay.cfd
├── Automatically adds Referer: https://webxzplay.cfd  
├── Handles M3U8 playlist parsing
└── Proxies .ts video segments
```

### Automatic Header Injection
Your deployment includes pre-configured headers:
- **Origin**: `https://webxzplay.cfd`
- **Referer**: `https://webxzplay.cfd`
- **User-Agent**: Modern Chrome browser
- **CORS**: Full cross-origin support

### File Mapping
The system maps clean URLs to actual streaming sources:

| Clean URL | Actual Stream URL |
|-----------|-------------------|
| `/mono.m3u8` | `https://zekonew.newkso.ru/zeko/premium598/mono.m3u8` |

## 🛠️ Technical Details

### API Endpoints Created

**Main M3U8 Handler**: `/api/mono.m3u8.ts`
- Fetches the original M3U8 playlist
- Injects required headers automatically  
- Rewrites segment URLs to proxy through Vercel
- Returns clean M3U8 content

**Segment Handler**: `/api/segment/[...url].ts`
- Handles .ts video segment requests
- Maintains required headers for each segment
- Supports range requests for seeking
- Returns binary video data

### Vercel Configuration

The `vercel.json` includes:
```json
{
  "functions": {
    "api/mono.m3u8.ts": { "maxDuration": 30 },
    "api/segment/[...url].ts": { "maxDuration": 30 }
  },
  "routes": [
    { "src": "/mono.m3u8", "dest": "/api/mono.m3u8.ts" },
    { "src": "/api/segment/(.*)", "dest": "/api/segment/[...url].ts" }
  ]
}
```

## 🎬 Using Your Stream

### In HTML5 Video Player
```html
<video controls>
  <source src="https://your-site.vercel.app/mono.m3u8" type="application/x-mpegURL">
</video>
```

### In HLS.js
```javascript
import Hls from 'hls.js';

const video = document.getElementById('video');
const hls = new Hls();
hls.loadSource('https://your-site.vercel.app/mono.m3u8');
hls.attachMedia(video);
```

### In Video.js
```javascript
videojs('my-player', {
  sources: [{
    src: 'https://your-site.vercel.app/mono.m3u8',
    type: 'application/x-mpegURL'
  }]
});
```

## 🔧 Adding More Streams

To add additional streams, update `/api/mono.m3u8.ts`:

```typescript
const fileMapping: Record<string, { url: string; origin: string; referer: string }> = {
  'mono.m3u8': {
    url: 'https://zekonew.newkso.ru/zeko/premium598/mono.m3u8',
    origin: 'https://webxzplay.cfd',
    referer: 'https://webxzplay.cfd'
  },
  'another-stream.m3u8': {
    url: 'https://example.com/stream.m3u8',
    origin: 'https://required-origin.com',
    referer: 'https://required-referer.com'
  }
};
```

Then add the route to `vercel.json`:
```json
{
  "src": "/another-stream.m3u8",
  "dest": "/api/mono.m3u8.ts"
}
```

## 📊 Vercel Limits

### Free Tier
- **Function Duration**: 10 seconds
- **Bandwidth**: 100GB/month
- **Requests**: 12,000/hour

### Pro Tier ($20/month)
- **Function Duration**: 60 seconds
- **Bandwidth**: 1TB/month
- **Requests**: Unlimited

## 🔒 Security Features

### CORS Headers
- Full cross-origin support
- Works in all browsers
- No preflight issues

### Header Protection
- Origin/Referer headers handled server-side
- No client-side header exposure
- Bypass restrictions automatically

## ✅ Benefits

- **Clean URLs**: No complex query parameters
- **Automatic Headers**: Required headers injected server-side
- **Fast Deployment**: Deploy in under 2 minutes
- **Global CDN**: Vercel's edge network
- **HTTPS**: Automatic SSL certificates
- **Zero Config**: Works out of the box

Your M3U8 streams will work perfectly with this simple Vercel deployment!