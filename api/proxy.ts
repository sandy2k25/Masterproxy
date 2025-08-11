import type { VercelRequest, VercelResponse } from '@vercel/node';

export default function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  const { url, origin, referer } = req.query;
  
  if (!url) {
    return res.status(400).json({ error: 'URL parameter required' });
  }
  
  if (typeof url !== 'string') {
    return res.status(400).json({ error: 'Invalid URL parameter' });
  }
  
  if (!url.includes('.m3u8') && !url.includes('.ts')) {
    return res.status(400).json({ error: 'Must be M3U8 or segment file' });
  }
  
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    'Origin': typeof origin === 'string' ? origin : 'https://webxzplay.cfd',
    'Referer': typeof referer === 'string' ? referer : 'https://webxzplay.cfd'
  };
  
  fetch(url, { headers })
    .then(async response => {
      if (!response.ok) {
        res.status(response.status).json({ error: `Fetch failed: ${response.status}` });
        return;
      }
      
      const contentType = response.headers.get('content-type') || 'application/octet-stream';
      res.setHeader('Access-Control-Allow-Origin', '*');
      
      if (url.includes('.m3u8')) {
        const content = await response.text();
        res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
        res.send(content);
      } else {
        const buffer = await response.arrayBuffer();
        res.setHeader('Content-Type', contentType);
        res.send(Buffer.from(buffer));
      }
    })
    .catch(error => {
      console.error('Proxy error:', error);
      res.status(500).json({ error: 'Proxy failed', message: String(error) });
    });
}