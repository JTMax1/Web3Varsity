import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Bot, X, Send, Loader2, MinusCircle, Maximize2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from '../ui/button';
import { useChatWithTutor, useChatHistory, useCreateChatSession, useIsAIEnabled } from '../../hooks/useAI';
import { useWallet } from '../../contexts/WalletContext';
import { toast } from 'sonner';

export function AITutor() {
    const [isOpen, setIsOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [sessionId, setSessionId] = useState<string | null>(null);
    const [inputMessage, setInputMessage] = useState('');

    const { user } = useWallet();
    const isAIEnabled = useIsAIEnabled();

    const messagesEndRef = useRef<HTMLDivElement>(null);

    const { mutateAsync: createSession, isPending: isCreatingSession } = useCreateChatSession();
    const { data: history, isLoading: historyLoading } = useChatHistory(sessionId || undefined);
    const { mutateAsync: sendMessage, isPending: isSending } = useChatWithTutor(sessionId || '');

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        if (isOpen && !isMinimized) {
            scrollToBottom();
        }
    }, [history, isOpen, isMinimized, isSending]);

    const handleOpen = async () => {
        setIsOpen(true);
        setIsMinimized(false);

        if (!sessionId && user) {
            try {
                const newSessionId = await createSession({});
                setSessionId(newSessionId);
            } catch (error) {
                console.error('Failed to start chat session:', error);
            }
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputMessage.trim() || !sessionId || isSending) return;

        const message = inputMessage.trim();
        setInputMessage('');

        try {
            await sendMessage({ message });
        } catch (error) {
            console.error('Failed to send message:', error);
            setInputMessage(message); // Put message back on failure
        }
    };

    useEffect(() => {
        console.log("AITutor mount state:", {
            isAIEnabled,
            hasUser: !!user,
            userId: user?.id
        });
    }, [isAIEnabled, user]);

    return (
        <div style={{ position: 'fixed', bottom: '54px', right: '54px', zIndex: 99999 }} className="transition-all duration-300">
            {/* Floating Action Button */}
            {!isOpen && (
                <div className="relative" style={{ justifyItems: 'center' }}>
                    <button
                        onClick={handleOpen}
                        className="group flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white shadow-lg transition-all hover:scale-110 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        style={{ pointerEvents: 'auto', marginBottom: '8px' }}
                    >
                        <Bot className="h-7 w-7 transition-transform group-hover:rotate-12" />
                    </button>
                    <div className="absolute -top-10 right-0 whitespace-nowrap rounded-lg bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white opacity-0 transition-opacity group-hover:opacity-100 pointer-events-none">
                        Need Help? <br /> Ask AI Tutor!
                    </div>
                </div>
            )}

            {/* Chat Window */}
            {isOpen && (
                <div
                    className={`flex w-[350px] sm:w-[400px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100 transition-all duration-300 ease-in-out ${isMinimized ? 'h-auto' : 'h-[550px] max-h-[80vh]'}`}
                >
                    {/* Header */}
                    <div className="flex items-center justify-between bg-blue-600 px-4 py-3 text-white">
                        <div className="flex items-center gap-2">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-sm">
                                <Bot className="h-5 w-5" />
                            </div>
                            <div>
                                <h3 className="text-sm font-semibold">Web3Varsity AI Tutor</h3>
                                <p className="text-xs text-blue-100">Powered by Gemini & Hedera</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-1">
                            <button
                                onClick={() => setIsMinimized(!isMinimized)}
                                className="rounded-full p-1.5 hover:bg-white/20 transition-colors"
                            >
                                {isMinimized ? <Maximize2 className="h-4 w-4" /> : <MinusCircle className="h-4 w-4" />}
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="rounded-full p-1.5 hover:bg-white/20 transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    </div>

                    {/* Chat Body */}
                    {!isMinimized && (
                        <>
                            <div className="flex-1 overflow-y-auto p-4 bg-gray-50 flex flex-col gap-4">
                                {/* Greeting Message */}
                                <div className="flex gap-3">
                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                        <Bot className="h-5 w-5" />
                                    </div>
                                    <div className="rounded-2xl rounded-tl-sm bg-white p-3 shadow-sm border border-gray-100">
                                        <p className="text-sm text-gray-700">
                                            Hello! I'm your Web3Varsity AI Tutor. How can I help you master Web3 and Hedera today? Let's dive into some concepts!
                                        </p>
                                    </div>
                                </div>

                                {isCreatingSession || historyLoading ? (
                                    <div className="flex justify-center items-center py-8">
                                        <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
                                    </div>
                                ) : (
                                    <>
                                        {history?.map((msg, index) => (
                                            <div
                                                key={msg.id || index}
                                                className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                                            >
                                                {msg.role === 'assistant' && (
                                                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                        <Bot className="h-5 w-5" />
                                                    </div>
                                                )}
                                                <div
                                                    className={`rounded-2xl p-3 shadow-sm max-w-[85%] break-words ${msg.role === 'user'
                                                        ? 'bg-indigo-600 text-white rounded-tr-sm'
                                                        : 'bg-white text-gray-700 border border-gray-100 rounded-tl-sm'
                                                        }`}
                                                >
                                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                                </div>
                                            </div>
                                        ))}

                                        {isSending && (
                                            <div className="flex gap-3">
                                                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-indigo-600">
                                                    <Bot className="h-5 w-5" />
                                                </div>
                                                <div className="rounded-2xl rounded-tl-sm bg-white p-4 shadow-sm border border-gray-100 flex items-center gap-1">
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                                                </div>
                                            </div>
                                        )}
                                    </>
                                )}
                                <div ref={messagesEndRef} />
                            </div>

                            {/* Input Area */}
                            <div className="border-t border-gray-100 bg-white p-3">
                                <form onSubmit={handleSendMessage} className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        placeholder="Ask me anything..."
                                        disabled={isSending || isCreatingSession}
                                        className="flex-1 rounded-full border-gray-200 bg-gray-50 px-4 py-2 text-sm focus:border-indigo-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-indigo-500 disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={!inputMessage.trim() || isSending || isCreatingSession}
                                        className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-600 text-white disabled:opacity-50 hover:bg-indigo-700 transition-colors"
                                    >
                                        <Send className="h-4 w-4 ml-0.5" />
                                    </button>
                                </form>
                            </div>
                        </>
                    )}
                </div>
            )}
        </div>
    );
}
