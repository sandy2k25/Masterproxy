import type { VercelRequest, VercelResponse } from '@vercel/node';

// Note: In serverless environment, each function invocation is independent
// This returns empty data as storage is not persistent across function calls

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    // In serverless environment, return empty array since storage is not persistent
    res.json([]);
  } catch (error) {
    console.error('Error fetching proxy requests:', error);
    res.status(500).json({
      error: "Failed to fetch proxy requests"
    });
  }
}