import { StudyNotes } from '@/types';
import SubtopicSection from './SubtopicSection';
import { BookOpen, AlertTriangle, Lightbulb } from 'lucide-react';

interface NotesRendererProps {
    notes: StudyNotes | null;
}

export default function NotesRenderer({ notes }: NotesRendererProps) {
    if (!notes) {
        return (
            <div className="h-full flex items-center justify-center text-gray-400 bg-white">
                <div className="text-center max-w-sm px-4">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                        <BookOpen className="w-8 h-8 opacity-20 text-gray-600" />
                    </div>
                    <h3 className="text-gray-900 font-medium mb-1">Study Notes</h3>
                    <p className="text-sm">Your generated notes and diagrams will appear here in a structured format.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="h-full overflow-y-auto bg-white p-6 md:p-12">
            <div className="max-w-3xl mx-auto space-y-10 pb-20">

                {/* Header */}
                <div className="space-y-4 border-b border-gray-100 pb-8">
                    <h1 className="text-4xl font-bold text-gray-900 tracking-tight leading-tight">
                        {notes.topic}
                    </h1>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-medium rounded uppercase tracking-wider">Exam Ready</span>
                        <span className="px-2 py-1 bg-blue-50 text-blue-600 text-xs font-medium rounded uppercase tracking-wider">Visual</span>
                    </div>
                </div>

                {/* Subtopics */}
                <div className="space-y-8">
                    {notes.subtopics.map((subtopic, idx) => (
                        <SubtopicSection key={idx} subtopic={subtopic} index={idx} />
                    ))}
                </div>

                {/* Additional Sections */}
                <div className="grid gap-6">
                    {/* Exam Notes */}
                    <div className="bg-gray-50 p-6 rounded-xl border border-gray-100">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                            <BookOpen className="w-5 h-5 text-gray-700" />
                            Exam Key Points
                        </h3>
                        <ul className="space-y-3">
                            {notes.exam_notes.map((note, idx) => (
                                <li key={idx} className="flex gap-3 text-gray-700 text-sm leading-relaxed">
                                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 flex-shrink-0" />
                                    {note}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Common Mistakes */}
                    <div className="bg-orange-50/50 p-6 rounded-xl border border-orange-100/50">
                        <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
                            <AlertTriangle className="w-5 h-5 text-orange-600" />
                            Common Mistakes
                        </h3>
                        <ul className="space-y-3">
                            {notes.common_mistakes.map((mistake, idx) => (
                                <li key={idx} className="flex gap-3 text-orange-800 text-sm leading-relaxed">
                                    <span className="w-1.5 h-1.5 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                                    {mistake}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Revision Tips */}
                    <div className="bg-green-50/50 p-6 rounded-xl border border-green-100/50">
                        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                            <Lightbulb className="w-5 h-5 text-green-600" />
                            Revision Tips
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {notes.revision_tips.map((tip, idx) => (
                                <span key={idx} className="px-3 py-1.5 bg-white border border-green-100 rounded-lg text-green-700 text-sm font-medium shadow-sm">
                                    {tip}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}
