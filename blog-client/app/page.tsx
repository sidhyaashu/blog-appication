'use client';

import { useEffect } from 'react';
import { usePosts } from '@/hooks/usePosts';
import { BlogCard } from '@/components/blog-card';
import { FeaturedPost } from '@/components/featured-post';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { HeroSection } from '@/components/hero-section';
import Footer from '@/components/footer';

export default function Home() {
  const { posts, featuredPosts, loadPosts, loadFeaturedPosts, isLoading } = usePosts();

  useEffect(() => {
    loadPosts();
    loadFeaturedPosts();
  }, [loadPosts, loadFeaturedPosts]);

  // Get latest 6 posts for the grid
  const displayPosts = posts.slice(0, 6);
  const latestPosts = posts.slice(0, 6);

  return (
    <main className="bg-background min-h-screen flex-col flex gap-10">


      <HeroSection />

      <section className="container mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="flex-1">
            <h2 className="text-3xl font-bold mb-8">Latest Articles</h2>

            {isLoading ? (
              <div className="flex justify-center items-center py-20">
                <RefreshCw className="w-8 h-8 animate-spin text-primary" />
                <span className="ml-3 text-muted-foreground">Loading posts...</span>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                  {displayPosts.length > 0 ? (
                    displayPosts.map((post) => (
                      <BlogCard key={post.id} post={post} />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-10 text-muted-foreground">
                      No posts found. Please ensure the backend server is running.
                    </div>
                  )}
                </div>

                <div className="flex justify-center">
                  <Button
                    variant="outline"
                    className="gap-2"
                    onClick={() => loadPosts()}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Load More
                  </Button>
                </div>
              </>
            )}
          </div>

          <aside className="lg:w-80 space-y-9">
            <div>
              <h3 className="text-xl font-bold mb-6 mt-4">Featured</h3>
              <div className="space-y-6">
                {featuredPosts.slice(0, 3).map((post) => (
                  <FeaturedPost key={post.id} post={post} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xl font-bold mb-6">Latest</h3>
              <div className="space-y-6">
                {latestPosts.slice(3, 6).map((post) => (
                  <FeaturedPost key={post.id} post={post} />
                ))}
              </div>
            </div>

          </aside>
        </div>
      </section>

      <Footer/>
    </main>
  );
}
