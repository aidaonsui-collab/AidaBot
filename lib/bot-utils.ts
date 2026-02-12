/**
 * Utility functions for the market maker bot
 */

export function calculateSpread(price: number, basisPoints: number): number {
  return price * (basisPoints / 10000)
}

export function roundToTickSize(price: number, tickSize: number): number {
  return Math.round(price / tickSize) * tickSize
}

export function formatPrice(price: number, decimals: number = 2): string {
  return price.toFixed(decimals)
}

export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`
}

export function calculatePnL(
  entryPrice: number,
  currentPrice: number,
  size: number,
  isLong: boolean
): number {
  const priceDiff = isLong ? currentPrice - entryPrice : entryPrice - currentPrice
  return priceDiff * size
}

export function calculateLiquidationPrice(
  entryPrice: number,
  leverage: number,
  isLong: boolean
): number {
  const liquidationPercentage = 1 / leverage
  if (isLong) {
    return entryPrice * (1 - liquidationPercentage)
  } else {
    return entryPrice * (1 + liquidationPercentage)
  }
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function exponentialBackoff(attempt: number, baseDelay: number = 1000): number {
  return Math.min(baseDelay * Math.pow(2, attempt), 30000)
}

export class RateLimiter {
  private tokens: number
  private lastRefill: number
  private readonly maxTokens: number
  private readonly refillRate: number

  constructor(maxRequests: number, intervalMs: number) {
    this.maxTokens = maxRequests
    this.tokens = maxRequests
    this.lastRefill = Date.now()
    this.refillRate = maxRequests / intervalMs
  }

  async acquire(): Promise<void> {
    this.refill()
    
    while (this.tokens < 1) {
      await sleep(100)
      this.refill()
    }
    
    this.tokens -= 1
  }

  private refill(): void {
    const now = Date.now()
    const timePassed = now - this.lastRefill
    const tokensToAdd = timePassed * this.refillRate
    
    this.tokens = Math.min(this.maxTokens, this.tokens + tokensToAdd)
    this.lastRefill = now
  }
}

export function validatePrivateKey(key: string): boolean {
  // Basic validation for hex private key
  return /^(0x)?[0-9a-fA-F]{64}$/.test(key)
}

export function validateAddress(address: string, blockchain: 'sui' | 'evm'): boolean {
  if (blockchain === 'sui') {
    // Sui addresses are 32 bytes in hex
    return /^0x[0-9a-fA-F]{64}$/.test(address)
  } else {
    // EVM addresses are 20 bytes in hex
    return /^0x[0-9a-fA-F]{40}$/.test(address)
  }
}

export function logger(level: 'info' | 'warn' | 'error', message: string, data?: any): void {
  const timestamp = new Date().toISOString()
  const logMessage = `[${timestamp}] [${level.toUpperCase()}] ${message}`
  
  if (data) {
    console.log(logMessage, data)
  } else {
    console.log(logMessage)
  }
}
