import React, { useState, useEffect, useRef } from 'react';
import {
    BONZO_VAULTS,
    generateMarketState,
    getKeeperRecommendation,
    MarketState,
    BonzoVault
} from '../../../lib/defi/bonzo-simulator';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Switch } from '../../ui/switch';
import { Progress } from '../../ui/progress';
import {
    TrendingUp,
    Activity,
    Terminal,
    Shield,
    RefreshCw,
    BrainCircuit,
    Zap,
    ArrowRightLeft,
    AlertTriangle
} from 'lucide-react';
import { toast } from 'sonner';
import { useWallet } from '../../../contexts/WalletContext';
import { getBalance, submitTransaction } from '../../../lib/hederaUtils';
import { env } from '../../../config';

interface LogEntry {
    type: 'info' | 'agent' | 'action' | 'warning';
    message: string;
    time: string;
}

export function BonzoDeFiSimulator({ onInteract }: { onInteract?: () => void }) {
    // Wallet Hooks
    const { connected, connect, account, accountId, activeProvider, balance, refreshBalance } = useWallet();

    // State
    const [selectedVault, setSelectedVault] = useState<BonzoVault>(BONZO_VAULTS[0]);
    const [isKeeperEnabled, setIsKeeperEnabled] = useState(false);
    const [marketState, setMarketState] = useState<MarketState>(generateMarketState());
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isRebalancing, setIsRebalancing] = useState(false);
    const [isDepositing, setIsDepositing] = useState(false);
    const [userPosition, setUserPosition] = useState<{ vaultId: string, amount: number, txHash?: string } | null>(null);

    const logEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll logs
    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    // Utility to add logs
    const addLog = (message: string, type: LogEntry['type'] = 'info') => {
        const time = new Date().toLocaleTimeString();
        setLogs(prev => [...prev.slice(-49), { message, type, time }]);
    };

    // Initial greeting
    useEffect(() => {
        addLog("Web3Varsity Bonzo Keeper Agent Initialized...", 'agent');
        addLog("Connected to Bonzo Finance (Testnet Vaults)", 'info');
    }, []);

    // Market Update Loop
    useEffect(() => {
        const interval = setInterval(() => {
            const newState = generateMarketState();
            setMarketState(newState);

            if (isKeeperEnabled && userPosition) {
                processKeeperLogic(newState);
            }
        }, 5000); // Update every 5 seconds for simulation speed

        return () => clearInterval(interval);
    }, [isKeeperEnabled, userPosition]);

    const processKeeperLogic = async (state: MarketState) => {
        if (!userPosition) return;

        const recommendation = getKeeperRecommendation(state, userPosition.vaultId);

        if (recommendation.action === 'REBALANCE' && recommendation.targetVaultId) {
            addLog(`[INTELLIGENCE] Triggering Autonomous Rebalance: ${recommendation.reason}`, 'agent');
            await executeRebalance(recommendation.targetVaultId);
        } else {
            // Periodic "Thinking" log
            if (Math.random() > 0.7) {
                addLog(`[MONITOR] ${recommendation.reason}`, 'agent');
            }
        }
    };

    const executeRebalance = async (targetId: string) => {
        setIsRebalancing(true);
        const targetVault = BONZO_VAULTS.find(v => v.id === targetId)!;

        addLog(`🔄 Initiating Hedera Agent Kit rebalance to ${targetVault.name}...`, 'action');

        // Note: Real rebalance would require a contract call.
        // For simulation, we wait and update state.
        await new Promise(r => setTimeout(r, 2000));

        setUserPosition(prev => prev ? { ...prev, vaultId: targetId } : null);
        setSelectedVault(targetVault);
        setIsRebalancing(false);

        toast.success(`Agent rebalanced to ${targetVault.name}`, {
            description: "Yield maximized based on market sentiment."
        });

        addLog(`✅ Rebalance Complete. Current Position: ${targetVault.name} @ ${targetVault.apy}% APY`, 'action');
    };

    const handleDeposit = async () => {
        if (!connected) {
            await connect();
            return;
        }

        if (balance < 1) {
            toast.error("Insufficient HBAR balance on Testnet.");
            return;
        }

        setIsDepositing(true);
        addLog(`🚀 Initiating real Testnet transaction for ${selectedVault.name}...`, 'action');

        try {
            const amount = 1; // Real 1 HBAR deposit for simulation
            const treasury = env.HEDERA_OPERATOR_EVM; // Send to platform treasury as "Vault"

            const result = await submitTransaction(
                account!,
                treasury,
                amount,
                activeProvider || undefined
            );

            if (result.status === 'success') {
                setUserPosition({
                    vaultId: selectedVault.id,
                    amount,
                    txHash: result.transactionId
                });
                await refreshBalance();
                addLog(`✅ Deposit Confirmed: 1 HBAR into ${selectedVault.name} Vault`, 'info');
                addLog(`🔗 Explorer: ${result.explorerUrl}`, 'info');
                toast.success("Successfully deposited 1 HBAR!");
            } else {
                addLog(`❌ Transaction Failed`, 'warning');
                toast.error("Transaction failed");
            }
        } catch (error: any) {
            console.error('Deposit error:', error);
            addLog(`❌ Error: ${error.message}`, 'warning');
            toast.error("Deposit failed");
        } finally {
            setIsDepositing(false);
        }
    };

    const handleWithdraw = async () => {
        if (!userPosition) return;

        addLog(`📤 Withdrew ${userPosition.amount} HBAR from Bonzo Protocol`, 'info');
        setUserPosition(null);
        await refreshBalance();
        toast("Withdrawal complete");
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto p-4 animate-in fade-in duration-700">

            {/* Left Panel: DeFi UI */}
            <div className="space-y-6">
                <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
                    <div className="flex justify-between items-start mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">Bonzo Vaults</h1>
                            <p className="text-gray-500 font-medium">Lending & Liquidity Ecosystem</p>
                        </div>
                        <div className="p-3 bg-blue-50 rounded-2xl">
                            <Shield className="w-8 h-8 text-[#0084C7]" />
                        </div>
                    </div>

                    <div className="space-y-4 mb-8">
                        {BONZO_VAULTS.map(vault => (
                            <div
                                key={vault.id}
                                onClick={() => setSelectedVault(vault)}
                                className={`relative overflow-hidden cursor-pointer rounded-2xl p-5 border-2 transition-all duration-300 ${selectedVault.id === vault.id
                                    ? 'border-[#0084C7] bg-blue-50/50 shadow-md ring-1 ring-[#0084C7]'
                                    : 'border-gray-100 bg-white hover:border-gray-300'
                                    }`}
                            >
                                {userPosition?.vaultId === vault.id && (
                                    <div className="absolute top-0 right-0 p-2">
                                        <Badge className="bg-green-500/10 text-green-600 border-green-200">
                                            ACTIVE
                                        </Badge>
                                    </div>
                                )}
                                <div className="flex items-center gap-4">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${selectedVault.id === vault.id ? 'bg-[#0084C7] text-white' : 'bg-gray-100 text-gray-600'
                                        }`}>
                                        {vault.asset[0]}
                                    </div>
                                    <div className="flex-1">
                                        <h4 className="font-bold text-gray-900">{vault.name}</h4>
                                        <div className="flex items-center gap-3 mt-1">
                                            <span className="text-sm font-bold text-green-600">{vault.apy}% APY</span>
                                            <span className="text-xs text-gray-400">|</span>
                                            <span className="text-xs text-gray-500">{vault.utilization}% Yield Efficiency</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-200">
                        <div className="flex justify-between text-sm mb-4">
                            <span className="text-gray-600 font-medium">Your Simulation Balance:</span>
                            <span className="font-bold text-[#0084C7]">
                                {balance.toFixed(4)} HBAR
                            </span>
                        </div>
                        {userPosition && (
                            <div className="flex justify-between text-sm mb-4 p-3 bg-green-50 rounded-xl border border-green-100">
                                <span className="text-green-700 font-medium">Vault Position:</span>
                                <span className="font-bold text-green-800">{userPosition.amount} HBAR in {BONZO_VAULTS.find(v => v.id === userPosition.vaultId)?.name}</span>
                            </div>
                        )}

                        <div className="flex gap-4">
                            {!userPosition ? (
                                <Button
                                    onClick={handleDeposit}
                                    disabled={isDepositing}
                                    className="w-full h-14 bg-[#0084C7] hover:bg-[#0070a9] text-white rounded-xl font-bold shadow-lg shadow-blue-500/20 disabled:opacity-50"
                                >
                                    {isDepositing ? 'Processing...' : `Deposit 1 HBAR into ${selectedVault.name}`}
                                </Button>
                            ) : (
                                <Button
                                    onClick={handleWithdraw}
                                    variant="outline"
                                    className="w-full h-14 border-red-200 text-red-600 hover:bg-red-50 rounded-xl font-bold"
                                >
                                    Withdraw Capital
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Keeper Control Card */}
                <Card className="p-8 border-none bg-gradient-to-br from-indigo-900 to-blue-900 text-white shadow-2xl overflow-hidden relative">
                    <div className="absolute top-0 right-0 p-12 opacity-10">
                        <BrainCircuit className="w-32 h-32" />
                    </div>

                    <div className="relative z-10">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center gap-3">
                                <Shield className="w-6 h-6 text-blue-300" />
                                <h3 className="text-xl font-bold">Autonomous Keeper Mode</h3>
                            </div>
                            <Switch
                                checked={isKeeperEnabled}
                                onCheckedChange={(checked) => {
                                    setIsKeeperEnabled(checked);
                                    if (checked) {
                                        addLog("🚀 Keeper Mode Engaged: Agent is now monitoring market volatility.", 'action');
                                        toast.success("Autonomous Keeper Enabled");
                                    } else {
                                        addLog("⏸️ Keeper Mode Disengaged.", 'warning');
                                        toast("Keeper disabled");
                                    }
                                }}
                            />
                        </div>

                        <p className="text-blue-100/80 text-sm mb-8 leading-relaxed">
                            When enabled, the Hedera Agent Kit will monitor Bonzo Finance vaults. If volatility exceeds 85%, the agent will autonomously move your liquidity to a lower-risk vault to protect against liquidation or slippage.
                        </p>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Status</p>
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${isKeeperEnabled ? 'bg-green-400 animate-pulse' : 'bg-gray-400'}`} />
                                    <span className="font-bold">{isKeeperEnabled ? 'Active' : 'Standby'}</span>
                                </div>
                            </div>
                            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/10">
                                <p className="text-blue-200 text-xs font-bold uppercase tracking-wider mb-1">Protection</p>
                                <span className="font-bold">{isKeeperEnabled ? 'Enabled' : 'Off'}</span>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Panel: Agent Terminal */}
            <div className="h-[750px] flex flex-col">
                <div className="bg-gray-900 rounded-t-3xl p-5 border-b border-gray-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex gap-1.5">
                            <div className="w-3 h-3 rounded-full bg-red-500/80" />
                            <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                            <div className="w-3 h-3 rounded-full bg-green-500/80" />
                        </div>
                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest ml-4">Keeper Node v1.0.4-beta</span>
                    </div>
                    <Badge variant="outline" className="text-blue-400 border-blue-900/50 bg-blue-900/10">
                        HEDERA-TESTNET-ACTIVE
                    </Badge>
                </div>

                <div className="flex-1 bg-gray-950 p-6 font-mono text-sm overflow-y-auto scrollbar-hide space-y-4 shadow-inner">
                    <div className="mb-6 p-4 bg-gray-900/50 rounded-2xl border border-gray-800/50">
                        <h5 className="text-blue-400 text-xs font-bold uppercase mb-4 flex items-center gap-2">
                            <Activity className="w-4 h-4" /> Market Feed
                        </h5>
                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-gray-500 text-[10px] mb-1">VOLATILITY INDEX</p>
                                <div className="flex items-center gap-3">
                                    <span className={`text-xl font-bold ${marketState.volatility > 70 ? 'text-red-400' : 'text-blue-400'}`}>
                                        {marketState.volatility}%
                                    </span>
                                    <Progress value={marketState.volatility} className="h-1 flex-1 bg-gray-800" />
                                </div>
                            </div>
                            <div>
                                <p className="text-gray-500 text-[10px] mb-1">SENTIMENT</p>
                                <div className="flex items-center gap-2">
                                    <Zap className={`w-4 h-4 ${marketState.sentiment === 'bullish' ? 'text-green-400' : 'text-red-400'}`} />
                                    <span className={`font-bold uppercase ${marketState.sentiment === 'bullish' ? 'text-green-400' : 'text-red-400'}`}>
                                        {marketState.sentiment}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-4 animate-in slide-in-from-left-2 duration-300">
                                <span className="text-gray-600 text-[10px] tabular-nums mt-1 whitespace-nowrap">{log.time}</span>
                                <p className={`leading-relaxed ${log.type === 'agent' ? 'text-blue-300' :
                                    log.type === 'action' ? 'text-green-400 font-bold' :
                                        log.type === 'warning' ? 'text-yellow-400' :
                                            'text-gray-400'
                                    }`}>
                                    <span className="text-gray-700 mr-2">│</span>
                                    {log.message}
                                </p>
                            </div>
                        ))}
                        {isRebalancing && (
                            <div className="flex gap-4 items-center">
                                <span className="text-gray-600 text-[10px] tabular-nums mt-1">--:--:--</span>
                                <div className="flex items-center gap-3 text-blue-400">
                                    <span className="text-gray-700 mr-2">│</span>
                                    <RefreshCw className="w-4 h-4 animate-spin" />
                                    <span className="animate-pulse">Signing Transaction via Hedera Agent Kit...</span>
                                </div>
                            </div>
                        )}
                        <div ref={logEndRef} />
                    </div>
                </div>

                <div className="bg-gray-900 rounded-b-3xl p-4 border-t border-gray-800 text-center">
                    <p className="text-[10px] text-gray-500 font-mono">
                        CONNECTED: [HAK_BONZO_PLUGIN] // [HEDERA_MAINNET_MIRROR_NODE]
                    </p>
                </div>
            </div>

        </div>
    );
}
