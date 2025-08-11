import type { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const requests = await storage.getProxyRequests();
    res.json(requests);
  } catch (error) {
    console.error('Error fetching proxy requests:', error);
    res.status(500).json({
      error: "Failed to fetch proxy requests"
    });
  }
}