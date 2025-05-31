# Jak získat Private Key pro NFT Minting

## 🧪 Pro testování a vývoj

### Možnost 1: Vygenerovat nový testovací účet
```bash
# Spusťte tento script pro vygenerování nového účtu
node scripts/generate-test-account.js
```

### Možnost 2: Export z MetaMask (POUZE pro testování!)
1. Otevřete MetaMask
2. Klikněte na tři tečky → Account details
3. Klikněte na "Export Private Key"
4. Zadejte heslo a zkopírujte private key

⚠️ **NIKDY neexportujte private key z účtu s reálnými penězi!**

### Možnost 3: Použijte vývojový seed phrase
```javascript
// Pro lokální vývoj můžete použít standardní test seed:
// "test test test test test test test test test test test junk"
// A vygenerovat z něj private key pro první účet
```

## 💰 Jak získat testovací ETH

### Worldchain Testnet Faucets
1. **Sepolia ETH** (pro bridge na Worldchain):
   - https://sepoliafaucet.com/
   - https://faucet.quicknode.com/ethereum/sepolia

2. **Bridge na Worldchain**:
   - Použijte Worldchain bridge pro převod z Sepolia na Worldchain testnet
   - https://bridge.worldchain.org/

### Alternativně - lokální testnet
```bash
# Pokud používáte lokální Anvil/Hardhat node
# Má přednastavené účty s ETH
npx hardhat node
```

## 🔒 Pro produkční nasazení

### Doporučené řešení:
1. **AWS KMS** - spravované HSM
2. **HashiCorp Vault** - bezpečné úložiště secrets
3. **Azure Key Vault** - Microsoft cloud HSM
4. **Hardware Security Modules (HSM)**

### Jednodušší produkční řešení:
```bash
# 1. Vytvořte nový účet jen pro minting
# 2. Uložte private key do environment variables
# 3. Omezený přístup pouze pro vaši aplikaci
# 4. Pravidelně rotujte klíče
```

## 📋 Checklist před nasazením

### Testování:
- [ ] Vygenerovali jste testovací private key
- [ ] Přidali jste do `.env.local`
- [ ] Účet má testovací ETH na Worldchain
- [ ] Kontrakt je nasazený na testnet

### Produkce:
- [ ] Nový účet jen pro minting
- [ ] Private key v bezpečném úložišti
- [ ] Účet má dostatek ETH na gas fees
- [ ] Pravidelné zálohování a rotace klíčů
- [ ] Monitoring transakcí

## 🚨 Bezpečnostní pravidla

### CO NIKDY NEDĚLAT:
- ❌ Nikdy nepoužívejte hlavní účet s velkými prostředky
- ❌ Nikdy nesdílejte private key v kódu nebo Gitu
- ❌ Nikdy neposílejte private key přes chat nebo email
- ❌ Nikdy neukládejte private key do veřejného repository

### CO DĚLAT:
- ✅ Používejte samostatný účet jen pro minting
- ✅ Pravidelně kontrolujte transakce
- ✅ Držte jen minimální množství ETH na účtu
- ✅ Používejte environment variables
- ✅ Zálohujte přístupové údaje bezpečně

## 💡 Tipy pro bezpečnost

1. **Minimální zůstatek**: Držte jen tolik ETH, kolik potřebujete pro gas fees
2. **Monitoring**: Nastavte alerty na neočekávané transakce
3. **Rotace**: Pravidelně vyměňujte private keys
4. **Testování**: Vždy nejdříve testujte na testnetu 