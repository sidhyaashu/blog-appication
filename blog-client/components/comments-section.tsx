'use client';

import { useState, useEffect, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { API_URL } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';
import { Reply, CornerDownRight } from 'lucide-react';

interface Comment {
    _id: string;
    content: string;
    user_id: {
        _id: string;
        name: string;
        avatar?: string;
    };
    parent_id?: string | null;
    created_at: string;
    children?: Comment[]; // For frontend tree structure
}

export function CommentsSection({ postId }: { postId: string }) {
    const [comments, setComments] = useState<Comment[]>([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState<any>(null);
    const [replyingTo, setReplyingTo] = useState<string | null>(null);
    const [replyContent, setReplyContent] = useState('');

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

        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
    }, [postId]);

    const handlePostComment = async (content: string, parentId?: string) => {
        if (!content.trim()) return;

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
                body: JSON.stringify({
                    content,
                    parent_id: parentId || null
                })
            });

            if (res.ok) {
                const comment = await res.json();
                setComments(prev => [comment, ...prev]);
                setNewComment('');
                setReplyContent('');
                setReplyingTo(null);
                toast.success(parentId ? 'Reply added' : 'Comment added');
            } else {
                toast.error('Failed to add ' + (parentId ? 'reply' : 'comment'));
            }
        } catch (error) {
            toast.error('Error posting comment');
        } finally {
            setLoading(false);
        }
    };

    // Build comment tree
    const commentTree = useMemo(() => {
        const commentMap: { [key: string]: Comment } = {};
        const roots: Comment[] = [];

        // Clone comments to avoid mutating state directly in deep nested structures if re-renders happen
        const rawComments = comments.map(c => ({ ...c, children: [] }));

        // Map by ID
        rawComments.forEach(comment => {
            commentMap[comment._id] = comment;
        });

        // Link children to parents
        rawComments.forEach(comment => {
            if (comment.parent_id && commentMap[comment.parent_id]) {
                commentMap[comment.parent_id].children?.push(comment);
            } else {
                roots.push(comment);
            }
        });

        // Sort roots by date desc
        return roots.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    }, [comments]);

    const recursiveRender = (commentList: Comment[], depth = 0) => {
        return commentList.map(comment => (
            <div key={comment._id} className={depth > 0 ? "ml-8 md:ml-12 border-l-2 border-gray-100 pl-4 mt-4" : "mt-8"}>
                <div className="flex gap-4">
                    <Avatar className="h-10 w-10 border">
                        <AvatarImage src={comment.user_id.avatar} />
                        <AvatarFallback>{comment.user_id.name?.[0]?.toUpperCase() || 'U'}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                        <div className="flex justify-between items-start mb-1">
                            <div>
                                <h4 className="font-semibold text-sm text-gray-900">{comment.user_id.name || 'Anonymous'}</h4>
                                <span className="text-xs text-gray-500">
                                    {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                                </span>
                            </div>
                            {user && !replyingTo && depth < 3 && ( // Limit depth to 3 levels
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-8 text-xs text-gray-500 hover:text-blue-600"
                                    onClick={() => setReplyingTo(comment._id)}
                                >
                                    <Reply className="mr-1 h-3 w-3" /> Reply
                                </Button>
                            )}
                        </div>

                        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{comment.content}</p>

                        {/* Reply Form */}
                        {replyingTo === comment._id && (
                            <div className="mt-4 flex gap-3 animate-in fade-in slide-in-from-top-2">
                                <div className="flex-1">
                                    <Textarea
                                        autoFocus
                                        placeholder={`Reply to ${comment.user_id.name}...`}
                                        value={replyContent}
                                        onChange={(e) => setReplyContent(e.target.value)}
                                        className="min-h-[80px] text-sm"
                                    />
                                    <div className="flex justify-end gap-2 mt-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setReplyingTo(null);
                                                setReplyContent('');
                                            }}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            size="sm"
                                            disabled={loading}
                                            onClick={() => handlePostComment(replyContent, comment._id)}
                                        >
                                            {loading ? 'Posting...' : 'Reply'}
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Render Children */}
                {comment.children && comment.children.length > 0 && (
                    <div className="mt-2">
                        {recursiveRender(comment.children.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()), depth + 1)}
                    </div>
                )}
            </div>
        ));
    };

    return (
        <div className="mt-16 border-t pt-8">
            <h2 className="text-2xl font-bold mb-6">Comments ({comments.length})</h2>

            {/* Main Comment Form */}
            {user ? (
                <div className="mb-10 flex gap-4">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback>{user.name?.[0]?.toUpperCase()}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                        <Textarea
                            placeholder="Write a comment..."
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-[100px]"
                        />
                        <div className="flex justify-end">
                            <Button
                                onClick={() => handlePostComment(newComment)}
                                disabled={loading}
                            >
                                {loading ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="mb-10 p-6 bg-gray-50 rounded-lg text-center border border-dashed">
                    <p className="text-gray-600 mb-4">Please log in to join the conversation.</p>
                    <Button variant="outline" onClick={() => window.location.href = '/auth/login'}>
                        Log In
                    </Button>
                </div>
            )}

            {/* Comments Tree */}
            <div className="space-y-2 pb-20">
                {comments.length === 0 ? (
                    <p className="text-gray-500 italic text-center py-10">No comments yet. Be the first to share your thoughts!</p>
                ) : (
                    recursiveRender(commentTree)
                )}
            </div>
        </div>
    );
}
