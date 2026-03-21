// Hedera NFT Badge Minting Edge Function
// Mints badge achievements as NFTs on Hedera Testnet

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
        const { userId, achievementId, userAchievementId } = await req.json();
        console.log('📥 Mint Badge request:', { userId, achievementId, userAchievementId });

        // Ensure authorized
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
        }

        const supabase = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
        );

        // Fetch User and Achievement
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('username, hedera_account_id')
            .eq('id', userId)
            .single();

        if (userError || !user) throw new Error('User not found');

        const { data: achievement, error: achError } = await supabase
            .from('achievements')
            .select('*')
            .eq('id', achievementId)
            .single();

        if (achError || !achievement) throw new Error('Achievement not found');

        // Hedera SDK Setup
        const operatorId = Deno.env.get('HEDERA_OPERATOR_ID');
        const operatorKey = Deno.env.get('HEDERA_OPERATOR_KEY');

        // We expect VITE_BADGE_COLLECTION_TOKEN_ID to be in the environment! (Or BADGE_COLLECTION_TOKEN_ID)
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

        // Construct NFT Metadata (on-chain maximum limit is roughly 100 bytes unless stored in decentralized storage)
        // For the hackathon, we will store a simplified JSON direct or URI on-chain!
        const badgeMetadata = {
            n: achievement.name,
            r: achievement.rarity,
            c: achievement.category
        };
        const nftMetadataBytes = new TextEncoder().encode(JSON.stringify(badgeMetadata));

        console.log('🪙 Minting Badge NFT...');
        const mintTx = await new TokenMintTransaction()
            .setTokenId(collectionTokenId)
            .setMetadata([nftMetadataBytes])
            .setMaxTransactionFee(new Hbar(20))
            .freezeWith(client);

        const mintSign = await mintTx.sign(privateKey);
        const mintSubmit = await mintSign.execute(client);
        const mintReceipt = await mintSubmit.getReceipt(client);
        const serialNumber = mintReceipt.serials[0];
        const mintTransactionId = mintSubmit.transactionId.toString();

        console.log(`✅ Badge NFT minted - Serial: ${serialNumber.toString()}`);

        // Transfer NFT to recipient
        let transferTransactionId = null;
        let transferStatus = 'minted';

        if (user.hedera_account_id) {
            console.log(`📨 Transferring Badge to ${user.hedera_account_id}...`);
            try {
                const recipientId = AccountId.fromString(user.hedera_account_id);
                const transferTx = await new TransferTransaction()
                    .addNftTransfer(collectionTokenId, serialNumber, accountId, recipientId)
                    .setTransactionMemo(`Web3Versity Badge: ${achievement.name}`)
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
            }
        }

        client.close();

        // Update the database record using the userAchievementId passed from auto-award
        if (userAchievementId) {
            await supabase
                .from('user_achievements')
                .update({
                    nft_token_id: collectionTokenId,
                    nft_minted_at: new Date().toISOString(),
                    nft_transaction_id: mintTransactionId
                })
                .eq('id', userAchievementId);
        }

        // Log the transaction
        await supabase.from('transactions').insert({
            user_id: userId,
            transaction_type: 'nft_mint_badge',
            transaction_id: mintTransactionId,
            amount_hbar: 0,
            status: 'success',
            from_account: operatorId,
            to_account: user.hedera_account_id || operatorId,
            memo: `Badge Awarded: ${achievement.name}`,
            consensus_timestamp: new Date().toISOString(),
            hashscan_url: `https://hashscan.io/testnet/token/${collectionTokenId}/${serialNumber.toString()}`,
        });

        console.log('✅ Badge flow completed successfully!');

        return new Response(JSON.stringify({
            success: true,
            serialNumber: serialNumber.toNumber(),
            tokenId: collectionTokenId,
            hashScanUrl: `https://hashscan.io/testnet/token/${collectionTokenId}/${serialNumber.toString()}`
        }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } });

    } catch (error: any) {
        console.error('❌ Badge minting failed:', error);
        return new Response(JSON.stringify({ error: error.message }), { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } });
    }
});
