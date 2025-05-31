import { NextRequest, NextResponse } from 'next/server'
import { storePaymentReference } from '../confirm-payment/route'

export async function POST(req: NextRequest) {
  try {
    const { eventId, quantity, totalAmount } = await req.json()
    
    // Generate unique reference ID
    const reference = crypto.randomUUID().replace(/-/g, '')
    
    // Store payment details for later use in confirm-payment
    storePaymentReference(reference, {
      eventId,
      quantity,
      totalAmount
    })
    
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