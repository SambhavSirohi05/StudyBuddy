'use client';

import { X, ZoomIn, Download } from 'lucide-react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';

interface ImageModalProps {
    isOpen: boolean;
    onClose: () => void;
    imageUrl?: string;
    children?: React.ReactNode;
}

export default function ImageModal({ isOpen, onClose, imageUrl, children }: ImageModalProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);

        const handleEsc = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };

        if (isOpen) {
            document.addEventListener('keydown', handleEsc);
            document.body.style.overflow = 'hidden';
        }

        return () => {
            document.removeEventListener('keydown', handleEsc);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    if (!mounted || !isOpen) return null;

    const handleDownload = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (!imageUrl) return;
        const a = document.createElement('a');
        a.href = imageUrl;
        a.download = 'studybuddy-diagram.svg';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300"
            onClick={onClose}
        >
            <div
                className="relative max-w-5xl max-h-[90vh] w-full overflow-hidden rounded-2xl bg-[#111111] shadow-2xl border border-white/10 animate-in zoom-in-95 duration-300 ease-out"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    {imageUrl && (
                        <button
                            onClick={handleDownload}
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-black/50 text-white hover:bg-white/10 border border-white/10 transition-colors text-sm font-medium backdrop-blur-md"
                        >
                            <Download className="w-4 h-4" />
                            Download SVG
                        </button>
                    )}
                    <button
                        onClick={onClose}
                        className="p-1.5 rounded-lg bg-black/50 text-white hover:bg-white/10 border border-white/10 transition-colors backdrop-blur-md"
                    >
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <div className="w-full h-full overflow-auto p-8 flex items-center justify-center bg-[#0a0a0a]">
                    {imageUrl ? (
                        <img
                            src={imageUrl}
                            alt="Zoomed Content"
                            className="max-w-full max-h-[85vh] object-contain"
                        />
                    ) : (
                        <div className="min-w-[500px] min-h-[300px] flex items-center justify-center">
                            {children}
                        </div>
                    )}
                </div>
            </div>
        </div>,
        document.body
    );
}
