'use client';

import { useState, useRef, useEffect } from 'react';
import { ArrowUp, Menu } from 'lucide-react';
import ChatMessage from './ChatMessage';
import { Message } from '@/types';
import Sidebar from './Sidebar';

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    onToggleSidebar: () => void; // New prop for mobile
}

export default function ChatInterface({ messages, onSendMessage, isLoading, onToggleSidebar }: ChatInterfaceProps) {
    const [input, setInput] = useState('');
    const bottomRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
        }
    };

    return (
        <div className="flex flex-col flex-1 h-full bg-white dark:bg-gray-900 overflow-hidden font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative">

                {/* Top Bar (Mobile) */}
                <div className="md:hidden flex items-center p-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900 sticky top-0 z-30 transition-colors">
                    <button onClick={onToggleSidebar} className="p-2 mr-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-lg text-gray-600 dark:text-gray-300">
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-gray-700 dark:text-gray-200">Study Buddy</span>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto w-full scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-800 dark:text-gray-200">
                            <div className="bg-white dark:bg-gray-800 p-4 rounded-full mb-4 shadow-sm border border-gray-100 dark:border-gray-700">
                                <span className="text-4xl">🎓</span>
                            </div>
                            <h2 className="text-2xl font-semibold mb-2">Study Buddy Agent</h2>
                            <p className="text-gray-500 dark:text-gray-400 mb-8 px-4 text-center">Exam-ready notes, visualized instantly.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl px-4 w-full">
                                <button onClick={() => setInput("Explain Binary Search Tree")} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-left text-sm text-gray-600 dark:text-gray-300 transition-colors bg-white dark:bg-gray-800">
                                    "Explain Binary Search Tree"
                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">Visually explained</div>
                                </button>
                                <button onClick={() => setInput("Quick Sort Algorithm")} className="p-4 border border-gray-200 dark:border-gray-700 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-800 text-left text-sm text-gray-600 dark:text-gray-300 transition-colors bg-white dark:bg-gray-800">
                                    "Quick Sort Algorithm"
                                    <div className="text-xs text-gray-400 dark:text-gray-500 mt-1">With flowcharts</div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full pb-32">
                            {messages.map((msg, idx) => (
                                <ChatMessage key={idx} message={msg} />
                            ))}
                            {isLoading && (
                                <div className="w-full py-2 md:py-4 bg-gray-5 dark:bg-[#444654] border-b border-black/5 dark:border-black/20">
                                    <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-4 md:py-6 flex lg:px-0 m-auto">
                                        <div className="w-8 flex flex-col relative items-end">
                                            <div className="relative h-7 w-7 rounded-sm flex items-center justify-center text-white flex-shrink-0 bg-green-500">
                                                <span className="animate-pulse">...</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center">
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-75 mx-1"></span>
                                            <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-150"></span>
                                        </div>
                                    </div>
                                </div>
                            )}
                            <div ref={bottomRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className="absolute bottom-0 left-0 w-full bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm pt-2 pb-6 px-4 border-t border-transparent bg-gradient-to-t from-white via-white to-transparent dark:from-gray-900 dark:via-gray-900">
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSubmit} className="relative shadow-xl flex items-center border border-gray-200/60 dark:border-gray-700 bg-white dark:bg-gray-800 rounded-2xl focus-within:ring-1 focus-within:ring-black/10 dark:focus-within:ring-white/10 focus-within:border-black/10 dark:focus-within:border-white/10 overflow-hidden ring-1 ring-black/5 dark:ring-white/5">
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Send a message..."
                                className="w-full pl-4 pr-12 py-4 bg-transparent border-none focus:ring-0 text-gray-900 dark:text-gray-100 placeholder:text-gray-500 dark:placeholder:text-gray-400 resize-none max-h-[200px] text-base"
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className={`absolute right-3 p-2 rounded-lg transition-all duration-200 ${input.trim() ? "bg-green-500 text-white" : "bg-transparent text-gray-300 dark:text-gray-600"}`}
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="text-center mt-2 text-xs text-gray-400 dark:text-gray-500 hidden md:block">
                            Study Buddy Research Preview. Use generated notes for review.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
