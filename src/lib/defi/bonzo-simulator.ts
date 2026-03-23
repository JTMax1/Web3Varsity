/**
 * Bonzo Finance - Intelligent Keeper Simulator Logic
 * 
 * This module simulates the yield-optimizing behavior of an autonomous keeper agent
 * interacting with Bonzo Finance vaults.
 */

export interface BonzoVault {
    id: string;
    name: string;
    asset: string;
    apy: number;
    utilization: number;
    totalLiquidity: number;
}

export const BONZO_VAULTS: BonzoVault[] = [
    {
        id: 'bonzo-hbar',
        name: 'Bonzo HBAR Vault',
        asset: 'HBAR',
        apy: 8.4,
        utilization: 62.5,
        totalLiquidity: 12500000,
    },
    {
        id: 'bonzo-usdc',
        name: 'Bonzo USDC Vault',
        asset: 'USDC',
        apy: 14.2,
        utilization: 88.1,
        totalLiquidity: 5200000,
    },
    {
        id: 'bonzo-weth',
        name: 'Bonzo WETH Vault',
        asset: 'WETH',
        apy: 18.7,
        utilization: 92.3,
        totalLiquidity: 1800000,
    }
];

export interface MarketState {
    volatility: number; // 0-100
    sentiment: 'bullish' | 'bearish' | 'neutral';
    timestamp: Date;
}

/**
 * Generates mock market volatility data to trigger the Keeper Agent
 */
export function generateMarketState(): MarketState {
    const volatility = Math.floor(Math.random() * 101);
    const sentiments: ('bullish' | 'bearish' | 'neutral')[] = ['bullish', 'bearish', 'neutral'];
    const sentiment = sentiments[Math.floor(Math.random() * sentiments.length)];

    return {
        volatility,
        sentiment,
        timestamp: new Date(),
    };
}

/**
 * Keeper Logic: Determines the best action for the vault
 */
export function getKeeperRecommendation(state: MarketState, currentVaultId: string): {
    action: 'HOLD' | 'REBALANCE' | 'WITHDRAW';
    targetVaultId?: string;
    reason: string;
} {
    // If volatility is massive, we move to safest vault (HBAR)
    if (state.volatility > 85) {
        if (currentVaultId !== 'bonzo-hbar') {
            return {
                action: 'REBALANCE',
                targetVaultId: 'bonzo-hbar',
                reason: `High volatility (${state.volatility}%) detected. Moving to lower-risk HBAR vault to preserve capital.`
            };
        }
        return { action: 'HOLD', reason: 'High volatility detected, but already in safest vault.' };
    }

    // If bullish sentiment and low/mid volatility, move to high-yield WETH
    if (state.sentiment === 'bullish' && state.volatility < 40) {
        if (currentVaultId !== 'bonzo-weth') {
            return {
                action: 'REBALANCE',
                targetVaultId: 'bonzo-weth',
                reason: `Market is Bullish with low volatility. Maximizing yield by moving to WETH vault (18.7% APY).`
            };
        }
    }

    return { action: 'HOLD', reason: 'Yield is currently optimized for present market conditions.' };
}
