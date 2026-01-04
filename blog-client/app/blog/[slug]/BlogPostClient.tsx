'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, Calendar, Clock, Share2 } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { ClapButton } from '@/components/clap-button';
import { BookmarkButton } from '@/components/bookmark-button';
import { ReadingProgress } from '@/components/reading-progress';
import { CommentsSection } from '@/components/comments-section';
import { RelatedPosts } from '@/components/related-posts';
import { toast } from 'sonner';
import { format } from 'date-fns';
import DOMPurify from 'isomorphic-dompurify';

interface Post {
    _id: string;
    title: string;
    slug: string;
    content: string;
    excerpt: string;
    image_url: string;
    published_at: string;
    read_time: number;
    categories?: { name: string; slug: string };
    authors?: { name: string; _id: string };
}

interface BlogPostClientProps {
    slug: string;
}

export default function BlogPostClient({ slug }: BlogPostClientProps) {
    const router = useRouter();
    const { isAuthenticated } = useAuth();
    const [post, setPost] = useState<Post | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchPost();
        }
    }, [slug]);

    const fetchPost = async () => {
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/slug/${slug}`);

            if (res.ok) {
                const data = await res.json();
                // Map backend response to frontend format
                const mappedPost: Post = {
                    ...data,
                    categories: data.category_id,
                    authors: data.author_id
                };
                setPost(mappedPost);
            } else {
                toast.error('Post not found');
                router.push('/blogs');
            }
        } catch (error) {
            console.error('Failed to load post:', error);
            toast.error('Failed to load post');
            // router.push('/blogs'); // Don't redirect immediately on error, user might want to retry or check connection
        } finally {
            setLoading(false);
        }
    };

    const handleShare = async () => {
        if (!post) return;

        if (navigator.share) {
            try {
                await navigator.share({
                    title: post.title,
                    text: post.excerpt,
                    url: window.location.href,
                });
            } catch (error) {
                // User cancelled share
            }
        } else {
            try {
                await navigator.clipboard.writeText(window.location.href);
                toast.success('Link copied to clipboard');
            } catch (error) {
                toast.error('Failed to copy link');
            }
        }
    };

    if (loading) {
        return (
            <div className="max-w-3xl mx-auto px-4 py-8">
                <div className="flex items-center gap-2 mb-8">
                    <Skeleton className="h-10 w-10 rounded-full" />
                    <div>
                        <Skeleton className="h-4 w-32 mb-2" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                </div>
                <Skeleton className="h-12 w-3/4 mb-4" />
                <Skeleton className="h-64 w-full mb-8 rounded-xl" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!post) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Post not found</h2>
                    <p className="text-gray-600 mb-4">The post you're looking for doesn't exist</p>
                    <Link href="/blogs" className="text-blue-600 hover:underline">
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <>
            <ReadingProgress />

            <div className="min-h-screen bg-background">
                {/* Header */}
                <header className="border-b sticky top-0 bg-white/80 backdrop-blur-md z-40">
                    <div className="max-w-7xl mx-auto px-4 py-4">
                        <div className="flex items-center justify-between">
                            <Link href="/blogs" className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition">
                                <ArrowLeft className="w-5 h-5" />
                                <span className="hidden sm:inline">Back to Blogs</span>
                            </Link>

                            <div className="flex items-center gap-3">
                                <ClapButton postId={post._id} />
                                <BookmarkButton postId={post._id} />
                                <button
                                    onClick={handleShare}
                                    className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
                                    aria-label="Share post"
                                >
                                    <Share2 className="w-5 h-5 text-gray-600" />
                                </button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <article className="max-w-3xl mx-auto px-4 py-12">
                    {/* Category */}
                    {post.categories && (
                        <Link href={`/category/${post.categories.slug}`}>
                            <Badge className="mb-4 hover:bg-primary/90 cursor-pointer transition">
                                {post.categories.name}
                            </Badge>
                        </Link>
                    )}

                    {/* Title */}
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
                        {post.title}
                    </h1>

                    {/* Meta */}
                    <div className="flex items-center gap-6 mb-8 text-gray-600">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-semibold shrink-0">
                                {post.authors?.name?.charAt(0).toUpperCase() || 'A'}
                            </div>
                            <div>
                                <p className="font-medium text-gray-900">{post.authors?.name || 'Anonymous'}</p>
                                <div className="flex items-center gap-3 text-sm">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-4 h-4" />
                                        {format(new Date(post.published_at), 'MMM d, yyyy')}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-4 h-4" />
                                        {post.read_time} min read
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Featured Image */}
                    {post.image_url && (
                        <div className="relative w-full h-64 md:h-96 mb-12 rounded-xl overflow-hidden">
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                className="object-cover"
                                priority
                                sizes="(max-width: 768px) 100vw, 896px"
                            />
                        </div>
                    )}

                    {/* Content - Render HTML safely with DOMPurify */}
                    <div
                        className="prose prose-lg prose-gray max-w-none mb-16 prose-headings:font-bold prose-a:text-blue-600 prose-img:rounded-lg prose-code:bg-gray-100 prose-code:px-1 prose-code:py-0.5 prose-code:rounded"
                        dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
                    />

                    {/* Divider */}
                    <div className="border-t border-gray-200 my-12" />

                    {/* Engagement Bar */}
                    <div className="flex items-center justify-between mb-16 pb-8 border-b">
                        <div className="flex items-center gap-4">
                            <ClapButton postId={post._id} className="scale-125" />
                        </div>
                        <div className="flex items-center gap-3">
                            <BookmarkButton postId={post._id} />
                            <button
                                onClick={handleShare}
                                className="flex items-center gap-2 px-4 py-2 rounded-full hover:bg-gray-100 transition"
                            >
                                <Share2 className="w-4 h-4" />
                                <span className="text-sm font-medium hidden sm:inline">Share</span>
                            </button>
                        </div>
                    </div>

                    {/* Comments */}
                    <CommentsSection postId={post._id} />

                    {/* Related Posts */}
                    <RelatedPosts slug={post.slug} />
                </article>
            </div>
        </>
    );
}
