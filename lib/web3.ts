import { createPublicClient, createWalletClient, http, parseEther } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { worldchain } from 'viem/chains'

// TicketNFT contract ABI - jen základní funkce které potřebujeme
export const TicketNFTABI = [
  {
    inputs: [
      { name: '_name', type: 'string' },
      { name: '_description', type: 'string' },
      { name: '_date', type: 'uint256' },
      { name: '_location', type: 'string' },
      { name: '_ticketPrice', type: 'uint256' },
      { name: '_totalTickets', type: 'uint256' },
      { name: '_eventType', type: 'string' }
    ],
    name: 'createEvent',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'nonpayable',
    type: 'function'
  },
  {
    inputs: [{ name: '_eventId', type: 'uint256' }],
    name: 'purchaseTicket',
    outputs: [{ type: 'uint256' }],
    stateMutability: 'payable',
    type: 'function'
  },
  {
    inputs: [{ name: '_eventId', type: 'uint256' }],
    name: 'events',
    outputs: [
      { name: 'id', type: 'uint256' },
      { name: 'name', type: 'string' },
      { name: 'description', type: 'string' },
      { name: 'date', type: 'uint256' },
      { name: 'location', type: 'string' },
      { name: 'ticketPrice', type: 'uint256' },
      { name: 'totalTickets', type: 'uint256' },
      { name: 'soldTickets', type: 'uint256' },
      { name: 'vendor', type: 'address' },
      { name: 'eventType', type: 'string' }
    ],
    stateMutability: 'view',
    type: 'function'
  },
  {
    inputs: [{ name: '_ticketId', type: 'uint256' }],
    name: 'getTicketInfo',
    outputs: [
      { name: 'ticketId', type: 'uint256' },
      { name: 'eventId', type: 'uint256' },
      { name: 'owner', type: 'address' },
      { name: 'isForSale', type: 'bool' },
      { name: 'salePrice', type: 'uint256' },
      { name: 'specificBuyer', type: 'address' },
      { name: 'hasAttended', type: 'bool' }
    ],
    stateMutability: 'view',
    type: 'function'
  }
] as const

// Web3 configuration
export const publicClient = createPublicClient({
  chain: worldchain,
  transport: http(process.env.WORLDCHAIN_RPC_URL || 'https://worldchain-mainnet.g.alchemy.com/public')
})

// Pomocná funkce pro validaci a normalizaci private key
function validateAndNormalizePrivateKey(privateKey: string): `0x${string}` {
  if (!privateKey) {
    throw new Error('Private key is required')
  }
  
  // Odstraníme whitespace
  let cleanKey = privateKey.trim()
  
  // Přidáme 0x prefix pokud chybí
  if (!cleanKey.startsWith('0x')) {
    cleanKey = '0x' + cleanKey
  }
  
  // Zkontrolujeme délku (0x + 64 hex characters = 66 total)
  if (cleanKey.length !== 66) {
    throw new Error(`Invalid private key length: expected 66 characters (including 0x), got ${cleanKey.length}`)
  }
  
  // Zkontrolujeme, zda obsahuje pouze validní hex characters
  const hexRegex = /^0x[0-9a-fA-F]{64}$/
  if (!hexRegex.test(cleanKey)) {
    throw new Error('Private key must contain only valid hexadecimal characters')
  }
  
  return cleanKey as `0x${string}`
}

// Wallet client pro transakce (potřebuje private key)
export function createWalletClientFromKey(privateKey: string) {
  try {
    // Validace a normalizace private key
    const normalizedKey = validateAndNormalizePrivateKey(privateKey)
    
    // Vytvoření účtu z private key
    const account = privateKeyToAccount(normalizedKey)
    
    return createWalletClient({
      account,
      chain: worldchain,
      transport: http(process.env.WORLDCHAIN_RPC_URL || 'https://worldchain-mainnet.g.alchemy.com/public')
    })
  } catch (error) {
    console.error('Error creating wallet client:', error)
    throw new Error(`Failed to create wallet client: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

// Contract address - bude potřeba nastavit po deploymentu
export const TICKET_NFT_CONTRACT_ADDRESS = process.env.TICKET_NFT_CONTRACT_ADDRESS as `0x${string}` || '0x0000000000000000000000000000000000000000'

// Pomocná funkce pro konverzi ceny
export function convertUSDToWei(usdAmount: number): bigint {
  // Jednoduchá konverze - v produkci byste použili Oracle pro aktuální kurz
  // Pro tesování předpokládáme 1 USD = 0.0003 ETH
  const ethAmount = usdAmount * 0.0003
  return parseEther(ethAmount.toString())
} 