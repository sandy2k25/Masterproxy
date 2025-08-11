import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

export async function registerRoutes(app: Express): Promise<Server> {
  // Proxy endpoint for M3U8 streams - supports /stream/[encoded-url]?origin=...&referer=....m3u8
  app.get(["/stream/:encodedUrl", "/stream/:encodedUrl.m3u8", "/stream/:encodedUrl.ts"], async (req, res) => {
    try {
      // Support both query parameter and path parameter formats
      let url = req.query.url as string;
      const { origin, referer } = req.query;
      
      // If URL is in path parameter, decode it and reconstruct with extension
      if (req.params.encodedUrl && !url) {
        try {
          let decodedUrl = decodeURIComponent(req.params.encodedUrl);
          
          // Add extension based on the route matched
          if (req.path.endsWith('.m3u8')) {
            decodedUrl += '.m3u8';
          } else if (req.path.endsWith('.ts')) {
            decodedUrl += '.ts';
          }
          
          url = decodedUrl;
        } catch (error) {
          return res.status(400).json({
            error: "Invalid URL encoding",
            message: "Failed to decode URL from path parameter"
          });
        }
      }
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({
          error: "Invalid URL",
          message: "URL parameter is required and must be a valid M3U8 URL"
        });
      }

      // Validate M3U8 URL
      if (!url.includes('.m3u8') && !url.includes('.ts')) {
        return res.status(400).json({
          error: "Invalid URL",
          message: "URL must be a valid M3U8 or segment URL"
        });
      }

      // Log the proxy request
      await storage.logProxyRequest({
        originalUrl: url,
        proxyUrl: `/stream?url=${encodeURIComponent(url)}`
      });

      // Use custom headers if provided, otherwise use default webxzplay.cfd
      const headers = {
        'Origin': (origin && typeof origin === 'string') ? origin : 'https://webxzplay.cfd',
        'Referer': (referer && typeof referer === 'string') ? referer : 'https://webxzplay.cfd',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      };

      // Fetch the content with predefined headers
      const response = await fetch(url, { headers });
      
      if (!response.ok) {
        return res.status(response.status).json({
          error: "Stream fetch failed",
          message: `Failed to fetch stream: ${response.statusText}`
        });
      }

      const contentType = response.headers.get('content-type');
      const content = await response.text();

      // If it's an M3U8 playlist, rewrite segment URLs to use our proxy
      if (url.includes('.m3u8')) {
        const baseUrl = url.substring(0, url.lastIndexOf('/') + 1);
        const rewrittenContent = content
          .split('\n')
          .map(line => {
            // Rewrite segment URLs
            if (line.trim() && !line.startsWith('#') && !line.startsWith('http')) {
              const segmentUrl = baseUrl + line.trim();
              
              // Handle segment URLs with new format
              let segmentBaseUrl = segmentUrl;
              let segmentExtension = '';
              
              if (segmentUrl.endsWith('.ts')) {
                segmentBaseUrl = segmentUrl.slice(0, -3);
                segmentExtension = '.ts';
              } else if (segmentUrl.endsWith('.m3u8')) {
                segmentBaseUrl = segmentUrl.slice(0, -5);
                segmentExtension = '.m3u8';
              }
              
              const encodedSegmentUrl = encodeURIComponent(segmentBaseUrl);
              const params = new URLSearchParams();
              if (origin && typeof origin === 'string') params.append('origin', origin);
              if (referer && typeof referer === 'string') params.append('referer', referer);
              const queryString = params.toString();
              
              return `/stream/${encodedSegmentUrl}${queryString ? '?' + queryString : ''}${segmentExtension}`;
            }
            return line;
          })
          .join('\n');

        res.set('Content-Type', 'application/vnd.apple.mpegurl');
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Access-Control-Allow-Headers', '*');
        return res.send(rewrittenContent);
      }

      // For video segments, just proxy the content
      res.set('Content-Type', contentType || 'video/mp2t');
      res.set('Access-Control-Allow-Origin', '*');
      res.set('Access-Control-Allow-Headers', '*');
      return res.send(Buffer.from(content, 'binary'));

    } catch (error) {
      console.error('Proxy error:', error);
      return res.status(500).json({
        error: "Internal server error",
        message: "Failed to proxy the stream"
      });
    }
  });

  // API endpoint to validate URLs
  app.post("/api/validate-url", async (req, res) => {
    try {
      const { url, origin, referer } = req.body;
      
      if (!url || typeof url !== 'string') {
        return res.status(400).json({
          valid: false,
          message: "URL is required"
        });
      }

      if (!url.includes('.m3u8')) {
        return res.status(400).json({
          valid: false,
          message: "URL must be a valid M3U8 stream"
        });
      }

      try {
        new URL(url);
      } catch {
        return res.status(400).json({
          valid: false,
          message: "Invalid URL format"
        });
      }

      // Build proxy URL with format: /stream/[url-without-extension]?origin=...&referer=....m3u8
      let baseUrl = url;
      let extension = '';
      
      // Extract extension if present
      if (url.endsWith('.m3u8')) {
        baseUrl = url.slice(0, -5); // Remove .m3u8
        extension = '.m3u8';
      } else if (url.endsWith('.ts')) {
        baseUrl = url.slice(0, -3); // Remove .ts
        extension = '.ts';
      }
      
      const encodedBaseUrl = encodeURIComponent(baseUrl);
      
      // Build the URL properly: /stream/[encoded-url]?params.extension
      let proxyUrl = `/stream/${encodedBaseUrl}`;
      
      const params = new URLSearchParams();
      if (origin && typeof origin === 'string') params.append('origin', origin);
      if (referer && typeof referer === 'string') params.append('referer', referer);
      
      if (params.toString()) {
        proxyUrl += `?${params.toString()}`;
      }
      proxyUrl += extension;

      res.json({
        valid: true,
        proxyUrl: proxyUrl
      });
    } catch (error) {
      console.error('Validation error:', error);
      res.status(500).json({
        valid: false,
        message: "Server error during validation"
      });
    }
  });

  // Get proxy request history
  app.get("/api/proxy-requests", async (req, res) => {
    try {
      const requests = await storage.getProxyRequests();
      res.json(requests);
    } catch (error) {
      console.error('Error fetching proxy requests:', error);
      res.status(500).json({
        error: "Failed to fetch proxy requests"
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
