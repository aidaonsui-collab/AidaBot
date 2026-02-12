import { Order, Position, Orderbook } from '../types'
import { ethers } from 'ethers'
import WebSocket from 'ws'

export class HyperliquidConnector {
  private apiUrl = 'https://api.hyperliquid.xyz'
  private wsUrl = 'wss://api.hyperliquid.xyz/ws'
  private privateKey: string
  private wallet: ethers.Wallet
  private wsConnection: WebSocket | null = null
  private address: string = ''

  constructor(privateKey: string) {
    this.privateKey = privateKey
    this.wallet = new ethers.Wallet(privateKey)
    this.address = this.wallet.address
  }

  async initialize(): Promise<void> {
    console.log('[v0] Initializing Hyperliquid connector...')
    console.log('[v0] Using address:', this.address)
  }

  private getAssetIndex(symbol: string): number {
    // Map symbols to Hyperliquid asset indices
    const assetMap: { [key: string]: number } = {
      'BTC': 0,
      'ETH': 1,
      'SOL': 2,
      'MATIC': 3,
      'ARB': 4
    }
    return assetMap[symbol] ?? 0
  }

  private async signAction(action: any, nonce: number, expiresAfter: number): Promise<any> {
    // Create EIP-712 typed data for Hyperliquid
    const domain = {
      name: 'Exchange',
      version: '1',
      chainId: 42161, // Arbitrum
      verifyingContract: '0x0000000000000000000000000000000000000000' as `0x${string}`
    }

    const types = {
      Agent: [
        { name: 'source', type: 'string' },
        { name: 'connectionId', type: 'bytes32' }
      ]
    }

    // For now, use simple message signing as EIP-712 requires more complex setup
    const message = JSON.stringify({ action, nonce, expiresAfter })
    const signature = await this.wallet.signMessage(message)
    
    // Split signature into r, s, v components
    const sig = ethers.Signature.from(signature)
    
    return {
      signature: {
        r: sig.r,
        s: sig.s,
        v: sig.v
      },
      action,
      nonce,
      expiresAfter
    }
  }

  async placeOrder(
    symbol: string,
    side: 'buy' | 'sell',
    price: number,
    size: number,
    reduceOnly: boolean = false
  ): Promise<Order> {
    console.log(`[v0] Placing ${side} order on Hyperliquid: ${size} @ ${price}`)

    const assetIndex = this.getAssetIndex(symbol)
    const nonce = Date.now()
    const expiresAfter = nonce + 20000 // Expire in 20 seconds

    const action = {
      type: 'order',
      orders: [
        {
          a: assetIndex, // Asset index, not address
          b: side === 'buy',
          p: price.toFixed(2),
          s: size.toFixed(6),
          r: reduceOnly,
          t: { limit: { tif: 'Gtc' } }
        }
      ],
      grouping: 'na'
    }

    try {
      const signed = await this.signAction(action, nonce, expiresAfter)
      
      console.log('[v0] Sending order request:', JSON.stringify(signed, null, 2))
      
      const response = await fetch(`${this.apiUrl}/exchange`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(signed)
      })

      console.log('[v0] Response status:', response.status)
      
      const responseText = await response.text()
      console.log('[v0] Response body:', responseText.substring(0, 500))
      
      let result
      try {
        result = JSON.parse(responseText)
      } catch (e) {
        console.error('[v0] Failed to parse response as JSON')
        throw new Error(`API returned non-JSON response: ${responseText.substring(0, 200)}`)
      }

      if (result.status === 'ok' && result.response?.data?.statuses?.[0]) {
        const status = result.response.data.statuses[0]
        
        if (status.error) {
          console.error('[v0] Hyperliquid order error:', status.error)
          throw new Error(status.error)
        }

        const order: Order = {
          id: status.oid?.toString() || `hl_${Date.now()}`,
          symbol,
          side,
          price,
          size,
          type: 'limit',
          reduceOnly,
          status: 'open',
          timestamp: Date.now()
        }

        console.log('[v0] Order placed successfully:', order.id)
        return order
      } else {
        console.error('[v0] Hyperliquid API error:', result)
        throw new Error(result.status || 'Unknown error')
      }
    } catch (error) {
      console.error('[v0] Failed to place order:', error)
      throw error
    }
  }

  async cancelOrder(orderId: string): Promise<boolean> {
    console.log(`[v0] Cancelling order ${orderId} on Hyperliquid`)
    
    const action = {
      type: 'cancel',
      cancels: [{ a: this.address, o: parseInt(orderId) }]
    }

    try {
      const signed = await this.signAction(action)
      
      const response = await fetch(`${this.apiUrl}/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signed)
      })

      const result = await response.json()
      console.log('[v0] Cancel order result:', result)
      
      return result.status === 'ok'
    } catch (error) {
      console.error('[v0] Failed to cancel order:', error)
      return false
    }
  }

  async cancelAllOrders(symbol: string): Promise<boolean> {
    console.log(`[v0] Cancelling all orders for ${symbol} on Hyperliquid`)
    
    const action = {
      type: 'cancel',
      cancels: [{ a: this.address, o: null }]
    }

    try {
      const signed = await this.signAction(action)
      
      const response = await fetch(`${this.apiUrl}/exchange`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(signed)
      })

      const result = await response.json()
      console.log('[v0] Cancel all orders result:', result)
      
      return result.status === 'ok'
    } catch (error) {
      console.error('[v0] Failed to cancel all orders:', error)
      return false
    }
  }

  async getPosition(symbol: string): Promise<Position | null> {
    try {
      const response = await fetch(`${this.apiUrl}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'clearinghouseState',
          user: this.address
        })
      })

      const data = await response.json()
      
      // Find position for the symbol
      const assetPosition = data.assetPositions?.find((p: any) => p.position.coin === symbol)
      
      if (!assetPosition || parseFloat(assetPosition.position.szi) === 0) {
        return null
      }

      return {
        symbol,
        size: parseFloat(assetPosition.position.szi),
        entryPrice: parseFloat(assetPosition.position.entryPx || '0'),
        markPrice: parseFloat(assetPosition.position.positionValue || '0'),
        unrealizedPnl: parseFloat(assetPosition.position.unrealizedPnl || '0'),
        realizedPnl: 0,
        leverage: parseFloat(assetPosition.position.leverage?.value || '10'),
        liquidationPrice: parseFloat(assetPosition.position.liquidationPx || '0')
      }
    } catch (error) {
      console.error('[v0] Failed to get position:', error)
      return null
    }
  }

  async getOpenOrders(symbol: string): Promise<Order[]> {
    try {
      const response = await fetch(`${this.apiUrl}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'openOrders',
          user: this.address
        })
      })

      const orders = await response.json()
      
      return orders
        .filter((o: any) => o.coin === symbol)
        .map((o: any) => ({
          id: o.oid.toString(),
          symbol: o.coin,
          side: o.side === 'B' ? 'buy' : 'sell',
          price: parseFloat(o.limitPx),
          size: parseFloat(o.sz),
          type: 'limit',
          reduceOnly: o.reduceOnly || false,
          status: 'open',
          timestamp: o.timestamp || Date.now()
        }))
    } catch (error) {
      console.error('[v0] Failed to get open orders:', error)
      return []
    }
  }

  async getOrderbook(symbol: string): Promise<Orderbook> {
    try {
      const response = await fetch(`${this.apiUrl}/info`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          type: 'l2Book',
          coin: symbol
        })
      })

      const data = await response.json()
      
      return {
        symbol,
        bids: data.levels?.[0]?.map((l: any) => ({ price: parseFloat(l.px), size: parseFloat(l.sz) })) || [],
        asks: data.levels?.[1]?.map((l: any) => ({ price: parseFloat(l.px), size: parseFloat(l.sz) })) || [],
        timestamp: Date.now()
      }
    } catch (error) {
      console.error('[v0] Failed to get orderbook:', error)
      return {
        symbol,
        bids: [],
        asks: [],
        timestamp: Date.now()
      }
    }
  }

  async connectWebSocket(onMessage: (data: any) => void): Promise<void> {
    this.wsConnection = new WebSocket(this.wsUrl)

    this.wsConnection.onopen = () => {
      console.log('[v0] Hyperliquid WebSocket connected')
      
      // Subscribe to user events
      this.wsConnection?.send(JSON.stringify({
        method: 'subscribe',
        subscription: {
          type: 'userEvents',
          user: this.address
        }
      }))
    }

    this.wsConnection.onmessage = (event) => {
      const data = JSON.parse(event.data)
      onMessage(data)
    }

    this.wsConnection.onerror = (error) => {
      console.error('[v0] Hyperliquid WebSocket error:', error)
    }

    this.wsConnection.onclose = () => {
      console.log('[v0] Hyperliquid WebSocket closed')
      setTimeout(() => this.connectWebSocket(onMessage), 5000)
    }
  }

  disconnect(): void {
    if (this.wsConnection) {
      this.wsConnection.close()
      this.wsConnection = null
    }
  }
}
