'use client';

import { Message, StudyNotes } from '@/types';
import { clsx } from 'clsx';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, RotateCcw, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import DiagramRenderer from './DiagramRenderer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ErrorBoundary from './ErrorBoundary';

interface ChatMessageProps {
    message: Message;
}

export default function ChatMessage({ message }: ChatMessageProps) {
    return (
        <ErrorBoundary>
            <ChatMessageContent message={message} />
        </ErrorBoundary>
    );
}

function ChatMessageContent({ message }: ChatMessageProps) {
    const isUser = message.role === 'user';
    const isNotes = typeof message.content !== 'string';

    return (
        <div className={clsx(
            "w-full text-base border-b border-white/10 text-gray-100",
            isUser ? "bg-[#1F1F1F]" : "bg-[#2A2A2A]"
        )}>
            <div className={clsx("w-full py-2 md:py-4 border-b border-white/5", isUser ? "bg-[#1F1F1F]" : "bg-[#2A2A2A]")}>
                <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-4 md:py-6 flex lg:px-0 m-auto">

                    {/* Avatar */}
                    <div className="w-8 flex flex-col relative items-end">
                        <div className={clsx(
                            "relative h-7 w-7 rounded-sm flex items-center justify-center text-white flex-shrink-0",
                            isUser ? "bg-gray-500" : "bg-green-500"
                        )}>
                            {isUser ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="relative flex-1 overflow-hidden">
                        {isUser ? (
                            <div className="font-semibold whitespace-pre-wrap">{message.content as string}</div>
                        ) : (
                            <div className="markdown prose prose-slate max-w-none break-words dark:prose-invert">
                                {isNotes ? (
                                    <StudyNotesRenderer notes={message.content as StudyNotes} />
                                ) : (
                                    <ReactMarkdown components={MarkdownComponents}>{message.content as string}</ReactMarkdown>
                                )}

                                {/* Footer Icons for Assistant */}
                                {!isUser && (
                                    <div className="flex gap-4 mt-4 text-gray-400">
                                        <Copy className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                                        <ThumbsUp className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                                        <ThumbsDown className="w-4 h-4 cursor-pointer hover:text-gray-600" />
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// Custom code renderer with syntax highlighting and copy button
function CodeCopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);
    return (
        <button 
            onClick={() => {
                navigator.clipboard.writeText(text);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
            }}
            className="flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
        >
            {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5" />}
            {copied ? <span className="text-green-500">Copied!</span> : 'Copy'}
        </button>
    );
}

const MarkdownComponents: any = {
    code({ node, className, children, ...props }: any) {
        const match = /language-(\w+)/.exec(className || '');
        const codeString = String(children).replace(/\n$/, '');
        
        // Block code (has language match or contains newlines)
        if (match || codeString.includes('\n')) {
            const lang = match ? match[1] : 'text';
            return (
                <div className="relative group rounded-md overflow-hidden bg-[#282C34] my-5 border border-white/10 shadow-sm">
                    <div className="flex bg-black/40 text-xs text-gray-400 px-4 py-2 justify-between items-center border-b border-white/5">
                        <span className="uppercase tracking-wider font-semibold">{lang}</span>
                        <CodeCopyButton text={codeString} />
                    </div>
                    <SyntaxHighlighter
                        style={oneDark}
                        language={lang}
                        PreTag="div"
                        customStyle={{ margin: 0, background: 'transparent', padding: '1rem', fontSize: '0.875rem' }}
                        {...props}
                    >
                        {codeString}
                    </SyntaxHighlighter>
                </div>
            );
        }
        
        // Inline code
        return (
            <code className="bg-white/10 px-1.5 py-0.5 rounded text-[#E2E8F0] font-mono text-sm" {...props}>
                {children}
            </code>
        );
    }
};

// Inline Renderer for the StudyNotes object
function StudyNotesRenderer({ notes }: { notes: StudyNotes }) {
    if (!notes) return <div className="text-red-500">Error: No notes data available.</div>;

    return (
        <div className="space-y-8">
            {/* Conversational Mode */}
            {notes.is_conversational && notes.conversational_response ? (
                <div className="prose prose-slate dark:prose-invert max-w-none">
                    <ReactMarkdown components={MarkdownComponents}>{notes.conversational_response}</ReactMarkdown>
                </div>
            ) : (
                <>
                    {/* Title */}
                    <div>
                        <h1 className="text-2xl font-bold mb-2 text-gray-100">{notes.topic}</h1>
                        <hr className="border-white/10 my-4" />
                    </div>

                    {/* Subtopics with Inline Diagrams */}
                    <div className="space-y-8">
                        {notes.subtopics?.length > 0 ? notes.subtopics.map((subtopic, idx) => (
                            <div key={idx} className="group p-5 -mx-5 rounded-2xl hover:bg-white/[0.02] transition-colors duration-300">
                                <h2 className="text-xl font-semibold mb-3 text-gray-100">{subtopic.title}</h2>

                                {/* Text Explanation */}
                                <div className="mb-6 leading-relaxed text-gray-300">
                                    <ReactMarkdown components={MarkdownComponents}>{subtopic.explanation}</ReactMarkdown>
                                </div>

                                {/* Diagrams */}
                                {subtopic.diagrams?.map((diagram, dIdx) => (
                                    <div key={dIdx} className="my-6 bg-[#1F1F1F] border border-white/10 rounded-xl p-2 shadow-sm hover:border-white/20 hover:shadow-lg hover:shadow-black/50 transition-all duration-300">
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2 pt-2">
                                            {diagram.diagram_title}
                                        </div>
                                        <div className="border-t border-gray-100 mb-2"></div>
                                        <DiagramRenderer
                                            code={diagram.diagram_code}
                                            id={`msg-diagram-${idx}-${dIdx}`}
                                            type={diagram.diagram_type}
                                        />
                                        <div className="text-sm bg-[#2A2A2A] p-3 rounded text-gray-400 italic mt-2 border-t border-white/10">
                                            {diagram.diagram_explanation}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )) : (
                            <div className="text-gray-500 italic">No detailed topics provided.</div>
                        )}
                    </div>

                    {/* Comparison Table */}
                    {notes.comparison_table && (
                        <div className="mt-10 overflow-x-auto">
                            <h2 className="text-xl font-semibold mb-4 text-gray-100">{notes.comparison_table.title}</h2>
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr className="border-b border-white/10">
                                        <th className="py-4 px-2 font-semibold text-gray-400 text-sm uppercase tracking-wider w-1/4">Aspect</th>
                                        {notes.comparison_table.columns.map((col, idx) => (
                                            <th key={idx} className="py-4 px-2 font-semibold text-gray-100 text-base">{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5">
                                    {notes.comparison_table.rows.map((row, rIdx) => (
                                        <tr key={rIdx} className="hover:bg-white/[0.04] transition-colors duration-200">
                                            <td className="py-4 px-2 font-semibold text-gray-100 align-top">{row.aspect}</td>
                                            {row.values.map((val, vIdx) => (
                                                <td key={vIdx} className="py-4 px-2 text-gray-300 leading-relaxed align-top">{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Exam Notes & Mistakes */}
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
                        <div className="bg-blue-900/20 p-4 rounded border border-blue-800/30">
                            <h3 className="font-bold text-blue-300 mb-2">Exam Points</h3>
                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-300">
                                {notes.exam_notes?.map((n, i) => <li key={i}>{n}</li>)}
                            </ul>
                        </div>
                        <div className="bg-red-900/20 p-4 rounded border border-red-800/30">
                            <h3 className="font-bold text-red-300 mb-2">Common Mistakes</h3>
                            <ul className="list-disc list-inside text-sm space-y-1 text-gray-300">
                                {notes.common_mistakes?.map((n, i) => <li key={i}>{n}</li>)}
                            </ul>
                        </div>
                    </div>

                    {/* Revision Tips */}
                    <div className="bg-green-900/20 p-4 rounded border border-green-800/30 mt-4">
                        <h3 className="font-bold text-green-300 mb-2">Quick Revision</h3>
                        <div className="flex flex-wrap gap-2">
                            {notes.revision_tips?.map((t, i) => (
                                <span key={i} className="text-xs bg-[#1F1F1F] border border-green-800/50 px-2 py-1 rounded text-green-300 font-medium">
                                    {t}
                                </span>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
