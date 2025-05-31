const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

console.log('🚀 Nastavení environment proměnných pro NFT minting...\n');

// Vygenerujeme nový private key
const privateKey = '0x' + crypto.randomBytes(32).toString('hex');

// Přečteme existující .env.local nebo vytvoříme nový
const envPath = path.join(process.cwd(), '.env.local');
let envContent = '';

if (fs.existsSync(envPath)) {
  envContent = fs.readFileSync(envPath, 'utf8');
  console.log('✅ Existující .env.local nalezen');
} else {
  console.log('📝 Vytváří se nový .env.local soubor');
}

// Environment proměnné které potřebujeme
const requiredVars = {
  'NFT_MINTER_PRIVATE_KEY': privateKey,
  'TICKET_NFT_CONTRACT_ADDRESS': '0x0000000000000000000000000000000000000000',
  'WORLDCHAIN_RPC_URL': 'https://worldchain-mainnet.g.alchemy.com/public',
  'NEXT_PUBLIC_BASE_URL': 'http://localhost:3000'
};

// Aktualizujeme nebo přidáme proměnné
let lines = envContent ? envContent.split('\n') : [];
let addedVars = [];

Object.entries(requiredVars).forEach(([key, defaultValue]) => {
  const existingLineIndex = lines.findIndex(line => line.startsWith(`${key}=`));
  
  if (existingLineIndex !== -1) {
    if (key === 'NFT_MINTER_PRIVATE_KEY') {
      // Pro private key vždy generujeme nový
      lines[existingLineIndex] = `${key}=${defaultValue}`;
      console.log(`🔄 Aktualizován ${key}`);
    } else {
      console.log(`✅ ${key} už existuje`);
    }
  } else {
    lines.push(`${key}=${defaultValue}`);
    addedVars.push(key);
    console.log(`➕ Přidán ${key}`);
  }
});

// Zapíšeme zpět do souboru
const newEnvContent = lines.filter(line => line.trim() !== '').join('\n') + '\n';
fs.writeFileSync(envPath, newEnvContent);

console.log('\n🎉 Environment proměnné byly nastaveny!\n');

// Zobrazíme další kroky
console.log('📋 DALŠÍ KROKY:');
console.log('1. Získejte testovací ETH pro tento účet na Worldchain testnet');
console.log('2. Nasaďte váš TicketNFT kontrakt na Worldchain');
console.log('3. Aktualizujte TICKET_NFT_CONTRACT_ADDRESS v .env.local');
console.log('');
console.log('🔧 NOVÝ PRIVATE KEY VYGENEROVÁN:');
console.log(`   ${privateKey}`);
console.log('');
console.log('⚠️  BEZPEČNOST:');
console.log('- Tento private key je POUZE pro testování!');
console.log('- Nikdy ho necommitujte do Gitu!');
console.log('- Pro produkci použijte bezpečnější řešení!');

if (addedVars.length > 0) {
  console.log('\n📁 Přidané proměnné do .env.local:');
  addedVars.forEach(varName => console.log(`   - ${varName}`));
} 