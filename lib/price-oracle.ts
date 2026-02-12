import { MarketData, PriceOracle } from './types'
import WebSocket from 'ws'

export class PriceOracleService {
  private wsConnection: WebSocket | null = null
  private priceCache: Map<string, number> = new Map()
  private emaShort: number = 0
  private emaLong: number = 0
  private readonly emaShortPeriod = 12
  private readonly emaLongPeriod = 26

  constructor(
    private oracle: PriceOracle,
    private symbol: string,
    private onPriceUpdate?: (data: MarketData) => void
  ) {}

  async connect(): Promise<void> {
    if (this.oracle === 'binance') {
      await this.connectBinance()
    } else if (this.oracle === 'hyperliquid') {
      await this.connectHyperliquid()
    }
  }

  private async connectBinance(): Promise<void> {
    const wsSymbol = this.formatBinanceSymbol(this.symbol)
    // Use bookTicker for real-time best bid/ask prices
    const wsUrl = `wss://fstream.binance.com/ws/${wsSymbol.toLowerCase()}@bookTicker`

    console.log('[v0] Connecting to Binance WebSocket:', wsUrl)
    this.wsConnection = new WebSocket(wsUrl)

    this.wsConnection.on('open', () => {
      console.log('[v0] Binance WebSocket connected')
    })

    this.wsConnection.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString())
        // bookTicker fields: b (best bid), a (best ask), B (best bid qty), A (best ask qty)
        const bidPrice = parseFloat(message.b)
        const askPrice = parseFloat(message.a)
        const fairPrice = (bidPrice + askPrice) / 2

        if (isNaN(fairPrice) || !isFinite(fairPrice) || fairPrice === 0) {
          console.error('[v0] Invalid price data from Binance:', message)
          return
        }

        this.updateEMA(fairPrice)

        const marketData: MarketData = {
          symbol: this.symbol,
          bidPrice,
          askPrice,
          fairPrice: this.emaShort,
          timestamp: Date.now(),
          spread: askPrice - bidPrice
        }

        this.priceCache.set(this.symbol, fairPrice)
        this.onPriceUpdate?.(marketData)
      } catch (error) {
        console.error('[v0] Error parsing Binance message:', error)
      }
    })

    this.wsConnection.on('error', (error) => {
      console.error('[v0] Binance WebSocket error:', error)
    })

    this.wsConnection.on('close', () => {
      console.log('[v0] Binance WebSocket closed, reconnecting...')
      setTimeout(() => this.connectBinance(), 5000)
    })
  }

  private async connectHyperliquid(): Promise<void> {
    const wsUrl = 'wss://api.hyperliquid.xyz/ws'

    console.log('[v0] Connecting to Hyperliquid WebSocket:', wsUrl)
    this.wsConnection = new WebSocket(wsUrl)

    this.wsConnection.on('open', () => {
      console.log('[v0] Hyperliquid WebSocket connected')
      const subscribeMessage = {
        method: 'subscribe',
        subscription: {
          type: 'l2Book',
          coin: this.symbol
        }
      }
      this.wsConnection?.send(JSON.stringify(subscribeMessage))
    })

    this.wsConnection.on('message', (data: WebSocket.Data) => {
      try {
        const message = JSON.parse(data.toString())
        
        if (message.channel === 'l2Book' && message.data) {
          const book = message.data
          const bidPrice = parseFloat(book.levels[0]?.[0]?.px || '0')
          const askPrice = parseFloat(book.levels[1]?.[0]?.px || '0')
          const fairPrice = (bidPrice + askPrice) / 2

          if (isNaN(fairPrice) || !isFinite(fairPrice) || fairPrice === 0) {
            console.error('[v0] Invalid price data from Hyperliquid:', message)
            return
          }

          this.updateEMA(fairPrice)

          const marketData: MarketData = {
            symbol: this.symbol,
            bidPrice,
            askPrice,
            fairPrice: this.emaShort,
            timestamp: Date.now(),
            spread: askPrice - bidPrice
          }

          this.priceCache.set(this.symbol, fairPrice)
          this.onPriceUpdate?.(marketData)
        }
      } catch (error) {
        console.error('[v0] Error parsing Hyperliquid message:', error)
      }
    })

    this.wsConnection.on('error', (error) => {
      console.error('[v0] Hyperliquid WebSocket error:', error)
    })

    this.wsConnection.on('close', () => {
      console.log('[v0] Hyperliquid WebSocket closed, reconnecting...')
      setTimeout(() => this.connectHyperliquid(), 5000)
    })
  }

  private updateEMA(price: number): void {
    const multiplierShort = 2 / (this.emaShortPeriod + 1)
    const multiplierLong = 2 / (this.emaLongPeriod + 1)

    if (this.emaShort === 0) {
      this.emaShort = price
      this.emaLong = price
    } else {
      this.emaShort = (price - this.emaShort) * multiplierShort + this.emaShort
      this.emaLong = (price - this.emaLong) * multiplierLong + this.emaLong
    }
  }

  private formatBinanceSymbol(symbol: string): string {
    return `${symbol}USDT`
  }

  getLatestPrice(symbol: string): number | undefined {
    return this.priceCache.get(symbol)
  }

  disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close()
      this.wsConnection = null
    }
  }

  getFairPrice(): number {
    return this.emaShort
  }
}

// Export alias for convenience
export { PriceOracleService as PriceOracle }
