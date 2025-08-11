import { Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default function ApiDocs() {
  return (
    <Card className="bg-surface border-border">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Code className="mr-3 text-secondary" />
          API Reference
        </h3>

        <div className="space-y-8">
          {/* Endpoint Documentation */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">Proxy Endpoint</h4>
            <Card className="bg-muted border-border">
              <CardContent className="p-4">
                <div className="flex items-center space-x-3 mb-3">
                  <Badge className="bg-accent text-accent-foreground">GET</Badge>
                  <span className="font-mono text-accent">/stream/[encoded-url]</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">Proxies M3U8 streams with automatic header injection. URL is encoded in the path, headers as query parameters.</p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">URL Structure</h5>
                    <Card className="bg-background border-border">
                      <CardContent className="p-3">
                        <div className="font-mono text-sm space-y-2">
                          <div>
                            <span className="text-primary">[encoded-url]</span>
                            <span className="text-muted-foreground"> (path): </span>
                            <span className="text-foreground">URL-encoded M3U8 stream URL</span>
                          </div>
                          <div>
                            <span className="text-primary">origin</span>
                            <span className="text-muted-foreground"> (query, optional): </span>
                            <span className="text-foreground">Custom Origin header (defaults to webxzplay.cfd)</span>
                          </div>
                          <div>
                            <span className="text-primary">referer</span>
                            <span className="text-muted-foreground"> (query, optional): </span>
                            <span className="text-foreground">Custom Referer header (defaults to webxzplay.cfd)</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">Example Requests</h5>
                    <Card className="bg-background border-border">
                      <CardContent className="p-3">
                        <div className="space-y-3">
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">Basic request (uses default headers):</div>
                            <pre className="font-mono text-sm">
                              <span className="text-muted-foreground">GET </span>
                              <span className="text-accent">/stream/https%3A%2F%2Fzekonew.newkso.ru%2Fzeko%2Fpremium598%2Fmono.m3u8</span>
                            </pre>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground mb-1">With custom headers:</div>
                            <pre className="font-mono text-sm">
                              <span className="text-muted-foreground">GET </span>
                              <span className="text-accent">/stream/https%3A%2F%2Fexample.com%2Fstream.m3u8?origin=https://custom.com&referer=https://custom.com</span>
                            </pre>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">Headers Applied to Upstream Request</h5>
                    <Card className="bg-background border-border">
                      <CardContent className="p-3">
                        <div className="font-mono text-sm space-y-1">
                          <div><span className="text-primary">Origin:</span> <span className="text-accent">Custom value or https://webxzplay.cfd (default)</span></div>
                          <div><span className="text-primary">Referer:</span> <span className="text-accent">Custom value or https://webxzplay.cfd (default)</span></div>
                          <div><span className="text-primary">User-Agent:</span> <span className="text-accent">Mozilla/5.0 (Windows NT 10.0; Win64; x64)...</span></div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Response Examples */}
          <div>
            <h4 className="text-lg font-semibold mb-4 text-accent">Response Examples</h4>
            <div className="grid lg:grid-cols-2 gap-6">
              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">Success Response</h5>
                <Card className="bg-muted border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge className="bg-accent text-accent-foreground">200 OK</Badge>
                      <span className="text-xs text-muted-foreground">Content-Type: application/vnd.apple.mpegurl</span>
                    </div>
                    <pre className="text-xs text-foreground font-mono overflow-x-auto">
{`#EXTM3U
#EXT-X-VERSION:3
#EXT-X-TARGETDURATION:10
#EXTINF:10.0,
segment001.ts
#EXTINF:10.0,
segment002.ts
#EXT-X-ENDLIST`}
                    </pre>
                  </CardContent>
                </Card>
              </div>

              <div>
                <h5 className="text-sm font-semibold text-foreground mb-2">Error Response</h5>
                <Card className="bg-muted border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-2 mb-3">
                      <Badge variant="destructive">400 Bad Request</Badge>
                      <span className="text-xs text-muted-foreground">Content-Type: application/json</span>
                    </div>
                    <pre className="text-xs text-foreground font-mono">
{`{
  "error": "Invalid URL",
  "message": "URL parameter is required and must be a valid M3U8 URL"
}`}
                    </pre>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
