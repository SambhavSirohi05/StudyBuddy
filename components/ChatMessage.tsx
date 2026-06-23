'use client';

import { Message, StudyNotes } from '@/types';
import { clsx } from 'clsx';
import { Bot, User, Copy, ThumbsUp, ThumbsDown, Check } from 'lucide-react';
import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import DiagramRenderer from './DiagramRenderer';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import ErrorBoundary from './ErrorBoundary';

interface ChatMessageProps {
    message: Message;
    isDarkMode: boolean;
}

export default function ChatMessage({ message, isDarkMode }: ChatMessageProps) {
    return (
        <ErrorBoundary>
            <ChatMessageContent message={message} isDarkMode={isDarkMode} />
        </ErrorBoundary>
    );
}

function ChatMessageContent({ message, isDarkMode }: ChatMessageProps) {
    const isUser = message.role === 'user';
    const isNotes = typeof message.content !== 'string';

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
                <code className={clsx(
                    "px-1.5 py-0.5 rounded font-mono text-sm sync-theme-transition",
                    isDarkMode 
                        ? "bg-white/10 text-[#E2E8F0]" 
                        : "bg-black/5 text-[#0f172a]"
                )} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div className={clsx(
            "w-full text-base border-b sync-theme-transition",
            isDarkMode ? "border-zinc-900/60" : "border-gray-100",
            isUser 
                ? (isDarkMode ? "bg-[#141414] text-gray-100" : "bg-[#F4F8F9] text-gray-800") 
                : (isDarkMode ? "bg-[#0D0D0D] text-gray-200" : "bg-[#ffffff] text-gray-800")
        )}>
            <div className={clsx(
                "w-full py-2 md:py-4 border-b sync-theme-transition",
                isDarkMode ? "border-zinc-900/40" : "border-gray-100/50",
                isUser 
                    ? (isDarkMode ? "bg-[#141414]" : "bg-[#F4F8F9]") 
                    : (isDarkMode ? "bg-[#0D0D0D]" : "bg-[#ffffff]")
            )}>
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
                            <div className={clsx(
                                "markdown prose prose-slate max-w-none break-words",
                                isDarkMode ? "prose-invert" : ""
                            )}>
                                {isNotes ? (
                                    <StudyNotesRenderer notes={message.content as StudyNotes} isDarkMode={isDarkMode} />
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

function StudyNotesRenderer({ notes, isDarkMode }: { notes: StudyNotes; isDarkMode: boolean }) {
    if (!notes) return <div className="text-red-500">Error: No notes data available.</div>;

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
                <code className={clsx(
                    "px-1.5 py-0.5 rounded font-mono text-sm sync-theme-transition",
                    isDarkMode 
                        ? "bg-white/10 text-[#E2E8F0]" 
                        : "bg-black/5 text-[#0f172a]"
                )} {...props}>
                    {children}
                </code>
            );
        }
    };

    return (
        <div className="space-y-8">
            {/* Conversational Mode */}
            {notes.is_conversational && notes.conversational_response ? (
                <div className={clsx(
                    "prose prose-slate max-w-none",
                    isDarkMode ? "prose-invert text-gray-300" : "text-gray-700"
                )}>
                    <ReactMarkdown components={MarkdownComponents}>{notes.conversational_response}</ReactMarkdown>
                </div>
            ) : (
                <>
                    {/* Title */}
                    <div>
                        <h1 className={clsx("text-2xl font-bold mb-2", isDarkMode ? "text-gray-100" : "text-gray-900")}>{notes.topic}</h1>
                        <hr className={isDarkMode ? "border-zinc-800 my-4" : "border-gray-200 my-4"} />
                    </div>

                    {/* Subtopics with Inline Diagrams */}
                    <div className="space-y-10">
                        {notes.subtopics?.length > 0 ? notes.subtopics.map((subtopic, idx) => (
                            <div key={idx} className="group">
                                <h2 className={clsx("text-xl font-semibold mb-3", isDarkMode ? "text-gray-100" : "text-gray-900")}>{subtopic.title}</h2>

                                {/* Text Explanation */}
                                <div className={clsx("mb-6 leading-relaxed", isDarkMode ? "text-gray-300" : "text-gray-700")}>
                                    <ReactMarkdown components={MarkdownComponents}>{subtopic.explanation}</ReactMarkdown>
                                </div>

                                {/* Diagrams */}
                                {subtopic.diagrams?.map((diagram, dIdx) => (
                                    <div 
                                        key={dIdx} 
                                        className={clsx(
                                            "my-6 border rounded-xl p-2 shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 sync-theme-transition",
                                            isDarkMode 
                                                ? "bg-[#141414] border-zinc-800 hover:border-zinc-700 hover:shadow-black/50" 
                                                : "bg-[#F4F8F9] border-gray-200 hover:border-gray-300 hover:shadow-gray-200"
                                        )}
                                    >
                                        <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2 px-2 pt-2">
                                            {diagram.diagram_title}
                                        </div>
                                        <div className={`border-t mb-2 ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}></div>
                                        <DiagramRenderer
                                            code={diagram.diagram_code}
                                            id={`msg-diagram-${idx}-${dIdx}`}
                                            type={diagram.diagram_type}
                                        />
                                        <div className={clsx("text-sm px-4 pb-4 rounded italic", isDarkMode ? "text-gray-400" : "text-gray-650")}>
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
                            <h2 className={clsx("text-xl font-semibold mb-4", isDarkMode ? "text-gray-100" : "text-gray-900")}>{notes.comparison_table.title}</h2>
                            <table className="w-full text-left border-collapse min-w-[500px]">
                                <thead>
                                    <tr className={`border-b ${isDarkMode ? 'border-zinc-800' : 'border-gray-200'}`}>
                                        <th className="py-4 px-2 font-semibold text-gray-400 text-sm uppercase tracking-wider w-1/4">Aspect</th>
                                        {notes.comparison_table.columns.map((col, idx) => (
                                            <th key={idx} className={clsx("py-4 px-2 font-semibold text-base", isDarkMode ? "text-gray-100" : "text-gray-900")}>{col}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody className={isDarkMode ? "divide-y divide-zinc-800/50" : "divide-y divide-gray-150"}>
                                    {notes.comparison_table.rows.map((row, rIdx) => (
                                        <tr key={rIdx} className={clsx("transition-colors duration-200", isDarkMode ? "hover:bg-white/[0.02]" : "hover:bg-black/[0.02]")}>
                                            <td className={clsx("py-4 px-2 font-semibold align-top", isDarkMode ? "text-gray-100" : "text-gray-900")}>{row.aspect}</td>
                                            {row.values.map((val, vIdx) => (
                                                <td key={vIdx} className={clsx("py-4 px-2 leading-relaxed align-top", isDarkMode ? "text-gray-300" : "text-gray-650")}>{val}</td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* Exam Notes & Mistakes */}
                    <div className="grid md:grid-cols-2 gap-4 mt-8">
                        <div className={clsx(
                            "p-4 rounded-xl border sync-theme-transition",
                            isDarkMode 
                                ? "bg-blue-900/20 border-blue-800/30" 
                                : "bg-blue-50/50 border-blue-100"
                        )}>
                            <h3 className={clsx("font-semibold mb-2", isDarkMode ? "text-blue-300" : "text-blue-700")}>Exam Points</h3>
                            <ul className={clsx("list-disc list-inside text-sm space-y-1", isDarkMode ? "text-gray-300" : "text-gray-650")}>
                                {notes.exam_notes?.map((n, i) => <li key={i}>{n}</li>)}
                            </ul>
                        </div>
                        <div className={clsx(
                            "p-4 rounded-xl border sync-theme-transition",
                            isDarkMode 
                                ? "bg-red-900/20 border-red-800/30" 
                                : "bg-red-50/50 border-red-100"
                        )}>
                            <h3 className={clsx("font-semibold mb-2", isDarkMode ? "text-red-300" : "text-red-700")}>Common Mistakes</h3>
                            <ul className={clsx("list-disc list-inside text-sm space-y-1", isDarkMode ? "text-gray-300" : "text-gray-650")}>
                                {notes.common_mistakes?.map((n, i) => <li key={i}>{n}</li>)}
                            </ul>
                        </div>
                    </div>

                    {/* Revision Tips */}
                    <div className={clsx(
                        "p-4 rounded-xl border mt-4 sync-theme-transition",
                        isDarkMode 
                            ? "bg-green-900/20 border-green-800/30" 
                            : "bg-green-50/50 border-green-100"
                    )}>
                        <h3 className={clsx("font-semibold mb-2", isDarkMode ? "text-green-300" : "text-green-700")}>Quick Revision</h3>
                        <div className="flex flex-wrap gap-2">
                            {notes.revision_tips?.map((t, i) => (
                                <span 
                                    key={i} 
                                    className={clsx(
                                        "text-xs px-2 py-1 rounded-lg font-medium border sync-theme-transition",
                                        isDarkMode 
                                            ? "bg-[#1F1F1F] border-green-800/50 text-green-300" 
                                            : "bg-white border-green-200 text-green-700 shadow-sm"
                                    )}
                                >
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
