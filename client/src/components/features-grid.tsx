import { Shield, Link, Podcast, Server, Zap, Code } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const features = [
  {
    icon: Shield,
    title: "Automatic Headers",
    description: "Automatically applies predefined origin and referer headers to all proxied requests without exposing them in URLs.",
    color: "text-primary"
  },
  {
    icon: Link,
    title: "Clean URLs",
    description: "Simple, clean URL structure without embedded parameters. Just pass your M3U8 URL and we handle the rest.",
    color: "text-accent"
  },
  {
    icon: Podcast,
    title: "Seamless Streaming",
    description: "Handles both M3U8 playlists and video segments with automatic URL rewriting for uninterrupted streaming.",
    color: "text-secondary"
  },
  {
    icon: Server,
    title: "Server-Side Config",
    description: "All header management is handled server-side with no client-side configuration required.",
    color: "text-red-500"
  },
  {
    icon: Zap,
    title: "High Performance",
    description: "Optimized proxy handling ensures minimal latency and maximum streaming performance.",
    color: "text-yellow-500"
  },
  {
    icon: Code,
    title: "Developer Friendly",
    description: "Simple API with standard HTTP responses and comprehensive error handling for easy integration.",
    color: "text-purple-500"
  }
];

export default function FeaturesGrid() {
  return (
    <>
      <h3 className="text-3xl font-bold text-center mb-12">Key Features</h3>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {features.map((feature, index) => (
          <Card key={index} className="bg-surface border-border hover:border-muted-foreground/50 transition-colors">
            <CardContent className="p-6">
              <div className={`w-12 h-12 bg-opacity-20 rounded-lg flex items-center justify-center mb-4 ${feature.color}/20`}>
                <feature.icon className={`${feature.color} text-xl`} />
              </div>
              <h4 className="text-xl font-semibold mb-3">{feature.title}</h4>
              <p className="text-muted-foreground">{feature.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </>
  );
}
