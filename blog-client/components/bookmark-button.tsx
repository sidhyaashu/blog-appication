'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { Bookmark as BookmarkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BookmarkButtonProps {
    postId: string;
    className?: string;
}

export function BookmarkButton({ postId, className }: BookmarkButtonProps) {
    const { token, isAuthenticated } = useAuth();
    const [isBookmarked, setIsBookmarked] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        checkBookmark();
    }, [postId, isAuthenticated]);

    const checkBookmark = async () => {
        if (!isAuthenticated || !token) {
            return;
        }

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/bookmark/check`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setIsBookmarked(data.bookmarked);
            }
        } catch (error) {
            console.error('Failed to check bookmark:', error);
        }
    };

    const toggleBookmark = async () => {
        if (!isAuthenticated) {
            toast.error('Please login to bookmark posts');
            return;
        }

        setIsLoading(true);

        try {
            const method = isBookmarked ? 'DELETE' : 'POST';
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/${postId}/bookmark`, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                setIsBookmarked(!isBookmarked);
                toast.success(isBookmarked ? 'Bookmark removed' : 'Post bookmarked');
            } else {
                const data = await res.json();
                toast.error(data.message || 'Failed to update bookmark');
            }
        } catch (error) {
            toast.error('Failed to update bookmark');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <button
            onClick={toggleBookmark}
            disabled={isLoading}
            className={cn(
                'flex items-center justify-center w-10 h-10 rounded-full transition-all hover:bg-gray-100',
                isLoading && 'opacity-50 cursor-not-allowed',
                className
            )}
            aria-label={isBookmarked ? 'Remove bookmark' : 'Bookmark this post'}
        >
            <BookmarkIcon
                className={cn(
                    'w-5 h-5 transition-all',
                    isBookmarked ? 'fill-blue-500 text-blue-500' : 'text-gray-600'
                )}
            />
        </button>
    );
}
