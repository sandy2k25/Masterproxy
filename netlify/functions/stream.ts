import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Basic proxy streaming functionality for Netlify
  try {
    const url = event.path.replace('/stream', '') || '/';
    const queryParams = event.queryStringParameters || {};
    
    // Extract URL from the path/query parameters
    let targetUrl = '';
    let origin = '';
    let referer = '';
    
    // Parse the URL from various formats
    if (url.startsWith('/')) {
      const parts = url.substring(1).split('/');
      if (parts.length > 0) {
        targetUrl = decodeURIComponent(parts[parts.length - 1]);
      }
    }
    
    // Extract headers from query parameters
    if (queryParams.origin) {
      origin = queryParams.origin;
    }
    if (queryParams.referer) {
      referer = queryParams.referer;
    }
    
    if (!targetUrl || !targetUrl.includes('m3u8')) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ error: 'Invalid M3U8 URL' }),
      };
    }
    
    // Fetch the stream with custom headers
    const headers: Record<string, string> = {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
    };
    
    if (origin) headers['Origin'] = origin;
    if (referer) headers['Referer'] = referer;
    
    const response = await fetch(targetUrl, { headers });
    
    if (!response.ok) {
      return {
        statusCode: response.status,
        body: JSON.stringify({ error: 'Failed to fetch stream' }),
      };
    }
    
    const contentType = response.headers.get('content-type') || 'application/vnd.apple.mpegurl';
    const content = await response.text();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': contentType,
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': '*',
        'Cache-Control': 'no-cache',
      },
      body: content,
    };
    
  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};