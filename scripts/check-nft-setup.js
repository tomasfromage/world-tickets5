const fs = require('fs');
const path = require('path');

console.log('🔍 Kontrola nastavení pro NFT minting...\n');

// Zkontrolujeme .env.local
const envPath = path.join(process.cwd(), '.env.local');
if (!fs.existsSync(envPath)) {
  console.log('❌ .env.local soubor neexistuje!');
  console.log('   Spusťte: node scripts/setup-env.js');
  process.exit(1);
}

const envContent = fs.readFileSync(envPath, 'utf8');
const requiredVars = [
  'NFT_MINTER_PRIVATE_KEY',
  'TICKET_NFT_CONTRACT_ADDRESS',
  'WORLDCHAIN_RPC_URL',
  'NEXT_PUBLIC_BASE_URL'
];

let allGood = true;

console.log('📋 ENVIRONMENT VARIABLES:');
requiredVars.forEach(varName => {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm');
  const match = envContent.match(regex);
  
  if (match) {
    const value = match[1];
    if (varName === 'TICKET_NFT_CONTRACT_ADDRESS' && value === '0x0000000000000000000000000000000000000000') {
      console.log(`⚠️  ${varName}: ${value} (PLACEHOLDER - aktualizujte po deployi kontraktu)`);
    } else if (varName === 'NFT_MINTER_PRIVATE_KEY') {
      console.log(`✅ ${varName}: ${value.substring(0, 10)}... (${value.length} characters)`);
    } else {
      console.log(`✅ ${varName}: ${value}`);
    }
  } else {
    console.log(`❌ ${varName}: CHYBÍ!`);
    allGood = false;
  }
});

console.log('\n🔧 POTŘEBNÉ SOUBORY:');

// Zkontrolujeme důležité soubory
const importantFiles = [
  'lib/web3.ts',
  'app/api/mint-nft-ticket/route.ts',
  'contracts/TicketNFT.sol'
];

importantFiles.forEach(filePath => {
  if (fs.existsSync(filePath)) {
    console.log(`✅ ${filePath}`);
  } else {
    console.log(`❌ ${filePath}: CHYBÍ!`);
    allGood = false;
  }
});

console.log('\n📝 STATUS:');
if (allGood) {
  console.log('✅ Základní nastavení je v pořádku!');
  console.log('\n🧪 PRO TESTOVÁNÍ:');
  console.log('1. Spusťte: yarn dev');
  console.log('2. Otevřete aplikaci v browseru');
  console.log('3. Jděte na event detail page');
  console.log('4. Klikněte na "🧪 Test NFT Minting"');
  console.log('5. Sledujte console pro debugging');
  
  console.log('\n⚠️  POZNÁMKY:');
  console.log('- Platba je zakomentovaná pro testování');
  console.log('- NFT minting může selhat, pokud není kontrakt nasazený');
  console.log('- Pro produkci odkomentujte platební logiku');
} else {
  console.log('❌ Něco chybí! Opravte chyby výše.');
}

console.log('\n📚 UŽITEČNÉ PŘÍKAZY:');
console.log('- Nastavení: node scripts/setup-env.js');
console.log('- Nový private key: node scripts/generate-test-account.js');
console.log('- Tato kontrola: node scripts/check-nft-setup.js'); 