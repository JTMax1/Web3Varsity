import React, { useState, useEffect, useRef } from 'react';
import {
    BONZO_VAULTS,
    generateMarketState,
    MarketState,
} from '../../../lib/defi/bonzo-simulator';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import {
    Newspaper,
    TrendingDown,
    TrendingUp,
    MessageSquare,
    Zap,
    RefreshCw,
    Search,
    BrainCircuit,
    ArrowRight,
    Trophy
} from 'lucide-react';
import { toast } from 'sonner';
import { useWallet } from '../../../contexts/WalletContext';
import { submitTransaction } from '../../../lib/hederaUtils';
import { env } from '../../../config';

interface Headline {
    id: string;
    text: string;
    sentiment: 'bullish' | 'bearish' | 'neutral';
    source: string;
    impact: number;
}

const MOCK_HEADLINES: Headline[] = [
    { id: '1', text: "Bonzo Finance TVL hits record high as institutional interest grows", sentiment: 'bullish', source: 'CryptoBrief', impact: 15 },
    { id: '2', text: "Rumors of regulatory crackdown on algorithmic yield aggregators", sentiment: 'bearish', source: 'NewsNode', impact: -20 },
    { id: '3', text: "New partnership announced between Hedera and global logistics giant", sentiment: 'bullish', source: 'HBAR Weekly', impact: 10 },
    { id: '4', text: "Whale alert: 50M reward tokens moved to exchange wallet", sentiment: 'bearish', source: 'WhaleWatch', impact: -25 },
    { id: '5', text: "Mainnet upgrade scheduled for next Tuesday, expected to boost tps", sentiment: 'bullish', source: 'Hedera Docs', impact: 5 },
    { id: '6', text: "Security researcher flags potential vulnerability in older vault logic", sentiment: 'bearish', source: 'AuditLink', impact: -30 },
];

interface LogEntry {
    type: 'rag' | 'action' | 'info';
    message: string;
    time: string;
}

export function BonzoRAGHarvester({ onInteract }: { onInteract?: () => void }) {
    // Wallet Hooks
    const { connected, connect, account, accountId, activeProvider, balance, refreshBalance } = useWallet();

    const [headlines, setHeadlines] = useState<Headline[]>([]);
    const [sentimentScore, setSentimentScore] = useState(50);
    const [rewardsAccumulated, setRewardsAccumulated] = useState(0);
    const [isHarvesting, setIsHarvesting] = useState(false);
    const [logs, setLogs] = useState<LogEntry[]>([]);
    const [isCompleted, setIsCompleted] = useState(false);

    const logEndRef = useRef<HTMLDivElement>(null);

    // Initial Setup
    useEffect(() => {
        addLog("RAG Sentiment Agent Initialized", 'info');
        addLog("Connected to Hedera News Oracle & Social Feed", 'rag');
        setHeadlines(MOCK_HEADLINES.slice(0, 3));
    }, []);

    // Reward Accumulation & News Rotation
    useEffect(() => {
        const interval = setInterval(() => {
            // Accumulate rewards
            setRewardsAccumulated(prev => +(prev + 0.05).toFixed(2));

            // Occasionally rotate news
            if (Math.random() > 0.7) {
                const nextHeadline = MOCK_HEADLINES[Math.floor(Math.random() * MOCK_HEADLINES.length)];
                setHeadlines(prev => [nextHeadline, ...prev.slice(0, 2)]);

                // Update sentiment based on RAG "Analysis"
                addLog(`[RAG] Ingesting: "${nextHeadline.text}"`, 'rag');
                updateSentiment(nextHeadline);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [headlines]);

    useEffect(() => {
        logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [logs]);

    const addLog = (message: string, type: LogEntry['type'] = 'info') => {
        const time = new Date().toLocaleTimeString([], { hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' });
        setLogs(prev => [...prev.slice(-19), { message, type, time }]);
    };

    const updateSentiment = (headline: Headline) => {
        setSentimentScore(prev => {
            const newScore = Math.max(0, Math.min(100, prev + headline.impact));
            if (newScore < 40) {
                addLog(`[INTELLIGENCE] Bearish sentiment detected (${newScore}%). Recommendation: Proactive Harvest.`, 'rag');
            } else if (newScore > 70) {
                addLog(`[INTELLIGENCE] Bullish sentiment detected (${newScore}%). Recommendation: Hold for appreciation.`, 'rag');
            }
            return newScore;
        });
    };

    const handleHarvest = async () => {
        if (!connected) {
            await connect();
            return;
        }

        if (rewardsAccumulated === 0) return;

        setIsHarvesting(true);
        addLog(`🚀 Executing Proactive Harvest via Hedera Agent Kit...`, 'action');

        try {
            const amount = 0.1; // Small HBAR transaction to simulate the harvest action on Testnet
            const treasury = env.HEDERA_OPERATOR_EVM;

            const result = await submitTransaction(
                account!,
                treasury,
                amount,
                activeProvider || undefined
            );

            if (result.status === 'success') {
                addLog(`✅ Harvest Confirmed: ${rewardsAccumulated} USDC worth of rewards swapped to HBAR`, 'action');
                setRewardsAccumulated(0);
                await refreshBalance();
                setIsCompleted(true);
                addLog(`🔗 Explorer: ${result.explorerUrl}`, 'info');
                toast.success("Harvest Successful!");
                onInteract?.();
            } else {
                addLog(`❌ Transaction Failed`, 'action');
                toast.error("Harvest failed");
            }
        } catch (error: any) {
            console.error('Harvest error:', error);
            addLog(`❌ Error: ${error.message}`, 'action');
            toast.error("Harvest failed");
        } finally {
            setIsHarvesting(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-7xl mx-auto p-4 animate-in fade-in duration-700">
            {/* Left Panel: News & RAG */}
            <div className="space-y-6">
                <Card className="p-8 border-none bg-white shadow-xl">
                    <div className="flex items-center justify-between mb-8">
                        <div className="flex items-center gap-3">
                            <div className="p-3 bg-indigo-100 rounded-2xl">
                                <Search className="w-6 h-6 text-indigo-600" />
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900">RAG News Oracle</h2>
                        </div>
                        <Badge variant="outline" className="text-indigo-600 border-indigo-200 bg-indigo-50">
                            LIVE FEED
                        </Badge>
                    </div>

                    <div className="space-y-4 mb-8">
                        {headlines.map(h => (
                            <div
                                key={h.id + Math.random()}
                                className="p-4 rounded-2xl border border-gray-100 bg-gray-50 flex items-start gap-4 animate-in slide-in-from-top-2"
                            >
                                <Newspaper className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                <div>
                                    <p className="text-sm font-semibold text-gray-800 mb-1">{h.text}</p>
                                    <div className="flex items-center gap-2">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{h.source}</span>
                                        <span className="text-[10px] text-gray-300">|</span>
                                        <Badge className={`text-[10px] h-4 ${h.sentiment === 'bullish' ? 'bg-green-100 text-green-700' :
                                            h.sentiment === 'bearish' ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-700'
                                            }`}>
                                            {h.sentiment}
                                        </Badge>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="p-6 bg-indigo-900 rounded-3xl text-white relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10">
                            <BrainCircuit className="w-24 h-24" />
                        </div>
                        <div className="relative z-10">
                            <h4 className="text-sm font-bold text-indigo-200 uppercase tracking-widest mb-4">Sentiment Intelligence</h4>
                            <div className="flex items-end justify-between mb-2">
                                <span className="text-3xl font-bold">{sentimentScore}%</span>
                                <span className="text-xs text-indigo-300">Market Confidence</span>
                            </div>
                            <Progress value={sentimentScore} className="h-2 bg-indigo-800" />
                            <div className="mt-4 flex items-center gap-2">
                                {sentimentScore > 50 ? (
                                    <TrendingUp className="w-4 h-4 text-green-400" />
                                ) : (
                                    <TrendingDown className="w-4 h-4 text-red-400" />
                                )}
                                <p className="text-xs text-indigo-100">
                                    {sentimentScore < 40 ? "Agent suggests harvesting immediately to lock in gains." :
                                        sentimentScore > 70 ? "Agent suggests holding rewards for price appreciation." :
                                            "Market is neutral. Scheduled harvest remains efficient."}
                                </p>
                            </div>
                        </div>
                    </div>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-none">
                    <div className="flex items-start gap-4">
                        <div className="p-2 bg-yellow-400 rounded-lg">
                            <Zap className="w-5 h-5 text-white" />
                        </div>
                        <div>
                            <h4 className="font-bold text-gray-900 mb-1">Why RAG?</h4>
                            <p className="text-xs text-gray-600 leading-relaxed">
                                Unlike static code, RAG allows your agent to "read" news. By connecting the Hedera Agent Kit to a news API, your Bonzo keeper can react to rumors or external events before they hit the price charts.
                            </p>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Right Panel: Rewards UI & Logs */}
            <div className="space-y-6">
                <Card className="p-8 border-none bg-white shadow-xl flex flex-col items-center text-center">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <RefreshCw className={`w-10 h-10 text-green-600 ${isHarvesting ? 'animate-spin' : ''}`} />
                    </div>
                    <h3 className="text-gray-500 font-bold uppercase tracking-widest text-xs mb-2">Pending Rewards</h3>
                    <div className="text-5xl font-black text-gray-900 mb-2 font-mono">
                        ${rewardsAccumulated} <span className="text-xl text-gray-400 font-normal">USDC</span>
                    </div>
                    <div className="text-xs text-gray-400 mb-6 font-mono">
                        Wallet Balance: {balance.toFixed(2)} HBAR
                    </div>

                    <Button
                        onClick={handleHarvest}
                        disabled={isHarvesting || rewardsAccumulated === 0}
                        className={`w-full py-8 text-lg font-bold rounded-2xl transition-all ${sentimentScore < 40
                            ? 'bg-red-500 hover:bg-red-600 text-white animate-pulse'
                            : 'bg-green-600 hover:bg-green-700 text-white shadow-xl shadow-green-200'
                            }`}
                    >
                        {isHarvesting ? (
                            <><RefreshCw className="w-5 h-5 mr-2 animate-spin" /> Signing via Agent Kit...</>
                        ) : (
                            <>Proactive Harvest Now <ArrowRight className="w-5 h-5 ml-2" /></>
                        )}
                    </Button>

                    {sentimentScore < 40 && (
                        <div className="mt-4 flex items-center gap-2 text-red-600 animate-bounce">
                            <TrendingDown className="w-4 h-4" />
                            <span className="text-xs font-bold uppercase">Sentiment Critical - Harvest Suggested</span>
                        </div>
                    )}
                </Card>

                {/* Agent Terminal */}
                <div className="bg-gray-950 rounded-3xl overflow-hidden flex flex-col border border-gray-800 shadow-2xl h-[400px]">
                    <div className="p-4 bg-gray-900 flex items-center gap-2 border-b border-gray-800">
                        <BrainCircuit className="w-4 h-4 text-indigo-400" />
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">RAG-Inference-Engine-v2</span>
                    </div>
                    <div className="flex-1 p-6 font-mono text-[11px] overflow-y-auto space-y-3">
                        {logs.map((log, i) => (
                            <div key={i} className="flex gap-4">
                                <span className="text-gray-600 tabular-nums">{log.time}</span>
                                <p className={
                                    log.type === 'rag' ? 'text-indigo-300' :
                                        log.type === 'action' ? 'text-green-400 font-bold' : 'text-gray-500'
                                }>
                                    <span className="text-gray-800 mr-2">│</span>
                                    {log.message}
                                </p>
                            </div>
                        ))}
                        <div ref={logEndRef} />
                    </div>
                </div>

                {isCompleted && (
                    <Card className="p-6 bg-green-500 text-white border-none animate-in zoom-in-95">
                        <div className="flex items-center gap-4">
                            <Trophy className="w-8 h-8" />
                            <div>
                                <h4 className="font-bold">Alpha Gained!</h4>
                                <p className="text-xs opacity-90">Your agent outsmarted the static harvest schedule.</p>
                            </div>
                        </div>
                    </Card>
                )}
            </div>
        </div>
    );
}
