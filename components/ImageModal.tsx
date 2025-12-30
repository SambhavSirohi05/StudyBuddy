'use client';

import { X, ZoomIn } from 'lucide-react';
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

    return createPortal(
        <div
            className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
            onClick={onClose}
        >
            <div
                className="relative max-w-5xl max-h-[90vh] w-full overflow-hidden rounded-lg bg-[#1a1a1a] shadow-2xl border border-white/10"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="absolute top-2 right-2 z-10 flex gap-2">
                    {/* Add Zoom Indicator for clarity */}
                    <div className="bg-black/50 text-white/70 px-2 py-1 rounded text-xs flex items-center gap-1">
                        <ZoomIn className="w-3 h-3" />
                        <span>Zoomed View</span>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-full bg-black/50 text-white hover:bg-white/20 transition-colors"
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
