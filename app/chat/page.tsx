'use client';

import { useState, useEffect } from 'react';
import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';
import { generateStudyNotesAction } from '@/lib/ai-handler';
import { Message } from '@/types';
import { useChatStore } from '@/hooks/useChatStore';

export default function ChatPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [isDarkMode, setIsDarkMode] = useState(true);

    // Sync theme with localStorage
    useEffect(() => {
        const storedTheme = localStorage.getItem('studybuddy-theme');
        if (storedTheme === 'light') {
            setIsDarkMode(false);
        } else {
            setIsDarkMode(true);
        }
    }, []);

    useEffect(() => {
        if (isDarkMode) {
            localStorage.setItem('studybuddy-theme', 'dark');
            document.body.classList.add('c1-dark-body');
            document.body.classList.remove('c1-light-body');
        } else {
            localStorage.setItem('studybuddy-theme', 'light');
            document.body.classList.add('c1-light-body');
            document.body.classList.remove('c1-dark-body');
        }
    }, [isDarkMode]);

    const {
        messages,
        addMessageToCurrent,
        createNewChat,
        sessions,
        currentSessionId,
        loadChat,
        deleteChat,
        clearAllChats
    } = useChatStore();

    const handleSendMessage = async (inputStr: string) => {
        setIsLoading(true);

        const userMsg: Message = { role: 'user', content: inputStr };
        const sessionIdObj = addMessageToCurrent(userMsg);
        const activeSessionId = typeof sessionIdObj === 'string' ? sessionIdObj : currentSessionId;

        try {
            const notes = await generateStudyNotesAction(inputStr, messages);
            const aiMsg: Message = { role: 'assistant', content: notes };
            addMessageToCurrent(aiMsg, activeSessionId || undefined);
        } catch (error) {
            console.error(error);
            const errorMsg: Message = {
                role: 'assistant',
                content: "I'm sorry, I'm having trouble connecting to my brain right now. Please check if the API Key is set."
            };
            addMessageToCurrent(errorMsg, activeSessionId || undefined);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex h-screen bg-white dark:bg-[#0D0D0D] overflow-hidden transition-colors duration-300">
            {/* Desktop Sidebar (Always Visible) */}
            <div className="hidden md:block h-full">
                <Sidebar
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    onNewChat={createNewChat}
                    onLoadChat={loadChat}
                    onDeleteChat={deleteChat}
                    onClearAllChats={clearAllChats}
                    isOpen={false}
                    onClose={() => { }}
                    isDarkMode={isDarkMode}
                />
            </div>

            {/* Mobile Sidebar (Drawer) */}
            <div className="md:hidden">
                <Sidebar
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    onNewChat={createNewChat}
                    onLoadChat={loadChat}
                    onDeleteChat={deleteChat}
                    onClearAllChats={clearAllChats}
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                    isDarkMode={isDarkMode}
                />
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onToggleSidebar={() => setIsSidebarOpen(true)}
                isDarkMode={isDarkMode}
                onToggleTheme={() => setIsDarkMode(!isDarkMode)}
            />
        </main>
    );
}
