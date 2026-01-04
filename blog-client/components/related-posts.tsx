'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';
import { API_URL } from '@/lib/api';
import { Skeleton } from '@/components/ui/skeleton';

interface RelatedPost {
    _id: string;
    title: string;
    slug: string;
    image_url: string;
    published_at: string;
    read_time: number;
    category_id: {
        name: string;
        slug: string;
    };
    author_id: {
        name: string;
        avatar_url: string;
    };
}

export function RelatedPosts({ slug }: { slug: string }) {
    const [posts, setPosts] = useState<RelatedPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchRelated = async () => {
            try {
                const res = await fetch(`${API_URL}/posts/slug/${slug}/related`);
                if (res.ok) {
                    const data = await res.json();
                    setPosts(data);
                }
            } catch (error) {
                console.error('Failed to load related posts');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchRelated();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="mt-16 border-t pt-16">
                <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="space-y-4">
                            <Skeleton className="aspect-video w-full rounded-xl" />
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-6 w-full" />
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (posts.length === 0) return null;

    return (
        <div className="mt-16 border-t pt-16">
            <h3 className="text-2xl font-bold mb-8">Related Articles</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {posts.map((post) => (
                    <Link
                        key={post._id}
                        href={`/blog/${post.slug}`}
                        className="group flex flex-col h-full bg-white rounded-xl overflow-hidden hover:shadow-lg transition-all duration-300 border border-gray-100"
                    >
                        <div className="relative aspect-video overflow-hidden">
                            <Image
                                src={post.image_url}
                                alt={post.title}
                                fill
                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <div className="absolute top-4 left-4">
                                <Badge className="bg-white/90 text-gray-900 hover:bg-white backdrop-blur-sm">
                                    {post.category_id.name}
                                </Badge>
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 p-5">
                            <h4 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                                {post.title}
                            </h4>

                            <div className="mt-auto flex items-center justify-between text-sm text-gray-500">
                                <div className="flex items-center gap-2">
                                    {post.author_id.avatar_url ? (
                                        <Image
                                            src={post.author_id.avatar_url}
                                            alt={post.author_id.name}
                                            width={24}
                                            height={24}
                                            className="rounded-full"
                                        />
                                    ) : (
                                        <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs">
                                            {post.author_id.name?.[0]}
                                        </div>
                                    )}
                                    <span className="truncate max-w-[80px]">{post.author_id.name}</span>
                                </div>
                                <span className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {post.read_time} min
                                </span>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
