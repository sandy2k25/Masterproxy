import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  try {
    // Get URL from query parameters
    const url = req.query.url as string;
    
    if (!url) {
      return res.status(400).json({
        error: "Missing URL parameter"
      });
    }

    // Simple validation
    if (!url.includes('.m3u8') && !url.includes('.ts')) {
      return res.status(400).json({
        error: "URL must be M3U8 or segment file"
      });
    }

    // Basic headers
    const headers = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    };

    // Simple fetch without timeout
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: `Failed to fetch: ${response.status}`
      });
    }

    // Handle content type
    const contentType = response.headers.get('content-type') || 'application/octet-stream';
    
    if (url.includes('.m3u8')) {
      const content = await response.text();
      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.send(content);
    } else {
      const buffer = await response.arrayBuffer();
      res.setHeader('Content-Type', contentType);
      res.setHeader('Access-Control-Allow-Origin', '*');
      return res.send(Buffer.from(buffer));
    }

  } catch (error) {
    console.error('Simple proxy error:', error);
    return res.status(500).json({
      error: "Proxy failed",
      message: String(error)
    });
  }
}