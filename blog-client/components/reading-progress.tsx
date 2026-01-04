'use client';

import { useEffect, useState } from 'react';

interface ReadingProgressProps {
    className?: string;
}

export function ReadingProgress({ className = '' }: ReadingProgressProps) {
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const updateProgress = () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(Math.min(scrollPercent, 100));
        };

        window.addEventListener('scroll', updateProgress);
        updateProgress(); // Initial calculation

        return () => window.removeEventListener('scroll', updateProgress);
    }, []);

    return (
        <div className={`fixed top-0 left-0 right-0 h-1 bg-gray-200 z-50 ${className}`}>
            <div
                className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-150 ease-out"
                style={{ width: `${progress}%` }}
            />
        </div>
    );
}
