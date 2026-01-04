'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Bookmark, Edit, Settings, Heart } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

interface BookmarkedPost {
    _id: string;
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image_url: string;
    published_at: string;
    read_time: number;
    categories?: { name: string };
}

export default function ProfilePage() {
    const { user, token, isAuthenticated, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const [bookmarks, setBookmarks] = useState<BookmarkedPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        if (isAuthenticated && token) {
            fetchBookmarks();
        }
    }, [isAuthenticated, token]);

    const fetchBookmarks = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/bookmarks`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (res.ok) {
                const data = await res.json();
                setBookmarks(data);
            }
        } catch (error) {
            toast.error('Failed to load bookmarks');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || !user) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-8">
                <Skeleton className="h-32 w-full mb-8" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            {/* Profile Header */}
            <div className="border-b">
                <div className="max-w-5xl mx-auto px-4 py-12">
                    <div className="flex items-start gap-6">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold">
                            {user.name.charAt(0).toUpperCase()}
                        </div>
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-2">{user.name}</h1>
                            <p className="text-gray-600 mb-4">{user.email}</p>
                            <div className="flex gap-3">
                                <Button variant="outline" size="sm">
                                    <Edit className="w-4 h-4 mr-2" />
                                    Edit Profile
                                </Button>
                                <Button variant="outline" size="sm">
                                    <Settings className="w-4 h-4 mr-2" />
                                    Settings
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Profile Content */}
            <div className="max-w-5xl mx-auto px-4 py-8">
                <Tabs defaultValue="library" className="w-full">
                    <TabsList>
                        <TabsTrigger value="library">
                            <Bookmark className="w-4 h-4 mr-2" />
                            Library
                        </TabsTrigger>
                        <TabsTrigger value="activity">
                            <Heart className="w-4 h-4 mr-2" />
                            Activity
                        </TabsTrigger>
                    </TabsList>

                    <TabsContent value="library" className="mt-6">
                        <div className="mb-6">
                            <h2 className="text-2xl font-bold mb-2">Saved Articles</h2>
                            <p className="text-gray-600">Your bookmarked posts</p>
                        </div>

                        {loading ? (
                            <div className="grid gap-6">
                                {[1, 2, 3].map((i) => (
                                    <Skeleton key={i} className="h-32 w-full" />
                                ))}
                            </div>
                        ) : bookmarks.length === 0 ? (
                            <div className="text-center py-16">
                                <Bookmark className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                <h3 className="text-xl font-semibold mb-2">No saved articles yet</h3>
                                <p className="text-gray-600 mb-6">Start saving articles to read them later</p>
                                <Link href="/blogs">
                                    <Button>Explore Articles</Button>
                                </Link>
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {bookmarks.map((post) => (
                                    <article key={post._id} className="border-b pb-6">
                                        <Link href={`/blog/${post.slug}`} className="group">
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <h3 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition line-clamp-2">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span>{new Date(post.published_at).toLocaleDateString()}</span>
                                                        <span>{post.read_time} min read</span>
                                                        {post.categories && (
                                                            <span className="px-2 py-1 bg-gray-100 rounded">
                                                                {post.categories.name}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>
                                                {post.image_url && (
                                                    <div className="relative w-32 h-32 shrink-0">
                                                        <Image
                                                            src={post.image_url}
                                                            alt={post.title}
                                                            fill
                                                            className="object-cover rounded-lg"
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        </Link>
                                    </article>
                                ))}
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="activity" className="mt-6">
                        <div className="text-center py-16">
                            <Heart className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                            <h3 className="text-xl font-semibold mb-2">Activity coming soon</h3>
                            <p className="text-gray-600">Track your claps and comments here</p>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    );
}
