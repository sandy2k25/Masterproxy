# M3U8 Proxy Service

A professional M3U8 streaming proxy service built with React and Express.js. The application provides a clean, user-friendly interface for proxying M3U8 streaming URLs with automatic header injection.

## Features

- **Clean URL Format**: `/stream/?origin=...&referer=.../encoded-url.m3u8`
- **Custom Headers**: Configurable origin and referer headers
- **Cross-Platform**: Works on Replit, Vercel, and traditional hosting
- **Modern UI**: Professional dark-themed interface with comprehensive documentation
- **Real-time Demo**: Live demo functionality with URL validation
- **API Documentation**: Built-in API reference and usage examples

## URL Format

The service supports a clean URL structure where:
- Custom headers (origin/referer) come first as query parameters
- The M3U8 URL comes at the very end after the parameters

### Examples

**Without custom headers:**
```
/stream/?/https%3A%2F%2Fexample.com%2Fstream.m3u8
```

**With custom headers:**
```
/stream/?origin=https://custom.com&referer=https://custom.com/https%3A%2F%2Fexample.com%2Fstream.m3u8
```

## Deployment

### Vercel Deployment

This project is optimized for Vercel deployment with serverless functions:

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Configuration:**
   - The `vercel.json` file is already configured
   - Individual serverless functions handle different routes
   - Static files are served from `client/dist`

3. **Environment Variables:**
   - No external dependencies required
   - Uses in-memory storage for fast cold starts

### Replit Deployment

The project runs natively on Replit:

1. Click the "Run" button to start the development server
2. Use Replit's deployment feature for production hosting

### Traditional Hosting

For traditional Node.js hosting:

```bash
npm install
npm run build
npm start
```

## API Endpoints

### POST /api/validate-url
Validates M3U8 URLs and generates proxy URLs.

**Request:**
```json
{
  "url": "https://example.com/stream.m3u8",
  "origin": "https://custom.com",
  "referer": "https://custom.com"
}
```

**Response:**
```json
{
  "valid": true,
  "proxyUrl": "/stream/?origin=https://custom.com&referer=https://custom.com/https%3A%2F%2Fexample.com%2Fstream.m3u8"
}
```

### GET /stream/
Proxies M3U8 streams with custom headers.

### GET /api/proxy-requests
Returns proxy request history.

## Development

```bash
npm install
npm run dev
```

## Architecture

- **Frontend**: React with TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Express.js with TypeScript
- **Storage**: In-memory storage (Vercel-optimized)
- **Build**: Vite for frontend, esbuild for backend
- **Deployment**: Vercel serverless functions

## License

MIT License