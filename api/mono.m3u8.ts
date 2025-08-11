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
    // The specific stream URL with required headers
    const targetUrl = 'https://zekonew.newkso.ru/zeko/premium598/mono.m3u8';
    const origin = 'https://webxzplay.cfd';
    const referer = 'https://webxzplay.cfd';

    // Simple headers that work based on curl test
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': origin,
      'Referer': referer
    };

    // Fetch the M3U8 content with timeout and retry logic
    let response: Response;
    try {
      response = await fetch(targetUrl, { 
        headers,
        method: 'GET',
        redirect: 'follow'
      });
    } catch (fetchError) {
      console.error('Fetch error:', fetchError);
      return res.status(503).json({ 
        error: 'Stream server unavailable',
        details: 'Unable to connect to the streaming server'
      });
    }
    
    if (!response.ok) {
      console.error(`Stream fetch failed: ${response.status} ${response.statusText}`);
      console.error('Response headers:', Object.fromEntries(response.headers.entries()));
      
      // Try alternative approach with minimal headers
      try {
        const fallbackResponse = await fetch(targetUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
            'Referer': referer
          }
        });
        
        if (fallbackResponse.ok) {
          response = fallbackResponse;
        } else {
          return res.status(response.status).json({ 
            error: `Stream unavailable: ${response.status} ${response.statusText}`,
            originalUrl: targetUrl,
            headers: {origin, referer}
          });
        }
      } catch {
        return res.status(503).json({ 
          error: 'Stream server is blocking requests',
          suggestion: 'The streaming server may be down or blocking proxy requests'
        });
      }
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