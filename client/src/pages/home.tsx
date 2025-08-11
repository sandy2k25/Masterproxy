import { Podcast, Code, BookOpen } from "lucide-react";
import ProxyDemo from "@/components/proxy-demo";
import FeaturesGrid from "@/components/features-grid";
import ApiDocs from "@/components/api-docs";
import UsageExamples from "@/components/usage-examples";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="bg-surface border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <Podcast className="text-white text-lg" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">M3U8 Proxy</h1>
                <p className="text-muted-foreground text-sm">Professional streaming proxy service</p>
              </div>
            </div>
            <nav className="hidden md:flex space-x-8">
              <a href="#demo" className="text-muted-foreground hover:text-white transition-colors">Try It</a>
              <a href="#docs" className="text-muted-foreground hover:text-white transition-colors">Documentation</a>
              <a href="#api" className="text-muted-foreground hover:text-white transition-colors">API Reference</a>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              Clean M3U8 Streaming Proxy
            </h2>
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Proxy M3U8 streams with automatic header injection. Clean URLs, server-side configuration, 
              seamless streaming experience with predefined origin and referer headers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-4 px-8 rounded-lg transition-colors">
                <Podcast className="inline mr-2 h-4 w-4" />
                Try Demo
              </button>
              <button className="bg-surface-light hover:bg-muted text-white font-semibold py-4 px-8 rounded-lg transition-colors border border-border">
                <BookOpen className="inline mr-2 h-4 w-4" />
                View Documentation
              </button>
            </div>
          </div>
        </section>

        {/* Live Demo Section */}
        <section id="demo" className="mb-16">
          <ProxyDemo />
        </section>

        {/* Features Grid */}
        <section className="mb-16">
          <FeaturesGrid />
        </section>

        {/* API Documentation */}
        <section id="api" className="mb-16">
          <ApiDocs />
        </section>

        {/* Usage Examples */}
        <section className="mb-16">
          <UsageExamples />
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-surface border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <Podcast className="text-white text-sm" />
                </div>
                <span className="text-xl font-bold">M3U8 Proxy</span>
              </div>
              <p className="text-muted-foreground max-w-md">
                Professional M3U8 streaming proxy service with automatic header injection. 
                Clean, reliable, and developer-friendly.
              </p>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-white transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API Reference</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Examples</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold mb-4">Status</h4>
              <div className="flex items-center space-x-2 text-accent">
                <div className="w-2 h-2 bg-accent rounded-full animate-pulse-slow"></div>
                <span className="text-sm">All systems operational</span>
              </div>
            </div>
          </div>
          
          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 M3U8 Proxy Service. Built for developers, by developers.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
