const crypto = require('crypto');

console.log('🔍 Test private key formátu...\n');

// Test 1: Vygenerujeme nový správný private key
const newPrivateKey = '0x' + crypto.randomBytes(32).toString('hex');
console.log('✅ Nový validní private key:', newPrivateKey);
console.log('   Délka:', newPrivateKey.length, 'characters');
console.log('   Prefix:', newPrivateKey.startsWith('0x') ? '✅ má 0x' : '❌ chybí 0x');

// Test 2: Zkontrolujeme environment variable
const envPrivateKey = process.env.NFT_MINTER_PRIVATE_KEY;
console.log('\n🔍 Environment variable check:');
if (envPrivateKey) {
  console.log('✅ NFT_MINTER_PRIVATE_KEY existuje');
  console.log('   Délka:', envPrivateKey.length, 'characters');
  console.log('   Prefix:', envPrivateKey.startsWith('0x') ? '✅ má 0x' : '❌ chybí 0x');
  console.log('   Hodnota:', envPrivateKey.substring(0, 10) + '...');
  
  // Validace formátu
  const hexRegex = /^0x[0-9a-fA-F]{64}$/;
  if (hexRegex.test(envPrivateKey)) {
    console.log('✅ Formát je validní');
  } else {
    console.log('❌ Nevalidní formát!');
    if (envPrivateKey.length !== 66) {
      console.log(`   Problém: Nesprávná délka (očekáváno 66, má ${envPrivateKey.length})`);
    }
    if (!envPrivateKey.startsWith('0x')) {
      console.log('   Problém: Chybí 0x prefix');
    }
  }
} else {
  console.log('❌ NFT_MINTER_PRIVATE_KEY neexistuje v environment');
}

// Test 3: Simulace viem validace
try {
  console.log('\n🧪 Test viem validace...');
  
  // Simulujeme stejnou validaci jako používá viem
  function testViemValidation(privateKey) {
    if (!privateKey) throw new Error('Private key is required');
    
    let cleanKey = privateKey.trim();
    if (!cleanKey.startsWith('0x')) {
      cleanKey = '0x' + cleanKey;
    }
    
    if (cleanKey.length !== 66) {
      throw new Error(`Invalid length: expected 66, got ${cleanKey.length}`);
    }
    
    const hexRegex = /^0x[0-9a-fA-F]{64}$/;
    if (!hexRegex.test(cleanKey)) {
      throw new Error('Invalid hex format');
    }
    
    return cleanKey;
  }
  
  if (envPrivateKey) {
    const validatedKey = testViemValidation(envPrivateKey);
    console.log('✅ Viem validace prošla:', validatedKey.substring(0, 10) + '...');
  } else {
    console.log('⚠️  Žádný private key k testování');
  }
  
} catch (error) {
  console.log('❌ Viem validace selhala:', error.message);
}

console.log('\n💡 OPRAVA:');
console.log('Pokud máte problémy s private key, spusťte:');
console.log('node scripts/setup-env.js');
console.log('\nNebo ručně do .env.local přidejte:');
console.log(`NFT_MINTER_PRIVATE_KEY=${newPrivateKey}`); 