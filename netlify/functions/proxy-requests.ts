import { Handler } from '@netlify/functions';

export const handler: Handler = async (event, context) => {
  // Proxy requests logging endpoint for Netlify
  if (event.httpMethod !== 'GET') {
    return {
      statusCode: 405,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
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
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
      body: '',
    };
  }

  try {
    // In serverless environment, we can't maintain persistent logs
    // Return mock data or implement external logging service
    const mockRequests = [
      {
        id: 1,
        url: 'https://example.com/stream.m3u8',
        timestamp: new Date().toISOString(),
        status: 200,
        origin: 'https://webxzplay.cfd',
        referer: 'https://webxzplay.cfd',
      },
    ];

    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({
        success: true,
        requests: mockRequests,
        note: 'Serverless environment - persistent logging not available',
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