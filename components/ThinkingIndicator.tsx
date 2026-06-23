'use client';

import { useState, useEffect } from 'react';
import { Brain, GitBranch, FileText, Sparkles, CheckCircle2 } from 'lucide-react';
import { clsx } from 'clsx';

interface ThinkingIndicatorProps {
    query?: string;
    isDarkMode: boolean;
}

const THINKING_STEPS = [
    { icon: Brain, label: 'Researching topic', duration: 3000 },
    { icon: GitBranch, label: 'Generating diagrams', duration: 5000 },
    { icon: FileText, label: 'Writing study notes', duration: 5000 },
    { icon: Sparkles, label: 'Preparing exam tips', duration: 4000 },
];

export default function ThinkingIndicator({ query, isDarkMode }: ThinkingIndicatorProps) {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const timers: NodeJS.Timeout[] = [];
        let elapsed = 0;

        THINKING_STEPS.forEach((step, index) => {
            if (index === 0) return; // First step shows immediately
            elapsed += step.duration;
            const timer = setTimeout(() => {
                setCurrentStep(index);
            }, elapsed - step.duration);
            timers.push(timer);
        });

        // Move to each step based on cumulative durations
        let cumulative = 0;
        THINKING_STEPS.forEach((step, index) => {
            if (index === 0) return;
            cumulative += THINKING_STEPS[index - 1].duration;
            const timer = setTimeout(() => setCurrentStep(index), cumulative);
            timers.push(timer);
        });

        return () => timers.forEach(clearTimeout);
    }, []);

    const topicSnippet = query
        ? query.length > 40 ? query.slice(0, 40) + '...' : query
        : 'your question';

    return (
        <div className={clsx(
            "w-full py-2 md:py-4 border-b sync-theme-transition",
            isDarkMode ? 'bg-[#0D0D0D] border-zinc-900/40' : 'bg-[#ffffff] border-gray-100/50'
        )}>
            <div className="text-base gap-4 md:gap-6 md:max-w-2xl lg:max-w-3xl xl:max-w-4xl p-4 md:py-6 flex lg:px-0 m-auto">
                {/* Avatar */}
                <div className="w-8 flex flex-col relative items-end">
                    <div className="relative h-7 w-7 rounded-sm flex items-center justify-center text-white flex-shrink-0 bg-green-500">
                        <Brain className="w-4 h-4 animate-pulse" />
                    </div>
                </div>

                {/* Steps */}
                <div className="flex-1 space-y-3">
                    <div className={clsx(
                        "text-sm mb-3 sync-theme-transition",
                        isDarkMode ? 'text-gray-400' : 'text-gray-500'
                    )}>
                        Thinking about <span className={clsx("font-medium sync-theme-transition", isDarkMode ? "text-gray-200" : "text-gray-800")}>"{topicSnippet}"</span>
                    </div>

                    <div className="space-y-2">
                        {THINKING_STEPS.map((step, index) => {
                            const StepIcon = step.icon;
                            const isActive = index === currentStep;
                            const isCompleted = index < currentStep;

                            return (
                                <div
                                    key={index}
                                    className={clsx(
                                        "flex items-center gap-3 text-sm transition-all duration-500",
                                        isActive 
                                            ? 'text-green-500' 
                                            : isCompleted 
                                                ? (isDarkMode ? 'text-gray-500' : 'text-gray-400') 
                                                : (isDarkMode ? 'text-zinc-700' : 'text-gray-300')
                                    )}
                                >
                                    <div className="w-5 h-5 flex items-center justify-center">
                                        {isCompleted ? (
                                            <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        ) : isActive ? (
                                            <StepIcon className="w-4 h-4 animate-pulse" />
                                        ) : (
                                            <div className={clsx(
                                                "w-2 h-2 rounded-full sync-theme-transition",
                                                isDarkMode ? 'bg-zinc-800' : 'bg-gray-250'
                                            )} />
                                        )}
                                    </div>
                                    <span className={clsx(
                                        "transition-all duration-300",
                                        isActive ? 'font-medium' : ''
                                    )}>
                                        {step.label}
                                        {isActive && (
                                            <span className="inline-flex ml-1">
                                                <span className="animate-[bounce_1s_infinite_0ms] inline-block">.</span>
                                                <span className="animate-[bounce_1s_infinite_200ms] inline-block">.</span>
                                                <span className="animate-[bounce_1s_infinite_400ms] inline-block">.</span>
                                            </span>
                                        )}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}
