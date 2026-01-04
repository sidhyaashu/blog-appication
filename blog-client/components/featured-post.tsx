import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/post';
import { format } from 'date-fns';

interface FeaturedPostProps {
  post: Post;
}

export function FeaturedPost({ post }: FeaturedPostProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="flex gap-4 group">
      <div className="relative w-24 h-24 flex-shrink-0 rounded-lg overflow-hidden">
        <Image
          src={post.image_url}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      <div className="flex-1">
        <p className="text-sm text-gray-500 mb-1">
          {format(new Date(post.published_at), 'MMMM d, yyyy')}
        </p>
        <h4 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
          {post.title}
        </h4>
      </div>
    </Link>
  );
}
