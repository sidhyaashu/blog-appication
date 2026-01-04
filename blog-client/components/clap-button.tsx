'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClapButtonProps {
    postId: string;
    className?: string;
}

export function ClapButton({ postId, className }: ClapButtonProps) {
    const { token, isAuthenticated } = useAuth();
    const [userClaps, setUserClaps] = useState(0);
    const [totalClaps, setTotalClaps] = useState(0);
    const [isClapping, setIsClapping] = useState(false);
    const [animate, setAnimate] = useState(false);

    // Load clap stats on mount
    useEffect(() => {
        fetchClapStats();
    }, [postId]);

    const fetchClapStats = async () => {
        try {
            const headers: any = { 'Content-Type': 'application/json' };
            if (token) {
                headers['Authorization'] = `Bearer ${token}`;
            }

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/claps`, {
                headers
            });

            if (res.ok) {
                const data = await res.json();
                setUserClaps(data.userClaps || 0);
                setTotalClaps(data.totalClaps || 0);
            }
        } catch (error) {
            console.error('Failed to fetch clap stats:', error);
        }
    };

    const handleClap = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to clap for this post');
            return;
        }

        if (userClaps >= 50) {
            toast.info('You\'ve reached the maximum claps for this post');
            return;
        }

        // OPTIMISTIC UPDATE: Update UI immediately
        const previousUserClaps = userClaps;
        const previousTotalClaps = totalClaps;

        setUserClaps(prev => prev + 1);
        setTotalClaps(prev => prev + 1);
        setAnimate(true);
        setIsClapping(true);

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/clap`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ count: 1 })
            });

            if (res.ok) {
                const data = await res.json();
                // Update with actual server values
                setUserClaps(data.userClaps);
                setTotalClaps(data.totalClaps);
            } else {
                // ROLLBACK: Revert to previous values on error
                setUserClaps(previousUserClaps);
                setTotalClaps(previousTotalClaps);
                toast.error('Failed to clap. Please try again.');
            }
        } catch (error) {
            // ROLLBACK: Revert to previous values on error
            setUserClaps(previousUserClaps);
            setTotalClaps(previousTotalClaps);
            toast.error('Network error. Please try again.');
        } finally {
            setIsClapping(false);
            setTimeout(() => setAnimate(false), 300);
        }
    };

    return (
        <div className={cn('flex flex-col items-center gap-2', className)}>
            <button
                onClick={handleClap}
                disabled={isClapping || userClaps >= 50}
                className={cn(
                    'relative flex items-center justify-center w-14 h-14 rounded-full border-2 transition-all',
                    userClaps > 0
                        ? 'border-red-500 bg-red-50 hover:bg-red-100'
                        : 'border-gray-300 bg-white hover:bg-gray-50',
                    isClapping && 'scale-95',
                    animate && 'animate-bounce',
                    userClaps >= 50 && 'opacity-50 cursor-not-allowed'
                )}
                aria-label="Clap for this post"
            >
                <Heart
                    className={cn(
                        'w-6 h-6 transition-all',
                        userClaps > 0 ? 'fill-red-500 text-red-500' : 'text-gray-600'
                    )}
                />
                {userClaps > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                        {userClaps}
                    </span>
                )}
            </button>
            <span className="text-sm text-gray-600 font-medium">
                {totalClaps.toLocaleString()}
            </span>
        </div>
    );
}
