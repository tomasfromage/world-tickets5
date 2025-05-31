# NFT Ticket Setup Guide

Po úspěšné platbě se nyní automaticky vytvoří NFT ticket podle kontraktu TicketNFT.sol.

## Environment Variables

Do vašeho `.env.local` souboru přidejte tyto proměnné:

```bash
# Web3 Configuration for NFT Minting
WORLDCHAIN_RPC_URL=https://worldchain-mainnet.g.alchemy.com/public
TICKET_NFT_CONTRACT_ADDRESS=0x_YOUR_DEPLOYED_CONTRACT_ADDRESS
NFT_MINTER_PRIVATE_KEY=0x_YOUR_PRIVATE_KEY_FOR_MINTING

# Application Configuration  
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

## Kroky pro nasazení

### 1. Deploy TicketNFT Contract
Nejdříve nasaďte kontrakt `contracts/TicketNFT.sol` na Worldchain:

```bash
# Nastavte deployment script a nasaďte kontrakt
# Uložte si adresu nasazeného kontraktu
```

### 2. Nastavte Environment Variables
- `TICKET_NFT_CONTRACT_ADDRESS`: Adresa vašeho nasazeného kontraktu
- `NFT_MINTER_PRIVATE_KEY`: Private key účtu, který bude mintovat NFT (musí mít ETH na Worldchain)
- `WORLDCHAIN_RPC_URL`: RPC endpoint pro Worldchain

### 3. Přidejte ETH na Minter Account
Účet s `NFT_MINTER_PRIVATE_KEY` musí mít dostatek ETH na Worldchain pro:
- Gas fees při mintování NFT
- Platby za ticket price (konvertované z USD na ETH)

## Jak to funguje

1. **Platba přes MiniKit**: Uživatel zaplatí pomocí USDC přes World App
2. **Potvrzení platby**: Backend ověří platbu na `/api/confirm-payment`
3. **Minting NFT**: Po úspěšné platbě se automaticky zavolá `/api/mint-nft-ticket`
4. **Vytvoření NFT**: Pro každý zakoupený ticket se vytvoří NFT na kontraktu
5. **Úspěch**: Uživatel obdrží potvrzení a NFT tickets

## API Endpoints

### `/api/mint-nft-ticket`
- **POST**: Vytvoří NFT tickets po úspěšné platbě
- Volá kontrakt funkci `purchaseTicket(eventId)`
- Vrací transaction hash a ticket ID

### `/api/confirm-payment` (aktualizováno)
- **POST**: Potvrdí platbu a automaticky vytvoří NFT
- Po úspěšné platbě zavolá mint endpoint
- Vrací informace o vytvořených NFT tickets

## Testování

Pro testování můžete:
1. Nastavit testovací kontrakt na Worldchain testnet
2. Použít testovací private key s testovacím ETH
3. Testovat celý flow od platby po vytvoření NFT

## Poznámky

- Konverze USD na ETH je nyní statická (1 USD = 0.0003 ETH)
- V produkci byste měli použít Oracle pro aktuální kurz
- Všechny NFT informace by měly být uloženy v databázi
- Private key by měl být zabezpečený (použijte KMS nebo podobné řešení) 