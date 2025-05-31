import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const { eventId, quantity, totalAmount } = await req.json()
    
    // Generate unique reference ID
    const reference = crypto.randomUUID().replace(/-/g, '')
    
    // TODO: Store reference ID in database along with payment information
    // For now just return reference ID
    
    console.log('Initiated payment:', { reference, eventId, quantity, totalAmount })
    
    return NextResponse.json({ 
      id: reference,
      eventId,
      quantity,
      totalAmount 
    })
  } catch (error) {
    console.error('Error initiating payment:', error)
    return NextResponse.json(
      { error: 'Failed to initiate payment' },
      { status: 500 }
    )
  }
} 