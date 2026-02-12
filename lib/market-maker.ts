import { BotConfig, BotStatus, Order, Position, MarketData } from './types'
import { FlowXConnector } from './exchanges/flowx'
import { HyperliquidConnector } from './exchanges/hyperliquid'
import { PriceOracleService } from './price-oracle'

export class MarketMaker {
  private config: BotConfig
  private exchange: FlowXConnector | HyperliquidConnector
  private priceOracle: PriceOracleService
  private isRunning: boolean = false
  private currentMarketData: MarketData | null = null
  private currentPosition: Position | null = null
  private activeOrders: Order[] = []
  private totalPnl: number = 0
  private tradesCount: number = 0
  private startTime: number = 0
  private lastError: string = ''

  constructor(config: BotConfig) {
    this.config = config
    
    // Initialize exchange connector
    if (config.exchange === 'flowx') {
      this.exchange = new FlowXConnector(config.suiPrivateKey || '')
    } else {
      this.exchange = new HyperliquidConnector(config.evmPrivateKey || '')
    }

    // Initialize price oracle
    this.priceOracle = new PriceOracleService(
      config.priceOracle,
      config.symbol,
      (data) => this.onPriceUpdate(data)
    )
  }

  async start(): Promise<void> {
    if (this.isRunning) {
      console.log('[v0] Market maker already running')
      return
    }

    console.log('[v0] Starting market maker bot...')
    console.log('[v0] Configuration:', this.config)

    try {
      this.isRunning = true
      this.startTime = Date.now()

      // Initialize connections
      await this.exchange.initialize()
      await this.priceOracle.connect()
      
      // Connect to exchange WebSocket
      await this.exchange.connectWebSocket((data) => this.onExchangeUpdate(data))

      // Start main loop
      this.mainLoop()

      console.log('[v0] Market maker bot started successfully')
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Unknown error'
      console.error('[v0] Failed to start market maker:', error)
      this.isRunning = false
      throw error
    }
  }

  async stop(): Promise<void> {
    if (!this.isRunning) {
      return
    }

    console.log('[v0] Stopping market maker bot...')
    this.isRunning = false

    // Cancel all open orders
    try {
      await this.exchange.cancelAllOrders(this.config.symbol)
    } catch (error) {
      console.error('[v0] Error cancelling orders:', error)
    }

    // Disconnect
    this.exchange.disconnect()
    this.priceOracle.disconnect()

    console.log('[v0] Market maker bot stopped')
  }

  private async mainLoop(): Promise<void> {
    while (this.isRunning) {
      try {
        // Update position
        this.currentPosition = await this.exchange.getPosition(this.config.symbol)
        
        // Update active orders
        this.activeOrders = await this.exchange.getOpenOrders(this.config.symbol)

        // Check if we need to update quotes
        if (this.currentMarketData) {
          await this.updateQuotes()
        }

        // Wait before next iteration
        await new Promise(resolve => setTimeout(resolve, 1000))
      } catch (error) {
        this.lastError = error instanceof Error ? error.message : 'Unknown error'
        console.error('[v0] Error in main loop:', error)
        await new Promise(resolve => setTimeout(resolve, 5000))
      }
    }
  }

  private onPriceUpdate(data: MarketData): void {
    this.currentMarketData = data
    
    if (this.config.enableLogging) {
      console.log('[v0] Price update:', {
        symbol: data.symbol,
        fairPrice: data.fairPrice.toFixed(2),
        spread: data.spread.toFixed(2)
      })
    }
  }

  private onExchangeUpdate(data: any): void {
    // Handle exchange updates (fills, cancellations, etc.)
    if (data.type === 'fill') {
      this.tradesCount++
      if (this.config.enableLogging) {
        console.log('[v0] Order filled:', data)
      }
    }
  }

  private async updateQuotes(): Promise<void> {
    if (!this.currentMarketData) return

    const position = this.currentPosition
    const positionSize = position?.size || 0

    // Check if we need to enter close-only mode
    const closeThreshold = this.calculateCloseThreshold()
    const closeMode = Math.abs(positionSize) >= closeThreshold

    // Cancel existing orders if they're too far from fair price
    if (this.activeOrders.length > 0) {
      const shouldCancel = this.activeOrders.some(order => {
        const priceDiff = Math.abs(order.price - this.currentMarketData!.fairPrice)
        const maxDiff = this.currentMarketData!.fairPrice * (this.config.spreadBps / 10000) * 2
        return priceDiff > maxDiff
      })

      if (shouldCancel) {
        await this.exchange.cancelAllOrders(this.config.symbol)
        this.activeOrders = []
      }
    }

    // Place new orders if we don't have active ones
    if (this.activeOrders.length === 0) {
      await this.placeQuotes(closeMode)
    }
  }

  private calculateOrderSize(): number {
    // If USD sizing is enabled and we have a fair price, convert USD to base currency
    if (this.config.useUsdSizing && this.config.orderSizeUsd && this.currentMarketData) {
      return this.config.orderSizeUsd / this.currentMarketData.fairPrice
    }
    // Otherwise use base currency amount
    return this.config.orderSize
  }

  private calculateMaxPosition(): number {
    // If USD sizing is enabled and we have a fair price, convert USD to base currency
    if (this.config.useUsdSizing && this.config.maxPositionUsd && this.currentMarketData) {
      return this.config.maxPositionUsd / this.currentMarketData.fairPrice
    }
    // Otherwise use base currency amount
    return this.config.maxPosition
  }

  private calculateCloseThreshold(): number {
    // If USD sizing is enabled and we have a threshold in USD, convert to base currency
    if (this.config.useUsdSizing && this.config.closeThresholdUsd && this.currentMarketData) {
      return this.config.closeThresholdUsd / this.currentMarketData.fairPrice
    }
    // Otherwise use ratio of max position (e.g., 0.8 * maxPosition)
    return this.calculateMaxPosition() * this.config.closeThreshold
  }

  private async placeQuotes(closeMode: boolean): Promise<void> {
    if (!this.currentMarketData) return

    const fairPrice = this.currentMarketData.fairPrice
    const spreadBps = this.config.spreadBps
    const halfSpread = (fairPrice * spreadBps) / 20000 // Divide by 2 for half spread

    const bidPrice = fairPrice - halfSpread
    const askPrice = fairPrice + halfSpread

    const position = this.currentPosition
    const positionSize = position?.size || 0

    // Calculate order size based on configuration
    const orderSize = this.calculateOrderSize()

    try {
      // Place bid (buy) order
      if (!closeMode || positionSize < 0) {
        const reduceOnly = closeMode && positionSize < 0
        await this.exchange.placeOrder(
          this.config.symbol,
          'buy',
          bidPrice,
          orderSize,
          reduceOnly
        )
      }

      // Place ask (sell) order
      if (!closeMode || positionSize > 0) {
        const reduceOnly = closeMode && positionSize > 0
        await this.exchange.placeOrder(
          this.config.symbol,
          'sell',
          askPrice,
          orderSize,
          reduceOnly
        )
      }

      if (this.config.enableLogging) {
        console.log('[v0] Quotes placed:', {
          bid: bidPrice.toFixed(2),
          ask: askPrice.toFixed(2),
          orderSize: orderSize.toFixed(6),
          orderSizeUsd: this.config.useUsdSizing ? this.config.orderSizeUsd : (orderSize * fairPrice).toFixed(2),
          closeMode
        })
      }
    } catch (error) {
      this.lastError = error instanceof Error ? error.message : 'Unknown error'
      console.error('[v0] Error placing quotes:', error)
    }
  }

  getStatus(): BotStatus {
    return {
      isRunning: this.isRunning,
      exchange: this.config.exchange,
      symbol: this.config.symbol,
      position: this.currentPosition,
      activeOrders: this.activeOrders,
      marketData: this.currentMarketData,
      totalPnl: this.totalPnl,
      tradesCount: this.tradesCount,
      uptime: this.isRunning ? Date.now() - this.startTime : 0,
      lastError: this.lastError || undefined
    }
  }
}
