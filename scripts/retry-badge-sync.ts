import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';

dotenv.config();

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    throw new Error("Missing Supabase credentials in .env");
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function main() {
    console.log("🔍 Scanning for stuck Badges in the Treasury...");

    // Find achievements that have been minted but haven't received their final transfer timestamp
    const { data: stuckBadges, error } = await supabase
        .from('user_achievements')
        .select('*')
        .not('nft_token_id', 'is', null)
        .is('nft_minted_at', null);

    if (error) {
        console.error("❌ Error fetching stuck badges:", error);
        return;
    }

    if (!stuckBadges || stuckBadges.length === 0) {
        console.log("✅ No stuck badges found! Make sure you actually earned one.");
        return;
    }

    console.log(`🚨 Found ${stuckBadges.length} Badge(s) stuck in Treasury!`);

    for (const badge of stuckBadges) {
        console.log(`\n⏳ Attempting Retroactive Claim for Badge UserAchievementID: ${badge.id}...`);

        try {
            const response = await fetch(`${supabaseUrl}/functions/v1/mint-badge`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${supabaseKey}`, // Overriding Edge JWT requirement via custom flag
                    'apikey': supabaseKey
                },
                body: JSON.stringify({
                    userId: badge.user_id,
                    achievementId: badge.achievement_id,
                    userAchievementId: badge.id,
                    retryClaim: true
                })
            });

            const result = await response.json();

            if (response.ok) {
                console.log(`🎉 SUCCESS: Badge Transferred! Status: ${result.status}`);
                console.log(`🔗 HashScan: ${result.hashScanUrl}`);
            } else {
                console.error(`❌ FAILED Retry:`, result.error);
                if (result.error === 'TOKEN_NOT_ASSOCIATED_TO_ACCOUNT') {
                    console.log("⚠️ -> Still NOT associated! Open HashPack and 'Add Token' ID: " + process.env.VITE_BADGE_COLLECTION_TOKEN_ID);
                }
            }
        } catch (e: any) {
            console.error(`❌ Network/Fetch Error:`, e.message);
        }
    }
}

main().catch(console.error);
