'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { ArrowUp, Menu } from 'lucide-react';
import ChatMessage from './ChatMessage';
import ThinkingIndicator from './ThinkingIndicator';
import { Message } from '@/types';

interface ChatInterfaceProps {
    messages: Message[];
    onSendMessage: (message: string) => void;
    isLoading: boolean;
    onToggleSidebar: () => void;
    isDarkMode: boolean;
    onToggleTheme: () => void;
}

export default function ChatInterface({ 
    messages, 
    onSendMessage, 
    isLoading, 
    onToggleSidebar, 
    isDarkMode, 
    onToggleTheme 
}: ChatInterfaceProps) {
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
        <div className={`flex flex-col flex-1 h-full overflow-hidden font-sans transition-colors duration-300 ${isDarkMode ? 'bg-[#0D0D0D] text-[#F0EDE8]' : 'bg-[#ffffff] text-[#0f172a]'}`}>
            
            {/* Unified Top Header Bar */}
            <header className={`flex items-center justify-between px-4 py-3 border-b sticky top-0 z-30 transition-colors duration-300 ${isDarkMode ? 'bg-[#0D0D0D] border-zinc-900' : 'bg-[#ffffff] border-gray-100'}`}>
                <div className="flex items-center gap-3">
                    <button 
                        onClick={onToggleSidebar} 
                        className={`p-2 md:hidden rounded-lg transition-colors ${isDarkMode ? 'hover:bg-zinc-800 text-gray-400 hover:text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                        aria-label="Toggle Sidebar"
                    >
                        <Menu className="w-5 h-5" />
                    </button>
                    {/* The brand logo was removed from here and moved to the sidebar */}
                </div>
                
                <div className="flex items-center gap-3.5">
                    {/* Theme Toggle Button */}
                    <button 
                        onClick={onToggleTheme} 
                        className="c1-theme-toggle" 
                        aria-label="Toggle Theme"
                    >
                        {isDarkMode ? (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="5"/>
                                <line x1="12" y1="1" x2="12" y2="3"/>
                                <line x1="12" y1="21" x2="12" y2="23"/>
                                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                <line x1="1" y1="12" x2="3" y2="12"/>
                                <line x1="21" y1="12" x2="23" y2="12"/>
                                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                            </svg>
                        ) : (
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                            </svg>
                        )}
                    </button>
                    
                    {/* Back to Home Button */}
                    <a href="/" className="c1-nav-cta !py-1.5 !px-3.5 text-xs font-semibold">
                        ← Home
                    </a>
                </div>
            </header>

            <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto w-full scroll-smooth">
                    {messages.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-full px-4">
                            <div className={`p-4 rounded-full mb-4 shadow-sm border ${isDarkMode ? 'bg-[#141414] border-zinc-800' : 'bg-[#F4F8F9] border-gray-100'}`}>
                                <span className="text-4xl">🎓</span>
                            </div>
                            <h2 className="text-2xl font-semibold mb-2">Study Buddy Agent</h2>
                            <p className={`mb-8 text-center text-sm ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>Exam-ready notes, visualized instantly.</p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-2xl w-full">
                                <button 
                                    onClick={() => setInput("Explain Binary Search Tree")} 
                                    className={`p-4 border rounded-xl text-left text-sm transition-colors duration-200 ${isDarkMode ? 'border-zinc-900 hover:bg-[#141414] text-gray-300' : 'border-gray-200 hover:bg-[#F4F8F9] text-gray-700'}`}
                                >
                                    "Explain Binary Search Tree"
                                    <div className="text-xs text-gray-400 mt-1">Visually explained</div>
                                </button>
                                <button 
                                    onClick={() => setInput("Quick Sort Algorithm")} 
                                    className={`p-4 border rounded-xl text-left text-sm transition-colors duration-200 ${isDarkMode ? 'border-zinc-900 hover:bg-[#141414] text-gray-300' : 'border-gray-200 hover:bg-[#F4F8F9] text-gray-700'}`}
                                >
                                    "Quick Sort Algorithm"
                                    <div className="text-xs text-gray-400 mt-1">With flowcharts</div>
                                </button>
                            </div>
                        </div>
                    ) : (
                        <div className="w-full pb-36">
                            {messages.map((msg, idx) => (
                                <ChatMessage key={idx} message={msg} />
                            ))}
                            {isLoading && (
                                <ThinkingIndicator query={
                                    messages.filter(m => m.role === 'user').pop()?.content as string
                                } />
                            )}
                            <div ref={bottomRef} />
                        </div>
                    )}
                </div>

                {/* Input Area */}
                <div className={`absolute bottom-0 left-0 w-full pt-4 pb-6 px-4 bg-gradient-to-t border-t border-transparent ${isDarkMode ? 'from-[#0D0D0D] via-[#0D0D0D]/95 to-transparent' : 'from-[#ffffff] via-[#ffffff]/95 to-transparent'}`}>
                    <div className="max-w-3xl mx-auto">
                        <form 
                            onSubmit={handleSubmit} 
                            className={`relative shadow-xl flex items-end border rounded-2xl overflow-hidden ring-1 transition-all duration-300 ${isDarkMode ? 'border-zinc-900 bg-[#141414] ring-white/5 focus-within:ring-white/10' : 'border-gray-200 bg-[#F4F8F9] ring-black/5 focus-within:ring-black/10'}`}
                        >
                            <textarea
                                ref={textareaRef}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                placeholder="Send a message..."
                                className={`w-full pl-4 pr-12 py-4 bg-transparent border-none focus:ring-0 resize-none text-base overflow-y-auto ${isDarkMode ? 'text-gray-100 placeholder:text-gray-500' : 'text-gray-800 placeholder:text-gray-400'}`}
                                style={{ maxHeight: '200px' }}
                                rows={1}
                                disabled={isLoading}
                            />
                            <button
                                type="submit"
                                disabled={!input.trim() || isLoading}
                                className={`absolute right-3 bottom-3 p-2 rounded-lg transition-all duration-300 active:scale-95 ${input.trim() && !isLoading ? "bg-green-500 hover:bg-green-400 hover:scale-105 hover:shadow-lg hover:shadow-green-500/20 text-white" : "bg-transparent text-gray-500"}`}
                            >
                                <ArrowUp className="w-4 h-4" />
                            </button>
                        </form>
                        <div className={`text-center mt-2.5 text-xs hidden md:block ${isDarkMode ? 'text-[#a3a3a3]' : 'text-gray-400'}`}>
                            Study Buddy Research Preview. Use generated notes for review.
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
