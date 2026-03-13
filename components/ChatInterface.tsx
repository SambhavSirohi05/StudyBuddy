'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
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
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Auto-resize textarea up to max height
    const adjustTextareaHeight = useCallback(() => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
        }
    }, []);

    useEffect(() => {
        adjustTextareaHeight();
    }, [input, adjustTextareaHeight]);

    const handleSubmit = (e?: React.FormEvent) => {
        e?.preventDefault();
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim());
            setInput('');
            // Reset textarea height after sending
            if (textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSubmit();
        }
    };

    return (
        <div className="flex flex-col flex-1 h-full bg-[#1F1F1F] overflow-hidden font-sans text-gray-100">
            {/* Sidebar is now managed by Page to support Drawer, but we keep the structure if needed */}
            {/* Main Content */}
            <div className="flex-1 flex flex-col h-full relative">

                {/* Top Bar (Mobile) */}
                <div className="md:hidden flex items-center p-3 border-b border-white/10 bg-[#1F1F1F] sticky top-0 z-30">
                    <button onClick={onToggleSidebar} className="p-2 mr-2 hover:bg-gray-100 rounded-lg text-gray-600">
                        <Menu className="w-5 h-5" />
                    </button>
                    <span className="font-semibold text-gray-700">Study Buddy</span>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto w-full scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full text-gray-200">
                            <div className="bg-[#2A2A2A] p-4 rounded-full mb-4 shadow-sm border border-white/5">
                                <span className="text-4xl">🎓</span>
                            </div>
                            <h2 className="text-2xl font-semibold mb-2">Study Buddy Agent</h2>
                            <p className="text-gray-500 mb-8 px-4 text-center">Exam-ready notes, visualized instantly.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl px-4 w-full">
                                <button onClick={() => setInput("Explain Binary Search Tree")} className="p-4 border border-white/10 rounded-xl hover:bg-[#2A2A2A] text-left text-sm text-gray-300 transition-colors">
                                    "Explain Binary Search Tree"
                                    <div className="text-xs text-gray-400 mt-1">Visually explained</div>
                                </button>
                                <button onClick={() => setInput("Quick Sort Algorithm")} className="p-4 border border-white/10 rounded-xl hover:bg-[#2A2A2A] text-left text-sm text-gray-300 transition-colors">
                                    "Quick Sort Algorithm"
                                    <div className="text-xs text-gray-400 mt-1">With flowcharts</div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full pb-32">
                            {messages.map((msg, idx) => (
                                <ChatMessage key={idx} message={msg} />
                            ))}
                            {isLoading && (
                                <div className="w-full py-2 md:py-4 bg-gray-5 border-b border-black/5">
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
                <div className="absolute bottom-0 left-0 w-full bg-[#1F1F1F]/80 backdrop-blur-sm pt-2 pb-6 px-4 border-t border-transparent bg-gradient-to-t from-[#1F1F1F] via-[#1F1F1F] to-transparent">
                    <div className="max-w-3xl mx-auto">
                        <form onSubmit={handleSubmit} className="relative shadow-xl flex items-end border border-white/10 bg-[#2A2A2A] rounded-2xl focus-within:ring-1 focus-within:ring-white/10 focus-within:border-white/10 overflow-hidden ring-1 ring-white/5">
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Send a message..."
                                className="w-full pl-4 pr-12 py-4 bg-transparent border-none focus:ring-0 text-gray-100 placeholder:text-gray-500 resize-none text-base overflow-y-auto"
                                style={{ maxHeight: '200px' }}
                                rows={1}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all duration-200 ${input.trim() ? "bg-green-500 text-white" : "bg-transparent text-gray-300"}`}
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </form>
                        <div className="text-center mt-2 text-xs text-gray-400 hidden md:block">
                            Study Buddy Research Preview. Use generated notes for review.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
