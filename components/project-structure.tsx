"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Folder, File, FileCode, Settings } from "lucide-react"

export function ProjectStructure() {
  const projectFiles = [
    {
      category: "Core Application",
      icon: <Folder className="h-4 w-4" />,
      files: [
        { name: "app/page.tsx", description: "Main dashboard with tabs for configuration, monitoring, and guide", type: "primary" },
        { name: "app/layout.tsx", description: "Root layout with theme provider and toaster", type: "config" },
        { name: "app/globals.css", description: "Global styles with Tailwind configuration", type: "style" },
      ]
    },
    {
      category: "Bot Components",
      icon: <FileCode className="h-4 w-4" />,
      files: [
        { name: "components/bot-configuration.tsx", description: "Bot configuration form with exchange settings, symbols, oracle selection, and risk parameters", type: "primary" },
        { name: "components/bot-monitor.tsx", description: "Real-time monitoring dashboard showing positions, P&L, orderbook, and active orders", type: "primary" },
        { name: "components/installation-guide.tsx", description: "Complete installation and operation guide with examples", type: "primary" },
        { name: "components/project-structure.tsx", description: "This file - project overview and structure documentation", type: "primary" },
      ]
    },
    {
      category: "Configuration Files",
      icon: <Settings className="h-4 w-4" />,
      files: [
        { name: "package.json", description: "Dependencies and scripts for the market maker bot", type: "config" },
        { name: "tsconfig.json", description: "TypeScript configuration", type: "config" },
        { name: "next.config.mjs", description: "Next.js configuration", type: "config" },
        { name: "postcss.config.mjs", description: "PostCSS configuration for Tailwind CSS", type: "config" },
        { name: "components.json", description: "shadcn/ui components configuration", type: "config" },
      ]
    },
    {
      category: "Utilities & Hooks",
      icon: <File className="h-4 w-4" />,
      files: [
        { name: "lib/utils.ts", description: "Utility functions including cn() for className merging", type: "util" },
        { name: "hooks/use-toast.ts", description: "Toast notification hook for user feedback", type: "util" },
        { name: "hooks/use-mobile.ts", description: "Mobile detection hook for responsive design", type: "util" },
      ]
    },
    {
      category: "UI Components (shadcn/ui)",
      icon: <Folder className="h-4 w-4" />,
      files: [
        { name: "components/ui/*", description: "50+ pre-built UI components from shadcn/ui including buttons, cards, forms, tables, dialogs, and more", type: "ui" },
      ]
    }
  ]

  const keyFeatures = [
    {
      feature: "Multi-Exchange Support",
      details: ["FlowX Finance on Sui blockchain", "Hyperliquid perpetuals", "Unified trading interface"]
    },
    {
      feature: "Price Oracle Options",
      details: ["Binance WebSocket feeds", "Hyperliquid prices", "EMA-based fair price calculation"]
    },
    {
      feature: "Risk Management",
      details: ["Configurable spread in basis points", "Position size limits", "Automatic close mode", "Real-time margin monitoring"]
    },
    {
      feature: "Real-Time Monitoring",
      details: ["Live P&L tracking", "Orderbook depth visualization", "Active orders display", "WebSocket price feeds"]
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "primary": return "bg-blue-500/10 text-blue-500 border-blue-500/20"
      case "config": return "bg-purple-500/10 text-purple-500 border-purple-500/20"
      case "style": return "bg-pink-500/10 text-pink-500 border-pink-500/20"
      case "util": return "bg-green-500/10 text-green-500 border-green-500/20"
      case "ui": return "bg-orange-500/10 text-orange-500 border-orange-500/20"
      default: return "bg-gray-500/10 text-gray-500 border-gray-500/20"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold mb-2">Multi-Exchange Market Maker Bot</h1>
        <p className="text-muted-foreground">
          Complete project structure and documentation for the perpetuals market maker supporting FlowX Finance and Hyperliquid
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Project Overview</CardTitle>
            <CardDescription>Key features and capabilities</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {keyFeatures.map((item, index) => (
                <div key={index} className="space-y-2">
                  <h4 className="font-semibold text-sm">{item.feature}</h4>
                  <ul className="space-y-1">
                    {item.details.map((detail, idx) => (
                      <li key={idx} className="text-sm text-muted-foreground pl-4 border-l-2 border-border">
                        {detail}
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Stats</CardTitle>
            <CardDescription>Project metrics and information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Total Files</span>
                <Badge variant="secondary">80+</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Core Components</span>
                <Badge variant="secondary">4</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">UI Components</span>
                <Badge variant="secondary">50+</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Exchanges Supported</span>
                <Badge variant="secondary">2</Badge>
              </div>
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <span className="text-sm font-medium">Framework</span>
                <Badge variant="secondary">Next.js 16</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Project File Structure</CardTitle>
          <CardDescription>Detailed breakdown of all project files and their purposes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {projectFiles.map((category, index) => (
              <div key={index} className="space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b">
                  {category.icon}
                  <span className="font-semibold">{category.category}</span>
                  <Badge variant="outline" className="ml-2">
                    {category.files.length} {category.files.length === 1 ? 'file' : 'files'}
                  </Badge>
                </div>
                <div className="space-y-3 pl-2">
                  {category.files.map((file, fileIndex) => (
                    <div key={fileIndex} className="flex items-start gap-3 p-3 border rounded-lg hover:bg-accent/50 transition-colors">
                      <FileCode className="h-4 w-4 mt-0.5 text-muted-foreground flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <code className="text-sm font-mono font-semibold">{file.name}</code>
                          <Badge variant="outline" className={getTypeColor(file.type)}>
                            {file.type}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">{file.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card className="border-orange-500/20 bg-orange-500/5">
        <CardHeader>
          <CardTitle className="text-orange-600">Getting Started</CardTitle>
          <CardDescription>How to use this application</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold flex-shrink-0">1</div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Go to the Configure Tab</h4>
              <p className="text-sm text-muted-foreground">Set up your bot with exchange selection, trading symbols, and risk parameters</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold flex-shrink-0">2</div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Monitor Your Bot</h4>
              <p className="text-sm text-muted-foreground">Use the Monitor tab to track positions, P&L, and live orderbook data</p>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-sm font-bold flex-shrink-0">3</div>
            <div>
              <h4 className="font-semibold text-sm mb-1">Read the Installation Guide</h4>
              <p className="text-sm text-muted-foreground">The Guide tab contains complete installation instructions and best practices</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
