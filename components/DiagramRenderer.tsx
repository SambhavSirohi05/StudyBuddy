'use client';

import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import ImageModal from './ImageModal';

interface DiagramRendererProps {
    code: string;
    id: string; // Unique ID for the diagram
    type: string;
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
            try {
                if (type === 'mermaid' && containerRef.current) {
                    // Generate an ID for the SVG
                    const svgId = `mermaid-svg-${id}`;
                    const { svg } = await mermaid.render(svgId, code);
                    setSvg(svg);
                    setError(null);

                    // Create a data URL from the SVG for the modal image
                    const blob = new Blob([svg], { type: 'image/svg+xml' });
                    const url = URL.createObjectURL(blob);
                    setSvgDataUrl(url);
                }
            } catch (err) {
                console.error('Mermaid rendering error:', err);
                setError('Failed to render diagram.');
            }
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
                className="my-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm overflow-x-auto flex justify-center cursor-zoom-in hover:shadow-md transition-shadow"
                onClick={() => !error && setIsZoomed(true)}
                title="Click to zoom"
            >
                {error ? (
                    <div className="text-red-500 text-sm p-2">{error}</div>
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
