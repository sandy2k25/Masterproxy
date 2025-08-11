import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Test the stream URL with different header combinations
  const targetUrl = 'https://zekonew.newkso.ru/zeko/premium598/mono.m3u8';
  const testConfigs = [
    {
      name: 'Full headers',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Origin': 'https://webxzplay.cfd',
        'Referer': 'https://webxzplay.cfd',
        'Accept': 'application/x-mpegURL, application/vnd.apple.mpegurl, */*',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    },
    {
      name: 'Minimal headers',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Referer': 'https://webxzplay.cfd'
      }
    },
    {
      name: 'Just User-Agent',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    },
    {
      name: 'No headers',
      headers: {}
    }
  ];

  const results = [];

  for (const config of testConfigs) {
    try {
      const response = await fetch(targetUrl, { 
        headers: config.headers,
        method: 'GET'
      });
      
      results.push({
        config: config.name,
        status: response.status,
        statusText: response.statusText,
        success: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
        contentType: response.headers.get('content-type')
      });
    } catch (error: any) {
      results.push({
        config: config.name,
        error: error.message,
        success: false
      });
    }
  }

  return res.json({
    targetUrl,
    testResults: results,
    timestamp: new Date().toISOString()
  });
}