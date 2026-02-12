#!/usr/bin/env tsx

import { PriceOracle } from '../lib/price-oracle'
import { FlowXConnector } from '../lib/exchanges/flowx'
import { HyperliquidConnector } from '../lib/exchanges/hyperliquid'
import { logger } from '../lib/bot-utils'

async function testPriceOracle() {
  console.log('\n=== Testing Price Oracle ===\n')
  
  const oracle = new PriceOracle('binance')
  
  try {
    await oracle.connect('BTCUSDT')
    console.log('✓ Connected to Binance WebSocket')
    
    // Wait for price updates
    await new Promise(resolve => setTimeout(resolve, 3000))
    
    const fairPrice = oracle.getFairPrice()
    console.log(`✓ Fair Price: $${fairPrice.toFixed(2)}`)
    
    oracle.disconnect()
    console.log('✓ Disconnected from price oracle')
  } catch (error) {
    console.error('✗ Price oracle test failed:', error)
  }
}

async function testFlowX() {
  console.log('\n=== Testing FlowX Connection ===\n')
  
  const privateKey = process.env.SUI_PRIVATE_KEY
  if (!privateKey) {
    console.log('⚠ SUI_PRIVATE_KEY not set, skipping FlowX test')
    return
  }
  
  try {
    const flowx = new FlowXConnector(privateKey, 'mainnet')
    console.log('✓ FlowX connector initialized')
    
    const balance = await flowx.getBalance()
    console.log(`✓ Balance: ${balance.available} SUI available, ${balance.locked} SUI locked`)
    
  } catch (error) {
    console.error('✗ FlowX test failed:', error)
  }
}

async function testHyperliquid() {
  console.log('\n=== Testing Hyperliquid Connection ===\n')
  
  const privateKey = process.env.EVM_PRIVATE_KEY
  if (!privateKey) {
    console.log('⚠ EVM_PRIVATE_KEY not set, skipping Hyperliquid test')
    return
  }
  
  try {
    const hl = new HyperliquidConnector(privateKey, 'mainnet')
    console.log('✓ Hyperliquid connector initialized')
    
    const balance = await hl.getBalance()
    console.log(`✓ Balance: $${balance.available} available, $${balance.locked} locked`)
    
    const position = await hl.getPosition('BTC')
    if (position) {
      console.log(`✓ Current Position: ${position.size} BTC @ $${position.entryPrice}`)
    } else {
      console.log('✓ No open position')
    }
    
  } catch (error) {
    console.error('✗ Hyperliquid test failed:', error)
  }
}

async function main() {
  console.log('╔════════════════════════════════════════╗')
  console.log('║   Market Maker Bot Connection Test    ║')
  console.log('╚════════════════════════════════════════╝')
  
  await testPriceOracle()
  await testFlowX()
  await testHyperliquid()
  
  console.log('\n=== Test Complete ===\n')
  process.exit(0)
}

main().catch(error => {
  console.error('Test failed:', error)
  process.exit(1)
})
