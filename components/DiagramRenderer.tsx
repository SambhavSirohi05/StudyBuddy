'use client';
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import ImageModal from './ImageModal';

interface DiagramRendererProps {
    code: string;
    id: string;
    type: string;
}

function sanitizeMermaidCode(code: string): string {
    let s = code.trim();

    // 0. Decode common HTML entities: &gt; → >, &lt; → <, &amp; → &
    s = s.replace(/&gt;/g, '>')
         .replace(/&lt;/g, '<')
         .replace(/&amp;/g, '&');

    // 0.5. Fix subgraph titles with quotes: subgraph "Typical Tree" → subgraph Typical_Tree ["Typical Tree"]
    s = s.replace(/^(\s*)subgraph\s+"([^"]+)"/gm, (match, indent, title) => {
        const safeId = title.replace(/[^a-zA-Z0-9]/g, '_');
        return `${indent}subgraph ${safeId} ["${title}"]`;
    });

    // 0.6. Fix subgraph titles with spaces but no quotes: subgraph Typical Tree → subgraph Typical_Tree ["Typical Tree"]
    s = s.replace(/^(\s*)subgraph\s+([a-zA-Z0-9_\s()\-]+)$/gm, (match, indent, title) => {
        const trimmed = title.trim();
        if (trimmed.includes(' ') && !trimmed.startsWith('"') && !trimmed.startsWith('[')) {
            const safeId = trimmed.replace(/[^a-zA-Z0-9]/g, '_');
            return `${indent}subgraph ${safeId} ["${trimmed}"]`;
        }
        return match;
    });

    // 1. Strip tilde generics: List~Book~ → List
    s = s.replace(/~[^~\n]+~/g, '');

    // 2. Strip angle bracket generics: List<Book> → List
    s = s.replace(/<[^>\n]+>/g, '');

    // 3. Strip colon-style param types inside parens: (book: Book) → (book)
    s = s.replace(/\(([^)]*)\)/g, (match, inner) => {
        const cleaned = inner
            .split(',')
            .map((p: string) => p.trim().replace(/:\s*\w+/g, '').trim())
            .filter(Boolean)
            .join(', ');
        return `(${cleaned})`;
    });

    // 4. Strip colon before return type: method() : boolean → method() boolean
    s = s.replace(/(\([^)]*\))\s*:\s*(\w+)/g, '$1 $2');

    // 5. Strip colon-style field types: -name: String → -name String
    s = s.replace(/^(\s*[+\-#~]\w+)\s*:\s*(\w+)(\s*)$/gm, '$1 $2$3');

    // 6. Strip > and < from inside quoted relationship labels
    s = s.replace(/:\s*"([^"]+)"/g, (_, label) => `: "${label.replace(/[<>]/g, '').trim()}"`);

    // 7. Normalize range multiplicities: "0..*" → * , "1..*" → * , "0..1" → 1
    s = s.replace(/"(\d+)\.\.\*"/g, '*');
    s = s.replace(/"(\d+)\.\.(\d+)"/g, '$2');

    // 8. Strip quotes from simple multiplicities: "1" -- "*" → 1 -- *
    s = s.replace(
        /"([\d\*]+)"\s*(--|\.\.>|\*--|--o|--\*|<\|--|--\|>|\*--\*)\s*"([\d\*]+)"/g,
        '$1 $2 $3'
    );

    // 9. Fix bare .. → ..>
    s = s.replace(/^(\s*[\w"'.]+\s*)(\.\.)(\s*[\w"'.]+)/gm, '$1..>$3');

    // 10. Reorder Java/TS style return types: +void method() → +method() void
    s = s.replace(
        /^(\s*)([+\-#~])(\w+)\s+(\w+)\(([^)]*)\)/gm,
        (match, indent, vis, returnType, methodName, params) => {
            const lower = returnType.toLowerCase();
            if (['class', 'interface', 'subgraph', 'enum'].includes(lower)) return match;
            return `${indent}${vis}${methodName}(${params}) ${returnType}`;
        }
    );

    // 11. Quote unquoted relationship labels with special chars
    s = s.replace(
        /^(\s*[\w"'.\-\*]+[^\n:]+:\s*)([^\n"]+)$/gm,
        (match, prefix, label) => {
            const trimmed = label.trim();
            if (/[^a-zA-Z0-9_]/.test(trimmed) && !trimmed.startsWith('"')) {
                return `${prefix}"${trimmed.replace(/"/g, '#quot;')}"`;
            }
            return match;
        }
    );

    // 12. Quote flowchart node labels with special chars: A[Label (x)] → A["Label (x)"]
    s = s.replace(/(\b\w+)\[([^\]"]+)\]/g, (match, nodeId, label) => {
        if (nodeId === 'subgraph') return match;
        if (/[(){}[\]<>|&]/.test(label)) {
            return `${nodeId}["${label.replace(/"/g, '#quot;')}"]`;
        }
        return match;
    });

    // 13. Collapse excess blank lines
    s = s.replace(/\n{3,}/g, '\n\n');

    return s;
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
            fontFamily: 'inherit',
            suppressUncaughtErrors: true,
        } as any);
        mermaid.parseError = () => {};
    }, []);

    useEffect(() => {
        let isMounted = true;
        const renderDiagram = async () => {
            if (type !== 'mermaid' || !containerRef.current) return;

            const svgId = `mermaid-svg-${id}`;
            const sanitized = sanitizeMermaidCode(code);
            console.log('[Mermaid sanitized]', sanitized);

            try {
                const { svg } = await mermaid.render(svgId, sanitized);
                if (!isMounted) return;
                setSvg(svg);
                setError(null);
                const blob = new Blob([svg], { type: 'image/svg+xml' });
                setSvgDataUrl(URL.createObjectURL(blob));
            } catch (err) {
                if (!isMounted) return;
                console.error('Mermaid render failed:', err);
                console.error('Sanitized code that failed:\n', sanitized);
                const tempId = `d${svgId}`;
                const el = document.getElementById(tempId) || document.getElementById(svgId);
                if (el) el.remove();
                setError('Diagram syntax error — showing raw code below.');
            }
        };

        renderDiagram();

        return () => {
            isMounted = false;
            if (svgDataUrl) URL.revokeObjectURL(svgDataUrl);
            const svgId = `mermaid-svg-${id}`;
            const el = document.getElementById(`d${svgId}`) || document.getElementById(svgId);
            if (el) el.remove();
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
                imageUrl={svgDataUrl}
            />
        </>
    );
}
