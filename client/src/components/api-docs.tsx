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
                  <span className="font-mono text-accent">/stream</span>
                </div>
                <p className="text-muted-foreground text-sm mb-4">Proxies M3U8 streams with automatic header injection</p>
                
                <div className="space-y-4">
                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">Query Parameters</h5>
                    <Card className="bg-background border-border">
                      <CardContent className="p-3">
                        <div className="font-mono text-sm">
                          <span className="text-primary">url</span>
                          <span className="text-muted-foreground"> (required): </span>
                          <span className="text-foreground">The M3U8 stream URL to proxy</span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">Example Request</h5>
                    <Card className="bg-background border-border">
                      <CardContent className="p-3">
                        <pre className="font-mono text-sm">
                          <span className="text-muted-foreground">GET </span>
                          <span className="text-accent">/stream?url=https://zekonew.newkso.ru/zeko/premium598/mono.m3u8</span>
                        </pre>
                      </CardContent>
                    </Card>
                  </div>

                  <div>
                    <h5 className="text-sm font-semibold text-foreground mb-2">Applied Headers</h5>
                    <Card className="bg-background border-border">
                      <CardContent className="p-3">
                        <div className="font-mono text-sm space-y-1">
                          <div><span className="text-primary">Origin:</span> <span className="text-accent">https://webxzplay.cfd</span></div>
                          <div><span className="text-primary">Referer:</span> <span className="text-accent">https://webxzplay.cfd</span></div>
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
