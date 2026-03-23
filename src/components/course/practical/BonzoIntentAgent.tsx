import React, { useState, useEffect, useRef } from 'react';
import {
    BONZO_VAULTS,
    BonzoVault
} from '../../../lib/defi/bonzo-simulator';
import { Button } from '../../ui/button';
import { Card } from '../../ui/card';
import { Badge } from '../../ui/badge';
import {
    MessageSquare,
    Zap,
    Send,
    User,
    BrainCircuit,
    Shield,
    Sparkles,
    ArrowRight,
    CircleDashed,
    RefreshCw,
    PlayCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { useWallet } from '../../../contexts/WalletContext';
import { submitTransaction } from '../../../lib/hederaUtils';
import { env } from '../../../config';

interface Message {
    id: string;
    role: 'user' | 'agent';
    content: string;
    status?: 'thinking' | 'done';
    plan?: {
        action: string;
        vault: string;
        amount: string;
        apy: number;
    };
}

export function BonzoIntentAgent({ onInteract }: { onInteract?: () => void }) {
    const { connected, connect, account, accountId, activeProvider, balance, refreshBalance } = useWallet();

    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            role: 'agent',
            content: "Welcome to Bonzo Intent. I am your Hedera Agent Kit assistant. What is your goal today? Example: 'Find the best yield for 1 HBAR' or 'Safely deposit 5 HBAR into USDC'."
        }
    ]);
    const [input, setInput] = useState('');
    const [isThinking, setIsThinking] = useState(false);
    const [isExecuting, setIsExecuting] = useState(false);
    const [isCompleted, setIsCompleted] = useState(false);

    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isThinking]);

    const handleSend = async () => {
        if (!input.trim() || isThinking || isExecuting) return;

        const userMsg: Message = { id: Date.now().toString(), role: 'user', content: input };
        setMessages(prev => [...prev, userMsg]);
        setInput('');
        setIsThinking(true);

        // Simulate Agent Thinking
        await new Promise(r => setTimeout(r, 2000));

        // Basic "Intent" parsing logic for the simulation
        let responseContent = "I've analyzed the Bonzo Vaults based on your intent.";
        let plan = undefined;

        if (input.toLowerCase().includes('hbar') || input.toLowerCase().includes('yield')) {
            const bestVault = BONZO_VAULTS.sort((a, b) => b.apy - a.apy)[0];
            plan = {
                action: "SUPPLY",
                vault: bestVault.name,
                amount: "0.1 HBAR",
                apy: bestVault.apy
            };
            responseContent = `I have found an optimal strategy using the Hedera Agent Kit. I suggest supplying 0.1 HBAR to the ${bestVault.name} vault, which currently offers ${bestVault.apy}% APY. This fits your goal of maximizing yield within Bonzo Finance.`;
        } else if (input.toLowerCase().includes('usdc') || input.toLowerCase().includes('stable')) {
            const usdcVault = BONZO_VAULTS.find(v => v.asset === 'USDC') || BONZO_VAULTS[0];
            plan = {
                action: "SUPPLY",
                vault: usdcVault.name,
                amount: "0.1 HBAR", // Still sending HBAR for the testnet simulation
                apy: usdcVault.apy
            };
            responseContent = `Understood. For a lower risk-profile, I suggest supplying to the ${usdcVault.name} vault. Would you like me to execute this single-action supply for you?`;
        }

        const agentMsg: Message = {
            id: (Date.now() + 1).toString(),
            role: 'agent',
            content: responseContent,
            plan
        };

        setMessages(prev => [...prev.slice(0, -1), { ...prev[prev.length - 1], status: 'done' as const }, agentMsg]);
        setIsThinking(false);
    };

    const handleExecutePlan = async (plan: any) => {
        if (!connected) {
            await connect();
            return;
        }

        setIsExecuting(true);
        toast.info("Signing Transaction Bundle...");

        try {
            const amount = 0.1;
            const treasury = env.HEDERA_OPERATOR_EVM;

            const result = await submitTransaction(
                account!,
                treasury,
                amount,
                activeProvider || undefined
            );

            if (result.status === 'success') {
                const successMsg: Message = {
                    id: Date.now().toString(),
                    role: 'agent',
                    content: `✅ Intent Executed! Successfully supplied ${plan.amount} into the ${plan.vault} vault. Explorer: ${result.explorerUrl}`
                };
                setMessages(prev => [...prev, successMsg]);
                await refreshBalance();
                setIsCompleted(true);
                toast.success("Yield Goal Achieved!");
                onInteract?.();
            } else {
                toast.error("Execution failed");
            }
        } catch (error: any) {
            console.error('Execution error:', error);
            toast.error("Execution failed: " + error.message);
        } finally {
            setIsExecuting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-4 animate-in fade-in duration-700">
            <Card className="rounded-[2.5rem] overflow-hidden border-none shadow-2xl bg-white h-[650px] flex flex-col">
                {/* Header */}
                <div className="bg-indigo-600 p-8 text-white flex items-center justify-between shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                            <BrainCircuit className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold font-display">Bonzo Intent Agent</h2>
                            <div className="flex items-center gap-2 mt-1">
                                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                                <span className="text-xs text-indigo-100 font-mono">HAK_CORE_ENGINE v1.0 | {balance.toFixed(2)} HBAR</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide bg-gray-50/50">
                    {messages.map((m) => (
                        <div
                            key={m.id}
                            className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'} animate-in slide-in-from-bottom-2`}
                        >
                            <div className={`flex gap-4 max-w-[85%] ${m.role === 'user' ? 'flex-row-reverse' : ''}`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white text-indigo-600'
                                    }`}>
                                    {m.role === 'user' ? <User className="w-5 h-5" /> : <Shield className="w-5 h-5" />}
                                </div>
                                <div className="space-y-4">
                                    <div className={`p-5 rounded-3xl shadow-sm leading-relaxed ${m.role === 'user'
                                        ? 'bg-indigo-600 text-white rounded-tr-none'
                                        : 'bg-white text-gray-800 rounded-tl-none border border-gray-100'
                                        }`}>
                                        <p className="text-sm">{m.content}</p>
                                    </div>

                                    {m.plan && !isCompleted && !isExecuting && (
                                        <Card className="p-6 border-2 border-indigo-100 bg-white rounded-3xl animate-in zoom-in-95">
                                            <div className="flex items-center gap-3 mb-4">
                                                <div className="p-2 bg-indigo-50 rounded-lg">
                                                    <Sparkles className="w-4 h-4 text-indigo-600" />
                                                </div>
                                                <h4 className="font-bold text-gray-900 text-sm italic">Proposed Agent Strategy:</h4>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4 mb-6">
                                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Vault</p>
                                                    <p className="text-sm font-black text-gray-800">{m.plan.vault}</p>
                                                </div>
                                                <div className="p-3 bg-gray-50 rounded-2xl border border-gray-100">
                                                    <p className="text-[10px] text-gray-400 uppercase font-bold tracking-widest mb-1">Yield (APY)</p>
                                                    <p className="text-sm font-black text-green-600">{m.plan.apy}%</p>
                                                </div>
                                            </div>
                                            <Button
                                                onClick={() => handleExecutePlan(m.plan)}
                                                className="w-full py-6 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold group shadow-xl shadow-indigo-200"
                                            >
                                                Sign & Execute Plan <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </Card>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isThinking && (
                        <div className="flex justify-start">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-white text-indigo-200 flex items-center justify-center animate-pulse">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <div className="bg-white p-5 rounded-3xl rounded-tl-none border border-gray-100 flex items-center gap-2">
                                    <span className="text-xs text-gray-400 font-mono italic">Agent is analyzing vaults...</span>
                                    <CircleDashed className="w-4 h-4 animate-spin text-indigo-200" />
                                </div>
                            </div>
                        </div>
                    )}
                    {isExecuting && (
                        <div className="flex justify-start">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-500 flex items-center justify-center">
                                    <RefreshCw className="w-5 h-5 animate-spin" />
                                </div>
                                <div className="bg-indigo-50 p-5 rounded-3xl rounded-tl-none border border-indigo-100">
                                    <p className="text-sm text-indigo-700 font-bold animate-pulse">
                                        Assembling Atomic Transaction via Hedera Agent Kit...
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={chatEndRef} />
                </div>

                {/* Input Area */}
                <div className="p-8 bg-white border-t border-gray-100">
                    <div className="relative flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                            placeholder={isCompleted ? "Goal Achieved!" : "Explain your DeFi goal..."}
                            disabled={isCompleted}
                            className={`w-full py-6 pl-8 pr-20 bg-gray-50 border-2 border-gray-100 rounded-3xl focus:outline-none focus:border-indigo-400 focus:bg-white transition-all text-sm font-medium ${isCompleted ? 'opacity-50 cursor-not-allowed' : ''
                                }`}
                        />
                        <button
                            disabled={!input.trim() || isCompleted}
                            onClick={handleSend}
                            className={`absolute right-3 p-4 rounded-2xl transition-all ${input.trim() && !isCompleted
                                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:scale-105 active:scale-95'
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                }`}
                        >
                            <Send className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </Card>

            <div className="mt-8 flex items-center justify-between text-xs text-gray-400 font-mono px-4">
                <div className="flex items-center gap-4">
                    <span className="flex items-center gap-1"><Zap className="w-3 h-3 text-yellow-400" /> Latency: 42ms</span>
                    <span className="flex items-center gap-1"><CircleDashed className="w-3 h-3" /> Oracle: Live</span>
                </div>
                <span>HEDERA-AGENT-KIT-DEMO</span>
            </div>
        </div>
    );
}
