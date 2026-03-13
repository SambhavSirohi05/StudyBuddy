'use client';

import { Plus, MessageSquare, User, X, Trash2 } from 'lucide-react';
import { ChatSession } from '@/types';
import { clsx } from 'clsx';

interface SidebarProps {
    sessions: ChatSession[];
    currentSessionId: string | null;
    onNewChat: () => void;
    onLoadChat: (id: string) => void;
    onDeleteChat: (id: string, e: React.MouseEvent) => void;
    isOpen: boolean;        // For mobile drawer state
    onClose: () => void;    // To close drawer on mobile
}

export default function Sidebar({
    sessions,
    currentSessionId,
    onNewChat,
    onLoadChat,
    onDeleteChat,
    isOpen,
    onClose
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
                "fixed inset-y-0 left-0 index-50 w-[260px] h-full bg-[#171717] text-gray-200 flex flex-col transition-transform duration-300 md:relative md:translate-x-0 z-50",
                isOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                {/* Mobile Header (Close Button) */}
                <div className="md:hidden p-4 flex justify-end">
                    <button onClick={onClose} className="p-1 hover:bg-white/10 rounded">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* New Chat Button */}
                <div className="p-3">
                    <button
                        onClick={() => {
                            onNewChat();
                            onClose(); // Close on mobile after selection
                        }}
                        className="flex items-center gap-2 w-full px-3 py-3 rounded-lg border border-white/20 hover:bg-white/10 transition-colors text-sm text-white font-medium text-left"
                    >
                        <Plus className="w-4 h-4" />
                        New chat
                    </button>
                </div>

                {/* History List */}
                <div className="flex-1 overflow-y-auto px-2 py-4 space-y-6">
                    {sessions.length === 0 ? (
                        <div className="text-sm text-gray-500 px-3 py-4 text-center">No chats yet</div>
                    ) : (
                        <>
                            <SessionGroup 
                                title="Today" 
                                items={sessions.filter(s => s.createdAt >= new Date().setHours(0,0,0,0))}
                                currentSessionId={currentSessionId}
                                onLoadChat={onLoadChat}
                                onDeleteChat={onDeleteChat}
                                onClose={onClose}
                            />
                            <SessionGroup 
                                title="Previous 7 Days" 
                                items={sessions.filter(s => s.createdAt < new Date().setHours(0,0,0,0) && s.createdAt >= new Date().setHours(0,0,0,0) - 7 * 24 * 60 * 60 * 1000)}
                                currentSessionId={currentSessionId}
                                onLoadChat={onLoadChat}
                                onDeleteChat={onDeleteChat}
                                onClose={onClose}
                            />
                            <SessionGroup 
                                title="Older" 
                                items={sessions.filter(s => s.createdAt < new Date().setHours(0,0,0,0) - 7 * 24 * 60 * 60 * 1000)}
                                currentSessionId={currentSessionId}
                                onLoadChat={onLoadChat}
                                onDeleteChat={onDeleteChat}
                                onClose={onClose}
                            />
                        </>
                    )}
                </div>

                {/* User Footer */}
                <div className="p-3 border-t border-white/10">
                    <button className="flex items-center gap-3 w-full px-3 py-3 rounded-lg hover:bg-white/10 transition-colors text-sm text-white">
                        <div className="w-8 h-8 rounded bg-green-600 flex items-center justify-center text-white font-bold">
                            U
                        </div>
                        <div className="flex-1 text-left font-medium">Study User</div>
                    </button>
                </div>
            </div>
        </>
    );
}

function SessionGroup({ title, items, currentSessionId, onLoadChat, onDeleteChat, onClose }: any) {
    if (items.length === 0) return null;
    
    return (
        <div className="space-y-1">
            <h3 className="px-3 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</h3>
            {items.map((session: ChatSession) => (
                <div key={session.id} className="relative group">
                    <button
                        onClick={() => {
                            onLoadChat(session.id);
                            onClose();
                        }}
                        className={clsx(
                            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all duration-200 text-sm overflow-hidden text-left",
                            currentSessionId === session.id 
                                ? "bg-[#2A2A2A] text-white font-medium shadow-sm border border-white/10" 
                                : "text-gray-400 hover:bg-white/5 hover:text-gray-200 border border-transparent"
                        )}
                    >
                        <MessageSquare className="w-4 h-4 flex-shrink-0" />
                        <span className="truncate pr-6">{session.title}</span>
                    </button>
                    {/* Delete Button (Visible on Hover) */}
                    <button
                        onClick={(e) => onDeleteChat(session.id, e)}
                        className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Delete chat"
                    >
                        <Trash2 className="w-3.5 h-3.5" />
                    </button>
                </div>
            ))}
        </div>
    );
}
