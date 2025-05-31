const crypto = require('crypto');

// Generujeme random private key
const privateKey = '0x' + crypto.randomBytes(32).toString('hex');

// Pomocí základního ECDSA můžeme vypočítat adresu
function privateKeyToAddress(privateKey) {
  const secp256k1 = require('crypto').createECDH('secp256k1');
  secp256k1.setPrivateKey(privateKey.slice(2), 'hex');
  const publicKey = secp256k1.getPublicKey('hex', 'uncompressed');
  
  // Pro Ethereum adresu potřebujeme keccak256 hash
  const { createHash } = require('crypto');
  const hash = createHash('sha256').update(Buffer.from(publicKey.slice(2), 'hex')).digest('hex');
  
  // Ethereum adresa je posledních 20 bytů hash
  const address = '0x' + hash.slice(-40);
  return address;
}

console.log('=== TESTOVACÍ ÚČET PRO NFT MINTING ===');
console.log('Private Key:', privateKey);
console.log('Pro použití přidejte do .env.local:');
console.log(`NFT_MINTER_PRIVATE_KEY=${privateKey}`);
console.log('');
console.log('⚠️  DŮLEŽITÉ UPOZORNĚNÍ:');
console.log('- Tento private key je POUZE pro testování!');
console.log('- Nikdy ho nepoužívejte na mainnetu!');
console.log('- Nikdy ho nesdílejte s nikým!');
console.log('- V produkci použijte bezpečnější řešení (KMS, Vault, atd.)'); 