import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    // Support multiple URL formats:
    // 1. New format: /stream/?origin=...&referer=.../encoded-url.m3u8
    // 2. Legacy query: /stream?url=...
    
    let url = req.query.url as string;
    const { origin, referer } = req.query;
    
    // Check for new format: URL at the end of the query string after '/'
    if (!url && req.url) {
      const urlParts = req.url.split('?')[1]; // Get query string
      if (urlParts && urlParts.includes('/')) {
        const afterSlash = urlParts.split('/').slice(1).join('/');
        if (afterSlash) {
          try {
            url = decodeURIComponent(afterSlash);
          } catch (error) {
            return res.status(400).json({
              error: "Invalid URL encoding",
              message: "Failed to decode URL from new format"
            });
          }
        }
      }
    }
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        error: "Invalid URL",
        message: "URL parameter is required and must be a valid M3U8 URL"
      });
    }

    // Validate M3U8 URL
    if (!url.includes('.m3u8') && !url.includes('.ts')) {
      return res.status(400).json({
        error: "Invalid URL",
        message: "URL must be a valid M3U8 or segment URL"
      });
    }

    // Log the proxy request
    await storage.logProxyRequest({
      originalUrl: url,
      proxyUrl: `/stream?url=${encodeURIComponent(url)}`
    });

    // Use custom headers if provided, otherwise use default webxzplay.cfd
    const headers = {
      'Origin': (origin && typeof origin === 'string') ? origin : 'https://webxzplay.cfd',
      'Referer': (referer && typeof referer === 'string') ? referer : 'https://webxzplay.cfd',
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
    };

    // Fetch the content with predefined headers
    const response = await fetch(url, { headers });
    
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Stream fetch failed",
        message: `Failed to fetch stream: ${response.statusText}`
      });
    }

    const contentType = response.headers.get('content-type');
    const content = await response.text();

    // If it's an M3U8 playlist, rewrite segment URLs to use our proxy
    if (url.includes('.m3u8')) {
      const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
      const rewrittenContent = content
        .split('\n')
        .map(line => {
          // Rewrite segment URLs
          if (line.trim() && !line.startsWith('#') && !line.startsWith('http')) {
            const segmentUrl = baseUrl + line.trim();
            
            // Handle segment URLs with new format
            const encodedSegmentUrl = encodeURIComponent(segmentUrl);
            const params = new URLSearchParams();
            if (origin && typeof origin === 'string') params.append('origin', origin);
            if (referer && typeof referer === 'string') params.append('referer', referer);
            
            let proxyUrl = '/stream/';
            if (params.toString()) {
              proxyUrl += `?${params.toString()}/`;
            } else {
              proxyUrl += '?/';
            }
            proxyUrl += encodedSegmentUrl;
            
            return proxyUrl;
          }
          return line;
        })
        .join('\n');

      res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Headers', '*');
      return res.send(rewrittenContent);
    }

    // For video segments, just proxy the content
    res.setHeader('Content-Type', contentType || 'video/mp2t');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', '*');
    return res.send(Buffer.from(content, 'binary'));

  } catch (error) {
    console.error('Proxy error:', error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to proxy the stream"
    });
  }
}