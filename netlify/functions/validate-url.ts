import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // URL validation endpoint for Netlify
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: JSON.stringify({ error: 'Method not allowed' }),
    };
  }

  // Handle CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  try {
    const body = JSON.parse(event.body || '{}');
    const { url, origin, referer } = body;

    if (!url) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'URL is required' }),
      };
    }

    // Basic URL validation
    try {
      new URL(url);
    } catch {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'Invalid URL format' }),
      };
    }

    // Check if it's likely an M3U8 URL
    const isM3U8 = url.includes('.m3u8') || url.includes('m3u8');
    
    if (!isM3U8) {
      return {
        statusCode: 400,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
        body: JSON.stringify({ error: 'URL does not appear to be an M3U8 stream' }),
      };
    }

    // Generate proxy URL
    const baseUrl = `https://${event.headers.host}`;
    const encodedUrl = encodeURIComponent(url);
    
    let proxyUrl = `${baseUrl}/stream/`;
    const params = new URLSearchParams();
    
    if (origin) params.append('origin', origin);
    if (referer) params.append('referer', referer);
    
    if (params.toString()) {
      proxyUrl += `?${params.toString()}/${encodedUrl}`;
    } else {
      proxyUrl += `?/${encodedUrl}`;
    }

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        valid: true,
        proxyUrl,
        originalUrl: url,
        headers: { origin, referer },
      }),
    };

  } catch (error) {
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ 
        error: 'Internal Server Error',
        message: error instanceof Error ? error.message : 'Unknown error'
      }),
    };
  }
};