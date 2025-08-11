import { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // Get the URL from the path parameters
    const { url } = req.query;
    const targetUrl = Array.isArray(url) ? url.join('/') : url;

    if (!targetUrl) {
      return res.status(400).json({ error: 'No segment URL provided' });
    }

    const decodedUrl = decodeURIComponent(targetUrl as string);

    // Validate URL
    let segmentUrl: URL;
    try {
      segmentUrl = new URL(decodedUrl);
    } catch {
      return res.status(400).json({ error: 'Invalid segment URL format' });
    }

    // Set headers for the request
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      'Origin': 'https://webxzplay.cfd',
      'Referer': 'https://webxzplay.cfd',
      'Accept': '*/*',
      'Accept-Encoding': 'identity',
      'Range': req.headers.range || ''
    };

    // Remove empty headers
    Object.keys(headers).forEach(key => {
      if (!headers[key]) delete headers[key];
    });

    // Fetch the segment
    const response = await fetch(segmentUrl.toString(), { headers });
    
    if (!response.ok) {
      return res.status(response.status).json({ 
        error: `Failed to fetch segment: ${response.status}` 
      });
    }

    // Set appropriate headers for video segments
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.setHeader('Content-Type', response.headers.get('content-type') || 'video/mp2t');
    
    // Forward range and cache headers if present
    const contentRange = response.headers.get('content-range');
    if (contentRange) {
      res.setHeader('Content-Range', contentRange);
      res.setHeader('Accept-Ranges', 'bytes');
    }

    const cacheControl = response.headers.get('cache-control');
    if (cacheControl) {
      res.setHeader('Cache-Control', cacheControl);
    }

    // Stream the binary content
    const buffer = await response.arrayBuffer();
    return res.send(Buffer.from(buffer));

  } catch (error) {
    console.error('Segment proxy error:', error);
    return res.status(500).json({ error: 'Failed to load video segment' });
  }
}