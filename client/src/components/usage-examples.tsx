import { Laptop } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function UsageExamples() {
  return (
    <Card className="bg-surface border-border">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Laptop className="mr-3 text-primary" />
          Usage Examples
        </h3>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* JavaScript Example */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">JavaScript/Fetch</h4>
            <Card className="bg-muted border-border">
              <CardContent className="p-4">
                <pre className="text-sm text-foreground font-mono overflow-x-auto">
{`const streamUrl = 'https://zekonew.newkso.ru/zeko/premium598/mono.m3u8';
const customOrigin = 'https://example.com';
const customReferer = 'https://example.com';

// Encode the URL for the path
const encodedUrl = encodeURIComponent(streamUrl);

// Add custom headers as query parameters
const params = new URLSearchParams({
  origin: customOrigin,
  referer: customReferer
});

let proxyUrl = '/stream/';
if (params.toString()) {
  proxyUrl += \`?\${params.toString()}/\`;
} else {
  proxyUrl += '?/';
}
proxyUrl += encodedUrl;

fetch(proxyUrl)
  .then(response => response.text())
  .then(playlist => {
    console.log('Playlist loaded:', playlist);
  })
  .catch(error => {
    console.error('Stream error:', error);
  });`}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Video.js Example */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">Video.js Integration</h4>
            <Card className="bg-muted border-border">
              <CardContent className="p-4">
                <pre className="text-sm text-foreground font-mono overflow-x-auto">
{`const streamUrl = 'https://zekonew.newkso.ru/zeko/premium598/mono.m3u8';
const encodedUrl = encodeURIComponent(streamUrl);
const params = new URLSearchParams({
  origin: 'https://custom.com',
  referer: 'https://custom.com'
});

const player = videojs('video-player', {
  fluid: true,
  responsive: true,
  sources: [{
    src: \`/stream/\${params.toString() ? '?' + params.toString() : '?'}/\${encodedUrl}\`,
    type: 'application/x-mpegURL'
  }]
});

player.ready(() => {
  console.log('Player ready for streaming');
});`}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* cURL Example */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">cURL</h4>
            <Card className="bg-muted border-border">
              <CardContent className="p-4">
                <pre className="text-sm text-foreground font-mono overflow-x-auto">
{`# Basic request (default headers)
curl -X GET \\
  "https://your-domain.com/stream/https%3A%2F%2Fzekonew.newkso.ru%2Fzeko%2Fpremium598%2Fmono.m3u8" \\
  -H "Accept: application/vnd.apple.mpegurl"

# With custom headers
curl -X GET \\
  "https://your-domain.com/stream/?origin=https://custom.com&referer=https://custom.com/https%3A%2F%2Fexample.com%2Fstream.m3u8" \\
  -H "Accept: application/vnd.apple.mpegurl"`}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* HTML5 Video Example */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">HTML5 Video</h4>
            <Card className="bg-muted border-border">
              <CardContent className="p-4">
                <pre className="text-sm text-foreground font-mono overflow-x-auto">
{`<!-- Basic usage -->
<video controls width="100%" height="auto">
  <source 
    src="/stream/https%3A%2F%2Fzekonew.newkso.ru%2Fzeko%2Fpremium598%2Fmono.m3u8" 
    type="application/x-mpegURL">
  Your browser does not support HLS streaming.
</video>

<!-- With custom headers -->
<video controls width="100%" height="auto">
  <source 
    src="/stream/?origin=https://custom.com&referer=https://custom.com/https%3A%2F%2Fexample.com%2Fstream.m3u8" 
    type="application/x-mpegURL">
  Your browser does not support HLS streaming.
</video>`}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
