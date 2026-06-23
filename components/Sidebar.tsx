'use client';

import { Plus, MessageSquare, X, Trash2 } from 'lucide-react';
import { ChatSession } from '@/types';
import { clsx } from 'clsx';

interface SidebarProps {
    sessions: ChatSession[];
    currentSessionId: string | null;
    onNewChat: () => void;
    onLoadChat: (id: string) => void;
    onDeleteChat: (id: string, e: React.MouseEvent) => void;
    onClearAllChats: () => void;
    isOpen: boolean;        // For mobile drawer state
    onClose: () => void;    // To close drawer on mobile
    isDarkMode: boolean;    // Dynamic theme support
}

export default function Sidebar({
    sessions,
    currentSessionId,
    onNewChat,
    onLoadChat,
    onDeleteChat,
    onClearAllChats,
    isOpen,
    onClose,
    isDarkMode
}: SidebarProps) {
    return (
        <>
            {/* Mobile Overlay */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                />
            )}

            {/* Sidebar Container */}
            <div className={clsx(
                "fixed inset-y-0 left-0 index-50 w-[260px] h-full flex flex-col md:relative md:translate-x-0 z-50 border-r sidebar-transition",
                isOpen ? "translate-x-0" : "-translate-x-full",
                isDarkMode 
                    ? "bg-[#0D0D0D] border-zinc-900 text-[#F0EDE8]" 
                    : "bg-[#ffffff] border-gray-100 text-[#0f172a]"
            )}>
                {/* Mobile Header (Close Button) */}
                <div className="md:hidden p-4 flex justify-end">
                    <button 
                        onClick={onClose} 
                        className={`p-1 rounded sync-theme-transition ${isDarkMode ? 'hover:bg-zinc-800 text-gray-400' : 'hover:bg-gray-100 text-gray-600'}`}
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Brand Header Logo (Above New Chat Button) */}
                <div className={`px-4 py-4.5 border-b flex items-center justify-between sync-theme-transition ${isDarkMode ? 'border-zinc-900' : 'border-gray-100'}`}>
                    <div className="c1-logo select-none text-[1.8rem]">
                        StudyBuddy<span className="c1-logo-dot">.</span>
                    </div>
                </div>

                {/* New Chat Button */}
                <div className="p-3">
                    <button
                        onClick={() => {
                            onNewChat();
                            onClose(); // Close on mobile after selection
                        }}
                        className={`flex items-center gap-2 w-full px-3 py-3 rounded-lg border sync-theme-transition text-sm font-medium text-left ${isDarkMode ? 'border-zinc-800 hover:bg-zinc-800/50 text-white' : 'border-gray-200 hover:bg-gray-50 text-gray-800'}`}
                    >
                        <Plus className="w-4 h-4" />
                        New chat
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
                    {sessions.length === 0 ? (
                        <div className={`text-sm px-3 py-4 text-center ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>No chats yet</div>
                    ) : (
                        <>
                            <SessionGroup 
                                title="Today" 
                                items={sessions.filter(s => s.createdAt >= new Date().setHours(0,0,0,0))}
                                currentSessionId={currentSessionId}
                                onLoadChat={onLoadChat}
                                onDeleteChat={onDeleteChat}
                                onClose={onClose}
                                isDarkMode={isDarkMode}
                            />
                            <SessionGroup 
                                title="Previous 7 Days" 
                                items={sessions.filter(s => s.createdAt < new Date().setHours(0,0,0,0) && s.createdAt >= new Date().setHours(0,0,0,0) - 7 * 24 * 60 * 60 * 1000)}
                                currentSessionId={currentSessionId}
                                onLoadChat={onLoadChat}
                                onDeleteChat={onDeleteChat}
                                onClose={onClose}
                                isDarkMode={isDarkMode}
                            />
                            <SessionGroup 
                                title="Older" 
                                items={sessions.filter(s => s.createdAt < new Date().setHours(0,0,0,0) - 7 * 24 * 60 * 60 * 1000)}
                                currentSessionId={currentSessionId}
                                onLoadChat={onLoadChat}
                                onDeleteChat={onDeleteChat}
                                onClose={onClose}
                                isDarkMode={isDarkMode}
                            />
                        </>
                    )}
                </div>

                {/* User Footer */}
                <div className={`p-3 border-t space-y-1 sync-theme-transition ${isDarkMode ? 'border-zinc-900' : 'border-gray-100'}`}>
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to clear all chat history?")) {
                                onClearAllChats();
                                onClose();
                            }
                        }}
                        className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg sync-theme-transition text-sm text-left ${isDarkMode ? 'hover:bg-red-500/10 text-zinc-400 hover:text-red-400' : 'hover:bg-red-500/5 text-gray-500 hover:text-red-500'}`}
                    >
                        <Trash2 className="w-4 h-4" />
                        <span>Clear all chats</span>
                    </button>
                    <div className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm">
                        <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center text-white font-bold">
                            U
                        </div>
                        <div className="flex-1 text-left font-medium select-none">Study User</div>
                    </div>
                </div>
            </div>
        </>
    );
}

function SessionGroup({ title, items, currentSessionId, onLoadChat, onDeleteChat, onClose, isDarkMode }: any) {
    if (items.length === 0) return null;
    
    return (
        <div className="space-y-1">
            <h3 className={`px-3 text-xs font-semibold uppercase tracking-wider mb-2 ${isDarkMode ? 'text-zinc-600' : 'text-gray-400'}`}>{title}</h3>
            {items.map((session: ChatSession) => (
                <div key={session.id} className="relative group">
                    <button
                        onClick={() => {
                            onLoadChat(session.id);
                            onClose();
                        }}
                        className={clsx(
                            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg sync-theme-transition text-sm overflow-hidden text-left",
                            currentSessionId === session.id 
                                ? (isDarkMode 
                                    ? "bg-zinc-900 text-white font-medium border border-white/5" 
                                    : "bg-gray-100 text-gray-900 font-medium border border-gray-200")
                                : (isDarkMode 
                                    ? "text-gray-400 hover:bg-zinc-900/50 hover:text-gray-200 border border-transparent" 
                                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 border border-transparent")
                        )}
                    >
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate pr-6">{session.title}</span>
                    </button>
                    {/* Delete Button (Visible on Hover) */}
                    <button
                        onClick={(e) => onDeleteChat(session.id, e)}
                        className={`absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded transition-opacity opacity-0 group-hover:opacity-100 ${isDarkMode ? 'text-zinc-500 hover:text-red-400 hover:bg-zinc-800' : 'text-gray-400 hover:text-red-500 hover:bg-gray-100'}`}
                        title="Delete chat"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
