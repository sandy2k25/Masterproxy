import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // The specific stream URL with required headers
    const targetUrl = 'https://zekonew.newkso.ru/zeko/premium598/mono.m3u8';
    const origin = 'https://webxzplay.cfd';
    const referer = 'https://webxzplay.cfd';

    // Set headers for the request
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': origin,
      'Referer': referer,
      'Accept': '*/*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache'
    };

    // Fetch the M3U8 content
    const response = await fetch(targetUrl, { headers });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch stream: ${response.status} ${response.statusText}` 
      });
    }

    // Set CORS headers for browser compatibility
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', 'application/vnd.apple.mpegurl');
    res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

    const content = await response.text();
    
    // Rewrite URLs in the M3U8 playlist to point back to our proxy
    const baseUrl = 'https://zekonew.newkso.ru/zeko/premium598';
    const rewrittenContent = content.replace(
      /(^(?!#)[^\r\n]+\.(?:m3u8|ts))/gm,
      (match) => {
        if (match.startsWith('http')) return match;
        const fullUrl = `${baseUrl}/${match}`;
        // Route .ts segments through our segment proxy
        return `/api/segment/${encodeURIComponent(fullUrl)}`;
      }
    );

    return res.send(rewrittenContent);

  } catch (error) {
    console.error('Mono.m3u8 proxy error:', error);
    return res.status(500).json({ error: 'Stream temporarily unavailable' });
  }
}