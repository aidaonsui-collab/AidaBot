import { NextRequest, NextResponse } from 'next/server'
import { MarketMaker } from '@/lib/market-maker'
import { BotConfig } from '@/lib/types'

// Store active bot instances
const activeBots = new Map<string, MarketMaker>()

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { action, botId, config } = body

    if (action === 'start') {
      if (activeBots.has(botId)) {
        return NextResponse.json(
          { error: 'Bot already running' },
          { status: 400 }
        )
      }

      const botConfig: BotConfig = config
      const bot = new MarketMaker(botConfig)
      
      await bot.start()
      activeBots.set(botId, bot)

      return NextResponse.json({
        success: true,
        message: 'Bot started successfully',
        status: bot.getStatus()
      })
    }

    if (action === 'stop') {
      const bot = activeBots.get(botId)
      if (!bot) {
        return NextResponse.json(
          { error: 'Bot not found' },
          { status: 404 }
        )
      }

      await bot.stop()
      activeBots.delete(botId)

      return NextResponse.json({
        success: true,
        message: 'Bot stopped successfully'
      })
    }

    if (action === 'status') {
      const bot = activeBots.get(botId)
      if (!bot) {
        return NextResponse.json(
          { error: 'Bot not found' },
          { status: 404 }
        )
      }

      return NextResponse.json({
        success: true,
        status: bot.getStatus()
      })
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    )
  } catch (error) {
    console.error('[v0] API error:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const botId = searchParams.get('botId')

  if (!botId) {
    return NextResponse.json(
      { error: 'Bot ID required' },
      { status: 400 }
    )
  }

  const bot = activeBots.get(botId)
  if (!bot) {
    return NextResponse.json(
      { error: 'Bot not found' },
      { status: 404 }
    )
  }

  return NextResponse.json({
    success: true,
    status: bot.getStatus()
  })
}
