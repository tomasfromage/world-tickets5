import { NextRequest, NextResponse } from 'next/server'

// For testing - in production this would be in ENV variables
const APP_ID = process.env.WORLD_APP_ID || 'test_app_id'
const DEV_PORTAL_API_KEY = process.env.DEV_PORTAL_API_KEY || 'test_key'

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json()
    
    console.log('Received payment confirmation:', payload)
    
    // TODO: Load reference from database for verification
    const reference = payload.reference
    
    if (!reference) {
      return NextResponse.json({ 
        success: false, 
        error: 'Missing reference' 
      }, { status: 400 })
    }
    
    // For testing - in production you would verify transaction via World Developer Portal API
    /*
    const response = await fetch(
      `https://developer.worldcoin.org/api/v2/minikit/transaction/${payload.transaction_id}?app_id=${APP_ID}`,
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${DEV_PORTAL_API_KEY}`,
        },
      }
    )
    const transaction = await response.json()
    
    if (transaction.reference === reference && transaction.status !== 'failed') {
      return NextResponse.json({ success: true })
    } else {
      return NextResponse.json({ success: false })
    }
    */
    
    // For testing - always accept payment
    if (payload.status === 'success') {
      console.log('Payment confirmed successfully for reference:', reference)
      return NextResponse.json({ success: true })
    }
    
    return NextResponse.json({ success: false })
    
  } catch (error) {
    console.error('Error confirming payment:', error)
    return NextResponse.json(
      { error: 'Failed to confirm payment' },
      { status: 500 }
    )
  }
} 