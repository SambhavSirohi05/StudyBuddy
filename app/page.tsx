'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

export default function LandingPage() {
    const [isDarkMode, setIsDarkMode] = useState(true);
    const isMounted = useRef(false);

    // Sync theme with localStorage and body classes
    useEffect(() => {
        // Temporarily disable transitions on mount to prevent flash
        document.body.classList.add('no-transitions');
        
        const storedTheme = localStorage.getItem('studybuddy-theme');
        const isDark = storedTheme !== 'light';
        setIsDarkMode(isDark);
        
        if (isDark) {
            document.body.classList.add('c1-dark-body');
            document.body.classList.remove('c1-light-body');
        } else {
            document.body.classList.add('c1-light-body');
            document.body.classList.remove('c1-dark-body');
        }
        
        const reflow = document.body.offsetHeight;
        const timer = setTimeout(() => {
            document.body.classList.remove('no-transitions');
        }, 50);

        return () => clearTimeout(timer);
    }, []);

    // Sync body class when theme toggle is clicked manually
    useEffect(() => {
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }

        if (isDarkMode) {
            localStorage.setItem('studybuddy-theme', 'dark');
            document.body.classList.add('c1-dark-body');
            document.body.classList.remove('c1-light-body');
        } else {
            localStorage.setItem('studybuddy-theme', 'light');
            document.body.classList.add('c1-light-body');
            document.body.classList.remove('c1-dark-body');
        }
    }, [isDarkMode]);

    return (
        <>
            <div className={`c1-container ${isDarkMode ? 'c1-dark' : ''}`}>
                {/* Navbar */}
                <nav className="c1-navbar">
                    <div className="c1-logo">
                        StudyBuddy<span className="c1-logo-dot">.</span>
                    </div>
                    <div className="c1-nav-right">
                        {/* Theme Toggle Button */}
                        <button 
                            onClick={() => setIsDarkMode(!isDarkMode)} 
                            className="c1-theme-toggle" 
                            aria-label="Toggle Theme"
                        >
                            {isDarkMode ? (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <circle cx="12" cy="12" r="5"/>
                                    <line x1="12" y1="1" x2="12" y2="3"/>
                                    <line x1="12" y1="21" x2="12" y2="23"/>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                                    <line x1="1" y1="12" x2="3" y2="12"/>
                                    <line x1="21" y1="12" x2="23" y2="12"/>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                                </svg>
                            ) : (
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                                </svg>
                            )}
                        </button>
                        <Link href="/chat" className="c1-nav-cta">
                            Start Studying →
                        </Link>
                    </div>
                </nav>

                {/* Header block */}
                <div className="c1-header">
                    <span className="c1-badge">AI Visual Study Companion</span>
                    <h1 className="c1-title">Visualize Your Learning</h1>
                    <p className="c1-subtitle">
                        Translate complex concepts, technical docs, and code logic<br />
                        into interactive flowcharts and structured study guides instantly.
                    </p>
                </div>

                {/* Grid */}
                <div className="c1-grid">
                    {/* Card 1 */}
                    <div className="c1-card c1-card-1">
                        <div className="c1-prompt-box">
                            Generate a <span className="c1-blur-text">visual concept map</span> of <span className="c1-blur-text">Photosynthesis</span> detailing the light reactions and Calvin cycle.
                            {/* Glowing study tip popup */}
                            <div className="c1-tip-popup">
                                ✦ Exam Tip: Focus on energy inputs/outputs!
                            </div>
                        </div>
                        <button className="c1-tips-btn">
                            Visualize topic <span className="c1-tips-star">✦</span>
                        </button>
                        <svg className="c1-cursor" width="24" height="24" viewBox="0 0 24 24">
                            <path d="M4 2L20 11L11 13L9 22L4 2Z" strokeWidth="1" />
                        </svg>
                        <h3>Structured Study Guides</h3>
                    </div>

                    {/* Card 2 */}
                    <div className="c1-card c1-card-2">
                        <div className="c1-api-visual">
                            <svg className="c1-network-img" viewBox="0 0 340 180" xmlns="http://www.w3.org/2000/svg">
                                <rect className="c1-svg-node-primary" x="110" y="10" width="120" height="34" rx="17" />
                                <text className="c1-svg-text-primary" x="170" y="31" textAnchor="middle">Photosynthesis</text>
                                
                                <path className="c1-flow-line" d="M170 44 L170 80 L70 80 L70 110" fill="none" strokeWidth="1.5" strokeDasharray="4 4" />
                                <path className="c1-flow-line" d="M170 44 L170 80 L270 80 L270 110" fill="none" strokeWidth="1.5" strokeDasharray="4 4" />
                                
                                <rect className="c1-svg-node-secondary" x="15" y="110" width="110" height="34" rx="17" />
                                <text className="c1-svg-text-secondary" x="70" y="131" textAnchor="middle">Light Reactions</text>
                                
                                <rect className="c1-svg-node-secondary" x="215" y="110" width="110" height="34" rx="17" />
                                <text className="c1-svg-text-secondary" x="270" y="131" textAnchor="middle">Calvin Cycle</text>
                                
                                <circle cx="70" cy="155" r="3" fill="#E8A838" />
                                <circle cx="270" cy="155" r="3" fill="#E8A838" />
                                <path className="c1-svg-line-deco" d="M70 144 L70 152" strokeWidth="1" />
                                <path className="c1-svg-line-deco" d="M270 144 L270 152" strokeWidth="1" />
                            </svg>
                        </div>
                        <h3>Interactive Concept Maps</h3>
                    </div>

                    {/* Card 3 */}
                    <div className="c1-card c1-card-3">
                        <div className="c1-mesh"></div>
                        
                        {/* Floating document previews */}
                        <div className="c1-doc-sheets">
                            <div className="c1-doc-sheet c1-doc-sheet-1">
                                <div className="c1-doc-line long"></div>
                                <div className="c1-doc-line short"></div>
                            </div>
                            <div className="c1-doc-sheet c1-doc-sheet-2">
                                <div className="c1-doc-line long"></div>
                                <div className="c1-doc-line short"></div>
                            </div>
                        </div>

                        <img 
                            className="c1-folder" 
                            src="https://pub-f170a2592d2c4a1485466404c36807be.r2.dev/viktor/library%20icon.svg" 
                            alt="Library Folder" 
                        />
                        <div className="c1-search">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="11" cy="11" r="8"/>
                                <line x1="21" y1="21" x2="16.65" y2="16.65"/>
                            </svg>
                            Search study guides
                        </div>
                        <h3>Organized Study Library</h3>
                    </div>
                </div>
            </div>

            <style dangerouslySetInnerHTML={{ __html: `
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&family=Instrument+Serif:ital@0;1&family=Geist+Mono:wght@400;500;600&display=swap');

                * {
                    box-sizing: border-box;
                    margin: 0;
                    padding: 0;
                }

                body {
                    min-height: 100vh;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-family: 'Inter', sans-serif;
                    padding: 80px 20px;
                    transition: background-color 0.4s ease, color 0.4s ease;
                }

                body.c1-light-body {
                    background-color: #ffffff !important;
                    color: #0f172a;
                }

                body.c1-dark-body {
                    background-color: #0D0D0D !important;
                    color: #F0EDE8;
                }

                /* Navbar styling */
                .c1-navbar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    width: 100%;
                    max-width: 1100px;
                    margin: 0 auto 60px auto;
                    padding: 0 10px;
                }

                .c1-logo {
                    font-family: 'Instrument Serif', serif;
                    font-size: 2.25rem;
                    font-style: italic;
                    font-weight: 500;
                    color: #0d0d0d;
                    letter-spacing: -0.02em;
                    user-select: none;
                    transition: color 0.4s ease;
                }

                .c1-dark .c1-logo {
                    color: #F0EDE8;
                }

                .c1-logo-dot {
                    color: #E8A838;
                }

                .c1-nav-right {
                    display: flex;
                    align-items: center;
                }

                .c1-theme-toggle {
                    background: transparent;
                    border: none;
                    cursor: pointer;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    padding: 8px;
                    border-radius: 6px;
                    color: #64748b;
                    margin-right: 12px;
                    transition: all 0.2s ease;
                }

                .c1-theme-toggle:hover {
                    background-color: #f1f5f9;
                    color: #0f172a;
                }

                .c1-dark .c1-theme-toggle {
                    color: #8A8A8A;
                }

                .c1-dark .c1-theme-toggle:hover {
                    background-color: #1c1c1c;
                    color: #F0EDE8;
                }

                .c1-nav-cta {
                    font-family: 'Geist Mono', monospace;
                    font-size: 0.85rem;
                    font-weight: 600;
                    color: #0d0d0d;
                    text-decoration: none;
                    border: 1px solid #0d0d0d;
                    padding: 8px 18px;
                    border-radius: 6px;
                    transition: all 0.2s ease, border-color 0.4s ease, color 0.4s ease;
                    background-color: transparent;
                }

                .c1-nav-cta:hover {
                    background-color: #0d0d0d;
                    color: #ffffff;
                }

                .c1-dark .c1-nav-cta {
                    color: #F0EDE8;
                    border-color: #F0EDE8;
                }

                .c1-dark .c1-nav-cta:hover {
                    background-color: #F0EDE8;
                    color: #0d0d0d;
                }

                .c1-container {
                    max-width: 1100px;
                    width: 100%;
                    text-align: center;
                }

                .c1-header {
                    margin-bottom: 50px;
                }

                .c1-badge {
                    display: inline-block;
                    font-size: 0.75rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 16px;
                    background: linear-gradient(90deg, #F5C344, #F28482, #B567C2);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                }

                .c1-title {
                    font-size: 2.75rem;
                    font-weight: 500;
                    color: #0f172a;
                    letter-spacing: -0.02em;
                    margin-bottom: 12px;
                    font-family: 'Inter', sans-serif;
                    transition: color 0.4s ease;
                }

                .c1-dark .c1-title {
                    color: #F0EDE8;
                }

                .c1-subtitle {
                    font-size: 1.125rem;
                    color: #64748b;
                    line-height: 1.5;
                    transition: color 0.4s ease;
                }

                .c1-dark .c1-subtitle {
                    color: #8A8A8A;
                }

                .c1-grid {
                    display: grid;
                    grid-template-columns: repeat(3, 1fr);
                    gap: 24px;
                    width: 100%;
                }

                .c1-card {
                    border-radius: 20px;
                    height: 340px;
                    display: flex;
                    flex-direction: column;
                    justify-content: flex-end;
                    position: relative;
                    overflow: hidden;
                    text-align: left;
                    background: #F4F8F9;
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.1);
                    transition: transform 0.4s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.4s cubic-bezier(0.16, 1, 0.3, 1), background 0.4s ease, border-color 0.4s ease;
                    cursor: pointer;
                    border: 1px solid transparent;
                }

                .c1-card:hover {
                    transform: translateY(-6px);
                    box-shadow: 0 20px 40px -15px rgba(0,0,0,0.15);
                }

                .c1-dark .c1-card {
                    background: #141414;
                    border: 1px solid #2a2a2a;
                    box-shadow: 0 10px 30px -10px rgba(0,0,0,0.5);
                }

                .c1-dark .c1-card:hover {
                    box-shadow: 0 20px 40px -15px rgba(0,0,0,0.7);
                    border-color: #3d3d3d;
                }

                .c1-card h3 {
                    font-size: 1.05rem;
                    font-weight: 600;
                    color: #1e293b;
                    padding: 24px;
                    z-index: 3;
                    transition: color 0.4s ease;
                }

                .c1-dark .c1-card h3 {
                    color: #F0EDE8;
                }

                /* Card 1 Specifics */
                .c1-card-1 {
                    background: radial-gradient(circle at 50% 0%, #FFB347 0%, #F9ED96 30%, #F4F8F9 60%, #F4F8F9 100%);
                }

                .c1-card-1:hover {
                    background: radial-gradient(circle at 50% 0%, #FFB347 10%, #F9ED96 45%, #F4F8F9 75%, #F4F8F9 100%);
                }

                .c1-dark .c1-card-1 {
                    background: radial-gradient(circle at 50% 0%, #E8A8381a 0%, #141414 70%);
                }

                .c1-dark .c1-card-1:hover {
                    background: radial-gradient(circle at 50% 0%, #E8A8382d 10%, #141414 75%);
                }

                .c1-prompt-box {
                    position: absolute;
                    top: 30px;
                    left: 24px;
                    right: 24px;
                    background: #ffffff;
                    border-radius: 12px;
                    padding: 16px;
                    font-size: 0.8rem;
                    color: #475569;
                    line-height: 1.6;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.04);
                    transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
                    border: 1px solid transparent;
                }

                .c1-dark .c1-prompt-box {
                    background: #1c1c1c;
                    border: 1px solid #2a2a2a;
                    color: #a3a3a3;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                }

                .c1-blur-text {
                    background: linear-gradient(90deg, #FFB347, #E5A1F5);
                    -webkit-background-clip: text;
                    -webkit-text-fill-color: transparent;
                    font-weight: 600;
                }

                .c1-tips-btn {
                    position: absolute;
                    top: 180px;
                    left: 40px;
                    background: #ffffff;
                    border: 1px solid #000000;
                    padding: 5px 14px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 600;
                    color: #1e293b;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                    display: flex;
                    align-items: center;
                    cursor: default;
                    border-style: solid;
                    z-index: 2;
                    animation: c1-tips-click 6s ease infinite;
                    transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
                }

                .c1-dark .c1-tips-btn {
                    background: #1c1c1c;
                    border-color: #2a2a2a;
                    color: #f8fafc;
                    box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                    animation: c1-tips-click-dark 6s ease infinite;
                }

                .c1-tips-star {
                    color: #a855f7;
                    font-size: 1rem;
                    margin-left: 6px;
                }

                .c1-cursor {
                    position: absolute;
                    top: 205px;
                    left: 110px;
                    filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
                    z-index: 10;
                    animation: c1-cursor-move 6s cubic-bezier(0.25, 1, 0.5, 1) infinite;
                }

                .c1-cursor path {
                    fill: #0f172a;
                    stroke: #ffffff;
                    transition: fill 0.4s ease, stroke 0.4s ease;
                }

                .c1-dark .c1-cursor path {
                    fill: #F0EDE8;
                    stroke: #0d0d0d;
                }

                .c1-tip-popup {
                    position: absolute;
                    bottom: -32px;
                    right: 0px;
                    background: #1e293b;
                    color: #f8fafc;
                    font-size: 0.7rem;
                    font-weight: 500;
                    padding: 6px 10px;
                    border-radius: 8px;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                    white-space: nowrap;
                    opacity: 0;
                    pointer-events: none;
                    animation: c1-tip-popup-fade 6s ease infinite;
                    z-index: 10;
                    transition: background-color 0.4s ease, color 0.4s ease;
                }

                .c1-dark .c1-tip-popup {
                    background: #e8a838;
                    color: #0d0d0d;
                    font-weight: 600;
                }

                /* Keyframes for Card 1 Cursor & Popup */
                @keyframes c1-cursor-move {
                    0% {
                        transform: translate(0, 0);
                    }
                    25% {
                        transform: translate(-10px, -18px);
                    }
                    30% {
                        transform: translate(-10px, -18px) scale(0.9);
                    }
                    35% {
                        transform: translate(-10px, -18px) scale(1);
                    }
                    60% {
                        transform: translate(0, 0);
                    }
                    100% {
                        transform: translate(0, 0);
                    }
                }

                @keyframes c1-tips-click {
                    0%, 28%, 37%, 100% {
                        transform: scale(1);
                        box-shadow: 0 4px 15px rgba(0,0,0,0.08);
                        border-color: #000000;
                    }
                    30%, 35% {
                        transform: scale(0.95);
                        box-shadow: 0 2px 6px rgba(0,0,0,0.04);
                        border-color: #a855f7;
                    }
                }

                @keyframes c1-tips-click-dark {
                    0%, 28%, 37%, 100% {
                        transform: scale(1);
                        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
                        border-color: #2a2a2a;
                    }
                    30%, 35% {
                        transform: scale(0.95);
                        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
                        border-color: #e8a838;
                    }
                }

                @keyframes c1-tip-popup-fade {
                    0%, 29% {
                        opacity: 0;
                        transform: translateY(10px) scale(0.95);
                    }
                    32%, 65% {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                    70%, 100% {
                        opacity: 0;
                        transform: translateY(-10px) scale(0.95);
                    }
                }

                /* Card 2 Specifics */
                .c1-card-2 {
                    background: radial-gradient(circle at 50% 0%, #E5A1F5 0%, #F8ACA0 30%, #F4F8F9 60%, #F4F8F9 100%);
                }

                .c1-card-2:hover {
                    background: radial-gradient(circle at 50% 0%, #E5A1F5 10%, #F8ACA0 45%, #F4F8F9 75%, #F4F8F9 100%);
                }

                .c1-dark .c1-card-2 {
                    background: radial-gradient(circle at 50% 0%, #58a6ff1a 0%, #141414 70%);
                }

                .c1-dark .c1-card-2:hover {
                    background: radial-gradient(circle at 50% 0%, #58a6ff2d 10%, #141414 75%);
                }

                .c1-api-visual {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 70px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0 24px;
                }

                .c1-flow-line {
                    stroke-dasharray: 6 4;
                    stroke: #64748b;
                    animation: c1-flow-dash 1.2s linear infinite;
                    transition: stroke 0.4s ease;
                }

                .c1-dark .c1-flow-line {
                    stroke: #444444;
                }

                @keyframes c1-flow-dash {
                    to {
                        stroke-dashoffset: -20;
                    }
                }

                /* SVG Elements styling */
                .c1-svg-node-primary {
                    fill: #1e293b;
                    stroke: #334155;
                    stroke-width: 1.5;
                    transition: fill 0.4s ease, stroke 0.4s ease;
                }

                .c1-dark .c1-svg-node-primary {
                    fill: #1c1c1c;
                    stroke: #e8a838;
                }

                .c1-svg-node-secondary {
                    fill: #ffffff;
                    stroke: #e2e8f0;
                    stroke-width: 1.5;
                    transition: fill 0.4s ease, stroke 0.4s ease;
                }

                .c1-dark .c1-svg-node-secondary {
                    fill: #1c1c1c;
                    stroke: #2a2a2a;
                }

                .c1-svg-text-primary {
                    fill: #f8fafc;
                    font-family: Inter, sans-serif;
                    font-size: 11px;
                    font-weight: 600;
                    transition: fill 0.4s ease;
                }

                .c1-svg-text-secondary {
                    fill: #475569;
                    font-family: Inter, sans-serif;
                    font-size: 10px;
                    font-weight: 500;
                    transition: fill 0.4s ease;
                }

                .c1-dark .c1-svg-text-secondary {
                    fill: #a3a3a3;
                }

                .c1-svg-line-deco {
                    stroke: #cbd5e1;
                    transition: stroke 0.4s ease;
                }

                .c1-dark .c1-svg-line-deco {
                    stroke: #2a2a2a;
                }

                /* Card 3 Specifics */
                .c1-card-3 {
                    background: radial-gradient(circle at 50% 0%, #F9ED96 0%, #E5A1F5 30%, #F4F8F9 60%, #F4F8F9 100%);
                }

                .c1-card-3:hover {
                    background: radial-gradient(circle at 50% 0%, #F9ED96 10%, #E5A1F5 45%, #F4F8F9 75%, #F4F8F9 100%);
                }

                .c1-dark .c1-card-3 {
                    background: radial-gradient(circle at 50% 0%, #a855f71a 0%, #141414 70%);
                }

                .c1-dark .c1-card-3:hover {
                    background: radial-gradient(circle at 50% 0%, #a855f72d 10%, #141414 75%);
                }

                .c1-mesh {
                    position: absolute;
                    inset: 0;
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px);
                    background-size: 16px 16px;
                    -webkit-mask-image: radial-gradient(circle at center top, black 0%, transparent 80%);
                    mask-image: radial-gradient(circle at center top, black 0%, transparent 80%);
                    z-index: 0;
                    transition: background-image 0.4s ease, mask-image 0.4s ease;
                }

                .c1-dark .c1-mesh {
                    background-image: 
                        linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
                    -webkit-mask-image: radial-gradient(circle at center top, black 0%, transparent 60%);
                    mask-image: radial-gradient(circle at center top, black 0%, transparent 60%);
                }

                .c1-folder {
                    position: absolute;
                    top: 50px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 170px;
                    filter: drop-shadow(0 15px 25px rgba(0,0,0,0.08));
                    z-index: 2;
                    transition: filter 0.4s ease;
                }

                .c1-dark .c1-folder {
                    filter: drop-shadow(0 15px 25px rgba(0,0,0,0.3));
                }

                .c1-search {
                    position: absolute;
                    top: 220px;
                    left: 50%;
                    transform: translateX(-50%);
                    background: #ffffff;
                    border: 1px solid #000000;
                    padding: 6px 18px;
                    border-radius: 20px;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #1e293b;
                    box-shadow: 0 8px 20px rgba(0,0,0,0.06);
                    white-space: nowrap;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    z-index: 3;
                    transition: background-color 0.4s ease, border-color 0.4s ease, color 0.4s ease, box-shadow 0.4s ease;
                }

                .c1-dark .c1-search {
                    background: #1c1c1c;
                    border-color: #2a2a2a;
                    color: #a3a3a3;
                    box-shadow: 0 8px 24px rgba(0,0,0,0.2);
                }

                /* Floating Document Sheets */
                .c1-doc-sheets {
                    position: absolute;
                    top: 50px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 130px;
                    height: 100px;
                    z-index: 1;
                }

                .c1-doc-sheet {
                    position: absolute;
                    left: 50%;
                    width: 80px;
                    height: 100px;
                    background: #ffffff;
                    border: 1px solid #e2e8f0;
                    border-radius: 6px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.05);
                    padding: 8px;
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                    opacity: 0;
                    transition: background-color 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;
                }

                .c1-dark .c1-doc-sheet {
                    background: #1c1c1c;
                    border-color: #2a2a2a;
                    box-shadow: 0 4px 12px rgba(0,0,0,0.25);
                }

                .c1-doc-line {
                    height: 4px;
                    background: #e2e8f0;
                    border-radius: 2px;
                    transition: background-color 0.4s ease;
                }

                .c1-dark .c1-doc-line {
                    background: #2a2a2a;
                }

                .c1-doc-line.long {
                    width: 80%;
                }

                .c1-doc-line.short {
                    width: 50%;
                }

                .c1-doc-sheet-1 {
                    animation: c1-sheet-float-1 5s ease-in-out infinite;
                }

                .c1-doc-sheet-2 {
                    animation: c1-sheet-float-2 5s ease-in-out 2.5s infinite;
                }

                @keyframes c1-sheet-float-1 {
                    0% {
                        transform: translate(-50%, 40px) rotate(-6deg);
                        opacity: 0;
                    }
                    20%, 50% {
                        opacity: 0.9;
                    }
                    80% {
                        transform: translate(-50%, -40px) rotate(-10deg);
                        opacity: 0;
                    }
                    100% {
                        transform: translate(-50%, -40px) rotate(-10deg);
                        opacity: 0;
                    }
                }

                @keyframes c1-sheet-float-2 {
                    0% {
                        transform: translate(-50%, 40px) rotate(4deg);
                        opacity: 0;
                    }
                    10% {
                        opacity: 0;
                    }
                    30%, 60% {
                        opacity: 0.9;
                    }
                    90% {
                        transform: translate(-50%, -35px) rotate(8deg);
                        opacity: 0;
                    }
                    100% {
                        transform: translate(-50%, -35px) rotate(8deg);
                        opacity: 0;
                    }
                }

                /* Responsive Breakpoints */
                @media (max-width: 900px) {
                    .c1-grid {
                        grid-template-columns: repeat(2, 1fr);
                    }
                    .c1-navbar {
                        margin-bottom: 40px;
                    }
                    body {
                        padding: 60px 20px;
                    }
                }

                @media (max-width: 600px) {
                    .c1-grid {
                        grid-template-columns: 1fr;
                    }
                    .c1-title {
                        font-size: 2.25rem;
                    }
                    .c1-navbar {
                        margin-bottom: 30px;
                    }
                    body {
                        padding: 40px 20px;
                    }
                }
            ` }} />
        </>
    );
}
