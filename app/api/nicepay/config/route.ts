import { NextRequest, NextResponse } from 'next/server'
import { getNicePayClientId, getNicePayJsSDKUrl } from '@/lib/payments/nicepay'

/**
 * Get NicePay client configuration for frontend
 * Returns only safe-to-expose configuration values
 */
export async function GET(request: NextRequest) {
  try {
    console.log('Getting NicePay config...')
    console.log('Environment variables check:')
    console.log('NICEPAY_CLIENT_ID:', process.env.NICEPAY_CLIENT_ID ? 'SET' : 'NOT SET')
    console.log('NICEPAY_SECRET_KEY:', process.env.NICEPAY_SECRET_KEY ? 'SET' : 'NOT SET')
    
    const config = {
      clientId: getNicePayClientId(),
      jsSDKUrl: getNicePayJsSDKUrl(),
      environment: process.env.NODE_ENV === 'production' ? 'production' : 'sandbox'
    }

    console.log('NicePay config generated:', config)

    return NextResponse.json({
      success: true,
      data: config
    })
  } catch (error) {
    console.error('Failed to get NicePay config:', error)
    
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to load payment configuration'
    }, { status: 500 })
  }
}