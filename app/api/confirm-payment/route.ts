import { NextRequest, NextResponse } from 'next/server'

// For testing - in production this would be in ENV variables
const APP_ID = process.env.WORLD_APP_ID || 'test_app_id'
const DEV_PORTAL_API_KEY = process.env.DEV_PORTAL_API_KEY || 'test_key'

// Dočasné úložiště pro payment references - v produkci by bylo v databázi
const paymentReferences = new Map<string, {
  eventId: string
  quantity: number
  totalAmount: number
  buyerAddress?: string
}>()

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
      
      try {
        // Získáme detaily platby z reference (v produkci z databáze)
        const paymentDetails = paymentReferences.get(reference)
        if (!paymentDetails) {
          console.warn('Payment details not found for reference:', reference)
          // Pro testování pokračujeme s default hodnotami
        }
        
        // Zavoláme mint NFT endpoint po úspěšné platbě
        console.log('Calling mint NFT endpoint after successful payment...')
        
        const mintResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/mint-nft-ticket`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            eventId: paymentDetails?.eventId || '1', // fallback pro testování
            quantity: paymentDetails?.quantity || 1,
            buyerAddress: payload.transaction?.from || '0x0000000000000000000000000000000000000000', // adresa z transakce
            totalAmountUSD: paymentDetails?.totalAmount || 10,
            paymentReference: reference
          })
        })
        
        const mintResult = await mintResponse.json()
        console.log('NFT minting result:', mintResult)
        
        if (mintResult.success) {
          console.log('NFT tickets minted successfully:', mintResult.ticketIds)
          return NextResponse.json({ 
            success: true,
            nftTickets: mintResult.ticketIds,
            message: 'Payment confirmed and NFT tickets minted successfully'
          })
        } else {
          console.error('Failed to mint NFT tickets:', mintResult.error)
          // I když NFT minting selže, platba byla úspěšná
          return NextResponse.json({ 
            success: true,
            warning: 'Payment confirmed but NFT minting failed',
            nftError: mintResult.error
          })
        }
        
      } catch (nftError) {
        console.error('Error during NFT minting:', nftError)
        // I když NFT minting selže, platba byla úspěšná
        return NextResponse.json({ 
          success: true,
          warning: 'Payment confirmed but NFT minting encountered an error',
          nftError: nftError instanceof Error ? nftError.message : 'Unknown NFT error'
        })
      }
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

// Pomocná funkce pro uložení payment reference (v produkci by bylo v databázi)
export function storePaymentReference(reference: string, details: {
  eventId: string
  quantity: number
  totalAmount: number
}) {
  paymentReferences.set(reference, details)
} 