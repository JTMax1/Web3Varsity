// Hedera NFT Badge Minting Edge Function
// Mints badge achievements as NFTs on Hedera Testnet & IPFS

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import {
    Client,
    PrivateKey,
    AccountId,
    TokenMintTransaction,
    TransferTransaction,
    Hbar,
} from 'npm:@hashgraph/sdk@^2.75.0';

// Import Pinata IPFS Helpers
import { uploadToPinata, uploadJSONToPinata } from '../mint-certificate/_shared/pinata-uploader.ts';

console.log('Badge Minting Function Started');

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        const { userId, achievementId, userAchievementId, retryClaim } = await req.json();
        console.log('📥 Mint Badge request:', { userId, achievementId, userAchievementId, retryClaim });

        // Ensure authorized
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Fetch User
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('username, hedera_account_id')
            .eq('id', userId)
            .single();

        if (userError || !user) throw new Error('User not found');

        // Hedera SDK Setup
        const operatorId = Deno.env.get('HEDERA_OPERATOR_ID');
        const operatorKey = Deno.env.get('HEDERA_OPERATOR_KEY');
        const collectionTokenId = Deno.env.get('VITE_BADGE_COLLECTION_TOKEN_ID') || Deno.env.get('BADGE_COLLECTION_TOKEN_ID');

        if (!operatorId || !operatorKey || !collectionTokenId) {
            throw new Error('Hedera credentials or Badge Token ID not configured');
        }

        const client = Client.forTestnet();
        const accountId = AccountId.fromString(operatorId);
        let privateKey: PrivateKey;
        try {
            if (operatorKey.startsWith('0x')) {
                privateKey = PrivateKey.fromStringECDSA(operatorKey);
            } else {
                privateKey = PrivateKey.fromStringED25519(operatorKey);
            }
        } catch {
            privateKey = PrivateKey.fromString(operatorKey);
        }
        client.setOperator(accountId, privateKey);
        client.setDefaultMaxTransactionFee(new Hbar(50));

        let serialNumber: number;
        let mintTransactionId = 'retry';
        let isRetry = false;

        // Retry Claim Flow (Transfer previously minted badge from treasury)
        if (retryClaim) {
            console.log('🔁 Executing Retroactive Claim Flow...');
            const { data: existingAchievement } = await supabase
                .from('user_achievements')
                .select('nft_transaction_id')
                .eq('id', userAchievementId)
                .single();

            if (existingAchievement?.nft_transaction_id) {
                isRetry = true;
                console.log('Retrying claim by minting fresh replica for immediate transfer...');
            } else {
                console.log('No previously minted badge found. Upgrading old badge via fresh mint...');
            }
        }

        // Standard Minting Flow
        let badgeMetadata: any = {};
        let achievementName = "Badge";

        // Always fetch achievement details for SVG rendering
        const { data: achievement, error: achError } = await supabase
            .from('achievements')
            .select('*')
            .eq('id', achievementId)
            .single();
        if (achError || !achievement) throw new Error('Achievement not found');

        achievementName = achievement.name;

        // Dynamic Rarity Colors matching the UI Palette
        let gradientStart = "#4F46E5";
        let gradientEnd = "#9333EA";

        switch (achievement.rarity) {
            case 'common':
                gradientStart = '#9CA3AF'; gradientEnd = '#4B5563'; break;
            case 'rare':
                gradientStart = '#60A5FA'; gradientEnd = '#2563EB'; break;
            case 'epic':
                gradientStart = '#C084FC'; gradientEnd = '#9333EA'; break;
            case 'legendary':
                gradientStart = '#FACC15'; gradientEnd = '#F97316'; break;
        }

        // Split HTML/App description into multiple SVG lines (approx 45 chars max per line)
        const words = (achievement.description || "Milestone completed").split(' ');
        let lines: string[] = [];
        let currentLine = "";
        words.forEach((word: string) => {
            if ((currentLine + word).length > 35) {
                lines.push(currentLine.trim());
                currentLine = word + " ";
            } else {
                currentLine += word + " ";
            }
        });
        lines.push(currentLine.trim());

        // Create text elements for description safely wrapped
        let descriptionSvg = '';
        lines.forEach((line, index) => {
            const yOffset = 230 + (index * 24);
            descriptionSvg += `<text x="250" y="${yOffset}" font-family="Arial" font-size="16" fill="white" font-weight="300" text-anchor="middle">${line}</text>\n`;
        });

        // Generate Dynamic Rich SVG string for Badge without external black wrapper
        const badgeSvg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 500 500" width="500" height="500">
  <defs>
    <linearGradient id="bgGlow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${gradientStart}"/>
      <stop offset="100%" stop-color="${gradientEnd}"/>
    </linearGradient>
  </defs>

  <!-- Glowing Hexagon Shield Background (No shadow filter for Hashpack support) -->
  <path d="M250,30 L440,140 L440,360 L250,470 L60,360 L60,140 Z" fill="url(#bgGlow)" />
  <path d="M250,45 L425,145 L425,355 L250,455 L75,355 L75,145 Z" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="4"/>

  <text x="250" y="115" font-family="Arial" font-size="70" fill="white" text-anchor="middle" dominant-baseline="middle">${achievement.icon_emoji || '🏆'}</text>
  <text x="250" y="170" font-family="Arial" font-size="28" fill="white" font-weight="bold" text-anchor="middle" letter-spacing="1">${(achievement.name).toUpperCase()}</text>

  <rect x="180" y="185" width="140" height="24" rx="12" fill="rgba(0,0,0,0.5)"/>
  <text x="250" y="202" font-family="Arial" font-size="12" fill="white" font-weight="bold" text-anchor="middle" letter-spacing="2" text-transform="uppercase">${achievement.rarity} BADGE</text>

  ${descriptionSvg}

  <!-- Recipient Profile Info without background wrapper to prevent overlap -->
  <text x="250" y="325" font-family="Arial" font-size="15" fill="white" font-weight="bold" text-anchor="middle" letter-spacing="1">AWARDED TO ${(user.username || 'Student').toUpperCase()}</text>

  <!-- Immutable Signatures (Shifted up significantly to prevent path clipping) -->
  <text x="250" y="375" font-family="Arial" font-size="12" fill="rgba(255,255,255,0.7)" font-weight="800" text-anchor="middle" letter-spacing="1">ISSUED BY WEB3VARSITY</text>
  <text x="250" y="395" font-family="Arial" font-size="11" fill="rgba(255,255,255,0.5)" text-anchor="middle" letter-spacing="1">POWERED BY HEDERA NATIVE HTS</text>

  <!-- Subtle Decoration -->
  <circle cx="250" cy="425" r="3" fill="rgba(255,255,255,0.3)"/>
</svg>
`.trim();

        // IPFS Pinata Upload
        const pinataKey = Deno.env.get('PINATA_API_KEY');
        const pinataSecret = Deno.env.get('PINATA_API_SECRET');

        if (pinataKey && pinataSecret) {
            console.log("📤 Uploading SVG to Pinata IPFS...");
            const svgUpload = await uploadToPinata(badgeSvg, `badge_${achievement.id}.svg`, pinataKey, pinataSecret);

            console.log("📤 Uploading JSON Metadata to Pinata IPFS...");
            const metadataJson = {
                name: `Web3Varsity Badge: ${achievement.name}`,
                description: achievement.description,
                image: svgUpload.ipfsUrl,
                attributes: [
                    { trait_type: "Rarity", value: achievement.rarity },
                    { trait_type: "Category", value: achievement.category },
                    { trait_type: "Student", value: user.username }
                ]
            };
            const jsonUpload = await uploadJSONToPinata(metadataJson, `badge_${achievement.id}_metadata.json`, pinataKey, pinataSecret);

            // Final Hedera token metadata string maps to the IPFS URI
            badgeMetadata = jsonUpload.ipfsUrl;
        } else {
            console.warn("⚠️ Pinata keys missing. Falling back to on-chain JSON string mapping.");
            badgeMetadata = JSON.stringify({ n: achievement.name, r: achievement.rarity, c: achievement.category });
        }

        // Support string URI (ipfs://...) or JSON fallback
        const metadataString = typeof badgeMetadata === 'string' ? badgeMetadata : JSON.stringify(badgeMetadata);
        const nftMetadataBytes = new TextEncoder().encode(metadataString);

        console.log('🪙 Minting Badge NFT...');
        const mintTx = await new TokenMintTransaction()
            .setTokenId(collectionTokenId)
            .setMetadata([nftMetadataBytes])
            .setMaxTransactionFee(new Hbar(20))
            .freezeWith(client);

        const mintSign = await mintTx.sign(privateKey);
        const mintSubmit = await mintSign.execute(client);
        const mintReceipt = await mintSubmit.getReceipt(client);
        serialNumber = mintReceipt.serials[0].toNumber();
        mintTransactionId = mintSubmit.transactionId.toString();

        console.log(`✅ Badge NFT minted - Serial: ${serialNumber}`);

        // Transfer NFT to recipient
        let transferTransactionId = null;
        let transferStatus = 'minted';

        if (user.hedera_account_id) {
            console.log(`📨 Transferring Badge to ${user.hedera_account_id}...`);
            try {
                const recipientId = AccountId.fromString(user.hedera_account_id);
                const transferTx = await new TransferTransaction()
                    .addNftTransfer(collectionTokenId, serialNumber, accountId, recipientId)
                    .setMaxTransactionFee(new Hbar(20))
                    .freezeWith(client);

                const transferSign = await transferTx.sign(privateKey);
                const transferSubmit = await transferSign.execute(client);
                await transferSubmit.getReceipt(client);

                transferTransactionId = transferSubmit.transactionId.toString();
                transferStatus = 'transferred';
                console.log(`✅ Badge NFT transferred successfully`);
            } catch (transferError: any) {
                console.error('Transfer failed (User may need to Associate Token first):', transferError.message);
                if (isRetry) {
                    throw new Error('TOKEN_NOT_ASSOCIATED_TO_ACCOUNT');
                }
            }
        }

        client.close();

        // Update the database record
        if (userAchievementId && transferStatus === 'transferred') {
            const payload: any = { nft_minted_at: new Date().toISOString() };
            if (transferTransactionId) payload.nft_transaction_id = transferTransactionId;

            await supabase
                .from('user_achievements')
                .update(payload)
                .eq('id', userAchievementId);
        } else if (userAchievementId && !isRetry) {
            // Initial mint, save the mint transaction so we know it exists
            await supabase
                .from('user_achievements')
                .update({ nft_token_id: collectionTokenId, nft_transaction_id: mintTransactionId })
                .eq('id', userAchievementId);
        }

        // Log the transaction
        if (transferStatus === 'transferred') {
            await supabase.from('transactions').insert({
                user_id: userId,
                transaction_type: 'nft_mint_badge',
                transaction_id: transferTransactionId || mintTransactionId,
                amount_hbar: 0,
                status: 'success',
                from_account: operatorId,
                to_account: user.hedera_account_id || operatorId,
                memo: `Badge Claimed Successfully`,
                consensus_timestamp: new Date().toISOString(),
                hashscan_url: `https://hashscan.io/testnet/token/${collectionTokenId}/${serialNumber}`,
            });
        }

        console.log(`✅ Badge flow completed. Status: ${transferStatus}`);

        return new Response(JSON.stringify({
            success: true,
            serialNumber,
            tokenId: collectionTokenId,
            status: transferStatus,
            hashScanUrl: `https://hashscan.io/testnet/token/${collectionTokenId}/${serialNumber}`
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('❌ Badge minting failed:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
});
