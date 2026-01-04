'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Post } from '@/lib/post';
import { getPosts, API_URL } from '@/lib/api';
import { format } from 'date-fns';
import { Edit, Trash2, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminPostsPage() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            // Use the centralized getPosts helper
            const data = await getPosts();
            setPosts(data);
        } catch (error) {
            console.error('Error fetching posts:', error);
            toast.error('Error fetching posts');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this post? This action cannot be undone.')) {
            return;
        }

        try {
            const res = await fetch(`${API_URL}/posts/${id}`, {
                method: 'DELETE',
            });

            if (res.ok) {
                toast.success('Post deleted successfully');
                fetchPosts(); // Refresh list
            } else {
                toast.error('Failed to delete post');
            }
        } catch (error) {
            console.error('Error deleting post:', error);
            toast.error('Error deleting post');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Posts</h2>
                    <p className="text-muted-foreground">Manage your blog content.</p>
                </div>
                <Link href="/admin/posts/new">
                    <Button>
                        <Plus className="mr-2 h-4 w-4" />
                        Create New
                    </Button>
                </Link>
            </div>

            <div className="border rounded-md">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50 border-b">
                        <tr>
                            <th className="px-6 py-3 font-medium text-gray-500">Title</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Author</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Category</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Published</th>
                            <th className="px-6 py-3 font-medium text-gray-500">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y">
                        {isLoading ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    Loading posts...
                                </td>
                            </tr>
                        ) : posts.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="px-6 py-8 text-center text-muted-foreground">
                                    No posts found. Create your first one!
                                </td>
                            </tr>
                        ) : (
                            posts.map((post) => (
                                <tr key={post.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-medium max-w-xs truncate" title={post.title}>
                                        {post.title}
                                    </td>
                                    <td className="px-6 py-4">
                                        {/* Helper maps author_id to authors prop, but let's check both for robust display */}
                                        {post.authors?.name || (typeof post.author_id === 'object' ? (post.author_id as any).name : 'Admin')}
                                    </td>
                                    <td className="px-6 py-4">
                                        {post.categories?.name || (typeof post.category_id === 'object' ? (post.category_id as any).name : 'Uncategorized')}
                                    </td>
                                    <td className="px-6 py-4 text-gray-500">
                                        {post.published_at ? format(new Date(post.published_at), 'MMM d, yyyy') : 'Draft'}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-2">
                                            <Link href={`/admin/posts/${post._id}/edit`}>
                                                <Button variant="ghost" size="icon" className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                            </Link>
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                                                onClick={() => handleDelete(post._id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
