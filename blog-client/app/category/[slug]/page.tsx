'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Clock, Heart } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { format } from 'date-fns';

interface Post {
    _id: string;
    title: string;
    slug: string;
    excerpt: string;
    image_url: string;
    published_at: string;
    read_time: number;
    authors?: { name: string };
}

interface Category {
    _id: string;
    name: string;
    slug: string;
}

export default function CategoryPage() {
    const params = useParams();
    const router = useRouter();
    const slug = params.slug as string;

    const [category, setCategory] = useState<Category | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (slug) {
            fetchCategoryAndPosts();
        }
    }, [slug]);

    const fetchCategoryAndPosts = async () => {
        try {
            // Fetch category by slug
            const catRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/categories`);
            if (catRes.ok) {
                const categories = await catRes.json();
                const cat = categories.find((c: any) => c.slug === slug);

                if (cat) {
                    setCategory({ _id: cat._id, name: cat.name, slug: cat.slug });

                    // Fetch posts for this category
                    const postsRes = await fetch(
                        `${process.env.NEXT_PUBLIC_API_URL}/posts?category=${cat._id}`
                    );

                    if (postsRes.ok) {
                        const data = await postsRes.json();
                        const mappedPosts = data.posts.map((p: any) => ({
                            ...p,
                            authors: p.author_id
                        }));
                        setPosts(mappedPosts);
                    }
                } else {
                    toast.error('Category not found');
                    router.push('/blogs');
                }
            }
        } catch (error) {
            console.error('Failed to load category:', error);
            toast.error('Failed to load category');
            router.push('/blogs');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="max-w-5xl mx-auto px-4 py-12">
                <Skeleton className="h-12 w-64 mb-8" />
                <div className="grid gap-6 md:grid-cols-2">
                    {[1, 2, 3, 4].map((i) => (
                        <Skeleton key={i} className="h-64 rounded-lg" />
                    ))}
                </div>
            </div>
        );
    }

    if (!category) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold mb-2">Category not found</h2>
                    <Link href="/blogs" className="text-blue-600 hover:underline">
                        Back to Blogs
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <div className="max-w-5xl mx-auto px-4 py-12">
                {/* Header */}
                <div className="mb-12">
                    <Link
                        href="/blogs"
                        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to Blogs
                    </Link>

                    <div className="flex items-center gap-4 mb-4">
                        <Badge className="text-lg px-4 py-2">{category.name}</Badge>
                    </div>

                    <p className="text-gray-600">
                        Explore {posts.length} {posts.length === 1 ? 'article' : 'articles'} in {category.name}
                    </p>
                </div>

                {/* Posts Grid */}
                {posts.length === 0 ? (
                    <div className="text-center py-16">
                        <h3 className="text-xl font-semibold mb-2">No posts yet</h3>
                        <p className="text-gray-600 mb-6">
                            There are no posts in this category yet.
                        </p>
                        <Link href="/blogs" className="text-blue-600 hover:underline">
                            Explore other categories
                        </Link>
                    </div>
                ) : (
                    <div className="grid gap-8 md:grid-cols-2">
                        {posts.map((post) => (
                            <Link
                                key={post._id}
                                href={`/blog/${post.slug}`}
                                className="group"
                            >
                                <article className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                    {post.image_url && (
                                        <div className="relative w-full h-48">
                                            <Image
                                                src={post.image_url}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                    )}

                                    <div className="p-6">
                                        <h2 className="text-xl font-bold mb-2 group-hover:text-blue-600 transition line-clamp-2">
                                            {post.title}
                                        </h2>

                                        <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                            {post.excerpt}
                                        </p>

                                        <div className="flex items-center gap-4 text-xs text-gray-500">
                                            <span>{post.authors?.name || 'Anonymous'}</span>
                                            <span className="flex items-center gap-1">
                                                <Clock className="w-3 h-3" />
                                                {format(new Date(post.published_at), 'MMM d, yyyy')}
                                            </span>
                                            <span className="flex items-center gap-1">
                                                <Heart className="w-3 h-3" />
                                                {post.read_time} min
                                            </span>
                                        </div>
                                    </div>
                                </article>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
