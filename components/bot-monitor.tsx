"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, TrendingDown, Activity, DollarSign, Target, AlertTriangle } from "lucide-react"

interface BotMonitorProps {
  activeBot: string | null
}

interface MarketData {
  fairPrice: number
  bidPrice: number
  askPrice: number
  spread: number
  volume24h: number
}

interface PositionData {
  size: number
  notional: number
  unrealizedPnL: number
  marginUsed: number
  marginRatio: number
  entryPrice: number
}

interface OrderbookEntry {
  price: number
  size: number
  total: number
}

export function BotMonitor({ activeBot }: BotMonitorProps) {
  const [marketData, setMarketData] = useState<MarketData | null>(null)
  const [positionData, setPositionData] = useState<PositionData | null>(null)
  const [bids, setBids] = useState<OrderbookEntry[]>([])
  const [asks, setAsks] = useState<OrderbookEntry[]>([])
  const [orders, setOrders] = useState<any[]>([])

  // Fetch real-time data when bot is active
  useEffect(() => {
    if (!activeBot) {
      setMarketData(null)
      setPositionData(null)
      setBids([])
      setAsks([])
      setOrders([])
      return
    }

    // TODO: Connect to real bot API endpoints
    // Example: fetch('/api/bot/market-data?botId=' + activeBot)
    // For now, show "Waiting for connection" state
    
  }, [activeBot])

  if (!activeBot) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground" />
            <p className="text-muted-foreground">No active bot</p>
            <p className="text-sm text-muted-foreground">Start a bot from the Configure tab to see monitoring data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!marketData || !positionData) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center h-64">
          <div className="text-center space-y-2">
            <Activity className="h-12 w-12 mx-auto text-muted-foreground animate-pulse" />
            <p className="text-muted-foreground">Connecting to exchange...</p>
            <p className="text-sm text-muted-foreground">Establishing WebSocket connection and fetching initial data</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Market Overview */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Fair Price</CardDescription>
            <CardTitle className="text-2xl">${marketData?.fairPrice.toFixed(2) || '--'}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2 text-sm">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-green-500">Live</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Spread</CardDescription>
            <CardTitle className="text-2xl">{marketData?.spread.toFixed(2) || '--'}%</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              ${marketData ? (marketData.askPrice - marketData.bidPrice).toFixed(2) : '--'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Position</CardDescription>
            <CardTitle className="text-2xl">{positionData?.size.toFixed(3) || '0.000'} BTC</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              ${positionData?.notional.toFixed(2) || '0.00'}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardDescription>Unrealized P&L</CardDescription>
            <CardTitle className={`text-2xl ${(positionData?.unrealizedPnL || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${positionData?.unrealizedPnL.toFixed(2) || '0.00'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-sm text-muted-foreground">
              {positionData ? ((positionData.unrealizedPnL / positionData.notional) * 100).toFixed(2) : '0.00'}%
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Risk Metrics */}
      <Card>
        <CardHeader>
          <CardTitle>Risk Metrics</CardTitle>
          <CardDescription>Position and margin utilization</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span>Margin Used</span>
              <span className="font-semibold">${positionData.marginUsed.toFixed(2)}</span>
            </div>
            <Progress value={positionData.marginRatio * 100} className="h-2" />
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span>{(positionData.marginRatio * 100).toFixed(1)}% utilized</span>
              {positionData.marginRatio > 0.7 && (
                <span className="flex items-center gap-1 text-yellow-500">
                  <AlertTriangle className="h-3 w-3" />
                  High leverage
                </span>
              )}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 pt-2">
            <div>
              <p className="text-sm text-muted-foreground">Entry Price</p>
              <p className="text-lg font-semibold">${positionData.entryPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mark Price</p>
              <p className="text-lg font-semibold">${marketData.fairPrice.toFixed(2)}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Liq. Price</p>
              <p className="text-lg font-semibold text-red-500">$95,200.00</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Orderbook and Orders */}
      <Tabs defaultValue="orderbook" className="w-full">
        <TabsList>
          <TabsTrigger value="orderbook">Orderbook</TabsTrigger>
          <TabsTrigger value="orders">Active Orders</TabsTrigger>
        </TabsList>

        <TabsContent value="orderbook">
          <Card>
            <CardHeader>
              <CardTitle>Market Depth</CardTitle>
              <CardDescription>Current orderbook state</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Asks */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-red-500 mb-3">ASKS</h3>
                  <div className="space-y-1">
                    {asks.slice().reverse().map((ask, i) => (
                      <div key={i} className="grid grid-cols-3 text-sm">
                        <span className="text-red-500">${ask.price.toFixed(2)}</span>
                        <span className="text-right">{ask.size.toFixed(3)}</span>
                        <span className="text-right text-muted-foreground">{ask.total.toFixed(3)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bids */}
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold text-green-500 mb-3">BIDS</h3>
                  <div className="space-y-1">
                    {bids.map((bid, i) => (
                      <div key={i} className="grid grid-cols-3 text-sm">
                        <span className="text-green-500">${bid.price.toFixed(2)}</span>
                        <span className="text-right">{bid.size.toFixed(3)}</span>
                        <span className="text-right text-muted-foreground">{bid.total.toFixed(3)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="orders">
          <Card>
            <CardHeader>
              <CardTitle>Active Orders</CardTitle>
              <CardDescription>Your current open orders</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {orders.map((order) => (
                  <div key={order.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-4">
                      <Badge variant={order.side === "BUY" ? "default" : "destructive"}>
                        {order.side}
                      </Badge>
                      <div>
                        <p className="font-semibold">${order.price.toFixed(2)}</p>
                        <p className="text-sm text-muted-foreground">{order.size} BTC</p>
                      </div>
                    </div>
                    <Badge variant="outline">{order.status}</Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
