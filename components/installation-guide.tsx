"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertCircle, CheckCircle2, Terminal, Download, Play, Eye } from "lucide-react"

export function InstallationGuide() {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Installation & Setup Guide</CardTitle>
          <CardDescription>
            Complete guide to install and operate the market maker bot
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Trading Software Warning</AlertTitle>
            <AlertDescription>
              This is trading software. Use at your own risk. Monitor liquidation risks, network latency, and exchange issues carefully.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>

      <Tabs defaultValue="installation" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="installation">
            <Download className="h-4 w-4 mr-2" />
            Install
          </TabsTrigger>
          <TabsTrigger value="configuration">
            <Terminal className="h-4 w-4 mr-2" />
            Configure
          </TabsTrigger>
          <TabsTrigger value="operation">
            <Play className="h-4 w-4 mr-2" />
            Operate
          </TabsTrigger>
          <TabsTrigger value="monitoring">
            <Eye className="h-4 w-4 mr-2" />
            Monitor
          </TabsTrigger>
        </TabsList>

        <TabsContent value="installation">
          <Card>
            <CardHeader>
              <CardTitle>Step 1: Installation</CardTitle>
              <CardDescription>Install dependencies and set up the project</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Prerequisites</h3>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
                    <li>Node.js 18.x or higher</li>
                    <li>npm or pnpm package manager</li>
                    <li>Git for cloning the repository</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>1</Badge>
                    Clone the Repository
                  </h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    git clone https://github.com/aidaonsui-collab/AidaBot.git<br />
                    cd AidaBot
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>2</Badge>
                    Install Dependencies
                  </h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    npm install
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Or use pnpm: <code>pnpm install</code>
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>3</Badge>
                    Build the Project
                  </h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    npm run build
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    This compiles TypeScript to JavaScript
                  </p>
                </div>

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>
                    Installation complete! Proceed to configuration.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="configuration">
          <Card>
            <CardHeader>
              <CardTitle>Step 2: Configuration</CardTitle>
              <CardDescription>Set up environment variables and API keys</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>1</Badge>
                    Create Environment File
                  </h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    cp .env.example .env
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>2</Badge>
                    Configure for FlowX Finance (Sui)
                  </h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                    <div># Exchange Configuration</div>
                    <div>EXCHANGE=flowx</div>
                    <div>SYMBOL=BTC</div>
                    <div><br /></div>
                    <div># Sui Configuration</div>
                    <div>SUI_PRIVATE_KEY=your_base64_or_hex_private_key</div>
                    <div><br /></div>
                    <div># Price Oracle</div>
                    <div>PRICE_SOURCE=binance</div>
                    <div><br /></div>
                    <div># Trading Parameters</div>
                    <div>SPREAD_BPS=10</div>
                    <div>ORDER_SIZE_USD=100</div>
                    <div>CLOSE_THRESHOLD_USD=500</div>
                    <div>MAX_POSITION_USD=2000</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>3</Badge>
                    Configure for Hyperliquid
                  </h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                    <div># Exchange Configuration</div>
                    <div>EXCHANGE=hyperliquid</div>
                    <div>SYMBOL=BTC</div>
                    <div><br /></div>
                    <div># Hyperliquid Configuration</div>
                    <div>HL_PRIVATE_KEY=0x_your_evm_private_key</div>
                    <div>HL_TESTNET=false</div>
                    <div><br /></div>
                    <div># Price Oracle</div>
                    <div>PRICE_SOURCE=binance</div>
                    <div><br /></div>
                    <div># Trading Parameters</div>
                    <div>SPREAD_BPS=10</div>
                    <div>ORDER_SIZE_USD=100</div>
                    <div>CLOSE_THRESHOLD_USD=500</div>
                    <div>MAX_POSITION_USD=2000</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Configuration Parameters</h3>
                  <div className="space-y-2">
                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <code className="text-sm font-mono">SPREAD_BPS</code>
                        <Badge variant="outline">Default: 10</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Spread in basis points (10 = 0.1%). Distance between bid and ask orders.
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <code className="text-sm font-mono">ORDER_SIZE_USD</code>
                        <Badge variant="outline">Default: 100</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Size of each order in USD. Adjust based on your capital and risk tolerance.
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <code className="text-sm font-mono">CLOSE_THRESHOLD_USD</code>
                        <Badge variant="outline">Default: 500</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Position size at which bot switches to close mode with reduce-only orders.
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <div className="flex justify-between items-start mb-1">
                        <code className="text-sm font-mono">MAX_POSITION_USD</code>
                        <Badge variant="outline">Default: 2000</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Maximum position size. Bot stops opening new positions when exceeded.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="operation">
          <Card>
            <CardHeader>
              <CardTitle>Step 3: Running the Bot</CardTitle>
              <CardDescription>Start and operate your market maker</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>Option 1</Badge>
                    Run with Environment Variables
                  </h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm">
                    npm run bot
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Uses configuration from .env file
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>Option 2</Badge>
                    Run with CLI Arguments
                  </h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                    <div># Run on Hyperliquid</div>
                    <div>npm run bot -- --exchange hyperliquid --symbol BTC</div>
                    <div><br /></div>
                    <div># Run on FlowX Finance</div>
                    <div>npm run bot -- --exchange flowx --symbol ETH</div>
                    <div><br /></div>
                    <div># With custom parameters</div>
                    <div>npm run bot -- --exchange hyperliquid --symbol BTC \</div>
                    <div>  --spread-bps 15 \</div>
                    <div>  --order-size 200 \</div>
                    <div>  --price-source binance</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>Option 3</Badge>
                    Run with Docker
                  </h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                    <div># Build Docker image</div>
                    <div>docker build -t market-maker .</div>
                    <div><br /></div>
                    <div># Run with Docker Compose</div>
                    <div>docker compose --profile hyperliquid up -d</div>
                    <div><br /></div>
                    <div># View logs</div>
                    <div>docker compose logs -f</div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">CLI Options Reference</h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between border-b pb-1">
                      <code>-e, --exchange</code>
                      <span className="text-muted-foreground">flowx or hyperliquid</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <code>-s, --symbol</code>
                      <span className="text-muted-foreground">BTC, ETH, SOL, etc.</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <code>-p, --price-source</code>
                      <span className="text-muted-foreground">binance or hyperliquid</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <code>--spread-bps</code>
                      <span className="text-muted-foreground">Spread in basis points</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <code>--order-size</code>
                      <span className="text-muted-foreground">Order size in USD</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <code>--close-threshold</code>
                      <span className="text-muted-foreground">Close mode threshold</span>
                    </div>
                    <div className="flex justify-between border-b pb-1">
                      <code>--max-position</code>
                      <span className="text-muted-foreground">Maximum position size</span>
                    </div>
                  </div>
                </div>

                <Alert>
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertTitle>Bot Running</AlertTitle>
                  <AlertDescription>
                    Your market maker is now active. Monitor it regularly and ensure proper risk management.
                  </AlertDescription>
                </Alert>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="monitoring">
          <Card>
            <CardHeader>
              <CardTitle>Step 4: Monitoring</CardTitle>
              <CardDescription>Track your bot's performance and manage risks</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    <Badge>TUI Monitor</Badge>
                    Real-Time Terminal Interface
                  </h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                    <div># Monitor Hyperliquid</div>
                    <div>npm run monitor -- --exchange hyperliquid --symbol BTC</div>
                    <div><br /></div>
                    <div># Monitor FlowX Finance</div>
                    <div>npm run monitor -- --exchange flowx --symbol ETH</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Displays live orderbook, positions, and market data
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Key Metrics to Monitor</h3>
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-1">Position Size</h4>
                      <p className="text-sm text-muted-foreground">
                        Track your current position in USD. Should stay within max limits.
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-1">Margin Ratio</h4>
                      <p className="text-sm text-muted-foreground">
                        Watch margin utilization. High ratios increase liquidation risk.
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-1">Unrealized P&L</h4>
                      <p className="text-sm text-muted-foreground">
                        Monitor profit and loss. Positive P&L indicates successful market making.
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-1">Order Fill Rate</h4>
                      <p className="text-sm text-muted-foreground">
                        Track how often your orders get filled. Balance between fills and spread.
                      </p>
                    </div>

                    <div className="border rounded-lg p-3">
                      <h4 className="font-semibold text-sm mb-1">Price Oracle</h4>
                      <p className="text-sm text-muted-foreground">
                        Ensure fair price is updating correctly. Stale prices = bad quotes.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Risk Management</h3>
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertTitle>Important Safety Measures</AlertTitle>
                    <AlertDescription className="space-y-2 mt-2">
                      <p><strong>Liquidation Risk:</strong> Monitor margin ratio constantly. Bot doesn't automatically prevent liquidation.</p>
                      <p><strong>Stale Prices:</strong> Network latency can cause inaccurate quotes. Use conservative spreads.</p>
                      <p><strong>Exchange Issues:</strong> API failures may leave orders orphaned. Check exchange directly.</p>
                      <p><strong>Position Limits:</strong> Set conservative limits and monitor them actively.</p>
                    </AlertDescription>
                  </Alert>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Stopping the Bot</h3>
                  <div className="bg-muted p-4 rounded-lg font-mono text-sm space-y-1">
                    <div># Graceful shutdown (cancels all orders)</div>
                    <div>Ctrl + C</div>
                    <div><br /></div>
                    <div># Docker shutdown</div>
                    <div>docker compose down</div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-2">
                    Bot will automatically cancel all open orders on exit
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Architecture Overview</CardTitle>
          <CardDescription>How the bot works internally</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">1. Price Oracle Connection</h3>
              <p className="text-sm text-muted-foreground">
                Bot connects to Binance (spot) or Hyperliquid (perps) via WebSocket for real-time price feeds
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">2. Fair Price Calculation</h3>
              <p className="text-sm text-muted-foreground">
                Uses Exponential Moving Average (EMA) to smooth price data and reduce noise
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">3. Quote Generation</h3>
              <p className="text-sm text-muted-foreground">
                Places bid/ask orders around fair price with configured spread (e.g., 10 bps = 0.1%)
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">4. Position Management</h3>
              <p className="text-sm text-muted-foreground">
                Monitors position size and switches to close mode when threshold exceeded
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">5. Close Mode</h3>
              <p className="text-sm text-muted-foreground">
                Uses tighter spread and reduce-only orders when position is too large
              </p>
            </div>

            <div className="border rounded-lg p-4">
              <h3 className="font-semibold mb-2">6. Continuous Updates</h3>
              <p className="text-sm text-muted-foreground">
                Bot continuously updates quotes as market price moves to maintain spread
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
