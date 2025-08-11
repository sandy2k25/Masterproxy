import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers first
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const targetUrl = 'https://zekonew.newkso.ru/zeko/premium598/mono.m3u8';
    
    // Simple headers that work (based on curl test)
    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://webxzplay.cfd',
        'Referer': 'https://webxzplay.cfd'
      }
    });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Stream fetch failed: ${response.status} ${response.statusText}`,
        url: targetUrl
      });
    }

    const content = await response.text();
    
    // Set response headers
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
    
    // Basic URL rewriting for segments
    const baseUrl = 'https://zekonew.newkso.ru/zeko/premium598';
    const rewrittenContent = content.replace(
      /(^(?!#)[^\r\n]+\.ts)/gm,
      (match) => `/api/segment/${encodeURIComponent(baseUrl + '/' + match)}`
    );

    return res.send(rewrittenContent);

  } catch (error: any) {
    console.error('Proxy error:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message 
    });
  }
}