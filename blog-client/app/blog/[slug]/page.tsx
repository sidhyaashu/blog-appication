import { Metadata } from 'next';
import BlogPostClient from './BlogPostClient';

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/posts/slug/${params.slug}`, {
      cache: 'no-store'
    });

    if (!res.ok) {
      return {
        title: 'Post Not Found | Ovanthra Blog',
        description: 'The requested blog post could not be found.'
      };
    }

    const post = await res.json();

    return {
      title: `${post.title} | Ovanthra Blog`,
      description: post.excerpt || post.title,
      authors: [{ name: post.author_id?.name || 'Ovanthra' }],
      openGraph: {
        title: post.title,
        description: post.excerpt || post.title,
        images: [
          {
            url: post.image_url,
            width: 1200,
            height: 630,
            alt: post.title
          }
        ],
        type: 'article',
        publishedTime: post.published_at,
        authors: [post.author_id?.name || 'Ovanthra'],
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.title,
        images: [post.image_url],
      },
      alternates: {
        canonical: `/blog/${params.slug}`
      }
    };
  } catch (error) {
    return {
      title: 'Ovanthra Blog',
      description: 'Read our latest blog posts'
    };
  }
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  return <BlogPostClient slug={params.slug} />;
}
