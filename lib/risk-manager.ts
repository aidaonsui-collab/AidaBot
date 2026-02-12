import { BotConfig, Position } from './types'
import { logger } from './bot-utils'

export class RiskManager {
  private config: BotConfig

  constructor(config: BotConfig) {
    this.config = config
  }

  /**
   * Check if we can place a new order based on risk limits
   */
  canPlaceOrder(currentPosition: Position | null, side: 'buy' | 'sell', size: number): boolean {
    // Check if we're in close-only mode
    if (this.isCloseOnlyMode(currentPosition)) {
      // Only allow reduce-only orders
      if (currentPosition) {
        if (currentPosition.size > 0 && side === 'sell') {
          return true // Closing long
        } else if (currentPosition.size < 0 && side === 'buy') {
          return true // Closing short
        }
      }
      logger('warn', 'Close-only mode active, rejecting order', { side, size })
      return false
    }

    // Check position size limits
    const newPositionSize = this.calculateNewPositionSize(currentPosition, side, size)
    if (Math.abs(newPositionSize) > this.config.maxPositionSize) {
      logger('warn', 'Order would exceed max position size', {
        newPositionSize,
        maxPositionSize: this.config.maxPositionSize
      })
      return false
    }

    return true
  }

  /**
   * Check if we should be in close-only mode
   */
  isCloseOnlyMode(position: Position | null): boolean {
    if (!position) return false

    // Enter close-only mode if position size exceeds threshold
    const positionSizeThreshold = this.config.maxPositionSize * 0.9
    if (Math.abs(position.size) >= positionSizeThreshold) {
      return true
    }

    // Enter close-only mode if unrealized P&L is too negative
    const maxLossThreshold = this.config.maxPositionSize * this.config.fairPrice * 0.1 // 10% loss
    if (position.unrealizedPnL < -maxLossThreshold) {
      return true
    }

    return false
  }

  /**
   * Calculate what the new position size would be after an order
   */
  private calculateNewPositionSize(
    currentPosition: Position | null,
    side: 'buy' | 'sell',
    size: number
  ): number {
    const currentSize = currentPosition?.size || 0
    const sizeChange = side === 'buy' ? size : -size
    return currentSize + sizeChange
  }

  /**
   * Calculate optimal order size based on available margin
   */
  calculateOptimalOrderSize(availableMargin: number, price: number, leverage: number = 1): number {
    const maxOrderValue = availableMargin * leverage * 0.5 // Use 50% of available margin
    const optimalSize = maxOrderValue / price
    return Math.min(optimalSize, this.config.orderSize)
  }

  /**
   * Check if margin is sufficient for position
   */
  hassufficientMargin(
    totalMargin: number,
    usedMargin: number,
    minMarginRatio: number = 0.2
  ): boolean {
    const marginUtilization = usedMargin / totalMargin
    return marginUtilization < (1 - minMarginRatio)
  }

  /**
   * Calculate required margin for a position
   */
  calculateRequiredMargin(size: number, price: number, leverage: number = 1): number {
    return (Math.abs(size) * price) / leverage
  }

  /**
   * Get recommended action based on current state
   */
  getRecommendedAction(
    position: Position | null,
    marginUtilization: number
  ): 'none' | 'reduce' | 'close' {
    // High margin utilization - recommend reducing position
    if (marginUtilization > 0.8) {
      return 'close'
    } else if (marginUtilization > 0.6) {
      return 'reduce'
    }

    // Large unrealized loss - recommend closing
    if (position && position.unrealizedPnL < 0) {
      const lossPercentage = Math.abs(position.unrealizedPnL) / (position.entryPrice * Math.abs(position.size))
      if (lossPercentage > 0.15) {
        return 'close'
      } else if (lossPercentage > 0.1) {
        return 'reduce'
      }
    }

    return 'none'
  }

  /**
   * Update config
   */
  updateConfig(newConfig: Partial<BotConfig>): void {
    this.config = { ...this.config, ...newConfig }
    logger('info', 'Risk manager config updated', newConfig)
  }
}
