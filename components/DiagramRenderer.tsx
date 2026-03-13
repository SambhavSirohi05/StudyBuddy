'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import ImageModal from './ImageModal';

interface DiagramRendererProps {
    code: string;
    id: string; // Unique ID for the diagram
    type: string;
}

/**
 * Sanitize AI-generated Mermaid code to fix common syntax issues.
 * - Ensures node labels containing special characters are properly quoted.
 * - Removes problematic characters that break the parser.
 */
function sanitizeMermaidCode(code: string): string {
    let sanitized = code.trim();

    // Fix subgraph labels with special characters
    // e.g. "subgraph Sender (Encapsulation)" -> "subgraph sender_encapsulation ["Sender (Encapsulation)"]"
    sanitized = sanitized.replace(
        /^(\s*subgraph\s+)(.+)$/gm,
        (match, prefix, label) => {
            const trimmedLabel = label.trim();
            // Already has bracket syntax like: subgraph id ["Label"]
            if (/\[.*\]/.test(trimmedLabel)) return match;
            // If label contains special characters, use the bracket syntax
            if (/[(){}[\]<>|&]/.test(trimmedLabel)) {
                // Create a safe ID from the label
                const safeId = trimmedLabel.replace(/[^a-zA-Z0-9]/g, '_').replace(/_+/g, '_');
                return `${prefix}${safeId} ["${trimmedLabel.replace(/"/g, '#quot;')}"]`;
            }
            return match;
        }
    );

    // Fix node definitions like A[Label (with parens)] -> A["Label (with parens)"]
    // Only quote if the label isn't already quoted
    sanitized = sanitized.replace(
        /(\b\w+)\[([^\]"]+)\]/g,
        (match, nodeId, label) => {
            // Skip subgraph lines (already handled above)
            if (nodeId === 'subgraph') return match;
            // If label contains special characters that break mermaid, wrap in quotes
            if (/[(){}[\]<>|&]/.test(label)) {
                return `${nodeId}["${label.replace(/"/g, '#quot;')}"]`;
            }
            return match;
        }
    );

    // Fix (round) node definitions: A(Label (x)) -> A("Label (x)")
    sanitized = sanitized.replace(
        /(\b\w+)\(([^)"]+)\)/g,
        (match, nodeId, label) => {
            if (nodeId === 'subgraph') return match;
            if (/[(){}[\]<>|&]/.test(label)) {
                return `${nodeId}("${label.replace(/"/g, '#quot;')}")`;
            }
            return match;
        }
    );

    // Remove any completely empty lines between nodes that could cause issues
    sanitized = sanitized.replace(/\n{3,}/g, '\n\n');

    return sanitized;
}

export default function DiagramRenderer({ code, id, type }: DiagramRendererProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const [svg, setSvg] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [isZoomed, setIsZoomed] = useState(false);
    const [svgDataUrl, setSvgDataUrl] = useState<string | undefined>(undefined);

    useEffect(() => {
        mermaid.initialize({
            startOnLoad: false,
            theme: 'neutral',
            securityLevel: 'loose',
            fontFamily: 'inherit'
        });
    }, []);

    useEffect(() => {
        const renderDiagram = async () => {
            if (type !== 'mermaid' || !containerRef.current) return;

            const svgId = `mermaid-svg-${id}`;

            // Try rendering original code first, then sanitized version
            const attempts = [code, sanitizeMermaidCode(code)];

            for (const attempt of attempts) {
                try {
                    const { svg } = await mermaid.render(svgId, attempt);
                    setSvg(svg);
                    setError(null);

                    const blob = new Blob([svg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    setSvgDataUrl(url);
                    return; // Success — stop trying
                } catch (err) {
                    console.warn('Mermaid render attempt failed:', err);
                    // Continue to next attempt
                }
            }

            // Both attempts failed — show graceful fallback
            console.error('Mermaid rendering failed for all attempts');
            setError('Diagram syntax error — showing raw code below.');
        };

        renderDiagram();

        return () => {
            if (svgDataUrl) URL.revokeObjectURL(svgDataUrl);
        };
    }, [code, id, type]);

    if (type !== 'mermaid') return null;

    return (
        <>
            <div
                className={`my-4 p-4 bg-white rounded-xl border border-gray-200 shadow-[0_0_15px_rgba(0,0,0,0.1)] overflow-hidden flex justify-center ${!error ? 'cursor-zoom-in hover:shadow-[0_0_20px_rgba(0,0,0,0.15)]' : ''} transition-shadow`}
                onClick={() => !error && setIsZoomed(true)}
                title={!error ? 'Click to zoom' : undefined}
            >
                {error ? (
                    <div className="w-full">
                        <div className="text-amber-600 text-sm font-medium mb-2">⚠️ {error}</div>
                        <pre className="text-xs text-gray-600 bg-gray-50 rounded-md p-3 overflow-x-auto whitespace-pre-wrap font-mono">
                            {code}
                        </pre>
                    </div>
                ) : (
                    <div
                        ref={containerRef}
                        className="mermaid-container"
                        dangerouslySetInnerHTML={{ __html: svg }}
                    />
                )}
            </div>

            <ImageModal
                isOpen={isZoomed}
                onClose={() => setIsZoomed(false)}
                imageUrl={svgDataUrl} // Pass the SVG blob URL
            />
        </>
    );
}
