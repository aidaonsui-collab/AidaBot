"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Play, Square, AlertCircle, CheckCircle2 } from "lucide-react"

interface BotConfigurationProps {
  onBotStart: (botId: string) => void
  activeBot: string | null
}

export function BotConfiguration({ onBotStart, activeBot }: BotConfigurationProps) {
  const [exchange, setExchange] = useState("flowx")
  const [symbol, setSymbol] = useState("BTC")
  const [priceSource, setPriceSource] = useState("binance")
  const [spreadBps, setSpreadBps] = useState("10")
  const [orderSizeUsd, setOrderSizeUsd] = useState("100")
  const [closeThresholdUsd, setCloseThresholdUsd] = useState("500")
  const [maxPositionUsd, setMaxPositionUsd] = useState("2000")
  
  // Exchange-specific keys
  const [suiPrivateKey, setSuiPrivateKey] = useState("")
  const [hlPrivateKey, setHlPrivateKey] = useState("")
  const [hlTestnet, setHlTestnet] = useState(false)

  const handleStart = async () => {
    // Validation
    if (exchange === "flowx" && !suiPrivateKey) {
      alert("Missing Configuration: Please provide Sui private key for FlowX Finance")
      return
    }

    if (exchange === "hyperliquid" && !hlPrivateKey) {
      alert("Missing Configuration: Please provide EVM private key for Hyperliquid")
      return
    }

    const config = {
      exchange,
      symbol,
      priceSource,
      spreadBps: parseFloat(spreadBps),
      orderSizeUsd: parseFloat(orderSizeUsd),
      closeThresholdUsd: parseFloat(closeThresholdUsd),
      maxPositionUsd: parseFloat(maxPositionUsd),
      suiPrivateKey: exchange === "flowx" ? suiPrivateKey : undefined,
      hlPrivateKey: exchange === "hyperliquid" ? hlPrivateKey : undefined,
      hlTestnet: exchange === "hyperliquid" ? hlTestnet : undefined,
    }

    // In a real implementation, this would start the bot via API
    console.log("Starting bot with config:", config)
    
    const botId = `${exchange}-${symbol}-${Date.now()}`
    onBotStart(botId)

    console.log(`Bot Started: Market maker is now running on ${exchange.toUpperCase()} for ${symbol}`)
  }

  const handleStop = () => {
    onBotStart(null)
    console.log("Bot Stopped: Market maker has been stopped and all orders cancelled")
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Bot Configuration</CardTitle>
              <CardDescription>Configure your market maker bot settings</CardDescription>
            </div>
            {activeBot && (
              <Badge variant="default" className="flex items-center gap-2">
                <CheckCircle2 className="h-3 w-3" />
                Running
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Basic Configuration */}
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exchange">Exchange</Label>
              <Select value={exchange} onValueChange={setExchange} disabled={!!activeBot}>
                <SelectTrigger id="exchange">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flowx">FlowX Finance (Sui)</SelectItem>
                  <SelectItem value="hyperliquid">Hyperliquid</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="symbol">Trading Symbol</Label>
              <Select value={symbol} onValueChange={setSymbol} disabled={!!activeBot}>
                <SelectTrigger id="symbol">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BTC">BTC</SelectItem>
                  <SelectItem value="ETH">ETH</SelectItem>
                  <SelectItem value="SOL">SOL</SelectItem>
                  <SelectItem value="SUI">SUI</SelectItem>
                  <SelectItem value="ARB">ARB</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="priceSource">Price Oracle</Label>
              <Select value={priceSource} onValueChange={setPriceSource} disabled={!!activeBot}>
                <SelectTrigger id="priceSource">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="binance">Binance (Spot)</SelectItem>
                  <SelectItem value="hyperliquid">Hyperliquid (Perps)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="spreadBps">Spread (basis points)</Label>
              <Input
                id="spreadBps"
                type="number"
                value={spreadBps}
                onChange={(e) => setSpreadBps(e.target.value)}
                placeholder="10"
                disabled={!!activeBot}
              />
              <p className="text-xs text-muted-foreground">10 bps = 0.1%</p>
            </div>
          </div>

          {/* Risk Parameters */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Risk Parameters</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="orderSize">Order Size (USD)</Label>
                <Input
                  id="orderSize"
                  type="number"
                  value={orderSizeUsd}
                  onChange={(e) => setOrderSizeUsd(e.target.value)}
                  placeholder="100"
                  disabled={!!activeBot}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="closeThreshold">Close Threshold (USD)</Label>
                <Input
                  id="closeThreshold"
                  type="number"
                  value={closeThresholdUsd}
                  onChange={(e) => setCloseThresholdUsd(e.target.value)}
                  placeholder="500"
                  disabled={!!activeBot}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPosition">Max Position (USD)</Label>
                <Input
                  id="maxPosition"
                  type="number"
                  value={maxPositionUsd}
                  onChange={(e) => setMaxPositionUsd(e.target.value)}
                  placeholder="2000"
                  disabled={!!activeBot}
                />
              </div>
            </div>
          </div>

          {/* Exchange-Specific Configuration */}
          <Tabs value={exchange} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="flowx">FlowX (Sui)</TabsTrigger>
              <TabsTrigger value="hyperliquid">Hyperliquid</TabsTrigger>
            </TabsList>

            <TabsContent value="flowx" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  FlowX Finance operates on the Sui blockchain. You'll need a Sui wallet with funds.
                </AlertDescription>
              </Alert>
              <div className="space-y-2">
                <Label htmlFor="suiKey">Sui Private Key</Label>
                <Input
                  id="suiKey"
                  type="password"
                  value={suiPrivateKey}
                  onChange={(e) => setSuiPrivateKey(e.target.value)}
                  placeholder="Base64 or hex encoded private key"
                  disabled={!!activeBot}
                />
                <p className="text-xs text-muted-foreground">
                  Your private key is stored locally and never sent to any server
                </p>
              </div>
            </TabsContent>

            <TabsContent value="hyperliquid" className="space-y-4">
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Hyperliquid uses EVM-compatible wallets. You can use testnet for testing.
                </AlertDescription>
              </Alert>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="hlKey">EVM Private Key</Label>
                  <Input
                    id="hlKey"
                    type="password"
                    value={hlPrivateKey}
                    onChange={(e) => setHlPrivateKey(e.target.value)}
                    placeholder="0x-prefixed hex private key"
                    disabled={!!activeBot}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="testnet"
                    checked={hlTestnet}
                    onChange={(e) => setHlTestnet(e.target.checked)}
                    disabled={!!activeBot}
                    className="h-4 w-4"
                  />
                  <Label htmlFor="testnet">Use Testnet</Label>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-4">
            {!activeBot ? (
              <Button onClick={handleStart} className="flex-1">
                <Play className="h-4 w-4 mr-2" />
                Start Bot
              </Button>
            ) : (
              <Button onClick={handleStop} variant="destructive" className="flex-1">
                <Square className="h-4 w-4 mr-2" />
                Stop Bot
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
