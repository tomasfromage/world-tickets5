import { NextRequest, NextResponse } from 'next/server'
import { createWalletClientFromKey, publicClient, TicketNFTABI, TICKET_NFT_CONTRACT_ADDRESS, convertUSDToWei } from '@/lib/web3'

interface MintTicketRequest {
  eventId: string
  quantity: number
  buyerAddress: string
  totalAmountUSD: number
  paymentReference: string
}

export async function POST(req: NextRequest) {
  try {
    const { eventId, quantity, buyerAddress, totalAmountUSD, paymentReference }: MintTicketRequest = await req.json()
    
    console.log('Minting NFT ticket:', { eventId, quantity, buyerAddress, totalAmountUSD, paymentReference })
    
    // Zkontrolujeme, zda máme všechny potřebné environment proměnné
    const privateKey = process.env.NFT_MINTER_PRIVATE_KEY
    console.log('Private key status:', {
      exists: !!privateKey,
      length: privateKey?.length,
      prefix: privateKey?.startsWith('0x'),
      type: typeof privateKey
    })
    
    if (!privateKey) {
      console.error('NFT_MINTER_PRIVATE_KEY not found in environment variables')
      return NextResponse.json({ 
        success: false, 
        error: 'Server configuration error - minter key not found' 
      }, { status: 500 })
    }
    
    if (!TICKET_NFT_CONTRACT_ADDRESS || TICKET_NFT_CONTRACT_ADDRESS === '0x0000000000000000000000000000000000000000') {
      console.error('TICKET_NFT_CONTRACT_ADDRESS not configured')
      return NextResponse.json({ 
        success: false, 
        error: 'Server configuration error - contract address not found' 
      }, { status: 500 })
    }
    
    // Vytvoříme wallet client s lepším error handlingem
    let walletClient
    try {
      console.log('Creating wallet client...')
      walletClient = createWalletClientFromKey(privateKey)
      console.log('Wallet client created successfully')
    } catch (walletError) {
      console.error('Failed to create wallet client:', walletError)
      return NextResponse.json({ 
        success: false, 
        error: 'Failed to create wallet client',
        details: walletError instanceof Error ? walletError.message : 'Unknown wallet error'
      }, { status: 500 })
    }
    
    // Mint NFT tickets pro kupujícího
    const ticketIds = []
    
    for (let i = 0; i < quantity; i++) {
      try {
        console.log(`Minting ticket ${i + 1}/${quantity} for event ${eventId}`)
        
        // Konvertujeme eventId na uint256 (předpokládáme numerické ID)
        const eventIdUint = BigInt(eventId)
        
        // Konvertujeme cenu na Wei (pro platbu kontraktu)
        const ticketPriceWei = convertUSDToWei(totalAmountUSD / quantity)
        
        console.log('Transaction parameters:', {
          contractAddress: TICKET_NFT_CONTRACT_ADDRESS,
          eventId: eventIdUint.toString(),
          ticketPriceWei: ticketPriceWei.toString(),
          walletAddress: walletClient.account.address
        })
        
        // Zavoláme purchaseTicket funkci kontraktu
        const hash = await walletClient.writeContract({
          address: TICKET_NFT_CONTRACT_ADDRESS,
          abi: TicketNFTABI,
          functionName: 'purchaseTicket',
          args: [eventIdUint],
          value: ticketPriceWei,
        })
        
        console.log(`Transaction hash for ticket ${i + 1}: ${hash}`)
        
        // Počkáme na potvrzení transakce
        const receipt = await publicClient.waitForTransactionReceipt({ hash })
        console.log(`Ticket ${i + 1} minted successfully: ${receipt.transactionHash}`)
        
        // Extrahujeme ticket ID z events (pokud kontrakt emituje events)
        if (receipt.logs && receipt.logs.length > 0) {
          // Zde bychom parsovali logs pro získání ticket ID
          // Pro jednoduchost nyní použijeme hash jako identifikátor
          ticketIds.push({
            ticketId: receipt.transactionHash,
            transactionHash: receipt.transactionHash,
            blockNumber: receipt.blockNumber.toString()
          })
        }
        
      } catch (error) {
        console.error(`Error minting ticket ${i + 1}:`, error)
        throw error
      }
    }
    
    console.log('All tickets minted successfully:', ticketIds)
    
    return NextResponse.json({ 
      success: true, 
      ticketIds,
      message: `Successfully minted ${quantity} NFT ticket(s)`,
      contractAddress: TICKET_NFT_CONTRACT_ADDRESS
    })
    
  } catch (error) {
    console.error('Error minting NFT tickets:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to mint NFT tickets',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 