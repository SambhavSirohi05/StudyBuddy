'use client';

import { useState } from 'react';
import ChatInterface from '@/components/ChatInterface';
import Sidebar from '@/components/Sidebar';
import { generateStudyNotesAction } from '@/lib/ai-handler';
import { Message } from '@/types';
import { useChatStore } from '@/hooks/useChatStore';

export default function Home() {
    const [isLoading, setIsLoading] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const {
        messages,
        addMessageToCurrent,
        createNewChat,
        sessions,
        currentSessionId,
        loadChat,
        deleteChat
    } = useChatStore();

    const handleSendMessage = async (inputStr: string) => {
        setIsLoading(true);

        // Add User Message. Capture the Session ID used!
        const userMsg: Message = { role: 'user', content: inputStr };
        const sessionIdObj = addMessageToCurrent(userMsg);
        // addMessageToCurrent returns string | undefined. 
        // We know it returns string if it created a new chat, but TypeScript might infer void if not typed strictly.
        // But our patched store returns the ID.

        // Ensure we have a valid ID.
        const activeSessionId = typeof sessionIdObj === 'string' ? sessionIdObj : currentSessionId;

        try {
            // Fetch AI Response (Real or Mock based on Env)
            const notes = await generateStudyNotesAction(inputStr, messages);

            // Add AI Message with Notes Object to the SAME session
            const aiMsg: Message = { role: 'assistant', content: notes };

            // Pass the activeSessionId to force it into the correct session
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
        <main className="flex h-screen bg-white overflow-hidden">
            {/* Desktop Sidebar (Always Visible) */}
            <div className="hidden md:block h-full">
                <Sidebar
                    sessions={sessions}
                    currentSessionId={currentSessionId}
                    onNewChat={createNewChat}
                    onLoadChat={loadChat}
                    onDeleteChat={deleteChat}
                    isOpen={false} // Desktop doesn't use drawer overlay
                    onClose={() => { }}
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
                    isOpen={isSidebarOpen}
                    onClose={() => setIsSidebarOpen(false)}
                />
            </div>

            <ChatInterface
                messages={messages}
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                onToggleSidebar={() => setIsSidebarOpen(true)}
            />
        </main>
    );
}
