export type Exchange = 'flowx' | 'hyperliquid'
export type PriceOracle = 'binance' | 'hyperliquid'

export interface BotConfig {
  exchange: Exchange
  symbol: string
  priceOracle: PriceOracle
  spreadBps: number
  orderSize: number // Base currency amount (e.g., 0.001 BTC)
  orderSizeUsd?: number // USD notional amount (e.g., 100 USD)
  maxPosition: number // Base currency amount
  maxPositionUsd?: number // USD notional amount
  closeThreshold: number // Ratio (0.8 = 80% of max position)
  closeThresholdUsd?: number // USD notional threshold
  useUsdSizing: boolean // If true, use USD-based sizing
  suiPrivateKey?: string
  evmPrivateKey?: string
  enableLogging: boolean
}

export interface MarketData {
  symbol: string
  bidPrice: number
  askPrice: number
  fairPrice: number
  timestamp: number
  spread: number
}

export interface Order {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  price: number
  size: number
  type: 'limit' | 'market'
  reduceOnly: boolean
  status: 'pending' | 'open' | 'filled' | 'cancelled'
  timestamp: number
}

export interface Position {
  symbol: string
  size: number
  entryPrice: number
  markPrice: number
  unrealizedPnl: number
  realizedPnl: number
  leverage: number
  liquidationPrice: number
}

export interface BotStatus {
  isRunning: boolean
  exchange: Exchange
  symbol: string
  position: Position | null
  activeOrders: Order[]
  marketData: MarketData | null
  totalPnl: number
  tradesCount: number
  uptime: number
  lastError?: string
}

export interface OrderbookLevel {
  price: number
  size: number
}

export interface Orderbook {
  symbol: string
  bids: OrderbookLevel[]
  asks: OrderbookLevel[]
  timestamp: number
}

export interface Trade {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  price: number
  size: number
  timestamp: number
  pnl: number
}
