import ReactMarkdown from 'react-markdown';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { Subtopic } from '@/types';
import DiagramRenderer from './DiagramRenderer';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface SubtopicSectionProps {
    subtopic: Subtopic;
    index: number;
}

export default function SubtopicSection({ subtopic, index }: SubtopicSectionProps) {
    const [isOpen, setIsOpen] = useState(true);

    return (
        <div className="border border-gray-200 rounded-xl overflow-hidden mb-6 bg-white shadow-sm hover:shadow-md transition-shadow">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 transition-colors text-left"
            >
                <h3 className="text-lg font-bold text-gray-800">{subtopic.title}</h3>
                {isOpen ? <ChevronUp className="w-5 h-5 text-gray-500" /> : <ChevronDown className="w-5 h-5 text-gray-500" />}
            </button>

            {isOpen && (
                <div className="p-6 space-y-6">
                    <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed">
                        <ReactMarkdown>{subtopic.explanation}</ReactMarkdown>
                    </div>

                    {subtopic.diagrams.map((diagram, idx) => (
                        <div key={idx} className="mt-6 bg-slate-50 rounded-lg p-6 border border-slate-100">
                            <div className="flex items-center gap-2 mb-4">
                                <span className="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded">DIAGRAM</span>
                                <h4 className="font-semibold text-slate-700">{diagram.diagram_title}</h4>
                            </div>

                            <DiagramRenderer
                                code={diagram.diagram_code}
                                id={`diagram-${index}-${idx}`}
                                type={diagram.diagram_type}
                            />

                            <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-400 text-yellow-800 text-sm">
                                <strong>💡 Explanation: </strong>
                                <ReactMarkdown components={{ p: 'span' }}>{diagram.diagram_explanation}</ReactMarkdown>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
