#!/usr/bin/env node

import { config as loadEnv } from 'dotenv'
import { MarketMaker } from '../lib/market-maker'
import { BotConfig } from '../lib/types'

// Load environment variables from .env.local and .env files
loadEnv({ path: '.env.local' })
loadEnv() // Also load .env as fallback

// Parse command line arguments
const args = process.argv.slice(2)

function parseArgs(): Partial<BotConfig> {
  const config: Partial<BotConfig> = {}
  
  for (let i = 0; i < args.length; i += 2) {
    const key = args[i].replace('--', '')
    const value = args[i + 1]
    
    switch (key) {
      case 'exchange':
        config.exchange = value as 'flowx' | 'hyperliquid'
        break
      case 'symbol':
        config.symbol = value
        break
      case 'oracle':
        config.priceOracle = value as 'binance' | 'hyperliquid'
        break
      case 'spread':
        config.spreadBps = parseInt(value)
        break
      case 'size':
        config.orderSize = parseFloat(value)
        break
      case 'size-usd':
        config.orderSizeUsd = parseFloat(value)
        config.useUsdSizing = true
        break
      case 'max-position':
        config.maxPosition = parseFloat(value)
        break
      case 'max-position-usd':
        config.maxPositionUsd = parseFloat(value)
        config.useUsdSizing = true
        break
      case 'close-threshold':
        config.closeThreshold = parseFloat(value)
        break
      case 'close-threshold-usd':
        config.closeThresholdUsd = parseFloat(value)
        config.useUsdSizing = true
        break
      case 'sui-key':
        config.suiPrivateKey = value
        break
      case 'evm-key':
        config.evmPrivateKey = value
        break
      case 'logging':
        config.enableLogging = value === 'true'
        break
    }
  }
  
  return config
}

function getConfigFromEnv(): BotConfig {
  const useUsdSizing = process.env.USE_USD_SIZING === 'true' || 
                       !!process.env.ORDER_SIZE_USD || 
                       !!process.env.MAX_POSITION_USD
  
  return {
    exchange: (process.env.EXCHANGE as 'flowx' | 'hyperliquid') || 'flowx',
    symbol: process.env.SYMBOL || 'BTC',
    priceOracle: (process.env.PRICE_ORACLE as 'binance' | 'hyperliquid') || 'binance',
    spreadBps: parseInt(process.env.SPREAD_BPS || '10'),
    orderSize: parseFloat(process.env.ORDER_SIZE || '0.001'),
    orderSizeUsd: process.env.ORDER_SIZE_USD ? parseFloat(process.env.ORDER_SIZE_USD) : undefined,
    maxPosition: parseFloat(process.env.MAX_POSITION || '1'),
    maxPositionUsd: process.env.MAX_POSITION_USD ? parseFloat(process.env.MAX_POSITION_USD) : undefined,
    closeThreshold: parseFloat(process.env.CLOSE_THRESHOLD || '0.8'),
    closeThresholdUsd: process.env.CLOSE_THRESHOLD_USD ? parseFloat(process.env.CLOSE_THRESHOLD_USD) : undefined,
    useUsdSizing,
    suiPrivateKey: process.env.SUI_PRIVATE_KEY,
    evmPrivateKey: process.env.EVM_PRIVATE_KEY,
    enableLogging: process.env.ENABLE_LOGGING === 'true'
  }
}

function printUsage() {
  console.log(`
Multi-Exchange Market Maker Bot

Usage:
  npm run bot -- [options]

Options:
  --exchange <flowx|hyperliquid>    Exchange to trade on
  --symbol <symbol>                 Trading symbol (e.g., BTC, ETH)
  --oracle <binance|hyperliquid>    Price oracle to use
  --spread <bps>                    Spread in basis points
  
  Order Size (choose one):
  --size <amount>                   Order size in base currency (e.g., 0.001 BTC)
  --size-usd <amount>               Order size in USD (e.g., 100)
  
  Position Limits (choose one):
  --max-position <amount>           Max position in base currency
  --max-position-usd <amount>       Max position in USD
  
  Close Threshold (choose one):
  --close-threshold <ratio>         Close mode at position ratio (e.g., 0.8)
  --close-threshold-usd <amount>    Close mode at USD notional
  
  Keys:
  --sui-key <key>                   Sui private key (for FlowX)
  --evm-key <key>                   EVM private key (for Hyperliquid)
  --logging <true|false>            Enable detailed logging

Environment Variables:
  EXCHANGE, SYMBOL, PRICE_ORACLE, SPREAD_BPS
  ORDER_SIZE, ORDER_SIZE_USD (use USD for notional-based sizing)
  MAX_POSITION, MAX_POSITION_USD
  CLOSE_THRESHOLD, CLOSE_THRESHOLD_USD
  USE_USD_SIZING (set to 'true' to force USD mode)
  SUI_PRIVATE_KEY, EVM_PRIVATE_KEY, ENABLE_LOGGING

Examples:
  # Using USD-based sizing (recommended)
  npm run bot -- --exchange hyperliquid --symbol BTC --oracle binance --spread 10 --size-usd 100 --max-position-usd 2000 --evm-key 0x...

  # Using base currency sizing
  npm run bot -- --exchange flowx --symbol ETH --oracle binance --spread 10 --size 0.05 --max-position 1 --sui-key your_key

  # Using environment variables with USD sizing
  export EXCHANGE=hyperliquid
  export SYMBOL=BTC
  export ORDER_SIZE_USD=100
  export MAX_POSITION_USD=2000
  export CLOSE_THRESHOLD_USD=1600
  npm run bot
  `)
}

async function main() {
  if (args.includes('--help') || args.includes('-h')) {
    printUsage()
    process.exit(0)
  }

  // Merge env config with CLI args (CLI args take precedence)
  const envConfig = getConfigFromEnv()
  const cliConfig = parseArgs()
  const config: BotConfig = { ...envConfig, ...cliConfig }

  // Validate config
  if (!config.exchange || !config.symbol) {
    console.error('Error: Exchange and symbol are required')
    printUsage()
    process.exit(1)
  }

  if (config.exchange === 'flowx' && !config.suiPrivateKey) {
    console.error('Error: Sui private key required for FlowX')
    process.exit(1)
  }

  if (config.exchange === 'hyperliquid' && !config.evmPrivateKey) {
    console.error('Error: EVM private key required for Hyperliquid')
    process.exit(1)
  }

  console.log('Starting market maker with configuration:')
  console.log({
    ...config,
    suiPrivateKey: config.suiPrivateKey ? '***' : undefined,
    evmPrivateKey: config.evmPrivateKey ? '***' : undefined
  })

  const bot = new MarketMaker(config)

  // Handle graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nShutting down gracefully...')
    await bot.stop()
    process.exit(0)
  })

  process.on('SIGTERM', async () => {
    console.log('\nShutting down gracefully...')
    await bot.stop()
    process.exit(0)
  })

  try {
    await bot.start()

    // Print status every 10 seconds
    setInterval(() => {
      const status = bot.getStatus()
      console.log('\n--- Bot Status ---')
      console.log('Running:', status.isRunning)
      console.log('Uptime:', Math.floor(status.uptime / 1000), 'seconds')
      console.log('Position:', status.position?.size || 0)
      console.log('Active Orders:', status.activeOrders.length)
      console.log('Total Trades:', status.tradesCount)
      console.log('Total PnL:', status.totalPnl.toFixed(2))
      if (status.marketData) {
        console.log('Fair Price:', status.marketData.fairPrice.toFixed(2))
      }
      if (status.lastError) {
        console.log('Last Error:', status.lastError)
      }
    }, 10000)
  } catch (error) {
    console.error('Failed to start bot:', error)
    process.exit(1)
  }
}

main()
