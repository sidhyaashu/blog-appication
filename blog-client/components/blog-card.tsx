import Link from 'next/link';
import Image from 'next/image';
import { Post } from '@/lib/post';
import { Badge } from '@/components/ui/badge';

interface BlogCardProps {
  post: Post;
}

export function BlogCard({ post }: BlogCardProps) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-lg h-[400px] shadow-md hover:shadow-xl transition-shadow">
        <Image
          src={post.image_url}
          alt={post.title}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />

        <div className="absolute inset-0 p-6 flex flex-col justify-between">
          <div>
            {post.categories && (
              <Badge className="bg-white/90 text-gray-800 hover:bg-white">
                {post.categories.name}
              </Badge>
            )}
          </div>

          <div className="text-white">
            <h3 className="text-2xl font-bold mb-3 line-clamp-2">
              {post.title}
            </h3>
            <p className="text-gray-200 text-sm line-clamp-3">
              {post.excerpt}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
