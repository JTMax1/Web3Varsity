import { Client, PrivateKey, AccountId, TokenCreateTransaction, TokenType, TokenSupplyType, Hbar } from '@hashgraph/sdk';
import * as dotenv from 'dotenv';
import * as fs from 'fs';

dotenv.config();

async function main() {
    const operatorId = process.env.VITE_HEDERA_OPERATOR_ID;
    const operatorKey = process.env.VITE_HEDERA_OPERATOR_KEY;

    if (!operatorId || !operatorKey) {
        throw new Error("Missing VITE_HEDERA_OPERATOR_ID or VITE_HEDERA_OPERATOR_KEY");
    }

    const client = Client.forTestnet();
    const accountId = AccountId.fromString(operatorId);

    // Parse key
    let privateKey: PrivateKey;
    try {
        if (operatorKey.startsWith('0x')) {
            privateKey = PrivateKey.fromStringECDSA(operatorKey);
        } else {
            privateKey = PrivateKey.fromStringED25519(operatorKey);
        }
    } catch (e: any) {
        // Fallback or handle differently
        try {
            privateKey = PrivateKey.fromString(operatorKey);
        } catch (e2) {
            throw new Error("Could not parse private key format");
        }
    }

    client.setOperator(accountId, privateKey);
    client.setDefaultMaxTransactionFee(new Hbar(50));

    console.log("🛠️ Creating 'Web3Versity Badges' NFT Collection on Hedera Testnet...");

    const tx = await new TokenCreateTransaction()
        .setTokenName("Web3Versity Badges")
        .setTokenSymbol("W3VBADG")
        .setTokenType(TokenType.NonFungibleUnique)
        .setSupplyType(TokenSupplyType.Infinite)
        .setDecimals(0)
        .setInitialSupply(0)
        .setTreasuryAccountId(accountId)
        .setSupplyKey(privateKey) // Necessary to mint new NFTs afterward
        .freezeWith(client);

    const signedTx = await tx.sign(privateKey);
    const txResponse = await signedTx.execute(client);
    const receipt = await txResponse.getReceipt(client);

    const tokenId = receipt.tokenId;

    if (!tokenId) {
        throw new Error("Failed to create token");
    }

    console.log(`✅ Success! Web3Versity Badges generated.`);
    console.log(`🪙 Token ID: ${tokenId.toString()}`);
    console.log(`🔗 HashScan: https://hashscan.io/testnet/token/${tokenId.toString()}`);

    // Automatically append to .env
    const envPath = '.env';
    let envContent = fs.readFileSync(envPath, 'utf8');

    if (envContent.includes('VITE_BADGE_COLLECTION_TOKEN_ID=')) {
        envContent = envContent.replace(/VITE_BADGE_COLLECTION_TOKEN_ID=.*/g, `VITE_BADGE_COLLECTION_TOKEN_ID=${tokenId.toString()}`);
    } else {
        envContent += `\nVITE_BADGE_COLLECTION_TOKEN_ID=${tokenId.toString()}\n`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log(`📝 Appended VITE_BADGE_COLLECTION_TOKEN_ID=${tokenId.toString()} to .env file!`);

    client.close();
    process.exit(0);
}

main().catch(console.error);
