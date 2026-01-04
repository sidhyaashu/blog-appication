'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface Comment {
    _id: string;
    content: string;
    user_id: {
        _id: string;
        name: string;
        avatar?: string;
    };
    created_at: string;
}

export function CommentsSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const res = await fetch(`${API_URL}/posts/${postId}/comments`);
                if (res.ok) {
                    const data = await res.json();
                    setComments(data);
                }
            } catch (error) {
                console.error('Failed to load comments');
            }
        };

        fetchComments();

        // Check auth status
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [postId]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        setLoading(true);
        const token = localStorage.getItem('token');

        if (!token) {
            toast.error('Please login to comment');
            setLoading(false);
            return;
        }

        try {
            const res = await fetch(`${API_URL}/posts/${postId}/comments`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({ content: newComment })
            });

            if (res.ok) {
                const comment = await res.json();
                setComments([comment, ...comments]);
                setNewComment('');
                toast.success('Comment added');
            } else {
                toast.error('Failed to add comment');
            }
        } catch (error) {
            toast.error('Error adding comment');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mt-16 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

            {/* Add Comment Form */}
            {user ? (
                <form onSubmit={handleSubmit} className="mb-10 space-y-4">
                    <Textarea
                        placeholder="Write a comment..."
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="min-h-[100px]"
                    />
                    <div className="flex justify-end">
                        <Button type="submit" disabled={loading}>
                            {loading ? 'Posting...' : 'Post Comment'}
                        </Button>
                    </div>
                </form>
            ) : (
                <div className="mb-10 p-6 bg-gray-50 rounded-lg text-center">
                    <p className="text-gray-600 mb-4">Please log in to join the conversation.</p>
                    <Button variant="outline" onClick={() => window.location.href = '/auth/login'}>
                        Log In
                    </Button>
                </div>
            )}

            {/* Comments List */}
            <div className="space-y-8">
                {comments.length === 0 ? (
                    <p className="text-gray-500 italic">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    comments.map((comment) => (
                        <div key={comment._id} className="flex gap-4">
                            <Avatar>
                                <AvatarImage src={comment.user_id.avatar} />
                                <AvatarFallback>{comment.user_id.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                                <div className="flex justify-between items-start mb-1">
                                    <h4 className="font-semibold text-gray-900">{comment.user_id.name || 'Anonymous'}</h4>
                                    <span className="text-sm text-gray-500">
                                        {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                    </span>
                                </div>
                                <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">{comment.content}</p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
