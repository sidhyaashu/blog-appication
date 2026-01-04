'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { useCategories } from '@/hooks/useCategories';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, MessageCircle, Bookmark, Clock, Search as SearchIcon, Loader2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Post {
    _id: string;
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    image_url: string;
    published_at: string;
    read_time: number;
    categories?: { name: string; slug: string };
    authors?: { name: string; _id: string };
}

export default function BlogsPage() {
    const { featuredPosts, loadFeaturedPosts } = usePosts();
    const { categories, loadCategories } = useCategories();

    const [posts, setPosts] = useState<Post[]>([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [initialLoad, setInitialLoad] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [searchDebounce, setSearchDebounce] = useState('');

    const observerTarget = useRef<HTMLDivElement>(null);

    useEffect(() => {
        loadFeaturedPosts();
        loadCategories();
    }, [loadFeaturedPosts, loadCategories]);

    // Debounce search
    useEffect(() => {
        const timer = setTimeout(() => {
            setSearchDebounce(searchQuery);
        }, 500);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Reset when search changes
    useEffect(() => {
        setPosts([]);
        setPage(1);
        setHasMore(true);
    }, [searchDebounce]);

    // Load posts function
    const loadMorePosts = useCallback(async () => {
        if (loading || !hasMore) return;

        setLoading(true);
        try {
            const params = new URLSearchParams({
                page: page.toString(),
                limit: '10',
                ...(searchDebounce && { search: searchDebounce })
            });

            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts?${params}`);

            if (res.ok) {
                const data = await res.json();

                // Map the response
                const newPosts = data.posts.map((p: any) => ({
                    ...p,
                    id: p._id,
                    categories: p.category_id,
                    authors: p.author_id
                }));

                setPosts(prev => page === 1 ? newPosts : [...prev, ...newPosts]);
                setHasMore(data.pagination.hasMore);
            } else {
                console.error('Failed to fetch posts:', res.status);
                if (page === 1) {
                    toast.error('Failed to load posts');
                }
                setHasMore(false);
            }
        } catch (error) {
            console.error('Load posts error:', error);
            if (page === 1) {
                toast.error('Failed to load posts');
            }
            setHasMore(false);
        } finally {
            setLoading(false);
            setInitialLoad(false);
        }
    }, [page, searchDebounce, loading, hasMore]);

    // Trigger load on page or search change
    useEffect(() => {
        loadMorePosts();
    }, [page, searchDebounce]);

    // Intersection Observer for infinite scroll
    useEffect(() => {
        if (!observerTarget.current || initialLoad) return;

        const observer = new IntersectionObserver(
            entries => {
                if (entries[0].isIntersecting && hasMore && !loading) {
                    setPage(prev => prev + 1);
                }
            },
            { threshold: 0.1, rootMargin: '100px' }
        );

        observer.observe(observerTarget.current);

        return () => observer.disconnect();
    }, [hasMore, loading, initialLoad]);

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex gap-8">
                    {/* Sidebar */}
                    <aside className="hidden lg:block w-64 shrink-0 sticky top-8 self-start">
                        <nav className="space-y-1">
                            <Link href="/" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                </svg>
                                <span>Home</span>
                            </Link>
                            <Link href="/profile" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition">
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                                <span>Profile</span>
                            </Link>
                            <Link href="/profile#bookmarks" className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-gray-100 transition">
                                <Bookmark className="w-5 h-5" />
                                <span>Library</span>
                            </Link>
                        </nav>

                        {/* Categories */}
                        <div className="mt-8">
                            <h3 className="px-4 mb-3 text-sm font-semibold text-gray-500 uppercase tracking-wider">Topics</h3>
                            <div className="space-y-1">
                                {categories.slice(0, 6).map((cat) => (
                                    <Link key={cat.id} href={`/category/${cat.slug}`} className="block px-4 py-2 text-sm rounded-lg hover:bg-gray-100 transition">
                                        {cat.name}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </aside>

                    {/* Main Content */}
                    <main className="flex-1 max-w-3xl">
                        <div className="flex items-center justify-between mb-8">
                            <h1 className="text-4xl font-bold">Blog</h1>

                            {/* Search Bar */}
                            <div className="relative w-64">
                                <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    type="text"
                                    placeholder="Search posts..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        <Tabs defaultValue="for-you" className="w-full">
                            <TabsList className="mb-8">
                                <TabsTrigger value="for-you">For you</TabsTrigger>
                                <TabsTrigger value="featured">Featured</TabsTrigger>
                            </TabsList>

                            <TabsContent value="for-you" className="space-y-6">
                                {posts.map((post) => (
                                    <article key={post._id} className="border-b border-gray-200 pb-6 last:border-0">
                                        <Link href={`/blog/${post.slug}`} className="group">
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    {/* Author */}
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                            {post.authors?.name?.charAt(0) || 'A'}
                                                        </div>
                                                        <span className="text-sm font-medium">{post.authors?.name || 'Anonymous'}</span>
                                                    </div>

                                                    {/* Title */}
                                                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition line-clamp-2">
                                                        {post.title}
                                                    </h2>

                                                    {/* Excerpt */}
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>

                                                    {/* Meta */}
                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {format(new Date(post.published_at), 'MMM d, yyyy')}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="w-4 h-4" />
                                                            {post.read_time} min read
                                                        </span>
                                                        {post.categories && (
                                                            <Badge variant="secondary" className="text-xs">
                                                                {post.categories.name}
                                                            </Badge>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Thumbnail */}
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

                                {/* Loading State */}
                                {loading && posts.length > 0 && (
                                    <div className="flex justify-center py-8">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                    </div>
                                )}

                                {/* Intersection Observer Target - only render if not loading initially */}
                                {!initialLoad && <div ref={observerTarget} className="h-4" />}

                                {/* No More Posts */}
                                {!hasMore && posts.length > 0 && !loading && (
                                    <p className="text-center py-8 text-gray-500">
                                        You've reached the end
                                    </p>
                                )}

                                {/* No Results or Initial Loading */}
                                {posts.length === 0 && (
                                    <div className="text-center py-16">
                                        {loading ? (
                                            <>
                                                <Loader2 className="w-16 h-16 mx-auto mb-4 text-blue-500 animate-spin" />
                                                <p className="text-gray-600">Loading posts...</p>
                                            </>
                                        ) : (
                                            <>
                                                <SearchIcon className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                                                <h3 className="text-xl font-semibold mb-2">No posts found</h3>
                                                <p className="text-gray-600">
                                                    {searchQuery ? 'Try adjusting your search' : 'No posts available yet'}
                                                </p>
                                            </>
                                        )}
                                    </div>
                                )}
                            </TabsContent>

                            <TabsContent value="featured" className="space-y-6">
                                {featuredPosts.map((post) => (
                                    <article key={post.id} className="border-b border-gray-200 pb-6 last:border-0">
                                        <Link href={`/blog/${post.slug}`} className="group">
                                            <div className="flex gap-4">
                                                <div className="flex-1">
                                                    <div className="flex items-center gap-2 mb-3">
                                                        <div className="w-8 h-8 bg-gradient-to-br from-orange-400 to-red-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                            {post.authors?.name?.charAt(0) || 'A'}
                                                        </div>
                                                        <span className="text-sm font-medium">{post.authors?.name || 'Anonymous'}</span>
                                                        <Badge className="bg-orange-100 text-orange-700 text-xs">Featured</Badge>
                                                    </div>

                                                    <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition line-clamp-2">
                                                        {post.title}
                                                    </h2>

                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>

                                                    <div className="flex items-center gap-4 text-xs text-gray-500">
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-4 h-4" />
                                                            {format(new Date(post.published_at), 'MMM d, yyyy')}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Heart className="w-4 h-4" />
                                                            {post.read_time} min read
                                                        </span>
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
                            </TabsContent>
                        </Tabs>
                    </main>
                </div>
            </div>
        </div>
    );
}
