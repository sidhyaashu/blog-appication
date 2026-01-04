'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowUpRight, Play, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useCategories } from '@/hooks/useCategories';
import { usePosts } from '@/hooks/usePosts';
import { Skeleton } from '@/components/ui/skeleton';

export function CategorySection() {
    const { categories, loadCategories, isLoading: categoriesLoading } = useCategories();
    const { posts, featuredPosts, isLoading: postsLoading } = usePosts();

    useEffect(() => {
        loadCategories();
    }, [loadCategories]);

    const isLoading = categoriesLoading || postsLoading;

    // Get featured posts for display
    const mainFeaturedPost = featuredPosts[0];
    const secondaryFeaturedPosts = featuredPosts.slice(1, 3);

    // Get categories for tag display
    const displayCategories = categories.slice(0, 8);

    if (isLoading) {
        return (
            <section className="container mx-auto px-4 py-12">
                <Skeleton className="h-12 w-32 mb-8" />
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 min-h-[600px]">
                    <Skeleton className="md:col-span-5 h-[600px] rounded-3xl" />
                    <div className="md:col-span-7 grid grid-rows-2 gap-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <Skeleton className="h-full rounded-3xl" />
                            <Skeleton className="h-full rounded-3xl" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
                            <Skeleton className="md:col-span-7 h-full rounded-3xl" />
                            <Skeleton className="md:col-span-5 h-full rounded-3xl" />
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section id="categories" className="container mx-auto px-4 py-12">
            <h2 className="text-4xl font-black mb-8 uppercase tracking-tighter">Explore Topics</h2>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-auto md:min-h-[600px]">
                {/* Large Left Card - Main Featured Post */}
                {mainFeaturedPost && (
                    <Link
                        href={`/blog/${mainFeaturedPost.slug}`}
                        className="md:col-span-5 relative group overflow-hidden rounded-3xl bg-neutral-100"
                    >
                        <Image
                            src={mainFeaturedPost.image_url || 'https://images.unsplash.com/photo-1677442136019-21780ecad995?q=80&w=2070&auto=format&fit=crop'}
                            alt={mainFeaturedPost.title}
                            fill
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute top-6 left-6">
                            <div className="bg-orange-500/20 backdrop-blur-md p-2 rounded-full w-10 h-10 flex items-center justify-center">
                                <span className="text-xl">🔥</span>
                            </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-8 bg-gradient-to-t from-black/60 to-transparent">
                            <div className="bg-white rounded-t-3xl p-6 -mb-8 pb-12 relative">
                                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                    <span className="font-bold text-black">
                                        {mainFeaturedPost.categories?.name || 'Featured'}
                                    </span>
                                    <span>|</span>
                                    <span>{new Date(mainFeaturedPost.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                </div>
                                <h3 className="text-3xl font-black leading-tight mb-2 line-clamp-2">
                                    {mainFeaturedPost.title.toUpperCase()}
                                </h3>
                                <p className="text-sm text-gray-600 line-clamp-2">{mainFeaturedPost.excerpt}</p>
                            </div>
                        </div>
                    </Link>
                )}

                {/* Middle/Right Grid - 7 columns */}
                <div className="md:col-span-7 grid grid-rows-2 gap-6">

                    {/* Top Row - Two Featured Posts */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-full">
                        {/* Green Card - First Secondary Post */}
                        {secondaryFeaturedPosts[0] && (
                            <Link
                                href={`/blog/${secondaryFeaturedPosts[0].slug}`}
                                className="bg-[#D9F99D] rounded-3xl p-8 relative flex flex-col justify-between group hover:shadow-xl transition-shadow"
                            >
                                <div className="absolute top-4 right-4 bg-white/50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <ArrowUpRight className="w-5 h-5" />
                                </div>
                                <div>
                                    <div className="text-sm font-semibold mb-4">
                                        {secondaryFeaturedPosts[0].categories?.name || 'Category'}
                                    </div>
                                    <h3 className="text-3xl font-black uppercase leading-none mb-4 line-clamp-3">
                                        {secondaryFeaturedPosts[0].title}
                                    </h3>
                                    <p className="text-sm font-medium leading-relaxed opacity-80 line-clamp-3">
                                        {secondaryFeaturedPosts[0].excerpt}
                                    </p>
                                </div>
                                <div className="space-y-3 mt-4">
                                    <div className="border-t border-black/10 pt-3 flex justify-between items-center text-xs font-bold uppercase">
                                        <span>{secondaryFeaturedPosts[0].read_time} min read</span>
                                        <ArrowRight className="w-4 h-4" />
                                    </div>
                                </div>
                            </Link>
                        )}

                        {/* Blue Card - Second Secondary Post */}
                        {secondaryFeaturedPosts[1] && (
                            <Link
                                href={`/blog/${secondaryFeaturedPosts[1].slug}`}
                                className="bg-[#BFDBFE] rounded-3xl p-8 relative flex flex-col justify-between overflow-hidden group hover:shadow-xl transition-shadow"
                            >
                                <div>
                                    <div className="text-sm text-gray-600 mb-2">
                                        {secondaryFeaturedPosts[1].categories?.name || 'Category'}
                                    </div>
                                    <div className="text-xs text-gray-500 mb-4">
                                        {secondaryFeaturedPosts[1].read_time} Min · {new Date(secondaryFeaturedPosts[1].published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <h3 className="text-3xl font-black uppercase leading-tight mb-4 line-clamp-3">
                                        {secondaryFeaturedPosts[1].title}
                                    </h3>
                                </div>
                                <div className="relative w-full h-32 mt-4">
                                    <Image
                                        src={secondaryFeaturedPosts[1].image_url}
                                        alt={secondaryFeaturedPosts[1].title}
                                        fill
                                        className="object-cover rounded-lg group-hover:scale-105 transition-transform"
                                    />
                                </div>
                            </Link>
                        )}
                    </div>

                    {/* Bottom Row */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 h-full">
                        {/* Video/Featured Card - 7 cols */}
                        {featuredPosts[3] && (
                            <Link
                                href={`/blog/${featuredPosts[3].slug}`}
                                className="md:col-span-7 bg-[#C4A484] rounded-3xl relative overflow-hidden group"
                            >
                                <Image
                                    src={featuredPosts[3].image_url}
                                    alt={featuredPosts[3].title}
                                    fill
                                    className="object-cover opacity-80 group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="bg-white/30 backdrop-blur-sm w-16 h-16 rounded-full flex items-center justify-center cursor-pointer hover:bg-white/50 transition-colors">
                                        <Play className="fill-white text-white ml-1" />
                                    </div>
                                </div>
                                <div className="absolute bottom-6 left-6 text-white max-w-[80%]">
                                    <div className="text-xs font-medium mb-1 opacity-80">
                                        {featuredPosts[3].categories?.name || 'Category'}
                                    </div>
                                    <div className="text-xs opacity-60 mb-2">
                                        {featuredPosts[3].read_time} Min · {new Date(featuredPosts[3].published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                                    </div>
                                    <h3 className="text-lg font-bold uppercase leading-tight line-clamp-2">
                                        {featuredPosts[3].title}
                                    </h3>
                                </div>
                            </Link>
                        )}

                        {/* Categories List - 5 cols */}
                        <div className="md:col-span-5 bg-[#E9D5FF] rounded-3xl p-6 flex flex-col justify-between">
                            <div className="flex flex-wrap gap-2 content-start">
                                {displayCategories.map((category) => (
                                    <Link key={category.id} href={`/category/${category.slug}`}>
                                        <Badge
                                            variant="secondary"
                                            className="bg-[#FEF08A] hover:bg-[#FDE047] text-black border-none px-3 py-1.5 text-xs font-normal cursor-pointer transition-colors"
                                        >
                                            {category.name}
                                        </Badge>
                                    </Link>
                                ))}
                                {categories.length === 0 && (
                                    <p className="text-sm text-gray-600">No categories available</p>
                                )}
                            </div>
                            <Link href="/categories" className="flex justify-between items-center mt-4 hover:opacity-80 transition-opacity">
                                <span className="font-bold text-lg">View All Categories</span>
                                <button className="bg-white rounded-full p-3 shadow-sm hover:shadow-md transition-shadow">
                                    <ArrowRight className="w-5 h-5" />
                                </button>
                            </Link>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
}
