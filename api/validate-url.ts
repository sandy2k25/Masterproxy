import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { url, origin, referer } = req.body;
    
    if (!url || typeof url !== 'string') {
      return res.status(400).json({
        valid: false,
        message: "URL is required"
      });
    }

    if (!url.includes('.m3u8')) {
      return res.status(400).json({
        valid: false,
        message: "URL must be a valid M3U8 stream"
      });
    }

    try {
      new URL(url);
    } catch {
      return res.status(400).json({
        valid: false,
        message: "Invalid URL format"
      });
    }

    // Build proxy URL with format: /stream/?origin=...&referer=.../encoded-url.m3u8
    const encodedUrl = encodeURIComponent(url);
    
    // Build the URL: /stream/?origin=...&referer=.../encoded-url
    let proxyUrl = `/stream/`;
    
    const params = new URLSearchParams();
    if (origin && typeof origin === 'string') params.append('origin', origin);
    if (referer && typeof referer === 'string') params.append('referer', referer);
    
    if (params.toString()) {
      proxyUrl += `?${params.toString()}/`;
    } else {
      proxyUrl += '?/';
    }
    proxyUrl += encodedUrl;

    res.json({
      valid: true,
      proxyUrl: proxyUrl
    });
  } catch (error) {
    console.error('Validation error:', error);
    res.status(500).json({
      valid: false,
      message: "Server error during validation"
    });
  }
}