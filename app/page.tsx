"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BotConfiguration } from "@/components/bot-configuration"
import { BotMonitor } from "@/components/bot-monitor"
import { InstallationGuide } from "@/components/installation-guide"
import { Activity, BookOpen, Settings } from "lucide-react"

export default function Home() {
  const [activeBot, setActiveBot] = useState<string | null>(null)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Multi-Exchange Market Maker Bot</h1>
          <p className="text-muted-foreground">
            Professional perpetuals market maker supporting FlowX Finance (Sui) and Hyperliquid
          </p>
        </div>

        <Tabs defaultValue="config" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 lg:w-[450px]">
            <TabsTrigger value="config" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Configure
            </TabsTrigger>
            <TabsTrigger value="monitor" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              Monitor
            </TabsTrigger>
            <TabsTrigger value="guide" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Guide
            </TabsTrigger>
          </TabsList>

          <TabsContent value="config">
            <BotConfiguration onBotStart={setActiveBot} activeBot={activeBot} />
          </TabsContent>

          <TabsContent value="monitor">
            <BotMonitor activeBot={activeBot} />
          </TabsContent>

          <TabsContent value="guide">
            <InstallationGuide />
          </TabsContent>
        </Tabs>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Features</CardTitle>
            <CardDescription>What makes this bot powerful</CardDescription>
          </CardHeader>
          <CardContent className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <h3 className="font-semibold">Multi-Exchange Support</h3>
              <p className="text-sm text-muted-foreground">
                Trade on FlowX Finance (Sui) and Hyperliquid with unified interface
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Flexible Price Oracle</h3>
              <p className="text-sm text-muted-foreground">
                Use Binance spot or Hyperliquid perps for accurate fair pricing
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">EMA-Based Pricing</h3>
              <p className="text-sm text-muted-foreground">
                Smooth price calculation with configurable EMA window
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Risk Management</h3>
              <p className="text-sm text-muted-foreground">
                Automatic close mode with reduce-only orders when position exceeds threshold
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Real-Time Monitoring</h3>
              <p className="text-sm text-muted-foreground">
                Live orderbook and position visualization with TUI interface
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold">Graceful Shutdown</h3>
              <p className="text-sm text-muted-foreground">
                Automatically cancels all orders on exit for clean shutdown
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
