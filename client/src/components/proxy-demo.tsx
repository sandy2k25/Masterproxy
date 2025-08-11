import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Terminal, ArrowRight, Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ValidationResponse {
  valid: boolean;
  message?: string;
  proxyUrl?: string;
}

export default function ProxyDemo() {
  const [streamUrl, setStreamUrl] = useState("https://zekonew.newkso.ru/zeko/premium598/mono.m3u8");
  const [origin, setOrigin] = useState("https://webxzplay.cfd");
  const [referer, setReferer] = useState("https://webxzplay.cfd");
  const [generatedUrl, setGeneratedUrl] = useState("");
  const [status, setStatus] = useState("Ready to stream");
  const { toast } = useToast();

  const validateMutation = useMutation({
    mutationFn: async (data: { url: string; origin?: string; referer?: string }): Promise<ValidationResponse> => {
      const response = await apiRequest("POST", "/api/validate-url", data);
      return response.json();
    },
    onSuccess: (data) => {
      if (data.valid && data.proxyUrl) {
        setGeneratedUrl(data.proxyUrl);
        setStatus("Proxy URL generated successfully");
        toast({
          title: "Success",
          description: "Proxy URL generated successfully",
        });
      } else {
        setStatus(data.message || "URL validation failed");
        toast({
          title: "Error",
          description: data.message || "URL validation failed",
          variant: "destructive",
        });
      }
    },
    onError: (error) => {
      setStatus("Failed to validate URL");
      toast({
        title: "Error",
        description: "Failed to validate URL",
        variant: "destructive",
      });
    },
  });

  const handleGenerateUrl = () => {
    if (!streamUrl.trim()) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      });
      return;
    }
    
    if (!streamUrl.includes('.m3u8')) {
      toast({
        title: "Error",
        description: "Please enter a valid M3U8 URL",
        variant: "destructive",
      });
      return;
    }

    validateMutation.mutate({ 
      url: streamUrl, 
      origin: origin.trim() || undefined, 
      referer: referer.trim() || undefined 
    });
  };

  const copyToClipboard = async () => {
    if (generatedUrl) {
      await navigator.clipboard.writeText(window.location.origin + generatedUrl);
      toast({
        title: "Copied",
        description: "URL copied to clipboard",
      });
    }
  };

  const testStream = () => {
    if (generatedUrl) {
      window.open(window.location.origin + generatedUrl, '_blank');
    }
  };

  return (
    <Card className="bg-surface border-border">
      <CardContent className="p-8">
        <h3 className="text-2xl font-bold mb-6 flex items-center">
          <Terminal className="mr-3 text-accent" />
          Live Demo
        </h3>
        
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-3">
              M3U8 Stream URL
            </Label>
            <div className="relative">
              <Input
                type="url"
                placeholder="https://zekonew.newkso.ru/zeko/premium598/mono.m3u8"
                value={streamUrl}
                onChange={(e) => setStreamUrl(e.target.value)}
                className="w-full bg-muted border-border text-white placeholder-muted-foreground font-mono text-sm"
              />
            </div>
            
            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Custom Headers</h4>
              <div className="space-y-4">
                <div>
                  <Label className="block text-xs font-medium text-muted-foreground mb-2">
                    Origin
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://webxzplay.cfd"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-muted border-border text-white placeholder-muted-foreground font-mono text-sm"
                  />
                </div>
                <div>
                  <Label className="block text-xs font-medium text-muted-foreground mb-2">
                    Referer
                  </Label>
                  <Input
                    type="url"
                    placeholder="https://webxzplay.cfd"
                    value={referer}
                    onChange={(e) => setReferer(e.target.value)}
                    className="w-full bg-muted border-border text-white placeholder-muted-foreground font-mono text-sm"
                  />
                </div>
              </div>
            </div>

            <Button 
              className="w-full bg-accent hover:bg-accent/90 text-accent-foreground font-semibold mt-6"
              onClick={handleGenerateUrl}
              disabled={validateMutation.isPending}
            >
              {validateMutation.isPending ? (
                <>Loading...</>
              ) : (
                <>
                  <ArrowRight className="mr-2 h-4 w-4" />
                  Generate Proxy URL
                </>
              )}
            </Button>
          </div>

          {/* Output Section */}
          <div>
            <Label className="block text-sm font-medium text-muted-foreground mb-3">
              Generated Proxy URL
            </Label>
            <Card className="bg-muted border-border min-h-[120px]">
              <CardContent className="p-4 font-mono text-sm">
                <div className="text-muted-foreground mb-2">Your proxied URL:</div>
                <div className="text-accent break-all">
                  {generatedUrl || "/stream/https%3A%2F%2Fzekonew.newkso.ru%2Fzeko%2Fpremium598%2Fmono.m3u8"}
                </div>
              </CardContent>
            </Card>

            <div className="mt-6">
              <h4 className="text-sm font-medium text-muted-foreground mb-3">Response Status</h4>
              <Card className="bg-muted border-border">
                <CardContent className="p-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-accent rounded-full animate-pulse-slow"></div>
                    <span className="text-sm text-muted-foreground">{status}</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex space-x-3 mt-6">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={copyToClipboard}
                disabled={!generatedUrl}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy URL
              </Button>
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={testStream}
                disabled={!generatedUrl}
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Test Stream
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
