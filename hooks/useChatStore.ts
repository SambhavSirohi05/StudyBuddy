"use client";

import { useState, useEffect } from 'react';
import { Message, ChatSession } from '@/types';

const STORAGE_KEY = 'studyidea-chat-sessions';

export function useChatStore() {
    const [sessions, setSessions] = useState<ChatSession[]>([]);
    const [currentSessionId, setCurrentSessionId] = useState<string | null>(null);
    const [isLoaded, setIsLoaded] = useState(false);

    // 1. Load from LocalStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem(STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setSessions(parsed);
                // Optionally restore the last active session? For now, we start Fresh or let user pick.
                // Or if we want to default to new chat:
                // setCurrentSessionId(null);
            } catch (e) {
                console.error("Failed to parse chat history", e);
            }
        }
        setIsLoaded(true);
    }, []);

    // 2. Save to LocalStorage whenever sessions change (WRAPPED IN TRY-CATCH)
    useEffect(() => {
        if (isLoaded) {
            try {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
            } catch (e) {
                console.error("Failed to save to localStorage:", e);
                // Optionally: Notify user via toast that history isn't saving?
            }
        }
    }, [sessions, isLoaded]);

    const createNewChat = () => {
        const newSession: ChatSession = {
            id: crypto.randomUUID(),
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
        };
        setSessions(prev => [newSession, ...prev]);
        setCurrentSessionId(newSession.id);
        return newSession.id;
    };

    const loadChat = (id: string) => {
        setCurrentSessionId(id);
    };

    const deleteChat = (id: string, e: React.MouseEvent) => {
        e.stopPropagation();
        setSessions(prev => prev.filter(s => s.id !== id));
        if (currentSessionId === id) {
            setCurrentSessionId(null);
        }
    };

    const addMessageToCurrent = (msg: Message, specificSessionId?: string) => {
        let targetId = specificSessionId || currentSessionId;

        // CASE 1: No session exists. Create one WITH the message included.
        if (!targetId) {
            const newSessionId = crypto.randomUUID();

            // Define Title
            let newTitle = 'New Chat';
            if (msg.role === 'user' && typeof msg.content === 'string') {
                newTitle = msg.content.slice(0, 30) + (msg.content.length > 30 ? '...' : '');
            }

            const newSession: ChatSession = {
                id: newSessionId,
                title: newTitle,
                messages: [msg],
                createdAt: Date.now(),
            };

            // Atomic Update: Add session AND set it as current
            setSessions(prev => [newSession, ...prev]);
            setCurrentSessionId(newSessionId);

            return newSessionId;
        }

        // CASE 2: Session exists. Update it.
        setSessions(prev => prev.map(session => {
            if (session.id === targetId) {
                const newMessages = [...session.messages, msg];
                // Update title if it's the first user message and title is "New Chat"
                let newTitle = session.title;
                if (session.messages.length === 0 && msg.role === 'user' && typeof msg.content === 'string') {
                    newTitle = msg.content.slice(0, 30) + (msg.content.length > 30 ? '...' : '');
                }
                return { ...session, messages: newMessages, title: newTitle };
            }
            return session;
        }));

        return targetId;
    };

    const currentMessages = sessions.find(s => s.id === currentSessionId)?.messages || [];

    return {
        sessions,
        currentSessionId,
        isLoaded,
        messages: currentMessages,
        createNewChat,
        loadChat,
        deleteChat,
        addMessageToCurrent
    };
}
